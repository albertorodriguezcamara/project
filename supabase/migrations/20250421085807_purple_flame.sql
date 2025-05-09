/*
  # Fix mesocycle state management

  1. Changes
    - Add trigger to handle mesocycle state changes
    - Fix RLS policies to use correct auth checks
    - Add indexes for better performance
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS mesociclos_user_id_idx ON mesociclos(user_id);
CREATE INDEX IF NOT EXISTS mesociclos_active_idx ON mesociclos(active);
CREATE INDEX IF NOT EXISTS mesociclos_completed_idx ON mesociclos(completed);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own mesociclos" ON mesociclos;

-- Create new policy with proper auth checks
CREATE POLICY "Users can manage their own mesociclos"
ON mesociclos
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create or replace function to handle mesocycle state
CREATE OR REPLACE FUNCTION handle_mesocycle_state()
RETURNS TRIGGER AS $$
BEGIN
  -- If activating a mesocycle
  IF NEW.active = true AND OLD.active = false THEN
    -- Deactivate all other mesocycles for this user
    UPDATE mesociclos
    SET active = false
    WHERE user_id = NEW.user_id 
    AND id != NEW.id;
  END IF;
  
  -- If completing a mesocycle
  IF NEW.completed = true AND OLD.completed = false THEN
    -- Set active to false
    NEW.active = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS handle_mesocycle_state_changes ON mesociclos;

-- Create new trigger for state changes
CREATE TRIGGER handle_mesocycle_state_changes
  BEFORE UPDATE ON mesociclos
  FOR EACH ROW
  WHEN (NEW.active IS DISTINCT FROM OLD.active OR NEW.completed IS DISTINCT FROM OLD.completed)
  EXECUTE FUNCTION handle_mesocycle_state();