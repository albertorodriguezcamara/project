/*
  # Fix Exercise Library Schema

  1. Changes
    - Add ON DELETE CASCADE to foreign key references
    - Add missing indexes for performance
    - Fix RLS policies to allow proper data access
    - Add trigger for updated_at column

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS exercise_secondary_muscles CASCADE;
DROP TABLE IF EXISTS exercise_primary_muscles CASCADE;
DROP TABLE IF EXISTS exercise_library CASCADE;
DROP TABLE IF EXISTS exercise_categories CASCADE;
DROP TABLE IF EXISTS exercise_equipment CASCADE;
DROP TABLE IF EXISTS muscles CASCADE;

-- Create tables
CREATE TABLE muscles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX muscles_name_key ON muscles (name);

CREATE TABLE exercise_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX exercise_equipment_name_key ON exercise_equipment (name);

CREATE TABLE exercise_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX exercise_categories_name_key ON exercise_categories (name);

CREATE TABLE exercise_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_english text,
  description text,
  difficulty_level text CHECK (difficulty_level IN ('principiante', 'intermedio', 'avanzado')),
  category_id uuid REFERENCES exercise_categories(id) ON DELETE CASCADE,
  equipment_id uuid REFERENCES exercise_equipment(id) ON DELETE CASCADE,
  image_url text,
  video_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX exercise_library_category_id_idx ON exercise_library (category_id);
CREATE INDEX exercise_library_equipment_id_idx ON exercise_library (equipment_id);

CREATE TABLE exercise_primary_muscles (
  exercise_id uuid REFERENCES exercise_library(id) ON DELETE CASCADE,
  muscle_id uuid REFERENCES muscles(id) ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, muscle_id)
);

CREATE TABLE exercise_secondary_muscles (
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
  ON muscles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read equipment"
  ON exercise_equipment FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read categories"
  ON exercise_categories FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read exercises"
  ON exercise_library FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read primary muscles"
  ON exercise_primary_muscles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read secondary muscles"
  ON exercise_secondary_muscles FOR SELECT TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_exercise_library_updated_at
  BEFORE UPDATE ON exercise_library
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO exercise_categories (name) VALUES
  ('fuerza'),
  ('cardio'),
  ('movilidad'),
  ('estiramiento'),
  ('técnica')
ON CONFLICT (name) DO NOTHING;

INSERT INTO exercise_equipment (name) VALUES
  ('peso corporal'),
  ('barra'),
  ('mancuernas'),
  ('máquina'),
  ('banda elástica'),
  ('cuerda para saltar'),
  ('cuerda de batalla')
ON CONFLICT (name) DO NOTHING;

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