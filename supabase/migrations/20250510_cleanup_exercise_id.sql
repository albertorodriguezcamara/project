-- Limpieza final de columnas y foreign key para exercise_id en routine_exercises

-- 1. Elimina la columna antigua UUID si existe
ALTER TABLE routine_exercises DROP COLUMN IF EXISTS exercise_id_uuid;

-- 2. Elimina la foreign key duplicada si existe
ALTER TABLE routine_exercises DROP CONSTRAINT IF EXISTS routine_exercises_exercise_id_fkey;

-- 3. Crea la foreign key correcta sobre el campo integer
ALTER TABLE routine_exercises
  ADD CONSTRAINT routine_exercises_exercise_id_fkey
  FOREIGN KEY (exercise_id) REFERENCES exercises(id);
