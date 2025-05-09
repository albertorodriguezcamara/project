```vue
<template>
  <div class="space-y-6">
    <RoutinePreviewModal
      v-if="selectedRoutine"
      :rutina="selectedRoutine"
      :visible="!!selectedRoutine"
      @close="closeRoutineModal"
      @edit="editRoutine"
      @start="startRoutine"
    />

    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-500 to-blue-700 -mx-4 px-4 py-8 md:rounded-2xl md:mx-0 text-white">
      <div class="max-w-xl">
        <h1 class="text-3xl font-bold mb-2">Entrenamiento</h1>
        <p class="text-blue-100">{{ today }}</p>
      </div>
    </div>

    <!-- No Active Mesocycle Warning -->
    <div v-if="!activeMesociclo" class="card p-8 text-center">
      <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle class="w-8 h-8" />
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">No hay mesociclo activo</h2>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Para comenzar tu entrenamiento, necesitas seleccionar un mesociclo activo.
      </p>
      <router-link
        to="/config"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all"
      >
        <Settings class="w-5 h-5 mr-2" />
        Ir a Configuración
      </router-link>
    </div>

    <!-- Active Mesocycle Content -->
    <template v-else>
      <!-- Current Mesocycle Status -->
      <div class="card bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-1">{{ activeMesociclo.name }}</h2>
            <p class="text-emerald-100">
              Mesociclo {{ activeMesociclo.order }} de {{ trainingStore.mesociclos.length }}
            </p>
          </div>
          <div class="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
            <Activity class="w-8 h-8" />
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="mt-6">
          <div class="flex justify-between text-sm mb-2">
            <span>Progreso</span>
            <span>{{ Math.round((activeMesociclo.order / trainingStore.mesociclos.length) * 100) }}%</span>
          </div>
          <div class="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              class="h-full bg-white rounded-full transition-all duration-500"
              :style="`width: ${(activeMesociclo.order / trainingStore.mesociclos.length) * 100}%`"
            ></div>
          </div>
        </div>
      </div>

      <!-- Routines Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="rutina in activeMesociclo.rutinas"
          :key="rutina.id"
          class="card hover:scale-[1.02] transition-all cursor-pointer"
          @click="openRoutine(rutina)"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ rutina.name }}</h3>
              <p class="text-sm text-gray-500">
                {{ (rutina.ejercicios?.length || 0) }} ejercicios
              </p>
            </div>
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="isRoutineCompleted(rutina.id) 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-blue-100 text-blue-600'"
            >
              <CheckCircle v-if="isRoutineCompleted(rutina.id)" class="w-5 h-5" />
              <Play v-else class="w-5 h-5" />
            </div>
          </div>

          <!-- Exercise Preview -->
          <div class="space-y-2">
            <div 
              v-for="(ejercicio, index) in rutina.ejercicios?.slice(0, 3)"
              :key="ejercicio.id"
              class="flex items-center text-sm text-gray-600"
            >
              <div class="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
                <span class="text-xs text-gray-500">{{ index + 1 }}</span>
              </div>
              {{ ejercicio.name }}
            </div>
            <div 
              v-if="(rutina.ejercicios?.length || 0) > 3"
              class="text-sm text-gray-400 pl-8"
            >
              Y {{ rutina.ejercicios!.length - 3 }} ejercicios más...
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-sm text-gray-500">Series totales</p>
              <p class="text-lg font-bold text-gray-900">
                {{ rutina.ejercicios?.reduce((acc, ej) => acc + ej.series, 0) || 0 }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500">Duración est.</p>
              <p class="text-lg font-bold text-gray-900">45-60m</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Settings, 
  AlertTriangle, 
  Activity,
  CheckCircle,
  Play
} from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import type { Rutina } from '@/types';
import RoutinePreviewModal from '@/components/training/RoutinePreviewModal.vue';
import { useActiveWorkoutStore } from '@/stores/activeWorkout';

const router = useRouter();
const trainingStore = useTrainingStore();
const workoutLogsStore = useWorkoutLogsStore();
const selectedRoutine = ref<Rutina | null>(null);
const activeWorkoutStore = useActiveWorkoutStore();

onMounted(async () => {
  await trainingStore.fetchMesociclos();
});

const activeMesociclo = computed(() => trainingStore.activeMesociclo);

const today = computed(() => new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));

function openRoutine(rutina: Rutina) {
  selectedRoutine.value = rutina;
}

function closeRoutineModal() {
  selectedRoutine.value = null;
}

function editRoutine(rutina: Rutina) {
  router.push(`/config?edit=rutina&id=${rutina.id}`);
}

function startRoutine(rutina: Rutina) {
  activeWorkoutStore.startFromRoutine(rutina);
  selectedRoutine.value = null;
  router.push('/active-workout');
}

function isRoutineCompleted(rutinaId: string) {
  return false; // Implement real logic based on workout logs
}
</script>
```