/*
  # Add INSERT policy for exercise library

  1. Changes
    - Add new RLS policy to allow authenticated users to insert records into exercise_library table

  2. Security
    - Only authenticated users can insert new exercises
    - Maintains existing SELECT policy
*/

CREATE POLICY "Users can insert exercises"
  ON exercise_library
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);