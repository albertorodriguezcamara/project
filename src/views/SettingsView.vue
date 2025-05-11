<template>
  <div class="p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-2xl font-bold mb-4">Ajustes Avanzados</h2>
    <div class="space-y-4">
      <button
        @click="onClearMesociclos"
        class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
      >
        Borrar todos los mesociclos
      </button>
      <button
        @click="onClearRutinas"
        class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
      >
        Borrar todas las rutinas
      </button>
      <button
        @click="onClearProgress"
        class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
      >
        Borrar todo el progreso
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTrainingStore } from '@/stores/training';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';
import { toast } from 'vue3-toastify';

const trainingStore = useTrainingStore();
const exerciseStore = useExerciseLibraryStore();

async function onClearMesociclos() {
  if (!confirm('¿Estás seguro de borrar todos los mesociclos? Esta acción no se puede deshacer.')) return;
  try {
    await trainingStore.clearAllMesociclos();
    toast.success('Mesociclos borrados');
  } catch {
    // error manejado en store
  }
}

async function onClearRutinas() {
  if (!confirm('¿Estás seguro de borrar todas las rutinas? Esta acción no se puede deshacer.')) return;
  try {
    await trainingStore.clearAllRutinas();
    toast.success('Rutinas borradas');
  } catch {
  }
}

async function onClearProgress() {
  if (!confirm('¿Estás seguro de borrar todo el progreso? Esta acción no se puede deshacer.')) return;
  try {
    await exerciseStore.clearAllProgress();
    toast.success('Progreso borrado');
  } catch {
  }
}
</script>
