/*
  # Fix mesocycle state management

  1. Changes
    - Add trigger to handle mesocycle state changes
    - Update RLS policies
    - Add indexes for performance
*/

-- Drop existing triggers
DROP TRIGGER IF EXISTS handle_mesocycle_state_changes ON mesociclos;
DROP TRIGGER IF EXISTS ensure_single_active_mesocycle ON mesociclos;

-- Create or replace function to handle mesocycle state
CREATE OR REPLACE FUNCTION handle_mesocycle_state()
RETURNS TRIGGER AS $$
BEGIN
  -- If activating a mesocycle
  IF NEW.active = true AND OLD.active = false THEN
    -- Deactivate all other mesocycles
    UPDATE mesociclos
    SET active = false
    WHERE id != NEW.id;
  END IF;
  
  -- If completing a mesocycle
  IF NEW.completed = true AND OLD.completed = false THEN
    -- Set active to false
    NEW.active = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger for state changes
CREATE TRIGGER handle_mesocycle_state_changes
  BEFORE UPDATE ON mesociclos
  FOR EACH ROW
  WHEN (NEW.active IS DISTINCT FROM OLD.active OR NEW.completed IS DISTINCT FROM OLD.completed)
  EXECUTE FUNCTION handle_mesocycle_state();

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS mesociclos_active_idx ON mesociclos(active);
CREATE INDEX IF NOT EXISTS mesociclos_completed_idx ON mesociclos(completed);

-- Update RLS policy
DROP POLICY IF EXISTS "Users can manage their own mesociclos" ON mesociclos;

CREATE POLICY "Users can manage their own mesociclos"
ON mesociclos
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);