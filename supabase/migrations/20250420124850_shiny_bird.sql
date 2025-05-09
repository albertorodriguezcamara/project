/*
  # Add routine variations and scheduling

  1. New Tables
    - `rutina_variations` - Stores variations of routines
      - `id` (uuid, primary key)
      - `rutina_id` (uuid, foreign key)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `ejercicio_variations` - Stores exercise modifications for each variation
      - `variation_id` (uuid, foreign key)
      - `ejercicio_id` (uuid, foreign key)
      - `series` (integer)
      - `repeticiones` (integer)
      - `peso_inicial` (numeric)
      - `descanso` (integer)
      - `notas` (text)
    
    - `rutina_schedule` - Stores weekly schedule for routines
      - `id` (uuid, primary key)
      - `rutina_id` (uuid, foreign key)
      - `variation_id` (uuid, foreign key, nullable)
      - `day_of_week` (integer)
      - `week_number` (integer)
      - `created_at` (timestamp)

  2. Changes to existing tables
    - Add `frequency` and `has_variations` to `rutinas` table

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Add new columns to rutinas
ALTER TABLE rutinas ADD COLUMN frequency integer NOT NULL DEFAULT 1;
ALTER TABLE rutinas ADD COLUMN has_variations boolean NOT NULL DEFAULT false;

-- Create rutina_variations table
CREATE TABLE rutina_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rutina_id uuid REFERENCES rutinas(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ejercicio_variations table
CREATE TABLE ejercicio_variations (
  variation_id uuid REFERENCES rutina_variations(id) ON DELETE CASCADE,
  ejercicio_id uuid REFERENCES ejercicios(id) ON DELETE CASCADE,
  series integer,
  repeticiones integer,
  peso_inicial numeric,
  descanso integer,
  notas text,
  PRIMARY KEY (variation_id, ejercicio_id)
);

-- Create rutina_schedule table
CREATE TABLE rutina_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rutina_id uuid REFERENCES rutinas(id) ON DELETE CASCADE,
  variation_id uuid REFERENCES rutina_variations(id) ON DELETE SET NULL,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  week_number integer NOT NULL CHECK (week_number > 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rutina_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ejercicio_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutina_schedule ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own rutina variations"
  ON rutina_variations
  FOR ALL
  TO authenticated
  USING (
    rutina_id IN (
      SELECT id FROM rutinas WHERE mesociclo_id IN (
        SELECT id FROM mesociclos WHERE auth.uid() IS NOT NULL
      )
    )
  );

CREATE POLICY "Users can manage their own ejercicio variations"
  ON ejercicio_variations
  FOR ALL
  TO authenticated
  USING (
    variation_id IN (
      SELECT id FROM rutina_variations WHERE rutina_id IN (
        SELECT id FROM rutinas WHERE mesociclo_id IN (
          SELECT id FROM mesociclos WHERE auth.uid() IS NOT NULL
        )
      )
    )
  );

CREATE POLICY "Users can manage their own rutina schedule"
  ON rutina_schedule
  FOR ALL
  TO authenticated
  USING (
    rutina_id IN (
      SELECT id FROM rutinas WHERE mesociclo_id IN (
        SELECT id FROM mesociclos WHERE auth.uid() IS NOT NULL
      )
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_rutina_variations_updated_at
  BEFORE UPDATE ON rutina_variations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();