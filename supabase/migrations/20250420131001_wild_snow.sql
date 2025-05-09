/*
  # Copy exercises data to exercise library
  
  1. Changes
    - Copy data from ejercicios table to exercise_library
    - Map existing columns to new structure
*/

INSERT INTO exercise_library (
  name,
  name_english,
  description,
  difficulty_level,
  category_id,
  equipment_id,
  image_url,
  video_url
)
SELECT 
  name,
  nombre_ingles,
  descripcion,
  CASE 
    WHEN nivel_dificultad = 'principiante' THEN 'principiante'
    WHEN nivel_dificultad = 'intermedio' THEN 'intermedio'
    ELSE 'avanzado'
  END as difficulty_level,
  (SELECT id FROM exercise_categories WHERE name = 'fuerza' LIMIT 1), -- Default category
  (SELECT id FROM exercise_equipment WHERE name = equipo LIMIT 1),
  image_url,
  video_url
FROM ejercicios
WHERE name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert primary muscles
INSERT INTO exercise_primary_muscles (exercise_id, muscle_id)
SELECT 
  el.id as exercise_id,
  m.id as muscle_id
FROM exercise_library el
CROSS JOIN UNNEST(
  (SELECT musculos_principales FROM ejercicios WHERE name = el.name LIMIT 1)
) as mp
JOIN muscles m ON m.name = mp
ON CONFLICT DO NOTHING;

-- Insert secondary muscles
INSERT INTO exercise_secondary_muscles (exercise_id, muscle_id)
SELECT 
  el.id as exercise_id,
  m.id as muscle_id
FROM exercise_library el
CROSS JOIN UNNEST(
  (SELECT musculos_secundarios FROM ejercicios WHERE name = el.name LIMIT 1)
) as ms
JOIN muscles m ON m.name = ms
ON CONFLICT DO NOTHING;