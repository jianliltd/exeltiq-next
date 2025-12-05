-- Create storage bucket for gym logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('gym-logos', 'gym-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for gym logos bucket
CREATE POLICY "Public can view gym logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'gym-logos');

CREATE POLICY "Authenticated users can upload gym logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gym-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update their gym logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gym-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete their gym logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gym-logos' 
  AND auth.role() = 'authenticated'
);