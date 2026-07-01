import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  paypal_order_id: z.string().min(1).max(100),
  email: z.string().email().max(200).optional(),
});

function buildHtml(opts: {
  buyer_name: string | null;
  license_key: string;
  download_url: string;
  paypal_order_id: string;
}) {
  const { buyer_name, license_key, download_url, paypal_order_id } = opts;
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#111">
      <h1 style="font-size:22px;margin:0 0 12px">Here's your SYNC theme${
        buyer_name ? `, ${buyer_name}` : ""
      } (resent).</h1>
      <p>Your lifetime license key:</p>
      <p style="font-family:monospace;background:#f4f4f5;padding:14px;border-radius:8px;font-size:16px;word-break:break-all">${license_key}</p>
      <p><a href="${download_url}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Download theme ZIP</a></p>
      <h3 style="margin-top:28px">How to install</h3>
      <ol style="line-height:1.6">
        <li>Download the ZIP above.</li>
        <li>In Shopify: <em>Online Store → Themes → Add theme → Upload ZIP</em>.</li>
        <li>Open the theme editor. An activation popup will ask for your license key.</li>
        <li>Paste the key above. Lifetime activation is locked to your Shopify domain and this theme.</li>
      </ol>
      <p style="color:#666;font-size:12px;margin-top:24px">Order: ${paypal_order_id}</p>
    </div>
  `.trim();
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
    const { paypal_order_id, email: overrideEmail } = parsed.data;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: qErr } = await admin
      .from("orders")
      .select("buyer_email, buyer_name, license_key, download_url, license_issued_at")
      .eq("paypal_order_id", paypal_order_id)
      .not("license_key", "is", null)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (qErr) throw qErr;
    if (!order?.license_key || !order?.download_url) {
      return new Response(
        JSON.stringify({ error: "No license found for this order yet." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const to = overrideEmail ?? order.buyer_email;
    if (!to) {
      return new Response(
        JSON.stringify({ error: "No recipient email on file. Provide one to resend." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (!resendKey || !lovableKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const html = buildHtml({
      buyer_name: order.buyer_name ?? null,
      license_key: order.license_key,
      download_url: order.download_url,
      paypal_order_id,
    });

    const r = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: "SitebyKrickel <onboarding@resend.dev>",
        to: [to],
        subject: "Your SYNC theme license + download (resent)",
        html,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("Resend failed:", r.status, text);
      return new Response(
        JSON.stringify({ error: "Email provider rejected the request." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, sent_to: to }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("resend-receipt error:", e);
    return new Response(JSON.stringify({ error: "Failed to resend receipt" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});