-- Add social media and location fields to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS google_maps_url TEXT;