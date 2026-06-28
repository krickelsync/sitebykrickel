import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const ItemSchema = z.object({
  product_id: z.string().uuid().nullable().optional(),
  product_title: z.string().min(1).max(300),
  amount: z.number().positive(),
});

const BodySchema = z.object({
  paypal_order_id: z.string().min(1).max(100),
  items: z.array(ItemSchema).min(1).max(50),
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
    const { paypal_order_id, items } = parsed.data;

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

    const rows = items.map((it) => ({
      product_id: it.product_id ?? null,
      product_title: it.product_title,
      buyer_email,
      buyer_name,
      paypal_order_id,
      amount: it.amount,
      currency,
      status: "COMPLETED",
    }));

    const { error } = await admin.from("orders").insert(rows);
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, buyer_name, buyer_email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("record-order error:", e);
    return new Response(JSON.stringify({ error: "Failed to record order" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});