CREATE POLICY "Buyers can view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (
  buyer_email IS NOT NULL
  AND lower(buyer_email) = lower((auth.jwt() ->> 'email'))
);

CREATE INDEX IF NOT EXISTS orders_buyer_email_lower_idx
ON public.orders (lower(buyer_email));