<template>
  <div class="space-y-4">
    <TransitionGroup
      name="list"
      tag="div"
      class="space-y-3"
    >
      <div
        v-for="ejercicio in ejercicios"
        :key="ejercicio.id"
        class="card hover:border-blue-200 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button class="drag-handle p-1 text-gray-400 hover:text-gray-600">
              <GripVertical class="w-5 h-5" />
            </button>
            <div>
              <h3 class="font-medium text-gray-900">{{ ejercicio.exercise?.name_es || ejercicio.name_es }}</h3>
              <p class="text-sm text-gray-500">
                {{ ejercicio.series }}x{{ ejercicio.repeticiones }} @ {{ ejercicio.peso_inicial }}kg
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              v-if="ejercicio.video_url"
              @click="showVideo(ejercicio)"
              class="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
            >
              <Video class="w-4 h-4" />
            </button>
            <button
              @click="$emit('edit', ejercicio)"
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="handleDelete(ejercicio)"
              class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="ejercicio.exercise?.instructions_es || ejercicio.instructions_es" class="mt-2 pl-9">
          <p class="text-sm text-gray-600">{{ ejercicio.exercise?.instructions_es || ejercicio.instructions_es }}</p>
        </div>
      </div>
    </TransitionGroup>

    <div
      v-if="!ejercicios.length"
      class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p class="text-gray-600">No hay ejercicios configurados.</p>
    </div>

    <!-- Video Modal -->
    <div v-if="showVideoModal" class="fixed inset-0 z-50 overflow-y-auto" @click="closeVideo">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <div class="absolute top-0 right-0 pt-4 pr-4">
            <button
              @click="closeVideo"
              class="text-gray-400 hover:text-gray-500"
            >
              <X class="w-6 h-6" />
            </button>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ selectedEjercicio?.exercise?.name_es || selectedEjercicio?.name_es }}
            </h3>
            <div class="relative pb-[56.25%] h-0">
              <img
                v-if="selectedEjercicio?.exercise?.gif_url_supabase || selectedEjercicio?.gif_url_supabase"
                :src="selectedEjercicio?.exercise?.gif_url_supabase || selectedEjercicio?.gif_url_supabase"
                class="absolute top-0 left-0 w-full h-full object-contain"
                alt="GIF ejercicio"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GripVertical, Pencil, Trash2, Video, X } from 'lucide-vue-next';
import type { Exercise } from '@/stores/exerciseLibrary';

const props = defineProps<{
  routineExercises: any[]; // Each has { id, exercise_id, ...fields, exercise: { ... } }
}>();

const emit = defineEmits<{
  (e: 'edit', routineExercise: any): void;
  (e: 'delete', id: string): void;
}>();

const showVideoModal = ref(false);
const selectedRoutineExercise = ref<any | null>(null);

function handleDelete(routineExercise: any) {
  if (confirm(`¿Estás seguro de que deseas eliminar el ejercicio "${routineExercise.exercise?.name || ''}"?`)) {
    emit('delete', routineExercise.id);
  }
}

function showVideo(routineExercise: any) {
  selectedRoutineExercise.value = routineExercise;
  showVideoModal.value = true;
}

function closeVideo() {
  showVideoModal.value = false;
  selectedRoutineExercise.value = null;
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