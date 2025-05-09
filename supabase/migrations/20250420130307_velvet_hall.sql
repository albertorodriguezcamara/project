/*
  # Add delete policy for exercise library

  1. Changes
    - Add policy to allow authenticated users to delete exercises
*/

CREATE POLICY "Users can delete exercises"
  ON exercise_library
  FOR DELETE 
  TO authenticated
  USING (auth.uid() IS NOT NULL);