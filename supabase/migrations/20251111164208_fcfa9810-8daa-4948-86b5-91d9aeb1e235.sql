-- Add date field to gym_schedule_templates table
ALTER TABLE public.gym_schedule_templates 
ADD COLUMN schedule_date DATE NULL;

-- Add index for better query performance on date
CREATE INDEX idx_gym_schedule_templates_date 
ON public.gym_schedule_templates(schedule_date);

-- Add comment to explain the column
COMMENT ON COLUMN public.gym_schedule_templates.schedule_date IS 'Specific date for the schedule. If null, this is a recurring weekly template based on day_of_week.';