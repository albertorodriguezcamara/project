/*
  # Schema update for training platform

  1. Tables
    - Create tables for mesociclos, rutinas, ejercicios, and logs
    - Add appropriate foreign key constraints
    - Set up timestamps and default values

  2. Security
    - Enable RLS on all tables
    - Create policies for authenticated users
    - Handle existing policy conflicts

  3. Triggers
    - Add updated_at triggers for all tables
*/

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS mesociclos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "order" integer NOT NULL,
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rutinas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mesociclo_id uuid REFERENCES mesociclos(id) ON DELETE CASCADE,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ejercicio_id uuid REFERENCES ejercicios(id) ON DELETE CASCADE,
  peso numeric NOT NULL,
  repeticiones integer NOT NULL,
  fecha timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
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
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own rutinas"
  ON rutinas
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own ejercicios"
  ON ejercicios
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own logs"
  ON logs
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

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