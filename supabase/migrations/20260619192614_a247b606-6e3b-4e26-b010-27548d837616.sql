CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  whatsapp text,
  package text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);