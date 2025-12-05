-- Add repeat tracking columns to gym_schedule_templates
ALTER TABLE public.gym_schedule_templates
ADD COLUMN IF NOT EXISTS repeat_id UUID,
ADD COLUMN IF NOT EXISTS repeat_type TEXT;

-- Create index for repeat_id lookups
CREATE INDEX IF NOT EXISTS idx_gym_schedule_templates_repeat_id 
ON public.gym_schedule_templates(repeat_id) 
WHERE repeat_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.gym_schedule_templates.repeat_id IS 'Groups recurring schedule slots together';
COMMENT ON COLUMN public.gym_schedule_templates.repeat_type IS 'Type of recurrence: daily, weekly, monthly, or none';