-- Add repeat_id and repeat_type columns to gym_schedule_templates table (idempotent)
-- These columns allow tracking recurring event series
-- Note: This may be a duplicate of 20251117213918

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'gym_schedule_templates' 
    AND column_name = 'repeat_id'
  ) THEN
    ALTER TABLE public.gym_schedule_templates ADD COLUMN repeat_id UUID;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'gym_schedule_templates' 
    AND column_name = 'repeat_type'
  ) THEN
    ALTER TABLE public.gym_schedule_templates ADD COLUMN repeat_type TEXT;
  END IF;
END $$;

-- Create index for efficient querying of recurring events
CREATE INDEX IF NOT EXISTS idx_gym_schedule_templates_repeat_id ON public.gym_schedule_templates(repeat_id);

-- Add comments for documentation
COMMENT ON COLUMN public.gym_schedule_templates.repeat_id IS 'UUID that groups recurring events together. NULL for non-recurring events';
COMMENT ON COLUMN public.gym_schedule_templates.repeat_type IS 'Type of recurrence: none, daily, weekdays, weekly, monthly';
