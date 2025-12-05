-- Add repeat_id and repeat_type columns to gym_schedule_templates table
-- These columns allow tracking recurring event series

ALTER TABLE public.gym_schedule_templates
ADD COLUMN repeat_id UUID,
ADD COLUMN repeat_type TEXT;

-- Create index for efficient querying of recurring events
CREATE INDEX idx_gym_schedule_templates_repeat_id ON public.gym_schedule_templates(repeat_id);

-- Add comments for documentation
COMMENT ON COLUMN public.gym_schedule_templates.repeat_id IS 'UUID that groups recurring events together. NULL for non-recurring events';
COMMENT ON COLUMN public.gym_schedule_templates.repeat_type IS 'Type of recurrence: none, daily, weekdays, weekly, monthly';

