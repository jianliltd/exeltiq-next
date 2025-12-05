-- Add created_by column to gym_schedule_templates table (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'gym_schedule_templates' 
    AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.gym_schedule_templates
    ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gym_schedule_templates_created_by ON public.gym_schedule_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_gym_schedule_templates_company_created ON public.gym_schedule_templates(company_id, created_by);

-- Update existing records to set created_by to null (or you could set it to a specific user)
-- Leaving as NULL for existing records since we don't know who created them
COMMENT ON COLUMN public.gym_schedule_templates.created_by IS 'User who created this schedule slot';
