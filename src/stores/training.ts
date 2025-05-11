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

  /**
   * Crea una rutina, guardando exercise_id (entero) y exercise_uuid (UUID) en routine_exercises.
   */
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

      // 1) Recolectar TODOS los UUID de los ejercicios (incluso los paired)
      const uuidList = data.ejercicios.flatMap((ej: any) =>
        ej.advancedMode === 'superset' && ej.supersetExerciseId
          ? [ej.exercise_id, ej.supersetExerciseId]
          : [ej.exercise_id]
      );

      // 2) Buscar en la tabla "exercises" por .in('uuid', uuidList) => {id, uuid}
      const { data: exerciseRecords, error: mapError } = await supabase
        .from('exercises')
        .select('id, uuid')
        .in('uuid', uuidList);

      if (mapError) throw mapError;

      // 3) Crear un map de uuid -> id
      const ejercicioIdMap: Record<string, number> = {};
      exerciseRecords.forEach(rec => {
        if (!rec.uuid) return;
        ejercicioIdMap[rec.uuid] = rec.id;
      });

      if (data.ejercicios?.length) {
        const inserts: any[] = [];

        data.ejercicios.forEach((ej: any, idx: number) => {
          const mainId = ejercicioIdMap[ej.exercise_id];
          if (!mainId) {
            throw new Error(`Exercise UUID ${ej.exercise_id} not found in DB`);
          }
          const mainUuid = exerciseRecords.find(
            rec => String(rec.id) === String(mainId)
          )?.uuid || ej.exercise_id;

          // Compatibilidad: aceptar tanto supersetExerciseId como superset_exercise_id
          let supersetExerciseIdInt = null;
          const supersetIdRaw = ej.supersetExerciseId || ej.superset_exercise_id;
          if (supersetIdRaw) {
            supersetExerciseIdInt = ejercicioIdMap[supersetIdRaw] || null;
          }

          // Validación defensiva para sets
          if (!Array.isArray(ej.sets) || ej.sets.length === 0) {
            console.warn('[Rutina] Ejercicio sin sets válido:', ej);
            return; // Saltar este ejercicio malformado (NO detiene el forEach, pero no agrega el insert)
          }

          // Validar que ej.sets[0] existe
          const firstSet = ej.sets[0];
          if (!firstSet) {
            console.warn('[Rutina] Ejercicio con sets vacío:', ej);
            return;
          }

          inserts.push({
            routine_id: rutina.id,
            exercise_id: mainId,
            exercise_uuid: mainUuid,
            position: idx,
            sets: ej.sets.length,
            reps: ej.sets[0].reps,
            peso_inicial: ej.sets[0].weight,
            descanso: ej.sets[0].rest,
            advanced_mode: ej.advancedMode,
            superset_group_id: ej.superset_group_id || null,
            superset_exercise_id: supersetExerciseIdInt,
            set_data: JSON.stringify(ej.sets),
            notas: ej.notas || ''
          });
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

      // resolve UUIDs to integer IDs for routine_exercises
      const uuidList = data.ejercicios.flatMap((ej: any) =>
        ej.advancedMode === 'superset' && ej.supersetExerciseId
          ? [ej.exercise_id, ej.supersetExerciseId]
          : [ej.exercise_id]
      );
      const { data: exerciseRecords, error: mapError } = await supabase
        .from('exercises')
        .select('id, uuid')
        .in('uuid', uuidList);

      if (mapError) throw mapError;

      const ejercicioIdMap: Record<string, number> = {};
      exerciseRecords.forEach(rec => {
        if (!rec.uuid) return;
        ejercicioIdMap[rec.uuid] = rec.id;
      });

      const { error: deleteError } = await supabase
        .from('routine_exercises')
        .delete()
        .eq('routine_id', id);

      if (deleteError) throw deleteError;

      if (data.ejercicios?.length) {
        const inserts: any[] = [];
        data.ejercicios.forEach((ej: any, idx: number) => {
          const mainId = ejercicioIdMap[ej.exercise_id];
          if (!mainId) throw new Error(`Exercise UUID ${ej.exercise_id} not found`);
          const mainUuid = exerciseRecords.find(
            rec => String(rec.id) === String(mainId)
          )?.uuid || ej.exercise_id;

          // Si es superserie, mapea el superset_exercise_id a entero (o null)
          let supersetExerciseIdInt = null;
          if (ej.supersetExerciseId) {
            supersetExerciseIdInt = ejercicioIdMap[ej.supersetExerciseId] || null;
          }

          inserts.push({
            routine_id: id,
            exercise_id: mainId,
            exercise_uuid: mainUuid,
            position: idx,
            sets: ej.sets.length,
            reps: ej.sets[0].reps,
            peso_inicial: ej.sets[0].weight,
            descanso: ej.sets[0].rest,
            advanced_mode: ej.advancedMode,
            superset_group_id: ej.superset_group_id || null,
            superset_exercise_id: supersetExerciseIdInt,
            set_data: JSON.stringify(ej.sets),
            notas: ej.notas || ''
          });
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
