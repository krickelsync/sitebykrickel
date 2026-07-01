DROP POLICY IF EXISTS "Public can read license by paypal_order_id" ON public.orders;
REVOKE SELECT ON public.orders FROM anon;