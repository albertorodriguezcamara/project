import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import type { Mesociclo, Rutina } from '@/types';
import { toast } from 'vue3-toastify';
import { v4 as uuidv4 } from 'uuid';

export const useTrainingStore = defineStore('training', () => {
  const mesociclos = ref<Mesociclo[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const sortedMesociclos = computed(() => {
    return [...mesociclos.value].sort((a, b) => a.order - b.order);
  });

  const activeMesociclo = computed(() => {
    return mesociclos.value.find(m => m.active);
  });

  // Actions
  async function fetchMesociclos() {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: err } = await supabase
        .from('mesociclos')
        .select(`
          *,
          rutinas (
            *,
            routine_exercises (
              *,
              exercise:exercises!routine_exercises_exercise_id_fkey(*),
              superset_exercise:exercises!fk_superset_exercise(*)
            )
          )
        `)
        .order('order');

      if (err) throw err;

      mesociclos.value = data || [];
    } catch (err) {
      console.error('Error fetching mesociclos:', err);
      error.value = err instanceof Error ? err.message : 'Error al cargar los mesociclos';
      toast.error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function createMesociclo(data: Partial<Mesociclo>) {
    try {
      const { data: newMeso, error: err } = await supabase
        .from('mesociclos')
        .insert([{
          name: data.name,
          order: data.order,
          active: data.active || false,
          completed: false
        }])
        .select()
        .single();

      if (err) throw err;

      await fetchMesociclos();
      return newMeso;
    } catch (err) {
      console.error('Error creating mesociclo:', err);
      throw err;
    }
  }

  async function updateMesociclo(id: string, data: Partial<Mesociclo>) {
    try {
      const { error: err } = await supabase
        .from('mesociclos')
        .update({
          name: data.name,
          order: data.order,
          active: data.active,
          completed: data.completed
        })
        .eq('id', id);

      if (err) throw err;

      await fetchMesociclos();
      return true;
    } catch (err) {
      console.error('Error updating mesociclo:', err);
      throw err;
    }
  }

  async function deleteMesociclo(id: string) {
    try {
      const { error: err } = await supabase
        .from('mesociclos')
        .delete()
        .eq('id', id);

      if (err) throw err;

      await fetchMesociclos();
      return true;
    } catch (err) {
      console.error('Error deleting mesociclo:', err);
      throw err;
    }
  }

  async function createRutina(data: any) {
    try {
      const { data: rutina, error: rutinaError } = await supabase
        .from('rutinas')
        .insert({
          name: data.name,
          order: data.order,
          frequency: data.frequency,
          mesociclo_id: data.mesociclo_id
        })
        .select()
        .single();

      if (rutinaError) throw rutinaError;

      if (data.ejercicios?.length) {
        const inserts: any[] = [];
        data.ejercicios.forEach((ej: any, idx: number) => {
          if (ej.advancedMode === 'superset' && ej.supersetExerciseId) {
            const groupId = uuidv4();
            inserts.push({
              routine_id: rutina.id,
              exercise_id: ej.exercise_id,
              position: idx * 2,
              sets: ej.sets.length,
              reps: ej.sets[0].reps,
              peso_inicial: ej.sets[0].weight,
              descanso: ej.sets[0].rest,
              advanced_mode: 'superset',
              superset_group_id: groupId,
              superset_exercise_id: ej.supersetExerciseId,
              set_data: JSON.stringify(ej.sets),
              notas: ej.notas || ''
            });
            inserts.push({
              routine_id: rutina.id,
              exercise_id: ej.supersetExerciseId,
              position: idx * 2 + 1,
              sets: ej.supersetExercise.sets.length,
              reps: ej.supersetExercise.sets[0].reps,
              peso_inicial: ej.supersetExercise.sets[0].weight,
              descanso: ej.supersetExercise.sets[0].rest,
              advanced_mode: 'superset',
              superset_group_id: groupId,
              superset_exercise_id: null,
              set_data: JSON.stringify(ej.supersetExercise.sets),
              notas: ''
            });
          } else {
            inserts.push({
              routine_id: rutina.id,
              exercise_id: ej.exercise_id,
              position: idx * 2,
              sets: ej.sets.length,
              reps: ej.sets[0].reps,
              peso_inicial: ej.sets[0].weight,
              descanso: ej.sets[0].rest,
              advanced_mode: ej.advancedMode,
              superset_group_id: null,
              superset_exercise_id: null,
              set_data: JSON.stringify(ej.sets),
              notas: ej.notas || ''
            });
          }
        });
        const { error } = await supabase.from('routine_exercises').insert(inserts);
        if (error) throw error;
      }

      await fetchMesociclos();
      return rutina;
    } catch (err) {
      console.error('Error creating rutina:', err);
      throw err;
    }
  }

  async function updateRutina(id: string, data: any) {
    try {
      const { error: rutinaError } = await supabase
        .from('rutinas')
        .update({
          name: data.name,
          order: data.order,
          frequency: data.frequency
        })
        .eq('id', id);

      if (rutinaError) throw rutinaError;

      const { error: deleteError } = await supabase
        .from('routine_exercises')
        .delete()
        .eq('routine_id', id);

      if (deleteError) throw deleteError;

      if (data.ejercicios?.length) {
        const inserts: any[] = [];
        data.ejercicios.forEach((ej: any, idx: number) => {
          if (ej.advancedMode === 'superset' && ej.supersetExerciseId) {
            const groupId = uuidv4();
            inserts.push({
              routine_id: id,
              exercise_id: ej.exercise_id,
              position: idx * 2,
              sets: ej.sets.length,
              reps: ej.sets[0].reps,
              peso_inicial: ej.sets[0].weight,
              descanso: ej.sets[0].rest,
              advanced_mode: 'superset',
              superset_group_id: groupId,
              superset_exercise_id: ej.supersetExerciseId,
              set_data: JSON.stringify(ej.sets),
              notas: ej.notas || ''
            });
            inserts.push({
              routine_id: id,
              exercise_id: ej.supersetExerciseId,
              position: idx * 2 + 1,
              sets: ej.supersetExercise.sets.length,
              reps: ej.supersetExercise.sets[0].reps,
              peso_inicial: ej.supersetExercise.sets[0].weight,
              descanso: ej.supersetExercise.sets[0].rest,
              advanced_mode: 'superset',
              superset_group_id: groupId,
              superset_exercise_id: null,
              set_data: JSON.stringify(ej.supersetExercise.sets),
              notas: ''
            });
          } else {
            inserts.push({
              routine_id: id,
              exercise_id: ej.exercise_id,
              position: idx * 2,
              sets: ej.sets.length,
              reps: ej.sets[0].reps,
              peso_inicial: ej.sets[0].weight,
              descanso: ej.sets[0].rest,
              advanced_mode: ej.advancedMode,
              superset_group_id: null,
              superset_exercise_id: null,
              set_data: JSON.stringify(ej.sets),
              notas: ej.notas || ''
            });
          }
        });
        const { error } = await supabase.from('routine_exercises').insert(inserts);
        if (error) throw error;
      }
      await fetchMesociclos();
    } catch (err) {
      console.error('Error updating rutina:', err);
      throw err;
    }
  }

  async function deleteRutina(id: string) {
    try {
      const { error: err } = await supabase
        .from('rutinas')
        .delete()
        .eq('id', id);

      if (err) throw err;

      await fetchMesociclos();
    } catch (err) {
      console.error('Error deleting rutina:', err);
      throw err;
    }
  }

  return {
    mesociclos,
    isLoading,
    error,
    sortedMesociclos,
    activeMesociclo,
    fetchMesociclos,
    createMesociclo,
    updateMesociclo,
    deleteMesociclo,
    createRutina,
    updateRutina,
    deleteRutina
  };
}, {
  persist: false
});