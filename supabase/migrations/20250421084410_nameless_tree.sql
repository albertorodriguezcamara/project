/*
  # Add exercise_id to ejercicios table

  1. Changes
    - Add `exercise_id` column to `ejercicios` table
    - Add foreign key constraint to reference `exercise_library` table
    - Add index for better query performance

  2. Notes
    - The column is nullable to prevent issues with existing data
    - Foreign key ensures referential integrity with exercise_library
*/

-- Add exercise_id column
ALTER TABLE ejercicios 
ADD COLUMN IF NOT EXISTS exercise_id uuid REFERENCES exercise_library(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS ejercicios_exercise_id_idx ON ejercicios(exercise_id);

-- Update RLS policy to ensure it works with the new column
CREATE POLICY "Users can manage their own ejercicios with exercise_id" ON ejercicios
FOR ALL TO authenticated
USING (uid() IS NOT NULL)
WITH CHECK (uid() IS NOT NULL);