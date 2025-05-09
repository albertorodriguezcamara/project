// src/types.ts

export interface Routine {
  id: number;
  name: string;
  description?: string;
  // Add more fields as needed
}

export interface Mesocycle {
  id: number;
  name: string;
  durationWeeks: number;
  description?: string;
  routines: Routine[];
  // Add more fields as needed
}

export interface Workout {
  id: number;
  date: string; // ISO string or Date
  routineId: number;
  mesocycleId: number;
  exercises: ExerciseLog[];
  // Add more fields as needed
}

export interface ExerciseLog {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  // Add more fields as needed
}
