/*
  # Create mesociclos schema with policy checks

  1. Tables
    - mesociclos (uuid, name, order, active, timestamps)
    - rutinas (uuid, name, mesociclo_id, order, timestamps)
    - ejercicios (uuid, name, rutina_id, series, repeticiones, peso_inicial, descanso, video_url, descripcion, timestamps)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users with existence checks
*/

-- Create tables
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

-- Enable RLS
ALTER TABLE mesociclos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ejercicios ENABLE ROW LEVEL SECURITY;

-- Create policies with existence checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own mesociclos'
  ) THEN
    CREATE POLICY "Users can manage their own mesociclos"
      ON mesociclos
      FOR ALL
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own rutinas'
  ) THEN
    CREATE POLICY "Users can manage their own rutinas"
      ON rutinas
      FOR ALL
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own ejercicios'
  ) THEN
    CREATE POLICY "Users can manage their own ejercicios"
      ON ejercicios
      FOR ALL
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers with IF NOT EXISTS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_mesociclos_updated_at'
  ) THEN
    CREATE TRIGGER update_mesociclos_updated_at
      BEFORE UPDATE ON mesociclos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_rutinas_updated_at'
  ) THEN
    CREATE TRIGGER update_rutinas_updated_at
      BEFORE UPDATE ON rutinas
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_ejercicios_updated_at'
  ) THEN
    CREATE TRIGGER update_ejercicios_updated_at
      BEFORE UPDATE ON ejercicios
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;