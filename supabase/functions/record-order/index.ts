import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

// CORS headers . kept inline because there's no shared module for edge fns.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ItemSchema = z.object({
  product_id: z.string().uuid().nullable().optional(),
  product_title: z.string().min(1).max(300),
  amount: z.number().positive(),
  theme_slug: z.string().min(1).max(100).optional(),
});

const BodySchema = z.object({
  paypal_order_id: z.string().min(1).max(100),
  items: z.array(ItemSchema).min(1).max(50),
  theme_slug: z.string().min(1).max(100).optional(),
});

const PAYPAL_BASE =
  Deno.env.get("PAYPAL_ENV") === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function paypalAccessToken(): Promise<string> {
  const id = Deno.env.get("PAYPAL_CLIENT_ID");
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  if (!id || !secret) throw new Error("Missing PayPal credentials");
  const r = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!r.ok) throw new Error("PayPal auth failed");
  const j = await r.json();
  return j.access_token as string;
}

async function verifyPaypalOrder(orderId: string) {
  const token = await paypalAccessToken();
  const r = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error("PayPal order not found");
  return await r.json();
}

interface LicenseIssueResult {
  license_key: string;
  download_url: string;
  reused?: boolean;
}

async function issueLicense(input: {
  theme_slug: string;
  buyer_email: string;
  buyer_name?: string | null;
  paypal_order_id: string;
  amount?: number;
  currency?: string;
}): Promise<LicenseIssueResult> {
  const base = Deno.env.get("LICENSE_DASHBOARD_URL");
  const apiKey = Deno.env.get("LICENSE_ISSUE_API_KEY");
  if (!base || !apiKey) throw new Error("License dashboard not configured");

  const doCall = async () => {
    const r = await fetch(`${base.replace(/\/$/, "")}/api/public/license/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        theme_slug: input.theme_slug,
        buyer_email: input.buyer_email,
        buyer_name: input.buyer_name ?? undefined,
        paypal_order_id: input.paypal_order_id,
        amount: input.amount,
        currency: input.currency,
      }),
    });
    return r;
  };

  let res = await doCall();
  if (res.status >= 500) {
    // one retry on transient dashboard failure
    await new Promise((r) => setTimeout(r, 500));
    res = await doCall();
  }

  const text = await res.text();
  if (res.status === 401) throw new Error("License dashboard rejected API key (401)");
  if (res.status === 404) throw new Error(`Theme slug not found: ${input.theme_slug}`);
  if (!res.ok) throw new Error(`License issue failed (${res.status}): ${text.slice(0, 200)}`);

  let json: LicenseIssueResult;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("License dashboard returned invalid JSON");
  }
  if (!json.license_key || !json.download_url) {
    throw new Error("License dashboard response missing fields");
  }
  return json;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { paypal_order_id, items, theme_slug: bodyThemeSlug } = parsed.data;

    const pp = await verifyPaypalOrder(paypal_order_id);
    if (pp.status !== "COMPLETED" && pp.status !== "APPROVED") {
      return new Response(JSON.stringify({ error: "Order not completed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pu = pp.purchase_units?.[0];
    const captured = Number(
      pu?.payments?.captures?.[0]?.amount?.value ?? pu?.amount?.value ?? 0
    );
    const expected = items.reduce((s, i) => s + i.amount, 0);
    if (Math.abs(captured - expected) > 0.01) {
      return new Response(JSON.stringify({ error: "Amount mismatch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payer = pp.payer ?? {};
    const buyer_name =
      [payer?.name?.given_name, payer?.name?.surname].filter(Boolean).join(" ") || null;
    const buyer_email = payer?.email_address ?? null;
    const currency =
      pu?.amount?.currency_code ?? pu?.payments?.captures?.[0]?.amount?.currency_code ?? "USD";

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Idempotency: if we already recorded this paypal_order_id with a license, return it.
    const { data: existing } = await admin
      .from("orders")
      .select("license_key, download_url, theme_slug")
      .eq("paypal_order_id", paypal_order_id)
      .not("license_key", "is", null)
      .limit(1)
      .maybeSingle();

    if (existing?.license_key && existing?.download_url) {
      return new Response(
        JSON.stringify({
          ok: true,
          buyer_name,
          buyer_email,
          license_key: existing.license_key,
          download_url: existing.download_url,
          theme_slug: existing.theme_slug,
          reused: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine theme slug (fallback to only theme currently available on dashboard).
    const theme_slug =
      bodyThemeSlug ?? items.find((i) => i.theme_slug)?.theme_slug ?? "sync";

    // Issue license via external dashboard.
    let license: LicenseIssueResult | null = null;
    let licenseError: string | null = null;
    if (buyer_email) {
      try {
        license = await issueLicense({
          theme_slug,
          buyer_email,
          buyer_name,
          paypal_order_id,
          amount: captured,
          currency,
        });
      } catch (e) {
        licenseError = (e as Error).message;
        console.error("issueLicense error:", licenseError);
      }
    } else {
      licenseError = "Missing buyer email from PayPal payer";
    }

    const rows = items.map((it, idx) => ({
      product_id: it.product_id ?? null,
      product_title: it.product_title,
      buyer_email,
      buyer_name,
      paypal_order_id,
      amount: it.amount,
      currency,
      status: "COMPLETED",
      theme_slug: it.theme_slug ?? theme_slug,
      // attach license only to first row to avoid duplicating in DB
      license_key: idx === 0 ? license?.license_key ?? null : null,
      download_url: idx === 0 ? license?.download_url ?? null : null,
      license_issued_at: idx === 0 && license ? new Date().toISOString() : null,
    }));

    const { error } = await admin.from("orders").insert(rows);
    if (error) throw error;

    // Fire-and-forget receipt email via Resend (if configured and license issued).
    if (license && buyer_email) {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      const lovableKey = Deno.env.get("LOVABLE_API_KEY");
      if (resendKey && lovableKey) {
        const html = `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#111">
            <h1 style="font-size:22px;margin:0 0 12px">Thanks${
              buyer_name ? `, ${buyer_name}` : ""
            } — your SYNC theme is ready.</h1>
            <p>Your lifetime license key:</p>
            <p style="font-family:monospace;background:#f4f4f5;padding:14px;border-radius:8px;font-size:16px;word-break:break-all">${license.license_key}</p>
            <p><a href="${license.download_url}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Download theme ZIP</a></p>
            <h3 style="margin-top:28px">How to install</h3>
            <ol style="line-height:1.6">
              <li>Download the ZIP above.</li>
              <li>In Shopify: <em>Online Store → Themes → Add theme → Upload ZIP</em>.</li>
              <li>Open the theme editor — an activation popup will ask for your license key.</li>
              <li>Paste the key above. Lifetime activation is locked to your Shopify domain and this theme.</li>
            </ol>
            <p style="color:#666;font-size:12px;margin-top:24px">Order: ${paypal_order_id}</p>
          </div>
        `.trim();

        try {
          await fetch("https://connector-gateway.lovable.dev/resend/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lovableKey}`,
              "X-Connection-Api-Key": resendKey,
            },
            body: JSON.stringify({
              from: "SitebyKrickel <onboarding@resend.dev>",
              to: [buyer_email],
              subject: "Your SYNC theme license + download",
              html,
            }),
          });
        } catch (e) {
          console.error("Receipt email failed:", (e as Error).message);
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        buyer_name,
        buyer_email,
        license_key: license?.license_key ?? null,
        download_url: license?.download_url ?? null,
        theme_slug,
        license_error: licenseError,
        reused: false,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("record-order error:", e);
    return new Response(JSON.stringify({ error: "Failed to record order" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});