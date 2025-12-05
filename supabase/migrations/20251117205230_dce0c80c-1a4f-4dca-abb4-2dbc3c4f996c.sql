-- Add created_by column to gym_schedule_templates table
ALTER TABLE public.gym_schedule_templates
ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_gym_schedule_templates_created_by ON public.gym_schedule_templates(created_by);

-- Create index for company_id + created_by combination (for efficient deletion)
CREATE INDEX idx_gym_schedule_templates_company_created ON public.gym_schedule_templates(company_id, created_by);

-- Update existing records to set created_by to null (or you could set it to a specific user)
-- Leaving as NULL for existing records since we don't know who created them
COMMENT ON COLUMN public.gym_schedule_templates.created_by IS 'User who created this schedule slot';

-- Create helper function to delete bookings for schedules created by a specific user
-- This avoids passing large arrays of IDs in the request
CREATE OR REPLACE FUNCTION public.delete_bookings_by_schedule_creator(
  p_company_id UUID,
  p_created_by UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.bookings
  WHERE schedule_id IN (
    SELECT id FROM public.gym_schedule_templates
    WHERE company_id = p_company_id
    AND created_by = p_created_by
  );
END;
$$;

-- Create helper function to delete waiting list entries for schedules created by a specific user
CREATE OR REPLACE FUNCTION public.delete_waitlist_by_schedule_creator(
  p_company_id UUID,
  p_created_by UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.gym_waiting_list
  WHERE schedule_id IN (
    SELECT id FROM public.gym_schedule_templates
    WHERE company_id = p_company_id
    AND created_by = p_created_by
  );
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_bookings_by_schedule_creator(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_waitlist_by_schedule_creator(UUID, UUID) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.delete_bookings_by_schedule_creator IS 'Deletes all bookings for schedules created by a specific user in a company';
COMMENT ON FUNCTION public.delete_waitlist_by_schedule_creator IS 'Deletes all waiting list entries for schedules created by a specific user in a company';