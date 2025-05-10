-- Add superset_exercise_id to link superseries exercises
BEGIN;

ALTER TABLE public.routine_exercises
  ADD COLUMN IF NOT EXISTS superset_exercise_id text;

ALTER TABLE public.routine_exercises
  ADD CONSTRAINT fk_superset_exercise
    FOREIGN KEY (superset_exercise_id) REFERENCES public.exercises(id) ON DELETE SET NULL;

COMMIT;
