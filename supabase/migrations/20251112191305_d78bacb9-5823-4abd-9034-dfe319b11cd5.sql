-- Fix RLS policies to work with anon (unauthenticated) users

-- Drop existing public gym policies
DROP POLICY IF EXISTS "Public can book gym sessions" ON public.bookings;
DROP POLICY IF EXISTS "Public can cancel gym sessions" ON public.bookings;
DROP POLICY IF EXISTS "Public can view gym sessions" ON public.bookings;
DROP POLICY IF EXISTS "Public can update gym sessions" ON public.bookings;

-- Create new policies that explicitly allow anon role
CREATE POLICY "Anon can book gym sessions"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (is_gym_session = true AND start_time > now());

CREATE POLICY "Anon can cancel gym sessions"
ON public.bookings
FOR DELETE
TO anon, authenticated
USING (is_gym_session = true AND start_time > (now() + interval '2 hours'));

CREATE POLICY "Anon can view gym sessions"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (is_gym_session = true);

CREATE POLICY "Anon can update gym sessions"
ON public.bookings
FOR UPDATE
TO anon, authenticated
USING (is_gym_session = true);