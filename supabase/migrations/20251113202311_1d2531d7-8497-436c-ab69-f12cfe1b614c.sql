-- Drop policies that depend on start_time column
DROP POLICY IF EXISTS "Anon can book gym sessions" ON public.bookings;
DROP POLICY IF EXISTS "Anon can cancel gym sessions" ON public.bookings;

-- Change start_time and end_time columns to time without time zone
ALTER TABLE public.bookings 
ALTER COLUMN start_time TYPE time without time zone 
USING start_time::time;

ALTER TABLE public.bookings 
ALTER COLUMN end_time TYPE time without time zone 
USING end_time::time;

-- Recreate policies with updated logic using schedule_date + start_time
CREATE POLICY "Anon can book gym sessions" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  is_gym_session = true 
  AND schedule_date IS NOT NULL
  AND (schedule_date > CURRENT_DATE 
       OR (schedule_date = CURRENT_DATE AND start_time > CURRENT_TIME))
);

CREATE POLICY "Anon can cancel gym sessions" 
ON public.bookings 
FOR DELETE 
USING (
  is_gym_session = true 
  AND schedule_date IS NOT NULL
  AND (
    (schedule_date > CURRENT_DATE) 
    OR (schedule_date = CURRENT_DATE AND start_time > (CURRENT_TIME + interval '2 hours'))
  )
);