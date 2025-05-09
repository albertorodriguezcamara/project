/*
  # Initial Schema Setup for Natural Way Training Platform

  1. New Tables
    - `mesociclos` - For managing training mesocycles
    - `rutinas` - For routines within each mesocycle
    - `ejercicios` - For exercises within routines
    - `logs` - For tracking workout history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Relationships
    - Mesociclos -> Rutinas (one-to-many)
    - Rutinas -> Ejercicios (one-to-many)
    - Ejercicios -> Logs (one-to-many)
*/

-- Create mesociclos table
CREATE TABLE IF NOT EXISTS mesociclos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "order" integer NOT NULL,
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rutinas table
CREATE TABLE IF NOT EXISTS rutinas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mesociclo_id uuid REFERENCES mesociclos(id) ON DELETE CASCADE,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ejercicios table
CREATE TABLE IF NOT EXISTS ejercicios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rutina_id uuid REFERENCES rutinas(id) ON DELETE CASCADE,
  series integer NOT NULL,
  repeticiones integer NOT NULL,
  peso_inicial numeric NOT NULL,
  descanso integer NOT NULL,
  video_url text,
  descripcion text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ejercicio_id uuid REFERENCES ejercicios(id) ON DELETE CASCADE,
  peso numeric NOT NULL,
  repeticiones integer NOT NULL,
  fecha timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE mesociclos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ejercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own mesociclos" ON mesociclos;
  DROP POLICY IF EXISTS "Users can manage their own rutinas" ON rutinas;
  DROP POLICY IF EXISTS "Users can manage their own ejercicios" ON ejercicios;
  DROP POLICY IF EXISTS "Users can manage their own logs" ON logs;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create policies
CREATE POLICY "Users can manage their own mesociclos"
  ON mesociclos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage their own rutinas"
  ON rutinas
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage their own ejercicios"
  ON ejercicios
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage their own logs"
  ON logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create or replace updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_mesociclos_updated_at ON mesociclos;
DROP TRIGGER IF EXISTS update_rutinas_updated_at ON rutinas;
DROP TRIGGER IF EXISTS update_ejercicios_updated_at ON ejercicios;

-- Create triggers
CREATE TRIGGER update_mesociclos_updated_at
  BEFORE UPDATE ON mesociclos
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_rutinas_updated_at
  BEFORE UPDATE ON rutinas
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ejercicios_updated_at
  BEFORE UPDATE ON ejercicios
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();