/*
  # Recent Changes Migration

  1. Add advanced exercise features
    - Add columns for advanced training modes (supersets, dropsets)
    - Add columns for exercise variations and scheduling
  
  2. Improve exercise tracking
    - Add columns for tracking exercise progression
    - Add support for exercise variations
*/

-- Add advanced mode columns to ejercicios
ALTER TABLE ejercicios
ADD COLUMN IF NOT EXISTS advanced_mode text DEFAULT 'normal'
  CHECK (advanced_mode IN ('normal', 'superset', 'dropset')),
ADD COLUMN IF NOT EXISTS superset_exercise_id uuid REFERENCES ejercicios(id),
ADD COLUMN IF NOT EXISTS drop_sets integer DEFAULT 0;

-- Add index for superset relationships
CREATE INDEX IF NOT EXISTS ejercicios_superset_idx 
ON ejercicios(superset_exercise_id);

-- Add columns for exercise progression
ALTER TABLE ejercicios
ADD COLUMN IF NOT EXISTS progression_type text DEFAULT 'linear'
  CHECK (progression_type IN ('linear', 'double-progression', 'wave')),
ADD COLUMN IF NOT EXISTS progression_increment numeric DEFAULT 2.5;

-- Add columns for exercise scheduling
ALTER TABLE ejercicios
ADD COLUMN IF NOT EXISTS schedule_priority integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS min_rest_days integer DEFAULT 1;

-- Add columns for exercise variations
ALTER TABLE ejercicios
ADD COLUMN IF NOT EXISTS variation_group_id uuid,
ADD COLUMN IF NOT EXISTS is_variation boolean DEFAULT false;

-- Create index for variation grouping
CREATE INDEX IF NOT EXISTS ejercicios_variation_group_idx 
ON ejercicios(variation_group_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can manage their own ejercicios" ON ejercicios;
CREATE POLICY "Users can manage their own ejercicios"
ON ejercicios
FOR ALL
TO authenticated
USING (
  rutina_id IN (
    SELECT id FROM rutinas 
    WHERE mesociclo_id IN (
      SELECT id FROM mesociclos 
      WHERE auth.uid() IS NOT NULL
    )
  )
)
WITH CHECK (
  rutina_id IN (
    SELECT id FROM rutinas 
    WHERE mesociclo_id IN (
      SELECT id FROM mesociclos 
      WHERE auth.uid() IS NOT NULL
    )
  )
);

-- Add trigger for handling exercise variations
CREATE OR REPLACE FUNCTION handle_exercise_variations()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a variation, ensure it has a group
  IF NEW.is_variation = true AND NEW.variation_group_id IS NULL THEN
    NEW.variation_group_id := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_variation_group
  BEFORE INSERT OR UPDATE ON ejercicios
  FOR EACH ROW
  WHEN (NEW.is_variation = true)
  EXECUTE FUNCTION handle_exercise_variations();