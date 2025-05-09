/*
  # Add Workout Logs Schema

  1. New Tables
    - `workout_logs` - For tracking completed workouts
    - `workout_exercise_logs` - For tracking exercises within workouts
    - `workout_set_logs` - For tracking individual sets

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Changes
    - Add relationships between logs and existing tables
*/

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  rutina_id uuid REFERENCES rutinas(id) ON DELETE SET NULL,
  mesociclo_id uuid REFERENCES mesociclos(id) ON DELETE SET NULL,
  fecha timestamptz DEFAULT now(),
  notas text,
  created_at timestamptz DEFAULT now()
);

-- Create workout_exercise_logs table
CREATE TABLE IF NOT EXISTS workout_exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workout_logs(id) ON DELETE CASCADE,
  ejercicio_id uuid REFERENCES ejercicios(id) ON DELETE SET NULL,
  exercise_id uuid REFERENCES exercise_library(id) ON DELETE SET NULL,
  orden integer NOT NULL,
  notas text,
  created_at timestamptz DEFAULT now()
);

-- Create workout_set_logs table
CREATE TABLE IF NOT EXISTS workout_set_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_log_id uuid REFERENCES workout_exercise_logs(id) ON DELETE CASCADE,
  set_number integer NOT NULL,
  peso numeric NOT NULL,
  repeticiones integer NOT NULL,
  rpe integer, -- Rate of Perceived Exertion (1-10)
  tempo text, -- e.g., "3-1-1-0" for eccentric-pause-concentric-rest
  completed boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_set_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own workout logs"
ON workout_logs
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own workout exercise logs"
ON workout_exercise_logs
FOR ALL
TO authenticated
USING (workout_id IN (
  SELECT id FROM workout_logs WHERE user_id = auth.uid()
))
WITH CHECK (workout_id IN (
  SELECT id FROM workout_logs WHERE user_id = auth.uid()
));

CREATE POLICY "Users can manage their own workout set logs"
ON workout_set_logs
FOR ALL
TO authenticated
USING (exercise_log_id IN (
  SELECT id FROM workout_exercise_logs WHERE workout_id IN (
    SELECT id FROM workout_logs WHERE user_id = auth.uid()
  )
))
WITH CHECK (exercise_log_id IN (
  SELECT id FROM workout_exercise_logs WHERE workout_id IN (
    SELECT id FROM workout_logs WHERE user_id = auth.uid()
  )
));

-- Create indexes
CREATE INDEX IF NOT EXISTS workout_logs_user_id_idx ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS workout_logs_rutina_id_idx ON workout_logs(rutina_id);
CREATE INDEX IF NOT EXISTS workout_logs_mesociclo_id_idx ON workout_logs(mesociclo_id);
CREATE INDEX IF NOT EXISTS workout_logs_fecha_idx ON workout_logs(fecha);

CREATE INDEX IF NOT EXISTS workout_exercise_logs_workout_id_idx 
ON workout_exercise_logs(workout_id);
CREATE INDEX IF NOT EXISTS workout_exercise_logs_ejercicio_id_idx 
ON workout_exercise_logs(ejercicio_id);
CREATE INDEX IF NOT EXISTS workout_exercise_logs_exercise_id_idx 
ON workout_exercise_logs(exercise_id);

CREATE INDEX IF NOT EXISTS workout_set_logs_exercise_log_id_idx 
ON workout_set_logs(exercise_log_id);