-- Add schedule_id column to bookings table
ALTER TABLE bookings 
ADD COLUMN schedule_id uuid REFERENCES gym_schedule_templates(id) ON DELETE CASCADE;

-- Create index for better query performance on gym sessions
CREATE INDEX idx_bookings_schedule ON bookings(schedule_id, schedule_date) WHERE is_gym_session = true;

-- Update existing gym session bookings to populate schedule_id based on matching schedule templates
UPDATE bookings b
SET schedule_id = gst.id
FROM gym_schedule_templates gst
WHERE b.company_id = gst.company_id
  AND b.start_time = gst.start_time
  AND b.is_gym_session = true
  AND EXTRACT(DOW FROM b.schedule_date) = CASE 
    WHEN gst.day_of_week = 0 THEN 1  -- Monday
    WHEN gst.day_of_week = 1 THEN 2  -- Tuesday
    WHEN gst.day_of_week = 2 THEN 3  -- Wednesday
    WHEN gst.day_of_week = 3 THEN 4  -- Thursday
    WHEN gst.day_of_week = 4 THEN 5  -- Friday
    WHEN gst.day_of_week = 5 THEN 6  -- Saturday
    WHEN gst.day_of_week = 6 THEN 0  -- Sunday
  END
  AND b.schedule_id IS NULL;