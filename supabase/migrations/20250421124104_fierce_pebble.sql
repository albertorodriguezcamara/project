/*
  # Add set_data column to ejercicios table

  1. Changes
    - Add `set_data` column to `ejercicios` table to store exercise set information as JSONB
    - Column allows NULL values since not all exercises might have set data
    - Default value is NULL

  2. Security
    - Inherits existing RLS policies from ejercicios table
    - No additional security changes needed
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ejercicios' 
    AND column_name = 'set_data'
  ) THEN
    ALTER TABLE ejercicios 
    ADD COLUMN set_data JSONB;
  END IF;
END $$;