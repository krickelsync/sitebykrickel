-- Remove any duplicate rows first (keep earliest by created_at)
DELETE FROM public.orders a
USING public.orders b
WHERE a.paypal_order_id = b.paypal_order_id
  AND a.paypal_order_id IS NOT NULL
  AND a.created_at > b.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS orders_paypal_order_id_unique
  ON public.orders (paypal_order_id)
  WHERE paypal_order_id IS NOT NULL;