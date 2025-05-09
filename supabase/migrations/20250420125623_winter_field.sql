/*
  # Add exercise data
  
  1. Categories
    - Add basic exercise categories if they don't exist
  
  2. Equipment
    - Add equipment types if they don't exist
  
  3. Muscles
    - Add muscle groups if they don't exist
*/

DO $$
BEGIN
  -- Insert categories
  IF NOT EXISTS (SELECT 1 FROM exercise_categories WHERE name = 'fuerza') THEN
    INSERT INTO exercise_categories (name) VALUES ('fuerza');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_categories WHERE name = 'cardio') THEN
    INSERT INTO exercise_categories (name) VALUES ('cardio');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_categories WHERE name = 'movilidad') THEN
    INSERT INTO exercise_categories (name) VALUES ('movilidad');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_categories WHERE name = 'estiramiento') THEN
    INSERT INTO exercise_categories (name) VALUES ('estiramiento');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_categories WHERE name = 'técnica') THEN
    INSERT INTO exercise_categories (name) VALUES ('técnica');
  END IF;

  -- Insert equipment
  IF NOT EXISTS (SELECT 1 FROM exercise_equipment WHERE name = 'barra') THEN
    INSERT INTO exercise_equipment (name) VALUES ('barra');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_equipment WHERE name = 'mancuernas') THEN
    INSERT INTO exercise_equipment (name) VALUES ('mancuernas');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_equipment WHERE name = 'máquina') THEN
    INSERT INTO exercise_equipment (name) VALUES ('máquina');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_equipment WHERE name = 'peso corporal') THEN
    INSERT INTO exercise_equipment (name) VALUES ('peso corporal');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_equipment WHERE name = 'banda elástica') THEN
    INSERT INTO exercise_equipment (name) VALUES ('banda elástica');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_equipment WHERE name = 'cuerda para saltar') THEN
    INSERT INTO exercise_equipment (name) VALUES ('cuerda para saltar');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_equipment WHERE name = 'cajón pliométrico') THEN
    INSERT INTO exercise_equipment (name) VALUES ('cajón pliométrico');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM exercise_equipment WHERE name = 'cuerda de batalla') THEN
    INSERT INTO exercise_equipment (name) VALUES ('cuerda de batalla');
  END IF;

  -- Insert muscles
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'cuádriceps') THEN
    INSERT INTO muscles (name) VALUES ('cuádriceps');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'glúteos') THEN
    INSERT INTO muscles (name) VALUES ('glúteos');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'isquiotibiales') THEN
    INSERT INTO muscles (name) VALUES ('isquiotibiales');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'core') THEN
    INSERT INTO muscles (name) VALUES ('core');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'espalda baja') THEN
    INSERT INTO muscles (name) VALUES ('espalda baja');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'pectoral mayor') THEN
    INSERT INTO muscles (name) VALUES ('pectoral mayor');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'tríceps') THEN
    INSERT INTO muscles (name) VALUES ('tríceps');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'deltoides anterior') THEN
    INSERT INTO muscles (name) VALUES ('deltoides anterior');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'deltoides medio') THEN
    INSERT INTO muscles (name) VALUES ('deltoides medio');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'deltoides lateral') THEN
    INSERT INTO muscles (name) VALUES ('deltoides lateral');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'deltoides posterior') THEN
    INSERT INTO muscles (name) VALUES ('deltoides posterior');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'trapecio') THEN
    INSERT INTO muscles (name) VALUES ('trapecio');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'bíceps') THEN
    INSERT INTO muscles (name) VALUES ('bíceps');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'dorsal ancho') THEN
    INSERT INTO muscles (name) VALUES ('dorsal ancho');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'romboides') THEN
    INSERT INTO muscles (name) VALUES ('romboides');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'antebrazos') THEN
    INSERT INTO muscles (name) VALUES ('antebrazos');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'pantorrillas') THEN
    INSERT INTO muscles (name) VALUES ('pantorrillas');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'oblicuos') THEN
    INSERT INTO muscles (name) VALUES ('oblicuos');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'recto abdominal') THEN
    INSERT INTO muscles (name) VALUES ('recto abdominal');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'erectores espinales') THEN
    INSERT INTO muscles (name) VALUES ('erectores espinales');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'manguito rotador') THEN
    INSERT INTO muscles (name) VALUES ('manguito rotador');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'esternocleidomastoideo') THEN
    INSERT INTO muscles (name) VALUES ('esternocleidomastoideo');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'flexores de cadera') THEN
    INSERT INTO muscles (name) VALUES ('flexores de cadera');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'abductores') THEN
    INSERT INTO muscles (name) VALUES ('abductores');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'aductores') THEN
    INSERT INTO muscles (name) VALUES ('aductores');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'piriforme') THEN
    INSERT INTO muscles (name) VALUES ('piriforme');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM muscles WHERE name = 'supraespinoso') THEN
    INSERT INTO muscles (name) VALUES ('supraespinoso');
  END IF;
END $$;