import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'vue3-toastify';
import type {
  Workout,
  WorkoutExercise,
  WorkoutSet
} from '@/types';

export const useWorkoutLogsStore = defineStore('workoutLogs', () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const workouts = ref<any[]>([]); // Estado reactivo para los workouts

  /**
   * Guarda un entrenamiento real en logs: workout_logs + workout_exercise_logs + workout_set_logs
   */
  async function saveWorkout(workout: Workout) {
    try {
      isLoading.value = true;
      error.value = null;

      // 1) Crear un registro en workout_logs
      const { data: wLog, error: wError } = await supabase
        .from('workout_logs')
        .insert({
          rutina_id: workout.rutina_id,
          fecha: workout.fecha,
          duracion: workout.duracion || null,
          notas: workout.notas || ''
        })
        .select()
        .single();

      if (wError) throw wError;

      // 2) Por cada ejercicio real, creamos su log
      for (let i = 0; i < workout.ejercicios.length; i++) {
        const exReal: WorkoutExercise = workout.ejercicios[i];

        // Insert en workout_exercise_logs
        const { data: exLog, error: exError } = await supabase
          .from('workout_exercise_logs')
          .insert({
            workout_id: wLog.id,
            ejercicio_id: exReal.ejercicio_id,
            orden: i + 1
          })
          .select()
          .single();

        if (exError) throw exError;

        // 3) Guardar las series
        const setsToInsert = exReal.series.map((s, idx) => ({
          exercise_log_id: exLog.id,
          set_number: idx + 1,
          peso: s.peso,
          repeticiones: s.repeticiones,
          completed: s.completed || false,
          ejercicio_id: exReal.id // <-- Usa el UUID real del ejercicio
        }));

        console.log('[saveWorkout] Insertando sets en workout_set_logs:', setsToInsert);
        const { data: setsData, error: setsErr } = await supabase
          .from('workout_set_logs')
          .insert(setsToInsert)
          .select();
        console.log('[saveWorkout] Respuesta de workout_set_logs:', { setsData, setsErr });

        if (setsErr) throw setsErr;
      }

      toast.success('Entrenamiento registrado correctamente.');
      return wLog;
    } catch (err: any) {
      console.error('Error saving workout:', err);
      error.value = err.message || 'Error al guardar entrenamiento';
      toast.error(error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Ejemplo de fetch de logs, si quieres listar entrenamientos
   */
  async function getWorkouts() {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from('workout_logs')
        .select(`
          *,
          ejercicios:workout_exercise_logs (
            *,
            sets:workout_set_logs(*)
          )
        `)
        .order('fecha', { ascending: false });

      if (fetchError) throw fetchError;

      workouts.value = data || [];
      return data;
    } catch (err: any) {
      console.error('Error fetching workouts:', err);
      error.value = err.message || 'Error al cargar workouts';
      toast.error(error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    workouts,
    saveWorkout,
    getWorkouts
  };
});
