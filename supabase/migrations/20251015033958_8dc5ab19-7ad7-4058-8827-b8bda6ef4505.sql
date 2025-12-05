-- Add RLS policy to allow public viewing of gym companies by their gym_slug
-- This enables the public gym booking pages to load company information
CREATE POLICY "Public can view gym companies by slug"
ON companies
FOR SELECT
USING (is_gym = true AND gym_slug IS NOT NULL);