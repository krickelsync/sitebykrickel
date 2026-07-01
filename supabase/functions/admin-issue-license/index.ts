import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  theme_slug: z.string().min(1).max(100),
  buyer_email: z.string().email().max(255),
  buyer_name: z.string().max(200).optional().nullable(),
  amount: z.number().nonnegative().max(100000).optional(),
  currency: z.string().length(3).optional(),
  note: z.string().max(500).optional().nullable(),
  send_email: z.boolean().optional().default(true),
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function logHook(
  admin: ReturnType<typeof createClient>,
  row: {
    source: string;
    event: string;
    order_id?: string | null;
    status_code?: number | null;
    request_snippet?: string | null;
    response_snippet?: string | null;
    payload?: unknown;
  },
) {
  try {
    await admin.from("webhook_logs").insert({
      source: row.source,
      event: row.event,
      order_id: row.order_id ?? null,
      status_code: row.status_code ?? null,
      request_snippet: row.request_snippet?.slice(0, 500) ?? null,
      response_snippet: row.response_snippet?.slice(0, 500) ?? null,
      payload: row.payload ?? null,
    });
  } catch (e) {
    console.error("[webhook_logs] insert failed", (e as Error).message);
  }
}

async function logEmail(
  admin: ReturnType<typeof createClient>,
  row: {
    order_id?: string | null;
    to_email: string;
    kind: string;
    resend_id?: string | null;
    status: string;
    error?: string | null;
  },
) {
  try {
    await admin.from("email_logs").insert({
      order_id: row.order_id ?? null,
      to_email: row.to_email,
      kind: row.kind,
      resend_id: row.resend_id ?? null,
      status: row.status,
      error: row.error ?? null,
    });
  } catch (e) {
    console.error("[email_logs] insert failed", (e as Error).message);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Auth + admin check
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json(401, { error: "Missing bearer token" });

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json(401, { error: "Invalid session" });

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json(403, { error: "Admin only" });

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return json(400, { error: parsed.error.flatten() });
    }
    const { theme_slug, buyer_email, buyer_name, amount, currency, note, send_email } =
      parsed.data;

    const paypal_order_id = `MANUAL-${crypto.randomUUID()}`;
    const finalAmount = amount ?? 0;
    const finalCurrency = currency ?? "USD";

    // Call license dashboard
    const base = Deno.env.get("LICENSE_DASHBOARD_URL");
    const apiKey = Deno.env.get("LICENSE_ISSUE_API_KEY");
    if (!base || !apiKey) {
      return json(500, { error: "License dashboard not configured" });
    }
    const url = `${base.replace(/\/$/, "")}/api/public/license/issue`;
    const reqBody = {
      theme_slug,
      buyer_email,
      buyer_name: buyer_name ?? undefined,
      paypal_order_id,
      amount: finalAmount,
      currency: finalCurrency,
    };

    let licenseKey: string | null = null;
    let downloadUrl: string | null = null;
    let licenseError: string | null = null;
    let status = 0;
    let bodyText = "";
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify(reqBody),
      });
      status = r.status;
      bodyText = await r.text();
      if (!r.ok) throw new Error(`License API ${r.status}: ${bodyText.slice(0, 200)}`);
      const j = JSON.parse(bodyText);
      if (!j.license_key || !j.download_url) throw new Error("Missing license fields");
      licenseKey = j.license_key;
      downloadUrl = j.download_url;
    } catch (e) {
      licenseError = (e as Error).message;
    }

    // Insert order row
    const { data: inserted, error: insErr } = await admin
      .from("orders")
      .insert({
        product_title: `Manual issue . ${theme_slug}`,
        buyer_email,
        buyer_name: buyer_name ?? null,
        paypal_order_id,
        amount: finalAmount,
        currency: finalCurrency,
        status: licenseKey ? "MANUAL" : "FAILED",
        theme_slug,
        license_key: licenseKey,
        download_url: downloadUrl,
        license_issued_at: licenseKey ? new Date().toISOString() : null,
        license_error: licenseError,
        admin_note: note ?? null,
      })
      .select("id")
      .single();

    const orderId = inserted?.id ?? null;
    if (insErr) console.error("[orders] insert failed", insErr.message);

    await logHook(admin, {
      source: "license-issue",
      event: licenseKey ? "manual.issued" : "manual.failed",
      order_id: orderId,
      status_code: status,
      request_snippet: JSON.stringify(reqBody),
      response_snippet: bodyText,
      payload: { theme_slug, buyer_email, error: licenseError },
    });

    // Email
    if (licenseKey && send_email) {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      const lovableKey = Deno.env.get("LOVABLE_API_KEY");
      if (resendKey && lovableKey) {
        const html = `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#111">
            <h1 style="font-size:22px;margin:0 0 12px">Your ${theme_slug} theme is ready${buyer_name ? `, ${buyer_name}` : ""}.</h1>
            <p>Your lifetime license key:</p>
            <p style="font-family:monospace;background:#f4f4f5;padding:14px;border-radius:8px;font-size:16px;word-break:break-all">${licenseKey}</p>
            <p><a href="${downloadUrl}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Download theme ZIP</a></p>
            <p style="color:#666;font-size:12px;margin-top:24px">Reference: ${paypal_order_id}</p>
          </div>
        `.trim();
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
              subject: `Your ${theme_slug} theme license + download`,
              html,
            }),
          });
          const emailText = await emailRes.text();
          let resendId: string | null = null;
          try {
            resendId = JSON.parse(emailText).id ?? null;
          } catch { /* ignore */ }
          await logEmail(admin, {
            order_id: orderId,
            to_email: buyer_email,
            kind: "manual_issue",
            resend_id: resendId,
            status: emailRes.ok ? "sent" : "failed",
            error: emailRes.ok ? null : emailText.slice(0, 300),
          });
          if (emailRes.ok && orderId) {
            await admin
              .from("orders")
              .update({ email_sent_at: new Date().toISOString() })
              .eq("id", orderId);
          }
        } catch (e) {
          await logEmail(admin, {
            order_id: orderId,
            to_email: buyer_email,
            kind: "manual_issue",
            status: "failed",
            error: (e as Error).message,
          });
        }
      }
    }

    if (licenseError) {
      return json(502, {
        ok: false,
        error: licenseError,
        paypal_order_id,
        order_id: orderId,
      });
    }

    return json(200, {
      ok: true,
      license_key: licenseKey,
      download_url: downloadUrl,
      paypal_order_id,
      order_id: orderId,
    });
  } catch (e) {
    console.error("admin-issue-license error", e);
    return json(500, { error: (e as Error).message });
  }
});