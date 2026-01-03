-- Create design_portfolio table
CREATE TABLE public.design_portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Logo', 'Clothing', 'Packaging')),
  image_url TEXT NOT NULL,
  description TEXT,
  size TEXT DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large', 'wide', 'tall')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.design_portfolio ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Public can view designs" 
  ON public.design_portfolio FOR SELECT 
  USING (true);

-- Policy: Authenticated users can manage designs
CREATE POLICY "Authenticated users can insert designs"
  ON public.design_portfolio FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update designs"
  ON public.design_portfolio FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete designs"
  ON public.design_portfolio FOR DELETE
  TO authenticated
  USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.design_portfolio;

-- Create storage bucket for designs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('designs', 'designs', true);

-- Storage policies
CREATE POLICY "Public can view design images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'designs');

CREATE POLICY "Authenticated users can upload designs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'designs');

CREATE POLICY "Authenticated users can update design images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'designs');

CREATE POLICY "Authenticated users can delete design images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'designs');