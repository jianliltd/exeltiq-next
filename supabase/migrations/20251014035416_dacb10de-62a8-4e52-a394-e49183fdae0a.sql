-- Add gym-specific fields to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS gym_slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_gym BOOLEAN DEFAULT false;

-- Add gym-specific fields to clients table for session tracking
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sessions_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sessions_remaining INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS session_package_expires_at TIMESTAMP WITH TIME ZONE;

-- Create gym schedule templates table (recurring weekly slots)
CREATE TABLE public.gym_schedule_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, day_of_week, start_time)
);

-- Enable RLS on gym_schedule_templates
ALTER TABLE public.gym_schedule_templates ENABLE ROW LEVEL SECURITY;

-- Gym owners can manage their schedules
CREATE POLICY "Gym owners can manage schedule templates"
ON public.gym_schedule_templates
FOR ALL
USING (is_admin(auth.uid(), company_id))
WITH CHECK (is_admin(auth.uid(), company_id));

-- Anyone can view active schedules for public booking (using gym_slug)
CREATE POLICY "Public can view active gym schedules"
ON public.gym_schedule_templates
FOR SELECT
USING (is_active = true);

-- Add session notes and gym-specific fields to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS session_notes TEXT,
ADD COLUMN IF NOT EXISTS is_gym_session BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS check_out_time TIMESTAMP WITH TIME ZONE;

-- Create policy for clients to view their own gym bookings
CREATE POLICY "Clients can view their own gym bookings"
ON public.bookings
FOR SELECT
USING (
  is_gym_session = true 
  AND client_id IN (
    SELECT id FROM public.clients WHERE email = auth.jwt() ->> 'email'
  )
);

-- Create policy for clients to book gym sessions
CREATE POLICY "Clients can book gym sessions"
ON public.bookings
FOR INSERT
WITH CHECK (
  is_gym_session = true 
  AND client_id IN (
    SELECT id FROM public.clients WHERE email = auth.jwt() ->> 'email'
  )
  AND start_time > now()
);

-- Create policy for clients to cancel their bookings (2 hours before)
CREATE POLICY "Clients can cancel gym bookings"
ON public.bookings
FOR DELETE
USING (
  is_gym_session = true 
  AND client_id IN (
    SELECT id FROM public.clients WHERE email = auth.jwt() ->> 'email'
  )
  AND start_time > (now() + interval '2 hours')
);

-- Add trigger for gym_schedule_templates updated_at
CREATE TRIGGER update_gym_schedule_templates_updated_at
BEFORE UPDATE ON public.gym_schedule_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster gym lookups
CREATE INDEX IF NOT EXISTS idx_companies_gym_slug ON public.companies(gym_slug) WHERE gym_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_gym_sessions ON public.bookings(company_id, start_time) WHERE is_gym_session = true;
CREATE INDEX IF NOT EXISTS idx_gym_schedules_active ON public.gym_schedule_templates(company_id, is_active) WHERE is_active = true;