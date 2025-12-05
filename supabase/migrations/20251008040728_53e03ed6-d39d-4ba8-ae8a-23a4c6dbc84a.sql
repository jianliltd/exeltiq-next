-- Add INSERT policy for companies
-- Allow authenticated users to create companies (they will become owners via the trigger)
CREATE POLICY "Users can create companies during signup"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add constraint to ensure company slugs are unique
ALTER TABLE public.companies
ADD CONSTRAINT companies_slug_unique UNIQUE (slug);