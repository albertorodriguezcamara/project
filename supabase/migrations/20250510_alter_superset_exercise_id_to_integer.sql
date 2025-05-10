-- Migración para asegurar la consistencia de tipos entre routine_exercises.superset_exercise_id y exercises.id
-- Aplica solo si los ids de ejercicios son integer en ambas tablas

-- 1. Eliminar la foreign key existente (si la hay)
ALTER TABLE routine_exercises DROP CONSTRAINT IF EXISTS fk_superset_exercise;

-- 2. Cambiar el tipo de columna id en exercises a integer
ALTER TABLE exercises
  ALTER COLUMN id TYPE integer
  USING id::integer;

-- 3. Cambiar el tipo de columna superset_exercise_id en routine_exercises a integer
ALTER TABLE routine_exercises
  ALTER COLUMN superset_exercise_id TYPE integer
  USING superset_exercise_id::integer;

-- 4. Volver a crear la foreign key
ALTER TABLE routine_exercises
  ADD CONSTRAINT fk_superset_exercise
  FOREIGN KEY (superset_exercise_id) REFERENCES exercises(id);
