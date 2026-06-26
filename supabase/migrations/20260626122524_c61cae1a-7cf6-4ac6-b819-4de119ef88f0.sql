
-- Replace permissive INSERT policy on leads with a length-validated CHECK
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 320
  AND char_length(message) BETWEEN 1 AND 5000
  AND (whatsapp IS NULL OR char_length(whatsapp) <= 50)
  AND (package IS NULL OR char_length(package) <= 100)
);

-- Make read-restriction explicit: only admins can read leads
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Admins can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Revoke any inadvertent direct anon SELECT grant on leads
REVOKE SELECT ON public.leads FROM anon;
GRANT SELECT ON public.leads TO authenticated;

-- Replace permissive INSERT policy on orders with a validated CHECK
DROP POLICY IF EXISTS "Anyone can record an order" ON public.orders;
CREATE POLICY "Anyone can record an order"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(product_title) BETWEEN 1 AND 300
  AND amount > 0
  AND char_length(currency) BETWEEN 3 AND 8
  AND (buyer_name  IS NULL OR char_length(buyer_name)  <= 200)
  AND (buyer_email IS NULL OR char_length(buyer_email) <= 320)
  AND (paypal_order_id IS NULL OR char_length(paypal_order_id) <= 100)
);
