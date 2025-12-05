-- Fix search_path for update_waiting_list_positions function
CREATE OR REPLACE FUNCTION update_waiting_list_positions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;