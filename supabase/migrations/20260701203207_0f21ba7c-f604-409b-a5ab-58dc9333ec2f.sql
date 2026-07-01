ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS addons jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS install_status text DEFAULT NULL;

CREATE INDEX IF NOT EXISTS orders_install_status_idx
  ON public.orders (install_status)
  WHERE install_status IS NOT NULL;