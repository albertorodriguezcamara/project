/*
  # Fix mesocycle state management

  1. Changes
    - Update RLS policies to use correct auth function
    - Add trigger to handle mesocycle state changes
    - Add user_id column to track ownership
*/

-- Add user_id column to mesociclos
ALTER TABLE mesociclos 
ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own mesociclos" ON mesociclos;

-- Create new policy using user_id
CREATE POLICY "Users can manage their own mesociclos"
ON mesociclos
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create function to handle mesocycle state changes
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

-- Create trigger for mesocycle state changes
DROP TRIGGER IF EXISTS handle_mesocycle_state_changes ON mesociclos;
CREATE TRIGGER handle_mesocycle_state_changes
  BEFORE UPDATE ON mesociclos
  FOR EACH ROW
  WHEN (NEW.active IS DISTINCT FROM OLD.active OR NEW.completed IS DISTINCT FROM OLD.completed)
  EXECUTE FUNCTION handle_mesocycle_state();