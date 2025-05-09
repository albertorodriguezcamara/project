-- Migration: Crear tabla exercises para ExerciseDB
create table if not exists public.exercises (
  id text primary key,
  name text,
  bodyPart text,
  equipment text,
  gifUrl text,
  target text,
  muscle text,
  secondaryMuscles jsonb,
  instructions jsonb
);
