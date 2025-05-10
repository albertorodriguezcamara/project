-- Limpia los valores de exercise_id que no sean UUID válidos
UPDATE workout_exercise_logs
SET exercise_id = NULL
WHERE exercise_id !~* '^[0-9a-fA-F-]{36}$';

-- Cambia el tipo de columna a uuid
ALTER TABLE workout_exercise_logs
ALTER COLUMN exercise_id TYPE uuid USING exercise_id::text::uuid;

-- (Opcional) Verifica que la clave foránea sigue activa y válida
-- Si da error, elimina y vuelve a crear la foreign key:
-- ALTER TABLE workout_exercise_logs DROP CONSTRAINT IF EXISTS workout_exercise_logs_exercise_id_fkey;
-- ALTER TABLE workout_exercise_logs ADD CONSTRAINT workout_exercise_logs_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id);
