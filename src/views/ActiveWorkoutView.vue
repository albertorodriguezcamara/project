<template>
  <div class="min-h-screen bg-gray-50">
    <RestTimerModal :visible="showRestModal" :initial="restTime" @close="handleRestModalClose" @finished="handleRestModalFinished" />
    <!-- Header with Timer -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <!-- Left side: Workout Info -->
          <div class="flex-1">
            <div class="flex flex-col space-y-2">
              <div class="flex items-center space-x-3">
                <h1 class="text-4xl font-extrabold text-white tracking-tight">
                  {{ activeWorkoutStore.sourceRoutine?.name || 'Entrenamiento' }}
                </h1>
                <span class="px-3 py-1 bg-white/10 rounded-full text-sm text-blue-100">
                  {{ localExercises.length }} ejercicios
                </span>
              </div>
              
              <div class="flex items-center space-x-4 text-blue-100">
                <div class="flex items-center space-x-2">
                  <Calendar class="w-4 h-4" />
                  <span class="text-sm">{{ formatDate(new Date()) }}</span>
                </div>
                <div class="w-1 h-1 rounded-full bg-blue-300"></div>
                <div class="flex items-center space-x-2">
                  <Clock class="w-4 h-4" />
                  <span class="text-sm">Tiempo total</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right side: Timer and Controls -->
          <div class="flex items-center space-x-6">
            <!-- Timer Display -->
            <div class="bg-white/10 px-6 py-3 rounded-2xl">
              <div class="text-4xl font-mono font-bold text-white tabular-nums tracking-tight">
                {{ formatTime(timerSeconds) }}
              </div>
            </div>
            
            <!-- Controls -->
            <div class="flex space-x-3">
              <button
                v-if="!isPaused"
                @click="pauseTimer"
                class="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Pausar"
              >
                <Pause class="w-6 h-6" />
              </button>
              <button
                v-else
                @click="resumeTimer"
                class="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Reanudar"
              >
                <Play class="w-6 h-6" />
              </button>
              <button
                @click="stopWorkout"
                class="p-4 rounded-xl bg-red-500/20 text-red-100 hover:bg-red-500/30 transition-colors"
                title="Terminar entrenamiento"
              >
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Exercise List -->
        <div class="lg:col-span-8 space-y-6">
          <div
            v-for="(ejercicio, index) in localExercises"
            :key="ejercicio.ejercicio_id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <!-- Exercise Header -->
            <div class="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 border-b border-gray-200">
              <!-- Exercise GIF -->
              <div class="w-28 h-20 flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
                <template v-if="ejercicio.exercise?.gif_url_supabase">
                  <img :src="ejercicio.exercise.gif_url_supabase" :alt="ejercicio.exercise?.name_es || 'GIF ejercicio'" class="object-cover w-full h-full" />
                </template>
                <div v-else class="flex flex-col items-center justify-center h-full w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 mb-1"><circle cx="16" cy="16" r="14"/><path d="M8 16h8l4 4"/></svg>
                  <span class="text-gray-400 text-xs">Sin imagen</span>
                </div>
              </div>
              <!-- Exercise Info -->
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900">
                  {{ ejercicio.exercise?.name_es || ejercicio.name_es }}
                </h3>
                <div class="flex flex-wrap gap-2 text-sm text-gray-700 mb-1">
                  <span v-if="ejercicio.exercise?.bodyPart_es" class="bg-blue-50 text-blue-800 px-2 py-1 rounded">{{ ejercicio.exercise.bodyPart_es }}</span>
                  <span v-if="ejercicio.exercise?.target_es" class="bg-green-50 text-green-800 px-2 py-1 rounded">Principal: {{ ejercicio.exercise.target_es }}</span>
                  <span v-if="ejercicio.exercise?.secondaryMuscles_es" class="bg-yellow-50 text-yellow-800 px-2 py-1 rounded">Secundarios: {{ ejercicio.exercise.secondaryMuscles_es }}</span>
                  <span v-if="ejercicio.exercise?.equipment_es" class="bg-purple-50 text-purple-800 px-2 py-1 rounded">Equipo: {{ ejercicio.exercise.equipment_es }}</span>
                </div>
                <div v-if="ejercicio.exercise?.instructions_es" class="mb-2">
                  <h4 class="font-semibold text-gray-800 text-xs mb-1">Instrucciones:</h4>
                  <ul class="list-disc list-inside text-xs text-gray-700">
                    <li v-for="(step, idx) in ejercicio.exercise.instructions_es.split('\n')" :key="idx">{{ step }}</li>
                  </ul>
                </div>
                <p class="text-sm text-gray-500 mb-1">
                  {{ ejercicio.sets.length }} series
                </p>
                <div class="flex items-center gap-2">
                  <button
                    v-if="ejercicio.sets.length === 0"
                    @click="startExercise(ejercicio)"
                    class="btn-primary text-sm"
                  >
                    Comenzar
                  </button>
                  <button
                    v-else
                    @click="addSet(index)"
                    class="btn-secondary text-sm"
                  >
                    <Plus class="w-4 h-4 mr-1" />
                    Añadir serie
                  </button>
                </div>
              </div>
            </div>

            <!-- Sets Table -->
            <div v-if="ejercicio.sets.length > 0" class="px-4">
              <div class="grid grid-cols-4 gap-2 text-sm font-medium text-gray-500 mb-2">
                <div>Serie</div>
                <div>Peso</div>
                <div>Reps</div>
                <div>Estado</div>
              </div>
              
              <div class="space-y-2">
                <div
                  v-for="(set, setIndex) in ejercicio.sets"
                  :key="setIndex"
                  class="grid grid-cols-4 gap-2 items-center py-2 rounded-lg transition-colors"
                  :class="{ 'bg-emerald-50': set.completed }"
                >
                  <div class="text-sm text-gray-900">
                    {{ setIndex + 1 }}
                  </div>
                  
                  <div>
                    <input
                      v-model.number="set.peso"
                      type="number"
                      min="0"
                      step="0.5"
                      class="w-20 px-2 py-1 text-sm border border-gray-300 rounded-lg"
                      :disabled="set.completed"
                    />
                  </div>
                  
                  <div>
                    <input
                      v-model.number="set.repeticiones"
                      type="number"
                      min="0"
                      class="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg"
                      :disabled="set.completed"
                    />
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <button
                      @click="toggleSetCompletion(ejercicio, setIndex)"
                      class="p-1.5 rounded-lg"
                      :class="set.completed 
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'"
                      :title="set.completed ? 'Desmarcar serie' : 'Completar serie'"
                    >
                      <Check v-if="set.completed" class="w-5 h-5" />
                      <Timer v-else class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Workout Summary Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Resumen</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center pb-4 border-b border-gray-200">
                <span class="text-gray-600">Series completadas</span>
                <span class="text-lg font-bold text-gray-900">
                  {{ completedSets }}/{{ totalSets }}
                </span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b border-gray-200">
                <span class="text-gray-600">Volumen total</span>
                <span class="text-lg font-bold text-gray-900">
                  {{ totalVolume }}kg
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Tiempo activo</span>
                <span class="text-lg font-bold text-gray-900">
                  {{ formatTime(timerSeconds) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Notas</h3>
            <textarea
              v-model="workoutNotes"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Añade notas sobre tu entrenamiento..."
            ></textarea>
          </div>

          <!-- Finish Button -->
          <button
            @click="finishWorkout"
            class="w-full btn-primary py-4"
            :disabled="!isWorkoutComplete"
          >
            {{ isWorkoutComplete ? 'Finalizar Entrenamiento' : 'Completa todas las series' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <RestTimerModal
    v-if="showRestModal"
    :visible="showRestModal"
    :initial="restTime"
    @close="handleRestModalClose"
    @finished="handleRestModalFinished"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Pause, Play, X, Plus, Check, Timer, Calendar, Clock } from 'lucide-vue-next';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useActiveWorkoutStore } from '@/stores/activeWorkout';
import type { WorkoutExercise } from '@/types';
import RestTimerModal from '@/components/training/RestTimerModal.vue';

const router = useRouter();
const workoutLogsStore = useWorkoutLogsStore();
const activeWorkoutStore = useActiveWorkoutStore();

// Timer state - sync with store
const timerSeconds = ref(activeWorkoutStore.activeWorkout?.timerSeconds || 0);
const isPaused = ref(activeWorkoutStore.activeWorkout?.isPaused || false);
let intervalId: number | null = null;

// Workout state
const localExercises = ref<any[]>([]);
const workoutNotes = ref('');

// Rest timer state
const showRestModal = ref(false);
const restTime = ref(0);
const restExerciseName = ref('');
const restSerieIdx = ref<number|null>(null);
const restExerciseIdx = ref<number|null>(null);

// Sincroniza el progreso local con el store (y localStorage) automáticamente
watch([localExercises, workoutNotes, timerSeconds, isPaused], () => {
  if (!activeWorkoutStore.activeWorkout) return;
  activeWorkoutStore.activeWorkout.ejercicios = localExercises.value.map(e => ({
    ejercicio_id: e.ejercicio_id,
    series: e.sets
  }));
  (activeWorkoutStore.activeWorkout as any).timerSeconds = timerSeconds.value;
  (activeWorkoutStore.activeWorkout as any).isPaused = isPaused.value;
  (activeWorkoutStore.activeWorkout as any).notas = workoutNotes.value;
}, { deep: true });

// Computed
const isWorkoutComplete = computed(() => {
  return localExercises.value.every(ejercicio =>
    ejercicio.sets.length > 0 &&
    ejercicio.sets.every(serie => serie.completed)
  );
});

const completedSets = computed(() => {
  return localExercises.value.reduce((total, ejercicio) => {
    return total + ejercicio.sets.filter(set => set.completed).length;
  }, 0);
});

const totalSets = computed(() => {
  return localExercises.value.reduce((total, ejercicio) => {
    return total + ejercicio.sets.length;
  }, 0);
});

const totalVolume = computed(() => {
  return localExercises.value.reduce((total, ejercicio) => {
    return total + ejercicio.sets.reduce((setTotal, set) => {
      return setTotal + (set.completed ? (set.peso * set.repeticiones) : 0);
    }, 0);
  }, 0);
});

// Methods
function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
  stopTimer();
  isPaused.value = false;
  intervalId = window.setInterval(() => {
    if (!isPaused.value) {
      timerSeconds.value++;
      // Sync with store
      if (activeWorkoutStore.activeWorkout) {
        activeWorkoutStore.activeWorkout.timerSeconds = timerSeconds.value;
        activeWorkoutStore.activeWorkout.isPaused = isPaused.value;
      }
    }
  }, 1000);
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function pauseTimer() {
  isPaused.value = true;
  if (activeWorkoutStore.activeWorkout) {
    activeWorkoutStore.activeWorkout.isPaused = true;
  }
}

function resumeTimer() {
  isPaused.value = false;
  if (activeWorkoutStore.activeWorkout) {
    activeWorkoutStore.activeWorkout.isPaused = false;
  }
}

function startExercise(ejercicio: WorkoutExercise) {
  const rutinaEjercicio = activeWorkoutStore.sourceRoutine?.ejercicios?.find(
    e => e.id === ejercicio.ejercicio_id
  );

  if (!rutinaEjercicio) return;

  const baseSeries = Array(rutinaEjercicio.series).fill(null).map(() => ({
    peso: rutinaEjercicio.peso_inicial,
    repeticiones: rutinaEjercicio.repeticiones,
    completed: false
  }));

  ejercicio.sets = [...baseSeries];
}

function addSet(exerciseIndex: number) {
  const ejercicio = localExercises.value[exerciseIndex];
  const lastSet = ejercicio.sets[ejercicio.sets.length - 1];
  
  ejercicio.sets.push({
    peso: lastSet.peso,
    repeticiones: lastSet.repeticiones,
    completed: false
  });
}

function toggleSetCompletion(ejercicio: WorkoutExercise, setIndex: number) {
  const set = ejercicio.sets[setIndex];
  if (!set) return;

  if (!set.completed) {
    // Buscar tiempo de descanso para esta serie en la rutina
    const rutinaEj = activeWorkoutStore.sourceRoutine?.ejercicios?.find(
      (ej: any) => ej.id === ejercicio.ejercicio_id
    );
    let tiempo = rutinaEj?.descanso || 60;
    restTime.value = tiempo;
    restExerciseName.value = ejercicio.exerciseName;
    restSerieIdx.value = setIndex;
    restExerciseIdx.value = setIndex;
    showRestModal.value = true;
  }
  
  set.completed = !set.completed;
}

function handleRestModalClose() {
  showRestModal.value = false;
}

function handleRestModalFinished() {
  showRestModal.value = false;
}

async function finishWorkout() {
  try {
    await workoutLogsStore.saveWorkout({
      ...activeWorkoutStore.activeWorkout!,
      ejercicios: localExercises.value.map(e => ({
        ejercicio_id: e.ejercicio_id,
        series: e.sets.map(s => ({
          peso: s.peso,
          repeticiones: s.repeticiones,
          completed: s.completed
        }))
      })),
      duracion: Math.max(1, Math.floor(timerSeconds.value / 60)), // nunca 0 minutos
      notas: workoutNotes.value
    });

    activeWorkoutStore.clear();
    router.push('/history');
  } catch (error) {
    console.error('Error saving workout:', error);
  }
}

function stopWorkout() {
  if (confirm('¿Estás seguro de que quieres terminar el entrenamiento?')) {
    activeWorkoutStore.clear();
    router.push('/training');
  }
}

// Lifecycle
onMounted(async () => {
  const workout = activeWorkoutStore.activeWorkout;
  const routine = activeWorkoutStore.sourceRoutine;

  if (!workout || !routine) {
    router.push('/training');
    return;
  }

  // Initialize timer from store
  timerSeconds.value = workout.timerSeconds || 0;
  isPaused.value = workout.isPaused || false;
  workoutNotes.value = (workout as any).notas || '';

  // Obtener la librería de ejercicios
  const exerciseLibraryStore = useExerciseLibraryStore();
  // Si la librería está vacía, cargarla primero
  if (!exerciseLibraryStore.exercises.length) {
    console.log('[ActiveWorkoutView] Cargando librería de ejercicios...');
    await exerciseLibraryStore.fetchExerciseLibrary();
    console.log('[ActiveWorkoutView] Librería cargada:', exerciseLibraryStore.exercises.length);
  }

  // Mapear los ejercicios con el objeto completo
  localExercises.value = (routine.ejercicios || []).map(ej => {
    // Buscar el objeto completo en la librería
    const exerciseObj = exerciseLibraryStore.exercises.find(ex => ex.id === ej.id);
    if (!exerciseObj) {
      console.warn('[ActiveWorkoutView] Ejercicio no encontrado en la librería:', ej.id);
    }
    return {
      ejercicio_id: ej.id,
      exercise: exerciseObj, // Objeto completo
      sets: workout.ejercicios.find(e => e.ejercicio_id === ej.id)?.series || []
    };
  });
  console.log('[ActiveWorkoutView] localExercises:', localExercises.value);

  startTimer();
});

onUnmounted(() => {
  stopTimer();
});
</script>