<template>
  <div class="space-y-12">
    <RoutinePreviewModal
      v-if="selectedRoutine"
      :rutina="selectedRoutine"
      :visible="!!selectedRoutine"
      @close="closeRoutineModal"
      @edit="editRoutine"
      @start="startRoutine"
    />

    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-emerald-600 to-emerald-800 -mx-4 px-6 py-12 md:rounded-3xl md:mx-0 text-white shadow-xl transition-all duration-300">
      <div class="max-w-xl">
        <h1 class="text-3xl font-bold mb-3">Entrenamiento</h1>
        <p class="text-lg text-emerald-100">{{ today }}</p>
      </div>
    </div>

    <!-- No Active Mesocycle Warning -->
    <div v-if="!activeMesociclo" class="card p-8 text-center shadow-md rounded-2xl">
      <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle class="w-10 h-10" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-3">No hay mesociclo activo</h2>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Para comenzar tu entrenamiento, necesitas seleccionar un mesociclo activo.
      </p>
      <router-link
        to="/config"
        class="inline-flex items-center justify-center px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 text-lg transition duration-300"
      >
        <Settings class="w-6 h-6 mr-2" />
        Ir a Configuración
      </router-link>
    </div>

    <!-- Active Mesocycle Content -->
    <template v-else>
      <!-- Current Mesocycle Status -->
      <div class="card p-6 shadow-lg rounded-2xl" :class="isMesocicloComplete ? 'bg-gradient-to-br from-amber-500 to-amber-700' : 'bg-teal-700'" :style="isMesocicloComplete ? 'animation: pulse 2s infinite' : ''">
        <div>
          <h2 class="text-2xl font-bold mb-2 text-white">{{ activeMesociclo.name }}</h2>
          <p class="text-lg text-emerald-100">
            Mesociclo {{ activeMesociclo.order }} de {{ trainingStore.mesociclos.length }}
          </p>
        </div>
        
        <!-- Festive Message when Mesocycle is 100% complete -->
        <div v-if="isMesocicloComplete" class="mt-4 p-3 bg-white/20 rounded-xl text-center">
          <div class="flex justify-center mb-2">
            <div class="w-16 h-16 bg-amber-300 rounded-full flex items-center justify-center shadow-lg">
              <Award class="w-10 h-10 text-amber-600" />
            </div>
          </div>
          <p class="text-lg font-bold text-white">¡Felicidades! Has completado este mesociclo</p>
          <button 
            @click="goToConfiguration" 
            class="mt-3 px-4 py-2 bg-white text-amber-600 rounded-lg font-bold hover:bg-amber-100 transition-colors shadow-md"
          >
            Activar siguiente mesociclo para continuar tu avance
          </button>
        </div>
        
        <!-- Progress Bar - Based on completed workouts -->
        <div class="mt-8">
          <div class="flex justify-between text-base mb-3">
            <span class="text-white">Progreso del mesociclo</span>
            <span class="font-bold text-white">{{ Math.round(mesocicloProgress) }}%</span>
          </div>
          <div class="h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-500"
              :class="isMesocicloComplete ? 'bg-amber-300' : 'bg-white'"
              :style="`width: ${mesocicloProgress}%`"
            ></div>
          </div>
          <div class="flex justify-between text-xs mt-2 text-emerald-100">
            <span>{{ completedRoutinesCount }} de {{ totalRoutinesInMesociclo }} entrenamientos completados</span>
          </div>
        </div>
      </div>

      <!-- Routines Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="rutina in activeMesociclo.rutinas"
          :key="rutina.id"
          class="card p-5 hover:scale-[1.02] transition-all cursor-pointer shadow-md rounded-2xl"
          @click="openRoutine(rutina)"
        >
          <div class="flex items-start justify-between mb-5">
            <div>
              <h3 class="text-xl font-bold text-gray-800">{{ rutina.name }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-base text-gray-600">
                  {{ (rutina.routine_exercises?.length || 0) }} ejercicios
                </p>
                <!-- Etiqueta de veces completadas -->
                <div v-if="getCompletionCount(rutina.id) > 0" 
                     class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center">
                  <CheckCircle class="w-3 h-3 mr-1" />
                  {{ getCompletionCount(rutina.id) }} {{ getCompletionCount(rutina.id) === 1 ? 'vez' : 'veces' }}
                </div>
              </div>
            </div>
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
              :class="isRoutineCompleted(rutina.id) 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-blue-100 text-blue-600'"
            >
              <CheckCircle v-if="isRoutineCompleted(rutina.id)" class="w-6 h-6" />
              <Play v-else class="w-6 h-6" />
            </div>
          </div>

          <!-- Exercise Preview -->
          <div class="mt-3 bg-gray-50 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <h5 class="text-sm font-medium text-gray-600">EJERCICIOS</h5>
            </div>
            <ul class="space-y-3">
              <li 
                v-for="(ejercicio, index) in rutina.routine_exercises?.slice(0, 3)"
                :key="ejercicio.id"
                class="text-base text-gray-700"
              >
                <div class="flex items-center">
                  <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm mr-2">
                    {{ index + 1 }}
                  </span>
                  <span class="font-medium">{{ ejercicio.exercise?.name_es || 'Ejercicio' }}</span>
                </div>
                <div class="ml-8 text-sm text-gray-500 mt-1">
                  <template v-if="ejercicio.advanced_mode !== 'dropset'">
                    <span>{{ ejercicio.sets }}×{{ ejercicio.reps }}</span>
                  </template>
                  <template v-else>
                    <template v-for="(s,i) in (ejercicio.set_data ? JSON.parse(ejercicio.set_data) : ejercicio.sets)" :key="i">
                      {{ s.weight }}kg×{{ s.reps }}
                      <span v-if="i < (ejercicio.set_data ? JSON.parse(ejercicio.set_data).length - 1 : ejercicio.sets - 1)" class="mx-1">•</span>
                    </template>
                  </template>
                </div>
              </li>
              <li v-if="(rutina.routine_exercises?.length || 0) > 3" class="text-sm text-center text-gray-500 italic pt-1">
                + {{ rutina.routine_exercises!.length - 3 }} ejercicios más
              </li>
            </ul>
          </div>

          <!-- Stats -->
          <div class="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-6">
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-base text-gray-600">Series totales</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ rutina.routine_exercises?.reduce((acc, ej) => acc + ej.sets, 0) || 0 }}
              </p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <p class="text-base text-gray-600">Duración est.</p>
              <p class="text-2xl font-bold text-gray-800">45-60m</p>
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
  Play,
  Award,
  Trophy
} from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import type { Rutina } from '@/types';
import RoutinePreviewModal from '@/components/training/RoutinePreviewModal.vue';
import { useActiveWorkoutStore } from '@/stores/activeWorkout';
import { toast } from 'vue3-toastify';

const router = useRouter();
const trainingStore = useTrainingStore();
const workoutLogsStore = useWorkoutLogsStore();
const selectedRoutine = ref<Rutina | null>(null);
const activeWorkoutStore = useActiveWorkoutStore();

onMounted(async () => {
  await trainingStore.fetchMesociclos();
  // Cargar los registros de entrenamientos completados
  if (workoutLogsStore.workouts.length === 0) {
    await workoutLogsStore.getWorkouts();
  }
});

const activeMesociclo = computed(() => trainingStore.activeMesociclo);

const today = computed(() => new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));

// Total de rutinas en el mesociclo activo
const totalRoutinesInMesociclo = computed(() => {
  if (!activeMesociclo.value) return 0;
  return activeMesociclo.value.rutinas?.length || 0;
});

// Contar rutinas completadas en el mesociclo activo
const completedRoutinesCount = computed(() => {
  if (!activeMesociclo.value) return 0;
  
  // Obtener IDs únicos de rutinas completadas (para no contar repeticiones)
  const completedRoutineIds = new Set();
  activeMesociclo.value.rutinas?.forEach(rutina => {
    if (isRoutineCompleted(rutina.id)) {
      completedRoutineIds.add(rutina.id);
    }
  });
  
  return completedRoutineIds.size;
});

// Calcular el progreso del mesociclo basado en entrenamientos completados
const mesocicloProgress = computed(() => {
  if (!activeMesociclo.value || totalRoutinesInMesociclo.value === 0) return 0;
  return (completedRoutinesCount.value / totalRoutinesInMesociclo.value) * 100;
});

// Comprobar si el mesociclo está completo (100%)
const isMesocicloComplete = computed(() => {
  return mesocicloProgress.value === 100;
});

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
  // Verificar si hay al menos un workout completado para esta rutina
  return workoutLogsStore.workouts.some(w => w.rutina_id === rutinaId);
}

function getCompletionCount(rutinaId: string) {
  // Contar cuántas veces se ha completado esta rutina
  return workoutLogsStore.workouts.filter(w => w.rutina_id === rutinaId).length;
}

// Función para ir a la pestaña de configuración
function goToConfiguration() {
  router.push('/config');
}
</script>

<style scoped>
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(245, 158, 11, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>