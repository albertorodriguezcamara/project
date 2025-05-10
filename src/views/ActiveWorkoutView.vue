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
            v-for="(ejercicio, index) in groupedExercises"
            :key="ejercicio.ejercicio_id || ejercicio.groupId"
            class="bg-white rounded-xl shadow-sm overflow-hidden"
            :class="[
              ejercicio.isSuperset ? 'border-2 border-red-300' : 'border border-gray-200',
              ejercicio.isSuperset ? 'relative' : ''
            ]"
          >
            <div v-if="ejercicio.isSuperset" class="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-bl">
              SUPERSERIE
            </div>
            <!-- Exercise Header - Clickable to expand/collapse -->
            <div 
              @click="toggleExerciseExpanded(ejercicio.ejercicio_id || ejercicio.groupId)"
              class="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <!-- First Exercise -->
              <div class="flex flex-1 flex-col md:flex-row md:items-center gap-4">
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
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-900">
                      {{ ejercicio.exercise?.name_es || ejercicio.name_es }}
                    </h3>
                    <div class="ml-2 p-1 rounded-full hover:bg-gray-200" @click.stop>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 transform transition-transform" :class="{'rotate-180': isExerciseExpanded(ejercicio.ejercicio_id || ejercicio.groupId)}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 text-sm text-gray-700 mb-1">
                    <span v-if="ejercicio.exercise?.bodyPart_es" class="bg-blue-50 text-blue-800 px-2 py-1 rounded">{{ ejercicio.exercise.bodyPart_es }}</span>
                    <span v-if="ejercicio.exercise?.equipment_es" class="bg-purple-50 text-purple-800 px-2 py-1 rounded">{{ ejercicio.exercise.equipment_es }}</span>
                    <span v-if="isSupersetExercise(ejercicio)" class="bg-red-50 text-red-800 px-2 py-1 rounded font-semibold">Superserie</span>
                  </div>
                  <p class="text-sm text-gray-500 mb-1">
                    {{ ejercicio.sets.length }} series
                  </p>
                </div>
              </div>
              
              <!-- Second Exercise (if superset) -->
              <div v-if="ejercicio.isSuperset && ejercicio.pairedExercise" class="flex flex-1 flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0 md:border-l md:pl-4 border-gray-200">
                <!-- Exercise GIF -->
                <div class="w-28 h-20 flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
                  <template v-if="ejercicio.pairedExercise.exercise?.gif_url_supabase">
                    <img :src="ejercicio.pairedExercise.exercise.gif_url_supabase" :alt="ejercicio.pairedExercise.exercise?.name_es || 'GIF ejercicio'" class="object-cover w-full h-full" />
                  </template>
                  <div v-else class="flex flex-col items-center justify-center h-full w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 mb-1"><circle cx="16" cy="16" r="14"/><path d="M8 16h8l4 4"/></svg>
                    <span class="text-gray-400 text-xs">Sin imagen</span>
                  </div>
                </div>
                <!-- Exercise Info -->
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900">
                    {{ ejercicio.pairedExercise.exercise?.name_es || ejercicio.pairedExercise.name_es }}
                  </h3>
                  <div class="flex flex-wrap gap-2 text-sm text-gray-700 mb-1">
                    <span v-if="ejercicio.pairedExercise.exercise?.bodyPart_es" class="bg-blue-50 text-blue-800 px-2 py-1 rounded">{{ ejercicio.pairedExercise.exercise.bodyPart_es }}</span>
                    <span v-if="ejercicio.pairedExercise.exercise?.equipment_es" class="bg-purple-50 text-purple-800 px-2 py-1 rounded">{{ ejercicio.pairedExercise.exercise.equipment_es }}</span>
                  </div>
                  <p class="text-sm text-gray-500 mb-1">
                    {{ ejercicio.pairedExercise.sets.length }} series
                  </p>
                </div>
              </div>
            </div>

            <!-- Expandable Content -->
            <div v-if="isExerciseExpanded(ejercicio.ejercicio_id || ejercicio.groupId)" class="p-4 border-t border-gray-100">
              <!-- Action Buttons for First Exercise -->
              <div class="mb-4 flex items-center gap-2">
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
              
              <!-- First Exercise Sets Table -->
              <div v-if="ejercicio.sets.length > 0" class="mb-6">
                <h4 class="font-medium text-gray-800 mb-2">Series de {{ ejercicio.exercise?.name_es || ejercicio.name_es }}</h4>
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
              
              <!-- Second Exercise (Paired) Sets Table -->
              <div v-if="ejercicio.isSuperset && ejercicio.pairedExercise" class="mt-6">
                <!-- Action Buttons for Second Exercise -->
                <div class="mb-4 flex items-center gap-2">
                  <button
                    v-if="ejercicio.pairedExercise.sets.length === 0"
                    @click="startExercise(ejercicio.pairedExercise)"
                    class="btn-primary text-sm"
                  >
                    Comenzar
                  </button>
                  <button
                    v-else
                    @click="addSetToPaired(index)"
                    class="btn-secondary text-sm"
                  >
                    <Plus class="w-4 h-4 mr-1" />
                    Añadir serie
                  </button>
                </div>
                
                <h4 class="font-medium text-gray-800 mb-2">Series de {{ ejercicio.pairedExercise.exercise?.name_es || ejercicio.pairedExercise.name_es }}</h4>
                <div v-if="ejercicio.pairedExercise.sets.length > 0">
                  <div class="grid grid-cols-4 gap-2 text-sm font-medium text-gray-500 mb-2">
                    <div>Serie</div>
                    <div>Peso</div>
                    <div>Reps</div>
                    <div>Estado</div>
                  </div>
                  
                  <div class="space-y-2">
                    <div
                      v-for="(set, setIndex) in ejercicio.pairedExercise.sets"
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
                          @click="toggleSetCompletion(ejercicio.pairedExercise, setIndex)"
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
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Pause, Play, X, Plus, Check, Timer, Calendar, Clock } from 'lucide-vue-next';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useActiveWorkoutStore } from '@/stores/activeWorkout';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';
import type { WorkoutExercise } from '@/types';
import RestTimerModal from '@/components/training/RestTimerModal.vue';

const router = useRouter();
const workoutLogsStore = useWorkoutLogsStore();
const activeWorkoutStore = useActiveWorkoutStore();
const exerciseLibraryStore = useExerciseLibraryStore();

// Timer state - sync with store
const timerSeconds = ref(activeWorkoutStore.activeWorkout?.timerSeconds || 0);
const isPaused = ref(activeWorkoutStore.activeWorkout?.isPaused || false);
let intervalId: number | null = null;

// Workout state
const localExercises = ref<any[]>([]);
const workoutNotes = ref('');
const expandedExercises = ref<Set<string>>(new Set());

// Función para expandir/colapsar ejercicios
function toggleExerciseExpanded(ejercicioId: string) {
  if (expandedExercises.value.has(ejercicioId)) {
    expandedExercises.value.delete(ejercicioId);
  } else {
    expandedExercises.value.add(ejercicioId);
  }
}

function isExerciseExpanded(ejercicioId: string): boolean {
  return expandedExercises.value.has(ejercicioId);
}

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

// Agrupar ejercicios en superseries
const groupedExercises = computed(() => {
  const result: any[] = [];
  const processed = new Set<string>();
  
  localExercises.value.forEach((ejercicio, idx) => {
    if (processed.has(ejercicio.ejercicio_id)) return;
    
    // Buscar si este ejercicio es parte de un superset
    const routineExercise = activeWorkoutStore.sourceRoutine?.routine_exercises?.find(
      e => e.exercise_id === ejercicio.ejercicio_id
    );
    
    if (routineExercise?.advanced_mode === 'superset' && routineExercise.superset_group_id) {
      // Encontrar el otro ejercicio del superset
      const pairedExercise = localExercises.value.find(e => {
        const re = activeWorkoutStore.sourceRoutine?.routine_exercises?.find(
          r => r.exercise_id === e.ejercicio_id
        );
        return re?.superset_group_id === routineExercise.superset_group_id && 
               e.ejercicio_id !== ejercicio.ejercicio_id;
      });
      
      if (pairedExercise) {
        result.push({
          ...ejercicio,
          isSuperset: true,
          groupId: routineExercise.superset_group_id,
          pairedExercise
        });
        processed.add(ejercicio.ejercicio_id);
        processed.add(pairedExercise.ejercicio_id);
      } else {
        result.push(ejercicio);
        processed.add(ejercicio.ejercicio_id);
      }
    } else {
      result.push(ejercicio);
      processed.add(ejercicio.ejercicio_id);
    }
  });
  
  return result;
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

// Helpers
function isSupersetExercise(ejercicio: any): boolean {
  const routineExercise = activeWorkoutStore.sourceRoutine?.routine_exercises?.find(
    e => e.exercise_id === ejercicio.ejercicio_id
  );
  return routineExercise?.advanced_mode === 'superset';
}

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
  const rutinaEjercicio = activeWorkoutStore.sourceRoutine?.routine_exercises?.find(
    e => e.exercise_id === ejercicio.ejercicio_id
  );

  if (!rutinaEjercicio) return;

  const baseSeries = Array(rutinaEjercicio.sets).fill(null).map(() => ({
    peso: rutinaEjercicio.peso_inicial,
    repeticiones: rutinaEjercicio.reps,
    completed: false
  }));

  ejercicio.sets = [...baseSeries];
  
  // Expandir automáticamente el ejercicio para mostrar las series
  expandedExercises.value.add(ejercicio.ejercicio_id || ejercicio.groupId || '');
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

function addSetToPaired(exerciseIndex: number) {
  const ejercicio = groupedExercises.value[exerciseIndex];
  if (!ejercicio.isSuperset || !ejercicio.pairedExercise) return;
  
  const pairedExercise = ejercicio.pairedExercise;
  const lastSet = pairedExercise.sets[pairedExercise.sets.length - 1];
  
  pairedExercise.sets.push({
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
    const rutinaEj = activeWorkoutStore.sourceRoutine?.routine_exercises?.find(
      (ej: any) => ej.exercise_id === ejercicio.ejercicio_id
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
  if (!exerciseLibraryStore.exercises.length) {
    console.log('[ActiveWorkoutView] Cargando librería de ejercicios...');
    await exerciseLibraryStore.fetchExerciseLibrary();
    console.log('[ActiveWorkoutView] Librería cargada:', exerciseLibraryStore.exercises.length);
  }

  // Mapear los ejercicios con el objeto completo y sets
  localExercises.value = (routine.routine_exercises || []).map(ej => {
    // Usar el FK exercise_id para buscar en la librería
    const exerciseId = ej.exercise_id;
    const exerciseObj = exerciseLibraryStore.exercises.find(ex => ex.id === exerciseId);
    if (!exerciseObj) {
      console.warn('[ActiveWorkoutView] Ejercicio no encontrado en la librería:', exerciseId);
    }
    return {
      ejercicio_id: exerciseId,
      exercise: exerciseObj,
      sets: workout.ejercicios.find(e => e.ejercicio_id === exerciseId)?.series || []
    };
  });

  console.log('[ActiveWorkoutView] localExercises:', localExercises.value);

  startTimer();
});

onUnmounted(() => {
  stopTimer();
});
</script>