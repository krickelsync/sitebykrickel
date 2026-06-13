DROP POLICY IF EXISTS "Authenticated users can delete designs" ON public.design_portfolio;
DROP POLICY IF EXISTS "Authenticated users can insert designs" ON public.design_portfolio;
DROP POLICY IF EXISTS "Authenticated users can update designs" ON public.design_portfolio;

DROP POLICY IF EXISTS "Authenticated users can upload designs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update design images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete design images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view design images" ON storage.objects;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'design_portfolio'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.design_portfolio';
  END IF;
END $$;