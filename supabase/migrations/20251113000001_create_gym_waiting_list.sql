-- Create gym_waiting_list table
CREATE TABLE IF NOT EXISTS gym_waiting_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, client_id, schedule_date, start_time)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gym_waiting_list_company_schedule ON gym_waiting_list(company_id, schedule_date, start_time);
CREATE INDEX IF NOT EXISTS idx_gym_waiting_list_client ON gym_waiting_list(client_id);
CREATE INDEX IF NOT EXISTS idx_gym_waiting_list_position ON gym_waiting_list(company_id, schedule_date, start_time, position);

-- Enable RLS
ALTER TABLE gym_waiting_list ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view waiting list entries for their company" ON gym_waiting_list;
CREATE POLICY "Users can view waiting list entries for their company" ON gym_waiting_list
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert waiting list entries" ON gym_waiting_list;
CREATE POLICY "Users can insert waiting list entries" ON gym_waiting_list
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete their own waiting list entries" ON gym_waiting_list;
CREATE POLICY "Users can delete their own waiting list entries" ON gym_waiting_list
  FOR DELETE USING (true);

-- Function to update positions when someone leaves the waiting list
CREATE OR REPLACE FUNCTION update_waiting_list_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- When a row is deleted, update positions of remaining entries
  IF TG_OP = 'DELETE' THEN
    UPDATE gym_waiting_list
    SET position = position - 1
    WHERE company_id = OLD.company_id
      AND schedule_date = OLD.schedule_date
      AND start_time = OLD.start_time
      AND position > OLD.position;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update positions
DROP TRIGGER IF EXISTS trigger_update_waiting_list_positions ON gym_waiting_list;
CREATE TRIGGER trigger_update_waiting_list_positions
AFTER DELETE ON gym_waiting_list
FOR EACH ROW
EXECUTE FUNCTION update_waiting_list_positions();
