-- Update RLS policies for gym bookings to work with phone login flow

-- Drop the restrictive policies that require auth.jwt()
DROP POLICY IF EXISTS "Clients can book gym sessions" ON public.bookings;
DROP POLICY IF EXISTS "Clients can cancel gym bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can view their own gym bookings" ON public.bookings;

-- Allow public access for gym sessions (is_gym_session = true)
CREATE POLICY "Public can book gym sessions"
ON public.bookings
FOR INSERT
WITH CHECK (is_gym_session = true AND start_time > now());

CREATE POLICY "Public can cancel gym sessions"
ON public.bookings
FOR DELETE
USING (is_gym_session = true AND start_time > (now() + interval '2 hours'));

CREATE POLICY "Public can view gym sessions"
ON public.bookings
FOR SELECT
USING (is_gym_session = true);

CREATE POLICY "Public can update gym sessions"
ON public.bookings
FOR UPDATE
USING (is_gym_session = true);