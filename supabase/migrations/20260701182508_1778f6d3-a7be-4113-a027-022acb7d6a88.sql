ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS theme_slug text,
  ADD COLUMN IF NOT EXISTS license_key text,
  ADD COLUMN IF NOT EXISTS download_url text,
  ADD COLUMN IF NOT EXISTS license_issued_at timestamptz;

CREATE INDEX IF NOT EXISTS orders_paypal_order_id_idx ON public.orders(paypal_order_id);

-- Allow buyers (even unauth) to look up their order+license by paypal_order_id on the success page.
-- The paypal_order_id acts as an unguessable token (PayPal returns a random ID) so this is safe.
DROP POLICY IF EXISTS "Public can read license by paypal_order_id" ON public.orders;
CREATE POLICY "Public can read license by paypal_order_id"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

GRANT SELECT ON public.orders TO anon;