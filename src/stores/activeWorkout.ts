import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Rutina, Workout } from '@/types';

export const useActiveWorkoutStore = defineStore('activeWorkout', () => {
  const STORAGE_KEY = 'activeWorkoutStore';
  const activeWorkout = ref<Workout | null>(null);
  const sourceRoutine = ref<Rutina | null>(null);

  // Restaurar desde localStorage si existe
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      activeWorkout.value = parsed.activeWorkout;
      sourceRoutine.value = parsed.sourceRoutine;
    } catch (e) {
      // Si hay error, ignora y empieza limpio
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activeWorkout: activeWorkout.value,
      sourceRoutine: sourceRoutine.value
    }));
  }

  function startFromRoutine(rutina: Rutina) {
    sourceRoutine.value = rutina;
    activeWorkout.value = {
      id: crypto.randomUUID(),
      rutina_id: rutina.id,
      fecha: new Date().toISOString(),
      ejercicios: rutina.ejercicios?.map(e => ({
        ejercicio_id: e.id,
        series: []
      })) || []
    };
    persist();
  }

  function clear() {
    activeWorkout.value = null;
    sourceRoutine.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  // Persistir automáticamente al cambiar
  watch(activeWorkout, persist, { deep: true });
  watch(sourceRoutine, persist, { deep: true });

  return {
    activeWorkout,
    sourceRoutine,
    startFromRoutine,
    clear
  };
});
