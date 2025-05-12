<template>
  <div class="min-h-screen bg-gray-50">
    <RestTimerModal
      :visible="showRestModal"
      :initial="restTime"
      @close="handleRestModalClose"
      @finished="handleRestModalFinished"
    />
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
              class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors relative"
            >
              <!-- Expand/Collapse Indicator - Ahora más grande y en la parte superior -->
              <div class="absolute right-5 top-4 bg-blue-100 rounded-full p-3 shadow-sm">
                <ChevronDown v-if="!isExerciseExpanded(ejercicio.ejercicio_id || ejercicio.groupId)" class="w-6 h-6 text-blue-600" />
                <ChevronUp v-else class="w-6 h-6 text-blue-600" />
              </div>
              <!-- First Exercise -->
              <div class="flex flex-1 flex-col md:flex-row md:items-center gap-4">
                <!-- Exercise GIF -->
                <div class="w-28 h-20 flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
                  <template v-if="ejercicio.exercise?.gif_url_supabase">
                    <img :src="ejercicio.exercise.gif_url_supabase" :alt="ejercicio.exercise?.name_es || 'GIF ejercicio'" class="object-cover w-full h-full" />
                  </template>
                  <div v-else class="w-full h-full flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      <path d="M8 16h8l4 4"/>
                    </svg>
                    <span class="text-gray-400 text-xs">Sin imagen</span>
                  </div>
                </div>
                <!-- Exercise Info -->
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 mb-2">
                    {{ ejercicio.exercise?.name_es || ejercicio.name_es }}
                  </h3>
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span v-if="ejercicio.isCompleted" class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-semibold">Completado</span>
                    <span v-if="ejercicio.exercise?.bodyPart_es" class="bg-blue-50 text-blue-800 px-2 py-1 rounded">{{ ejercicio.exercise.bodyPart_es }}</span>
                    <span v-if="ejercicio.exercise?.equipment_es" class="bg-purple-50 text-purple-800 px-2 py-1 rounded">{{ ejercicio.exercise.equipment_es }}</span>
                  </div>
                  <p class="text-sm text-gray-500 mb-1">
                    {{ ejercicio.sets.length }} series
                  </p>
                </div>
              </div>
              
              <!-- Second Exercise (if superset) -->
              <div
                v-if="ejercicio.isSuperset && ejercicio.pairedExercise"
                class="flex flex-1 flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0 md:border-l md:pl-4 border-gray-200"
              >
                <!-- Exercise GIF -->
                <div class="w-28 h-20 flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
                  <template v-if="ejercicio.pairedExercise.exercise?.gif_url_supabase">
                    <img :src="ejercicio.pairedExercise.exercise.gif_url_supabase" :alt="ejercicio.pairedExercise.exercise?.name_es || 'GIF ejercicio'" class="object-cover w-full h-full" />
                  </template>
                  <div v-else class="flex flex-col items-center justify-center h-full w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 mb-1">
                      <circle cx="16" cy="16" r="14"/>
                      <path d="M8 16h8l4 4"/>
                    </svg>
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
            <div
              v-if="isExerciseExpanded(ejercicio.ejercicio_id || ejercicio.groupId)"
              class="p-4 border-t border-gray-100"
            >
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
                <h4 class="font-medium text-gray-800 mb-4">
                  Series de {{ ejercicio.exercise?.name_es || ejercicio.name_es }}
                </h4>
                <div class="grid grid-cols-4 gap-2 text-base font-medium text-gray-600 mb-3 px-2">
                  <div>Serie</div>
                  <div>Peso</div>
                  <div>Reps</div>
                  <div>Estado</div>
                </div>
                
                <div class="space-y-3">
                  <div
                    v-for="(set, setIndex) in ejercicio.sets"
                    :key="setIndex"
                    class="grid grid-cols-4 gap-3 items-center py-3 px-2 rounded-lg transition-all duration-300"
                    :class="{
                      'bg-emerald-50 border border-emerald-100': set.completed && !set.deleteConfirm,
                      'bg-orange-50 border border-orange-200': set.deleteConfirm,
                      'opacity-50 transform -translate-x-full': set.deleteAnimation
                    }"
                  >
                    <div class="text-base font-medium text-gray-900 flex items-center justify-between bg-gray-100 rounded-lg py-2 px-3 relative">
                      <span>{{ setIndex + 1 }}</span>
                      <button 
                        v-if="ejercicio.sets.length > 1"
                        @click.stop="confirmDeleteSet(ejercicio, setIndex)"
                        class="w-6 h-6 flex items-center justify-center rounded-full transition-colors"
                        :class="{
                          'text-gray-400 hover:text-gray-600': !set.deleteConfirm,
                          'text-orange-600 hover:text-orange-700': set.deleteConfirm
                        }"
                        title="Eliminar serie"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div>
                      <div class="relative">
                        <input
                          v-model.number="set.peso"
                          type="number"
                          min="0"
                          step="0.5"
                          inputmode="decimal"
                          class="w-full h-12 px-3 py-2 text-lg font-medium border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          :disabled="set.completed"
                        />
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">kg</span>
                      </div>
                    </div>
                    
                    <div>
                      <input
                        v-model.number="set.repeticiones"
                        type="number"
                        min="0"
                        inputmode="numeric"
                        class="w-full h-12 px-3 py-2 text-lg font-medium border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :disabled="set.completed"
                      />
                    </div>
                    
                    <div class="flex items-center justify-center">
                      <button
                        @click="toggleSetCompletion(ejercicio, setIndex)"
                        class="p-3 rounded-lg w-full flex items-center justify-center"
                        :class="set.completed 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'"
                      >
                        <Check v-if="set.completed" class="w-6 h-6" />
                        <Timer v-else class="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Second Exercise (Paired) Sets Table -->
              <div
                v-if="ejercicio.isSuperset && ejercicio.pairedExercise"
                class="mt-6"
              >
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
                
                <h4 class="font-medium text-gray-800 mb-2">
                  Series de {{ ejercicio.pairedExercise.exercise?.name_es || ejercicio.pairedExercise.name_es }}
                </h4>
                <div v-if="ejercicio.pairedExercise.sets.length > 0">
                  <div class="grid grid-cols-4 gap-2 text-base font-medium text-gray-600 mb-3 px-2">
                    <div>Serie</div>
                    <div>Peso</div>
                    <div>Reps</div>
                    <div>Estado</div>
                  </div>
                  
                  <div class="space-y-3">
                    <div
                      v-for="(set, setIndex) in ejercicio.pairedExercise.sets"
                      :key="setIndex"
                      class="grid grid-cols-4 gap-3 items-center py-3 px-2 rounded-lg transition-colors"
                      :class="{ 'bg-emerald-50 border border-emerald-100': set.completed }"
                    >
                      <div class="text-base font-medium text-gray-900 flex items-center justify-center bg-gray-100 rounded-lg py-2">
                        {{ setIndex + 1 }}
                      </div>
                      
                      <div>
                        <div class="relative">
                          <input
                            v-model.number="set.peso"
                            type="number"
                            min="0"
                            step="0.5"
                            inputmode="decimal"
                            class="w-full h-12 px-3 py-2 text-lg font-medium border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            :disabled="set.completed"
                          />
                          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">kg</span>
                        </div>
                      </div>
                      
                      <div>
                        <input
                          v-model.number="set.repeticiones"
                          type="number"
                          min="0"
                          inputmode="numeric"
                          class="w-full h-12 px-3 py-2 text-lg font-medium border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          :disabled="set.completed"
                        />
                      </div>
                      
                      <div class="flex items-center justify-center">
                        <button
                          @click="toggleSetCompletion(ejercicio.pairedExercise, setIndex)"
                          class="p-3 rounded-lg w-full flex items-center justify-center"
                          :class="set.completed 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'"
                        >
                          <Check v-if="set.completed" class="w-6 h-6" />
                          <Timer v-else class="w-6 h-6" />
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
          >
            Finalizar Entrenamiento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Pause, Play, X, Plus, Check, Timer, Calendar, Clock, ChevronDown, ChevronUp, Trash2 } from 'lucide-vue-next';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useActiveWorkoutStore } from '@/stores/activeWorkout';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';
import RestTimerModal from '@/components/training/RestTimerModal.vue';

/**
 * Interfaces para mayor robustez
 */
interface SetData {
  peso: number;
  repeticiones: number;
  completed: boolean;
  deleteConfirm?: boolean;
  deleteAnimation?: boolean;
}

interface LocalExercise {
  ejercicio_id: string|number;
  exercise?: any;
  sets: SetData[];
  // Campos para manejar superserie
  isSuperset?: boolean;
  groupId?: string|number|null;
  pairedExercise?: LocalExercise;
  name_es?: string; // Por si la rutina o el store tienen name_es
}

//----------------------------------

const router = useRouter();
const workoutLogsStore = useWorkoutLogsStore();
const activeWorkoutStore = useActiveWorkoutStore();
const exerciseLibraryStore = useExerciseLibraryStore();

// Timer state - sync with store
const timerSeconds = ref(activeWorkoutStore.activeWorkout?.timerSeconds || 0);
const isPaused = ref(activeWorkoutStore.activeWorkout?.isPaused || false);
let intervalId: number | null = null;

// Workout state
const localExercises = ref<LocalExercise[]>([]);
const workoutNotes = ref('');
const expandedExercises = ref<Set<string>>(new Set());

// Rest timer state
const showRestModal = ref(false);
const restTime = ref(0);
const restExerciseName = ref('');
const restSerieIdx = ref<number|null>(null);
const restExerciseIdx = ref<number|null>(null);

//----------------------------------
// WATCHERS: Sincroniza con el store
//----------------------------------
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

//----------------------------------
// COMPUTED
//----------------------------------
const isWorkoutComplete = computed(() => {
  return localExercises.value.every(ejercicio =>
    ejercicio.sets.length > 0 &&
    ejercicio.sets.every(serie => serie.completed)
  );
});

// Conteo de series totales
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

// Volumen total (solo sets completados)
const totalVolume = computed(() => {
  return localExercises.value.reduce((total, ejercicio) => {
    return total + ejercicio.sets.reduce((setTotal, set) => {
      return setTotal + (set.completed ? (set.peso * set.repeticiones) : 0);
    }, 0);
  }, 0);
});

/**
 * Ajustamos "groupedExercises" para que si un ejercicio es parte de superserie
 * y ya está enlazado con "pairedExercise", aparezcan ambos en UN SOLO BLOQUE.
 * Evita duplicar la misma superserie dos veces.
 */
const groupedExercises = computed(() => {
  const output: LocalExercise[] = [];
  const visited = new Set<string>();

  for (const ex of localExercises.value) {
    const exId = String(ex.ejercicio_id);
    if (visited.has(exId)) {
      // Ya lo hemos agregado (o es el paired de otro).
      continue;
    }

    // Si es superserie y tiene paired, agregamos este "ex" al output
    // y marcamos también el paired como visitado para no duplicarlo.
    if (ex.isSuperset && ex.pairedExercise) {
      output.push(ex);
      visited.add(exId);
      visited.add(String(ex.pairedExercise.ejercicio_id));
    } else {
      // Normal (o superset sin paired)
      output.push(ex);
      visited.add(exId);
    }
  }

  return output;
});

//----------------------------------
// FUNCIONES DE AYUDA
//----------------------------------
function toggleExerciseExpanded(ejercicioId: string|number) {
  const idStr = String(ejercicioId);
  if (expandedExercises.value.has(idStr)) {
    expandedExercises.value.delete(idStr);
  } else {
    expandedExercises.value.add(idStr);
  }
}

function isExerciseExpanded(ejercicioId: string|number): boolean {
  return expandedExercises.value.has(String(ejercicioId));
}

// Descanso
function handleRestModalClose() {
  showRestModal.value = false;
}
function handleRestModalFinished() {
  showRestModal.value = false;
}

//----------------------------------
// TIMER
//----------------------------------
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

function stopWorkout() {
  if (confirm('¿Estás seguro de que quieres terminar el entrenamiento?')) {
    activeWorkoutStore.clear();
    router.push('/training');
  }
}

//----------------------------------
// LÓGICA DE SERIES
//----------------------------------
function startExercise(ejercicio: LocalExercise) {
  // Buscar correspondencia en la rutina base
  const rutinaEjercicio = activeWorkoutStore.sourceRoutine?.routine_exercises?.find(
    (e: any) => String(e.exercise_uuid || e.exercise_id) === String(ejercicio.ejercicio_id)
  );
  if (!rutinaEjercicio) return;

  const baseSeries = Array(rutinaEjercicio.sets).fill(null).map(() => ({
    peso: rutinaEjercicio.peso_inicial,
    repeticiones: rutinaEjercicio.reps,
    completed: false
  }));

  ejercicio.sets = [...baseSeries];
  // Expandir en la UI
  expandedExercises.value.add(String(ejercicio.ejercicio_id || ejercicio.groupId || ''));
}

function addSet(exerciseIndex: number) {
  const ejercicio = groupedExercises.value[exerciseIndex];
  if (!ejercicio) return;
  const lastSet = ejercicio.sets[ejercicio.sets.length - 1];
  ejercicio.sets.push({
    peso: lastSet?.peso ?? 0,
    repeticiones: lastSet?.repeticiones ?? 0,
    completed: false
  });
}

function addSetToPaired(exerciseIndex: number) {
  const ejercicio = groupedExercises.value[exerciseIndex];
  if (!ejercicio || !ejercicio.isSuperset || !ejercicio.pairedExercise) return;
  
  const pairedExercise = ejercicio.pairedExercise;
  const lastSet = pairedExercise.sets[pairedExercise.sets.length - 1];
  pairedExercise.sets.push({
    peso: lastSet?.peso ?? 0,
    repeticiones: lastSet?.repeticiones ?? 0,
    completed: false
  });
}

function toggleSetCompletion(ejercicio: LocalExercise, setIndex: number) {
  const set = ejercicio.sets[setIndex];
  if (!set) return;

  if (!set.completed) {
    // Buscar tiempo de descanso para esta serie en la rutina (si lo deseas)
    const rutinaEj = activeWorkoutStore.sourceRoutine?.routine_exercises?.find(
      (rE: any) => String(rE.exercise_id) === String(ejercicio.ejercicio_id)
    );
    let tiempo = rutinaEj?.descanso || 60;
    restTime.value = tiempo;
    restExerciseName.value = (ejercicio.exercise?.name_es || ejercicio.name_es) ?? '';
    restSerieIdx.value = setIndex;
    restExerciseIdx.value = setIndex;
    showRestModal.value = true;
  }
  
  set.completed = !set.completed;

  // Log de depuración para superseries
  if (ejercicio.isSuperset) {
    const paired = ejercicio.pairedExercise;
    const printSets = (sets: SetData[]) =>
      sets.map(s => ({ peso: s.peso, repeticiones: s.repeticiones, completed: s.completed }));
    console.log('[Superset][toggleSetCompletion] Estado tras marcar set:', {
      ejercicio_id: ejercicio.ejercicio_id,
      sets: printSets(ejercicio.sets),
      paired_id: paired?.ejercicio_id,
      paired_sets: paired ? printSets(paired.sets) : []
    });
  }
}

function confirmDeleteSet(ejercicio: LocalExercise, setIndex: number) {
  // No permitir eliminar la última serie
  if (ejercicio.sets.length <= 1) {
    return;
  }
  
  const set = ejercicio.sets[setIndex];
  
  // Si ya está en modo confirmación, eliminar la serie con animación
  if (set.deleteConfirm) {
    set.deleteAnimation = true;
    
    // Esperar a que termine la animación antes de eliminar
    setTimeout(() => {
      removeSet(ejercicio, setIndex);
    }, 300); // Duración de la animación
  } else {
    // Activar el modo confirmación
    set.deleteConfirm = true;
    
    // Desactivar automáticamente después de 3 segundos
    setTimeout(() => {
      if (set && ejercicio.sets.includes(set)) {
        set.deleteConfirm = false;
      }
    }, 3000);
  }
}

function removeSet(ejercicio: LocalExercise, setIndex: number) {
  // No permitir eliminar la última serie
  if (ejercicio.sets.length <= 1) {
    return;
  }
  
  // Eliminar la serie en el índice especificado
  ejercicio.sets.splice(setIndex, 1);
}

function removeSetFromPaired(ejercicio: LocalExercise, setIndex: number) {
  if (!ejercicio.pairedExercise || ejercicio.pairedExercise.sets.length <= 1) {
    return;
  }
  
  ejercicio.pairedExercise.sets.splice(setIndex, 1);
}

//----------------------------------
// GUARDAR ENTRENAMIENTO
//----------------------------------
async function finishWorkout() {
  try {
    // Depuración
    console.log('[DEBUG] Sets por ejercicio antes de guardar:', localExercises.value.map(e => ({
      ejercicio_id: e.ejercicio_id,
      sets: e.sets
    })));

    // Aviso si algún ejercicio no tiene sets
    const ejerciciosSinSets = localExercises.value.filter(e => e.sets.length === 0);
    if (ejerciciosSinSets.length > 0) {
      alert('Atención: Hay ejercicios sin sets. Estos no se guardarán.');
      console.warn('[WARN] Ejercicios sin sets:', ejerciciosSinSets.map(e => e.ejercicio_id));
    }

    // Guardar solo ejercicios con sets
    await workoutLogsStore.saveWorkout({
      ...activeWorkoutStore.activeWorkout!,
      ejercicios: localExercises.value
        .filter(e => e.sets.length > 0)
        .map(e => ({
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

//----------------------------------
// onMounted - Carga inicial
//----------------------------------
onMounted(async () => {
  const workout = activeWorkoutStore.activeWorkout;
  const routine = activeWorkoutStore.sourceRoutine;

  if (!workout || !routine) {
    router.push('/training');
    return;
  }

  // Inicializa timer
  timerSeconds.value = workout.timerSeconds || 0;
  isPaused.value = workout.isPaused || false;
  workoutNotes.value = (workout as any).notas || '';

  // Cargar librería de ejercicios si no está
  if (!exerciseLibraryStore.exercises.length) {
    console.log('[ActiveWorkoutView] Cargando librería de ejercicios...');
    await exerciseLibraryStore.fetchExerciseLibrary();
    console.log('[ActiveWorkoutView] Librería cargada:', exerciseLibraryStore.exercises.length);
  }

  // Mapa de sets, proveniente del store
  const setsMap: Record<string, SetData[]> = {};
  (workout.ejercicios || []).forEach((ej: any) => {
    setsMap[String(ej.ejercicio_id)] = ej.series ? ej.series.map((s: any) => ({...s})) : [];
  });

  // Generar localExercises con superset
  localExercises.value = [];
  const addedIds = new Set<string>();

  (routine.routine_exercises || []).forEach((ej: any) => {
    const exerciseId = String(ej.exercise_uuid || ej.exercise_id);
    if (addedIds.has(exerciseId)) return;
    const exerciseObj = exerciseLibraryStore.exercises.find(ex => String(ex.id) === exerciseId);

    localExercises.value.push({
      ejercicio_id: exerciseObj?.id ?? exerciseId,
      exercise: exerciseObj,
      sets: setsMap[exerciseId] || [],
      isSuperset: (ej.advanced_mode === 'superset'),
      groupId: ej.superset_group_id || null
    });
    addedIds.add(exerciseId);

    // Si es superserie, intentar buscar el paired
    if (ej.advanced_mode === 'superset' && ej.superset_group_id) {
      const paired = (routine.routine_exercises || []).find(
        (e2: any) => e2 !== ej && e2.superset_group_id === ej.superset_group_id
      );
      if (paired) {
        const pairedId = String(paired.exercise_uuid || paired.exercise_id);
        if (!addedIds.has(pairedId)) {
          const pairedObj = exerciseLibraryStore.exercises.find(ex => String(ex.id) === pairedId);
          localExercises.value.push({
            ejercicio_id: pairedObj?.id ?? pairedId,
            exercise: pairedObj,
            sets: setsMap[pairedId] || [],
            isSuperset: true,
            groupId: paired.superset_group_id
          });
          addedIds.add(pairedId);
        }
      }
    }
  });

  // Tras tener ambos ejercicios, enlazarlos en pairedExercise
  // (Así cada uno referencia al otro, quedando en la UI tal como se muestra.)
  for (const ex1 of localExercises.value) {
    if (ex1.isSuperset && ex1.groupId) {
      // Buscar el "otro"
      const ex2 = localExercises.value.find(
        e => e !== ex1 && e.groupId === ex1.groupId
      );
      if (ex2) {
        ex1.pairedExercise = ex2;
      }
    }
  }

  console.log('[ActiveWorkoutView] Mapeo localExercises final:', localExercises.value);

  startTimer();
});

//----------------------------------
// onUnmounted
//----------------------------------
onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Estilos para botones */
.btn-primary {
  @apply bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors;
}
.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm transition-colors;
}

/* Estilos para cards */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100;
}

/* Animaciones */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
