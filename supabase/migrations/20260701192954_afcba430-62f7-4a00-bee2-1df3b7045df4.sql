
-- =========================================================
-- Admin dashboard expansion: schema for tasks 1-8
-- =========================================================

-- 1) Orders: kolom baru untuk PayPal refund, revoke, coupon
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS paypal_capture_id text,
  ADD COLUMN IF NOT EXISTS license_revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount_amount numeric NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS orders_buyer_email_idx ON public.orders (buyer_email);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);

-- =========================================================
-- 2) Coupons + redemptions
-- =========================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('percent', 'fixed')),
  value numeric NOT NULL CHECK (value > 0),
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  min_amount numeric NOT NULL DEFAULT 0,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Public can SELECT only active, unexpired coupons (needed for checkout validation).
CREATE POLICY "Public read active coupons"
  ON public.coupons FOR SELECT
  USING (active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admins can read everything.
CREATE POLICY "Admins read all coupons"
  ON public.coupons FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert coupons"
  ON public.coupons FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update coupons"
  ON public.coupons FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete coupons"
  ON public.coupons FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER coupons_set_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  redeemed_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coupon_redemptions TO authenticated;
GRANT ALL ON public.coupon_redemptions TO service_role;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read redemptions"
  ON public.coupon_redemptions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Atomic increment used by edge functions.
CREATE OR REPLACE FUNCTION public.redeem_coupon(_code text, _order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.coupons%ROWTYPE;
BEGIN
  SELECT * INTO c FROM public.coupons
    WHERE code = _code AND active = true
    FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  IF c.expires_at IS NOT NULL AND c.expires_at <= now() THEN RETURN false; END IF;
  IF c.max_uses IS NOT NULL AND c.used_count >= c.max_uses THEN RETURN false; END IF;

  UPDATE public.coupons SET used_count = used_count + 1 WHERE id = c.id;
  INSERT INTO public.coupon_redemptions (coupon_id, order_id) VALUES (c.id, _order_id);
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_coupon(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text, uuid) TO service_role;

-- =========================================================
-- 3) Webhook logs
-- =========================================================
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  event text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  status_code integer,
  request_snippet text,
  response_snippet text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.webhook_logs TO authenticated;
GRANT ALL ON public.webhook_logs TO service_role;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read webhook logs"
  ON public.webhook_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS webhook_logs_source_idx ON public.webhook_logs (source);
CREATE INDEX IF NOT EXISTS webhook_logs_created_at_idx ON public.webhook_logs (created_at DESC);

-- =========================================================
-- 4) Email logs
-- =========================================================
CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  kind text NOT NULL,
  resend_id text,
  status text NOT NULL,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.email_logs TO authenticated;
GRANT ALL ON public.email_logs TO service_role;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read email logs"
  ON public.email_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS email_logs_order_idx ON public.email_logs (order_id);
CREATE INDEX IF NOT EXISTS email_logs_created_at_idx ON public.email_logs (created_at DESC);
