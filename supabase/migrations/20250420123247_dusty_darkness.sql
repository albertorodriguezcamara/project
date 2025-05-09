/*
  # Exercise Library Schema

  1. New Tables
    - `exercise_categories` - Categories like strength, cardio, mobility
    - `exercises` - Main exercise library table
    - `exercise_muscles` - Junction table for muscles worked
    - `muscles` - Muscle groups table
    - `exercise_equipment` - Equipment needed for exercises

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Changes
    - Add relationships between exercises and existing tables
*/

-- Create muscle groups table
CREATE TABLE IF NOT EXISTS muscles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create equipment table
CREATE TABLE IF NOT EXISTS exercise_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS exercise_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercise_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_english text,
  description text,
  difficulty_level text CHECK (difficulty_level IN ('principiante', 'intermedio', 'avanzado')),
  category_id uuid REFERENCES exercise_categories(id) ON DELETE SET NULL,
  equipment_id uuid REFERENCES exercise_equipment(id) ON DELETE SET NULL,
  image_url text,
  video_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for primary muscles
CREATE TABLE IF NOT EXISTS exercise_primary_muscles (
  exercise_id uuid REFERENCES exercise_library(id) ON DELETE CASCADE,
  muscle_id uuid REFERENCES muscles(id) ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, muscle_id)
);

-- Create junction table for secondary muscles
CREATE TABLE IF NOT EXISTS exercise_secondary_muscles (
  exercise_id uuid REFERENCES exercise_library(id) ON DELETE CASCADE,
  muscle_id uuid REFERENCES muscles(id) ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, muscle_id)
);

-- Enable RLS
ALTER TABLE muscles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_primary_muscles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_secondary_muscles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read muscles"
  ON muscles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read equipment"
  ON exercise_equipment
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read categories"
  ON exercise_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read exercises"
  ON exercise_library
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read primary muscles"
  ON exercise_primary_muscles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read secondary muscles"
  ON exercise_secondary_muscles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at trigger for exercise_library
CREATE TRIGGER update_exercise_library_updated_at
  BEFORE UPDATE ON exercise_library
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert categories
INSERT INTO exercise_categories (name) VALUES
  ('fuerza'),
  ('cardio'),
  ('movilidad'),
  ('estiramiento'),
  ('técnica')
ON CONFLICT (name) DO NOTHING;

-- Insert equipment
INSERT INTO exercise_equipment (name) VALUES
  ('peso corporal'),
  ('barra'),
  ('mancuernas'),
  ('máquina'),
  ('banda elástica'),
  ('cuerda para saltar'),
  ('cuerda de batalla')
ON CONFLICT (name) DO NOTHING;

-- Insert muscles
INSERT INTO muscles (name) VALUES
  ('cuádriceps'),
  ('isquiotibiales'),
  ('glúteos'),
  ('pantorrillas'),
  ('pectoral mayor'),
  ('dorsal ancho'),
  ('deltoides anterior'),
  ('deltoides lateral'),
  ('deltoides posterior'),
  ('tríceps'),
  ('bíceps'),
  ('trapecio'),
  ('core'),
  ('oblicuos'),
  ('erectores espinales'),
  ('antebrazos')
ON CONFLICT (name) DO NOTHING;