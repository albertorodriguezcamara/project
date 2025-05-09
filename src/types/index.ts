import type { User } from '@supabase/supabase-js';

export interface Mesociclo {
  id: string;
  name: string;
  order: number;
  active: boolean;
  completed?: boolean;
  created_at: string;
  updated_at: string;
  rutinas?: Rutina[];
}

export interface Rutina {
  id: string;
  name: string;
  mesociclo_id: string;
  order: number;
  frequency: number;
  has_variations: boolean;
  created_at: string;
  updated_at: string;
  ejercicios?: Ejercicio[];
}

export interface Ejercicio {
  id: string;
  name: string;
  rutina_id: string;
  exercise_id?: string;
  series: number;
  repeticiones: number;
  peso_inicial: number;
  descanso: number;
  video_url?: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
  exercise?: Exercise;
}

export interface Exercise {
  id: string;
  name: string;
  name_english?: string;
  description?: string;
  difficulty_level?: string;
  image_url?: string;
  video_url?: string;
  musculos_principales?: string[];
  musculos_secundarios?: string[];
}

export interface ExerciseLog {
  id: string;
  ejercicio_id: string;
  peso: number;
  repeticiones: number;
  fecha: string;
  created_at: string;
}

export interface Workout {
  id: string;
  rutina_id: string;
  fecha: string;
  ejercicios: WorkoutExercise[];
  duracion?: number; // en minutos
  notas?: string; // comentario del usuario
}

export interface WorkoutExercise {
  ejercicio_id: string;
  series: WorkoutSet[];
}

export interface WorkoutSet {
  peso: number;
  repeticiones: number;
  completed?: boolean;
}