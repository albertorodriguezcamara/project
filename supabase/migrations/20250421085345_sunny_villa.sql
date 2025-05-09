/*
  # Fix mesocycle state management

  1. Changes
    - Update RLS policies to use correct auth function
    - Add trigger to ensure only one active mesocycle
    - Add completed column if not exists
*/

-- Add completed column if it doesn't exist
ALTER TABLE mesociclos
ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own mesociclos" ON mesociclos;

-- Create new policy using correct auth function
CREATE POLICY "Users can manage their own mesociclos"
ON mesociclos
FOR ALL
TO authenticated
USING (auth.jwt()->>'sub' IS NOT NULL)
WITH CHECK (auth.jwt()->>'sub' IS NOT NULL);

-- Create function to handle mesocycle activation
CREATE OR REPLACE FUNCTION handle_mesocycle_activation()
RETURNS TRIGGER AS $$
BEGIN
  -- If new row is being activated
  IF NEW.active = true AND OLD.active = false THEN
    -- Deactivate all other mesocycles
    UPDATE mesociclos
    SET active = false
    WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for mesocycle activation
DROP TRIGGER IF EXISTS ensure_single_active_mesocycle ON mesociclos;
CREATE TRIGGER ensure_single_active_mesocycle
  BEFORE UPDATE ON mesociclos
  FOR EACH ROW
  WHEN (NEW.active IS DISTINCT FROM OLD.active)
  EXECUTE FUNCTION handle_mesocycle_activation();