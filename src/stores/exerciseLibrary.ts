import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'vue3-toastify';

export interface Exercise {
  id: string;
  name_es?: string;
  name_en?: string;
  bodyPart_es?: string;
  bodyPart_en?: string;
  target_es?: string;
  target_en?: string;
  equipment_es?: string;
  equipment_en?: string;
  secondaryMuscles_es?: string;
  secondaryMuscles_en?: string;
  instructions_es?: string;
  instructions_en?: string;
  gif_url_supabase?: string;
  uuid?: string;
}


interface ExerciseLog {
  id: string;
  ejercicio_id: string;
  peso: number;
  repeticiones: number;
  fecha: string;
  created_at: string;
}

interface RutinaData {
  name: string;
  order: number;
  frequency: number;
  mesociclo_id: string;
  ejercicios: {
    exercise_id: string;
    sets: { weight: number; reps: number; }[];
  }[];
}

const DEFAULT_IMAGES = [
  'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg',
  'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg',
  'https://images.pexels.com/photos/4162583/pexels-photo-4162583.jpeg',
  'https://images.pexels.com/photos/6550851/pexels-photo-6550851.jpeg',
  'https://images.pexels.com/photos/6550852/pexels-photo-6550852.jpeg'
];

export const useExerciseLibraryStore = defineStore('exerciseLibrary', () => {
  const exercises = ref<Exercise[]>([]);
  const exerciseLogs = ref<ExerciseLog[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchExerciseLibrary() {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: fetchError } = await supabase
        .from('exercises')
        .select('*')
        ;

      if (fetchError) throw fetchError;

      exercises.value = (data || []).map((exercise: any) => ({
        id: exercise.id,
        name_es: exercise.name_es,
        name_en: exercise.name_en,
        bodyPart_es: exercise.bodyPart_es,
        bodyPart_en: exercise.bodyPart_en,
        target_es: exercise.target_es,
        target_en: exercise.target_en,
        equipment_es: exercise.equipment_es,
        equipment_en: exercise.equipment_en,
        secondaryMuscles_es: exercise.secondaryMuscles_es,
        secondaryMuscles_en: exercise.secondaryMuscles_en,
        instructions_es: exercise.instructions_es,
        instructions_en: exercise.instructions_en,
        gif_url_supabase: exercise.gif_url_supabase,
        uuid: exercise.uuid,
      }));

    } catch (err) {
      console.error('Error fetching exercise library:', err);
      error.value = 'Error al cargar la biblioteca de ejercicios';
      toast.error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchExerciseLogs(ejercicioId: string) {
    try {
      // Buscar los sets de este ejercicio en workout_set_logs
      const { data, error: fetchError } = await supabase
        .from('workout_set_logs')
        .select('*')
        .eq('ejercicio_id', ejercicioId)
        .order('fecha', { ascending: true });

      if (fetchError) throw fetchError;
      // Mapear los datos para que coincidan con ExerciseLog
      exerciseLogs.value = (data || []).map(log => ({
        id: log.id,
        ejercicio_id: log.ejercicio_id,
        peso: log.peso,
        repeticiones: log.repeticiones,
        fecha: log.fecha,
        created_at: log.created_at
      }));
    } catch (err) {
      console.error('Error fetching exercise logs:', err);
      toast.error('Error al cargar el historial del ejercicio');
    }
  }

  async function createRutina(data: RutinaData) {
    try {
      // First create the rutina
      const { data: rutinaData, error: rutinaError } = await supabase
        .from('rutinas')
        .insert([{
          name: data.name,
          order: data.order,
          frequency: data.frequency,
          mesociclo_id: data.mesociclo_id
        }])
        .select()
        .single();

      if (rutinaError) throw rutinaError;

      // Then create all ejercicios for this rutina
      const ejerciciosPromises = data.ejercicios.map(async (ejercicio) => {
        const { error: ejercicioError } = await supabase
          .from('ejercicios')
          .insert([{
            rutina_id: rutinaData.id,
            exercise_id: ejercicio.exercise_id,
            series: ejercicio.sets.length,
            repeticiones: ejercicio.sets[0].reps,
            peso_inicial: ejercicio.sets[0].weight
          }]);

        if (ejercicioError) throw ejercicioError;
      });

      await Promise.all(ejerciciosPromises);
      toast.success('Rutina creada exitosamente');

    } catch (err) {
      console.error('Error creating rutina:', err);
      toast.error('Error al crear la rutina');
      throw err;
    }
  }

  async function updateRutina(rutinaId: string, data: RutinaData) {
    try {
      // Update the rutina basic info
      const { error: rutinaError } = await supabase
        .from('rutinas')
        .update({
          name: data.name,
          order: data.order,
          frequency: data.frequency
        })
        .eq('id', rutinaId);

      if (rutinaError) throw rutinaError;

      // Delete existing ejercicios
      const { error: deleteError } = await supabase
        .from('ejercicios')
        .delete()
        .eq('rutina_id', rutinaId);

      if (deleteError) throw deleteError;

      // Create new ejercicios
      const ejerciciosPromises = data.ejercicios.map(async (ejercicio) => {
        const { error: ejercicioError } = await supabase
          .from('ejercicios')
          .insert([{
            rutina_id: rutinaId,
            exercise_id: ejercicio.exercise_id,
            series: ejercicio.sets.length,
            repeticiones: ejercicio.sets[0].reps,
            peso_inicial: ejercicio.sets[0].weight
          }]);

        if (ejercicioError) throw ejercicioError;
      });

      await Promise.all(ejerciciosPromises);
      toast.success('Rutina actualizada exitosamente');

    } catch (err) {
      console.error('Error updating rutina:', err);
      toast.error('Error al actualizar la rutina');
      throw err;
    }
  }

  function getRandomImage(): string {
    return DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
  }

  const muscleGroups = computed(() => {
    const groups = new Set<string>();
    exercises.value.forEach(exercise => {
      if (exercise.bodyPart_es) groups.add(exercise.bodyPart_es);
    });
    return Array.from(groups).sort();
  });

  const equipmentTypes = computed(() => {
    const types = new Set<string>();
    exercises.value.forEach(exercise => {
      if (exercise.equipment_es) types.add(exercise.equipment_es);
    });
    return Array.from(types).sort();
  });

  return {
    exercises,
    exerciseLogs,
    isLoading,
    error,
    muscleGroups,
    equipmentTypes,
    fetchExerciseLibrary,
    fetchExerciseLogs,
    createRutina,
    updateRutina
  };
});