
-- 1) Remove public read on coupons; expose validation via SECURITY DEFINER RPC only
DROP POLICY IF EXISTS "Public read active coupons" ON public.coupons;

CREATE OR REPLACE FUNCTION public.validate_coupon(_code text, _total numeric)
RETURNS TABLE(code text, type text, value numeric)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.coupons%ROWTYPE;
BEGIN
  SELECT * INTO c FROM public.coupons WHERE lower(coupons.code) = lower(_code);
  IF NOT FOUND OR NOT c.active THEN
    RAISE EXCEPTION 'invalid_coupon' USING ERRCODE = 'P0001';
  END IF;
  IF c.expires_at IS NOT NULL AND c.expires_at <= now() THEN
    RAISE EXCEPTION 'expired_coupon' USING ERRCODE = 'P0001';
  END IF;
  IF c.max_uses IS NOT NULL AND c.used_count >= c.max_uses THEN
    RAISE EXCEPTION 'exhausted_coupon' USING ERRCODE = 'P0001';
  END IF;
  IF c.min_amount IS NOT NULL AND _total < c.min_amount THEN
    RAISE EXCEPTION 'min_amount:%', c.min_amount USING ERRCODE = 'P0001';
  END IF;
  RETURN QUERY SELECT c.code, c.type, c.value;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_coupon(text, numeric) FROM public;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO anon, authenticated;

-- 2) Remove orders from Realtime publication to prevent email-based row leaks
ALTER PUBLICATION supabase_realtime DROP TABLE public.orders;
