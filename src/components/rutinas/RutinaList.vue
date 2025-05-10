<template>
  <div class="space-y-4">
    <TransitionGroup
      name="list"
      tag="div"
      class="space-y-3"
    >
      <div
        v-for="rutina in rutinas"
        :key="rutina.id"
        class="bg-white rounded-lg border border-gray-200 p-4 hover:border-emerald-300 transition-colors cursor-pointer"
        @click="$emit('edit', rutina)"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">{{ rutina.name }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm text-gray-500">
                {{ rutina.routine_exercises?.length || 0 }} ejercicios
              </span>
              <span v-if="rutina.frequency > 1" class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {{ rutina.frequency }}x por semana
              </span>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click.stop="$emit('edit', rutina)"
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click.stop="handleDelete(rutina)"
              class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Exercise List -->
        <div 
          v-if="rutina.routine_exercises?.length" 
          class="mt-4 space-y-2"
        >
          <div
            v-for="ejercicio in rutina.routine_exercises"
            :key="ejercicio.id"
            class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              :src="ejercicio.exercise?.image_url || 'https://via.placeholder.com/40'"
              :alt="ejercicio.name"
              class="w-10 h-10 rounded object-cover"
            />
            <div>
              <p class="font-medium text-gray-800">{{ ejercicio.exercise?.name || ejercicio.name }}</p>
              <p class="text-sm text-gray-500">
                {{ ejercicio.series }}x{{ ejercicio.repeticiones }} @ {{ ejercicio.peso_inicial }}kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <div
      v-if="!rutinas.length"
      class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p class="text-gray-600">No hay rutinas configuradas.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import type { Rutina } from '@/types';

defineProps<{
  rutinas: Rutina[];
}>();

const emit = defineEmits<{
  (e: 'edit', rutina: Rutina): void;
}>();

const trainingStore = useTrainingStore();

async function handleDelete(rutina: Rutina) {
  if (confirm(`¿Estás seguro de que deseas eliminar la rutina "${rutina.name}"?`)) {
    await trainingStore.deleteRutina(rutina.id);
  }
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>