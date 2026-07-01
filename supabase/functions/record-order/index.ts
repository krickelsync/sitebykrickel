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

const AddonsSchema = z
  .object({
    remove_watermark: z.boolean().optional().default(false),
    install_setup: z.boolean().optional().default(false),
  })
  .optional();

const BodySchema = z.object({
  paypal_order_id: z.string().min(1).max(100),
  items: z.array(ItemSchema).min(1).max(50),
  theme_slug: z.string().min(1).max(100).optional(),
  subtotal: z.number().nonnegative().optional(),
  processing_fee: z.number().nonnegative().optional(),
  gross_amount: z.number().nonnegative().optional(),
  addons: AddonsSchema,
  buyer_email_override: z.string().email().max(200).optional(),
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
  remove_watermark?: boolean;
  install_requested?: boolean;
  subtotal?: number;
  processing_fee?: number;
}): Promise<LicenseIssueResult> {
  const base = Deno.env.get("LICENSE_DASHBOARD_URL");
  const apiKey = Deno.env.get("LICENSE_ISSUE_API_KEY");
  if (!base || !apiKey) {
    console.error("[license] missing config", {
      paypal_order_id: input.paypal_order_id,
      has_base: !!base,
      has_api_key: !!apiKey,
    });
    throw new Error("License dashboard not configured");
  }

  const url = `${base.replace(/\/$/, "")}/api/public/license/issue`;
  const logCtx = {
    paypal_order_id: input.paypal_order_id,
    theme_slug: input.theme_slug,
    buyer_email: input.buyer_email,
    url,
  };

  const doCall = async () => {
    const started = Date.now();
    const r = await fetch(url, {
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
        // Extended metadata . dashboard may ignore these fields safely.
        remove_watermark: input.remove_watermark ?? false,
        install_requested: input.install_requested ?? false,
        subtotal: input.subtotal,
        processing_fee: input.processing_fee,
      }),
    });
    console.log("[license] issue call", {
      ...logCtx,
      status: r.status,
      ok: r.ok,
      ms: Date.now() - started,
    });
    return r;
  };

  let res = await doCall();
  let attempt = 1;
  if (res.status >= 500) {
    console.warn("[license] 5xx from dashboard, retrying in 500ms", {
      ...logCtx,
      first_status: res.status,
    });
    await new Promise((r) => setTimeout(r, 500));
    res = await doCall();
    attempt = 2;
  }

  const text = await res.text();
  const bodyPreview = text.slice(0, 500);

  if (res.status === 401) {
    console.error("[license] 401 unauthorized. API key rejected", {
      ...logCtx,
      attempt,
      body: bodyPreview,
    });
    throw new Error("License dashboard rejected API key (401)");
  }
  if (res.status === 404) {
    const isHtmlFallback = /<!doctype html|<html[\s>]/i.test(bodyPreview);
    const message = isHtmlFallback
      ? "License dashboard API route missing: /api/public/license/issue"
      : `Theme slug not found: ${input.theme_slug}`;
    console.error(
      isHtmlFallback
        ? "[license] 404 not found. dashboard issue API route missing"
        : "[license] 404 not found. theme_slug missing on dashboard",
      {
      ...logCtx,
      attempt,
      body: bodyPreview,
      },
    );
    throw new Error(message);
  }
  if (!res.ok) {
    console.error("[license] non-ok response after retries", {
      ...logCtx,
      attempt,
      status: res.status,
      body: bodyPreview,
    });
    throw new Error(`License issue failed (${res.status}): ${bodyPreview.slice(0, 200)}`);
  }

  let json: LicenseIssueResult;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("[license] invalid JSON from dashboard", {
      ...logCtx,
      attempt,
      body: bodyPreview,
    });
    throw new Error("License dashboard returned invalid JSON");
  }
  if (!json.license_key || !json.download_url) {
    console.error("[license] response missing required fields", {
      ...logCtx,
      attempt,
      has_license_key: !!json.license_key,
      has_download_url: !!json.download_url,
    });
    throw new Error("License dashboard response missing fields");
  }
  console.log("[license] issued", {
    ...logCtx,
    attempt,
    reused: json.reused ?? false,
  });
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
    const {
      paypal_order_id,
      items,
      theme_slug: bodyThemeSlug,
      subtotal: bodySubtotal,
      processing_fee: bodyFee,
      gross_amount: bodyGross,
      addons: bodyAddons,
      buyer_email_override,
    } = parsed.data;

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
    const itemsTotal = items.reduce((s, i) => s + i.amount, 0);
    // If client sent gross_amount (with processing fee), verify against that.
    // Otherwise fall back to items total (legacy checkouts without pass-through fee).
    const expected = typeof bodyGross === "number" ? bodyGross : itemsTotal;
    if (Math.abs(captured - expected) > 0.02) {
      return new Response(JSON.stringify({ error: "Amount mismatch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subtotal =
      typeof bodySubtotal === "number" ? bodySubtotal : itemsTotal;
    const processing_fee =
      typeof bodyFee === "number" ? bodyFee : Math.max(0, captured - subtotal);

    const payer = pp.payer ?? {};
    const buyer_name =
      [payer?.name?.given_name, payer?.name?.surname].filter(Boolean).join(" ") || null;
    // Prefer buyer-entered email (used for account dashboard + receipt).
    const buyer_email =
      (buyer_email_override && buyer_email_override.trim()) ||
      payer?.email_address ||
      null;
    const currency =
      pu?.amount?.currency_code ?? pu?.payments?.captures?.[0]?.amount?.currency_code ?? "USD";

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Determine theme slug from real theme rows only . skip addon rows so their
    // slugs never get sent to the license dashboard.
    const addonSlugs = new Set(["sync-remove-watermark", "sync-install-setup"]);
    const themeItem = items.find(
      (i) => i.theme_slug && !addonSlugs.has(i.theme_slug),
    );
    const theme_slug = bodyThemeSlug ?? themeItem?.theme_slug ?? "sync";

    const addons = {
      remove_watermark: !!bodyAddons?.remove_watermark
        || items.some((i) => i.theme_slug === "sync-remove-watermark"),
      install_setup: !!bodyAddons?.install_setup
        || items.some((i) => i.theme_slug === "sync-install-setup"),
    };

    // Idempotency: one row per PayPal order. If PayPal retries or the user
    // clicks again after a license-dashboard failure, never throw a duplicate
    // key error back to the buyer.
    const { data: existing } = await admin
      .from("orders")
      .select("id, license_key, download_url, theme_slug, buyer_email")
      .eq("paypal_order_id", paypal_order_id)
      .limit(1)
      .maybeSingle();

    if (existing?.license_key && existing?.download_url) {
      return new Response(
        JSON.stringify({
          ok: true,
          buyer_name,
          buyer_email: existing.buyer_email ?? buyer_email,
          license_key: existing.license_key,
          download_url: existing.download_url,
          theme_slug: existing.theme_slug ?? theme_slug,
          reused: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
          remove_watermark: addons.remove_watermark,
          install_requested: addons.install_setup,
          subtotal,
          processing_fee,
        });
      } catch (e) {
        licenseError = (e as Error).message;
        console.error("[license] issueLicense failed", {
          paypal_order_id,
          theme_slug,
          buyer_email,
          error: licenseError,
        });
      }
    } else {
      licenseError = "Missing buyer email from PayPal payer";
      console.error("[license] skipped. missing buyer email", { paypal_order_id });
    }

    const orderRow = {
      product_id: themeItem?.product_id ?? null,
      product_title: items.map((it) => it.product_title).join(", ").slice(0, 300),
      buyer_email,
      buyer_name,
      paypal_order_id,
      amount: captured,
      currency,
      status: "COMPLETED",
      theme_slug,
      license_key: license?.license_key ?? null,
      download_url: license?.download_url ?? null,
      license_issued_at: license ? new Date().toISOString() : null,
      license_error: licenseError,
      subtotal,
      processing_fee,
      addons,
      install_status:
        addons.install_setup ? "pending" : null,
    };

    const { error } = existing?.id
      ? await admin.from("orders").update(orderRow).eq("id", existing.id)
      : await admin.from("orders").insert(orderRow);
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

        let emailOk = false;
        try {
          const emailRes = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
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
          emailOk = emailRes.ok;
          if (!emailOk) {
            console.error("[email] resend non-ok", { status: emailRes.status });
          }
        } catch (e) {
          console.error("Receipt email failed:", (e as Error).message);
        }
        if (emailOk) {
          await admin
            .from("orders")
            .update({ email_sent_at: new Date().toISOString() })
            .eq("paypal_order_id", paypal_order_id)
            .not("license_key", "is", null);
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