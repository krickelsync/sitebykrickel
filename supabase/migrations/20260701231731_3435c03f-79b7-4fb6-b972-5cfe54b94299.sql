
CREATE INDEX IF NOT EXISTS orders_status_created_at_idx
  ON public.orders (status, created_at DESC);

CREATE INDEX IF NOT EXISTS orders_buyer_email_created_at_idx
  ON public.orders (buyer_email, created_at DESC);

CREATE INDEX IF NOT EXISTS orders_paypal_order_id_idx
  ON public.orders (paypal_order_id);

CREATE INDEX IF NOT EXISTS orders_created_at_idx
  ON public.orders (created_at DESC);
