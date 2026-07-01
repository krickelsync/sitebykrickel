import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  order_id: z.string().uuid(),
  amount: z.number().positive().optional(),
  reason: z.string().max(300).optional(),
  revoke_license: z.boolean().optional().default(true),
});

const PAYPAL_BASE =
  Deno.env.get("PAYPAL_ENV") === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function paypalToken(): Promise<string> {
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
  return (await r.json()).access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await anon.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let raw: unknown;
    try { raw = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { order_id, amount, reason, revoke_license } = parsed.data;

    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("id, paypal_order_id, amount, currency, refunded_amount, status, license_key")
      .eq("id", order_id)
      .maybeSingle();
    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!order.paypal_order_id) {
      return new Response(JSON.stringify({ error: "No PayPal order id on record" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const alreadyRefunded = Number(order.refunded_amount || 0);
    const paid = Number(order.amount || 0);
    const remaining = Math.max(0, +(paid - alreadyRefunded).toFixed(2));
    if (remaining <= 0) {
      return new Response(JSON.stringify({ error: "Order already fully refunded" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const refundAmount = amount != null
      ? Math.min(remaining, +Number(amount).toFixed(2))
      : remaining;

    const token = await paypalToken();

    // Look up capture id for this PayPal order.
    const ordRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${order.paypal_order_id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!ordRes.ok) {
      const t = await ordRes.text();
      return new Response(
        JSON.stringify({ error: `PayPal order lookup failed: ${t.slice(0, 200)}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const ord = await ordRes.json();
    const captureId = ord?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    if (!captureId) {
      return new Response(JSON.stringify({ error: "PayPal capture not found" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const refundRes = await fetch(
      `${PAYPAL_BASE}/v2/payments/captures/${captureId}/refund`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `refund-${order_id}-${Date.now()}`,
        },
        body: JSON.stringify({
          amount: {
            value: refundAmount.toFixed(2),
            currency_code: order.currency ?? "USD",
          },
          note_to_payer: reason ? reason.slice(0, 255) : "Refund issued",
        }),
      },
    );
    const refundJson = await refundRes.json().catch(() => ({}));
    if (!refundRes.ok) {
      console.error("[refund] paypal error", refundJson);
      return new Response(
        JSON.stringify({ error: "PayPal refund failed", details: refundJson }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const totalRefunded = +(alreadyRefunded + refundAmount).toFixed(2);
    const fullyRefunded = totalRefunded >= paid - 0.01;

    const updates: Record<string, unknown> = {
      refunded_amount: totalRefunded,
      refunded_at: new Date().toISOString(),
      status: fullyRefunded ? "REFUNDED" : "PARTIALLY_REFUNDED",
    };
    if (fullyRefunded && revoke_license && order.license_key) {
      updates.license_revoked_at = new Date().toISOString();
    }
    await admin.from("orders").update(updates).eq("id", order_id);

    await admin.from("webhook_logs").insert({
      source: "refund-order",
      event: "refund.completed",
      order_id,
      payload: {
        paypal_order_id: order.paypal_order_id,
        capture_id: captureId,
        refund_id: refundJson?.id,
        amount: refundAmount,
        reason: reason ?? null,
        actor: userData.user.email,
      },
      status_code: 200,
    }).catch(() => {});

    return new Response(
      JSON.stringify({
        ok: true,
        refund_id: refundJson?.id,
        refunded_amount: totalRefunded,
        fully_refunded: fullyRefunded,
        license_revoked: !!updates.license_revoked_at,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("refund-order error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});