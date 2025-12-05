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

