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

