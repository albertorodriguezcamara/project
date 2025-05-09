-- Añade la columna ejercicio_id a workout_set_logs
ALTER TABLE workout_set_logs
ADD COLUMN ejercicio_id uuid;

-- Actualiza los registros existentes usando el join con workout_exercise_logs
UPDATE workout_set_logs AS ws
SET ejercicio_id = wel.ejercicio_id
FROM workout_exercise_logs AS wel
WHERE ws.exercise_log_id = wel.id;

-- Opcional: agrega un índice para mejorar las consultas por ejercicio_id
CREATE INDEX IF NOT EXISTS idx_workout_set_logs_ejercicio_id ON workout_set_logs(ejercicio_id);
