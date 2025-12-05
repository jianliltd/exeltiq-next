-- Add schedule_id column to gym_waiting_list table
-- This creates a direct reference to gym_schedule_templates instead of matching by date/time

-- Add column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gym_waiting_list' AND column_name = 'schedule_id'
  ) THEN
    ALTER TABLE gym_waiting_list
    ADD COLUMN schedule_id UUID REFERENCES gym_schedule_templates(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_gym_waiting_list_schedule ON gym_waiting_list(schedule_id, schedule_date);

-- Update the unique constraint to use schedule_id instead of start_time
ALTER TABLE gym_waiting_list
DROP CONSTRAINT IF EXISTS gym_waiting_list_company_id_client_id_schedule_date_start_time_key;

-- Add new constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gym_waiting_list_unique_entry'
  ) THEN
    ALTER TABLE gym_waiting_list
    ADD CONSTRAINT gym_waiting_list_unique_entry 
    UNIQUE(company_id, client_id, schedule_id, schedule_date);
  END IF;
END $$;

-- Update the trigger function to use schedule_id for position management
CREATE OR REPLACE FUNCTION update_waiting_list_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- When a row is deleted, update positions of remaining entries
  IF TG_OP = 'DELETE' THEN
    UPDATE gym_waiting_list
    SET position = position - 1
    WHERE company_id = OLD.company_id
      AND schedule_id = OLD.schedule_id
      AND schedule_date = OLD.schedule_date
      AND position > OLD.position;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Note: For existing waitlist entries without schedule_id, you'll need to manually update them
-- or they can be cleared since they're temporary waiting list entries
