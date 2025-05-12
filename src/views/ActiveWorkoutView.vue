<template>
  <div class="min-h-screen bg-gray-50">
    <RestTimerModal
      :visible="showRestModal"
      :initial="restTime"
      @close="handleRestModalClose"
      @finished="handleRestModalFinished"
    />
    <!-- Header with Timer - Athletic American Style -->
    <div class="active-workout-header sticky top-0 z-20">
      <!-- Texturas americanas decorativas -->
      <div class="texture-element stars-texture"></div>
      <div class="texture-element stripes-texture"></div>
      <div class="texture-element dots-texture"></div>
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <!-- Left side: Workout Info -->
          <div class="flex-1">
            <div class="flex flex-col space-y-2">
              <div class="flex items-center space-x-3">
                <div class="active-title-banner">
                  <h1 class="active-title" style="color: #FFD700 !important;">
                    {{ activeWorkoutStore.sourceRoutine?.name || 'ENTRENAMIENTO' }}
                  </h1>
                </div>
                <div class="active-exercise-count">
                  <span>{{ localExercises.length }} EJERCICIOS</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="active-date-badge">
                  <Calendar class="active-info-icon" />
                  <span>{{ formatDate(new Date()) }}</span>
                </div>
                <div class="active-time-badge">
                  <Clock class="active-info-icon" />
                  <span>TIEMPO TOTAL</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right side: Timer and Controls -->
          <div class="flex items-center space-x-6">
            <!-- Timer Display -->
            <div class="active-timer-display">
              <div class="active-timer-value">
                {{ formatTime(timerSeconds) }}
              </div>
            </div>
            
            <!-- Controls -->
            <div class="flex space-x-3">
              <button
                v-if="!isPaused"
                @click="pauseTimer"
                class="active-control-btn pause-btn"
                title="Pausar"
              >
                <Pause class="w-6 h-6" />
              </button>
              <button
                v-else
                @click="resumeTimer"
                class="active-control-btn play-btn"
                title="Reanudar"
              >
                <Play class="w-6 h-6" />
              </button>
              <button
                @click="stopWorkout"
                class="active-control-btn stop-btn"
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
    <div class="max-w-7xl mx-auto px-4 py-6 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Exercise List -->
        <div class="lg:col-span-8 space-y-6">
          <div class="active-section-header">
            <div class="active-section-title-banner">
              <h2>EJERCICIOS</h2>
            </div>
          </div>
          <div
            v-for="(ejercicio, index) in groupedExercises"
            :key="ejercicio.ejercicio_id || ejercicio.groupId"
            class="active-exercise-card"
            :class="[
              ejercicio.isSuperset ? 'superset-card' : '',
              ejercicio.isSuperset ? 'relative' : ''
            ]"
          >
            <!-- Texturas atléticas americanas para cards -->
            <div class="card-texture stars-small"></div>
            <div class="card-texture stripes-diagonal"></div>
            <div class="card-texture dots-pattern"></div>
            
            <div v-if="ejercicio.isSuperset" class="active-superset-badge">
              SUPERSERIE
            </div>
            <!-- Exercise Header - Clickable to expand/collapse -->
            <div 
              @click="toggleExerciseExpanded(ejercicio.ejercicio_id || ejercicio.groupId)"
              class="active-exercise-header"
            >
              <!-- Expand/Collapse Indicator - Estilo atlético americano -->
              <div class="active-expand-indicator">
                <ChevronDown v-if="!isExerciseExpanded(ejercicio.ejercicio_id || ejercicio.groupId)" class="w-6 h-6" />
                <ChevronUp v-else class="w-6 h-6" />
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
                <div class="active-exercise-info">
                  <div class="active-exercise-name-banner">
                    <h3 class="active-exercise-name" style="color: #FFD700 !important;">
                      {{ ejercicio.exercise?.name_es || ejercicio.name_es }}
                    </h3>
                  </div>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span v-if="ejercicio.exercise?.bodyPart_es" class="active-tag body-part-tag">{{ ejercicio.exercise.bodyPart_es }}</span>
                    <span v-if="ejercicio.exercise?.equipment_es" class="active-tag equipment-tag">{{ ejercicio.exercise.equipment_es }}</span>
                  </div>
                  <div class="active-sets-container">
                    <span 
                      v-for="(set, setIndex) in ejercicio.sets" 
                      :key="setIndex"
                      class="active-set-badge"
                      :class="set.completed ? 'completed-set' : 'pending-set'"
                    >
                      {{ setIndex + 1 }}
                    </span>
                  </div>
                  <div class="active-sets-count">
                    <span>{{ ejercicio.sets.length }} SERIES</span>
                  </div>
                </div>
              </div>
              
              <!-- Second Exercise (if superset) -->
              <div
                v-if="ejercicio.isSuperset && ejercicio.pairedExercise"
                class="active-paired-exercise"
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
                <div class="active-exercise-info">
                  <div class="active-exercise-name-banner">
                    <h3 class="active-exercise-name" style="color: #FFD700 !important;">
                      {{ ejercicio.pairedExercise.exercise?.name_es || ejercicio.pairedExercise.name_es }}
                    </h3>
                  </div>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span v-if="ejercicio.pairedExercise.exercise?.bodyPart_es" class="active-tag body-part-tag">{{ ejercicio.pairedExercise.exercise.bodyPart_es }}</span>
                    <span v-if="ejercicio.pairedExercise.exercise?.equipment_es" class="active-tag equipment-tag">{{ ejercicio.pairedExercise.exercise.equipment_es }}</span>
                  </div>
                  <div class="active-sets-count">
                    <span>{{ ejercicio.pairedExercise.sets.length }} SERIES</span>
                  </div>
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
                  class="active-action-btn start-btn"
                >
                  COMENZAR
                </button>
                <button
                  v-else
                  @click="addSet(index)"
                  class="active-action-btn add-set-btn"
                >
                  <Plus class="w-4 h-4 mr-1" />
                  AÑADIR SERIE
                </button>
              </div>
              
              <!-- First Exercise Sets Table -->
              <div v-if="ejercicio.sets.length > 0" class="mb-6">
                <div class="active-sets-header">
                  <div class="active-sets-title-banner">
                    <h4>SERIES DE {{ ejercicio.exercise?.name_es || ejercicio.name_es }}</h4>
                  </div>
                </div>
                <div class="active-sets-table-header">
                  <div>SERIE</div>
                  <div>PESO</div>
                  <div>REPS</div>
                  <div>ESTADO</div>
                </div>
                
                <div class="active-sets-rows">
                  <div
                    v-for="(set, setIndex) in ejercicio.sets"
                    :key="setIndex"
                    class="active-set-row"
                    :class="{
                      'completed-set-row': set.completed && !set.deleteConfirm,
                      'delete-confirm-row': set.deleteConfirm,
                      'delete-animation': set.deleteAnimation
                    }"
                  >
                    <div class="active-set-number">
                      <span>{{ setIndex + 1 }}</span>
                      <button 
                        v-if="ejercicio.sets.length > 1"
                        @click.stop="confirmDeleteSet(ejercicio, setIndex)"
                        class="active-delete-set-btn"
                        :class="{
                          'delete-confirm': set.deleteConfirm
                        }"
                        title="Eliminar serie"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div class="weight-field-container">
                      <div class="active-weight-input-container">
                        <input
                          v-model.number="set.peso"
                          type="number"
                          min="0"
                          step="0.5"
                          inputmode="decimal"
                          class="active-weight-input"
                          :disabled="set.completed"
                        />
                        <span class="active-weight-unit">kg</span>
                      </div>
                    </div>
                    
                    <div>
                      <div class="active-reps-input-container">
                        <input
                          v-model.number="set.repeticiones"
                          type="number"
                          min="0"
                          inputmode="numeric"
                          class="active-reps-input"
                          :disabled="set.completed"
                        />
                      </div>
                    </div>
                    
                    <div class="flex items-center justify-center">
                      <button
                        @click="toggleSetCompletion(ejercicio, setIndex)"
                        class="active-set-status-btn"
                        :class="set.completed 
                          ? 'completed-status'
                          : 'pending-status'"
                      >
                        <Check v-if="set.completed" class="w-6 h-6 font-bold text-white" style="stroke-width: 3;" />
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
                    class="active-action-btn start-btn"
                  >
                    COMENZAR
                  </button>
                  <button
                    v-else
                    @click="addSetToPaired(index)"
                    class="active-action-btn add-set-btn"
                  >
                    <Plus class="w-4 h-4 mr-1" />
                    AÑADIR SERIE
                  </button>
                </div>
                
                <div class="active-sets-header">
                  <div class="active-sets-title-banner">
                    <h4>SERIES DE {{ ejercicio.pairedExercise.exercise?.name_es || ejercicio.pairedExercise.name_es }}</h4>
                  </div>
                </div>
                <div v-if="ejercicio.pairedExercise.sets.length > 0">
                  <div class="active-sets-table-header">
                    <div>SERIE</div>
                    <div>PESO</div>
                    <div>REPS</div>
                    <div>ESTADO</div>
                  </div>
                  
                  <div class="active-sets-rows">
                    <div
                      v-for="(set, setIndex) in ejercicio.pairedExercise.sets"
                      :key="setIndex"
                      class="active-set-row"
                      :class="{
                        'completed-set-row': set.completed && !set.deleteConfirm,
                        'delete-confirm-row': set.deleteConfirm,
                        'delete-animation': set.deleteAnimation
                      }"
                    >
                      <div class="active-set-number">
                        <span>{{ setIndex + 1 }}</span>
                        <button 
                          v-if="ejercicio.pairedExercise.sets.length > 1"
                          @click.stop="confirmDeleteSet(ejercicio.pairedExercise, setIndex)"
                          class="active-delete-set-btn"
                          :class="{
                            'delete-confirm': set.deleteConfirm
                          }"
                          title="Eliminar serie"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div class="weight-field-container">
                        <div class="active-weight-input-container">
                          <input
                            v-model.number="set.peso"
                            type="number"
                            min="0"
                            step="0.5"
                            inputmode="decimal"
                            class="active-weight-input"
                            :disabled="set.completed"
                          />
                          <span class="active-weight-unit">kg</span>
                        </div>
                      </div>
                      
                      <div>
                        <div class="active-reps-input-container">
                          <input
                            v-model.number="set.repeticiones"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            class="active-reps-input"
                            :disabled="set.completed"
                          />
                        </div>
                      </div>
                      
                      <div class="flex items-center justify-center">
                        <button
                          @click="toggleSetCompletion(ejercicio.pairedExercise, setIndex)"
                          class="active-set-status-btn"
                          :class="set.completed 
                            ? 'completed-status'
                            : 'pending-status'"
                        >
                          <Check v-if="set.completed" class="w-6 h-6 font-bold text-white" style="stroke-width: 3;" />
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
          <div class="active-stats-card">
            <div class="active-section-header mb-4">
              <div class="active-section-title-banner">
                <h2>RESUMEN</h2>
              </div>
            </div>
            
            <!-- Texturas decorativas -->
            <div class="card-texture stars-small"></div>
            <div class="card-texture stripes-diagonal"></div>
            <div class="card-texture dots-pattern"></div>
            
            <div class="active-stats-container-horizontal">
              <div class="active-stat-item-horizontal">
                <div class="active-stat-label-horizontal">SERIES</div>
                <div class="active-stat-value-horizontal">{{ completedSets }}/{{ totalSets }}</div>
              </div>
              
              <div class="active-stat-item-horizontal">
                <div class="active-stat-label-horizontal">VOLUMEN</div>
                <div class="active-stat-value-horizontal">{{ totalVolume }}kg</div>
              </div>
              
              <div class="active-stat-item-horizontal">
                <div class="active-stat-label-horizontal">TIEMPO</div>
                <div class="active-stat-value-horizontal">{{ formatTime(timerSeconds) }}</div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="active-notes-card">
            <div class="active-section-header mb-4">
              <div class="active-section-title-banner">
                <h2>NOTAS</h2>
              </div>
            </div>
            
            <!-- Texturas decorativas -->
            <div class="card-texture stars-small"></div>
            <div class="card-texture stripes-diagonal"></div>
            
            <textarea
              v-model="workoutNotes"
              rows="4"
              class="active-notes-textarea"
              placeholder="Añade notas sobre tu entrenamiento..."
            ></textarea>
          </div>

          <!-- Finish Button -->
          <button
            @click="finishWorkout"
            class="active-finish-button"
          >
            FINALIZAR ENTRENAMIENTO
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
/* Variables de colores */
:root {
  --navy: #1F2D48;
  --brick-red: #A52A2A;
  --gold: #FFD700;
  --pure-white: #FFFFFF;
  --deep-black: #111111;
}

/* Ocultar scrollbar pero mantener funcionalidad */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Header atlético americano */
.active-workout-header {
  background-color: var(--navy);
  position: relative;
  overflow: hidden;
}

/* Texturas decorativas */
.texture-element {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  opacity: 0.1;
}

.stars-texture {
  top: 20px;
  right: 20px;
  width: 150px;
  height: 150px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M50 0l12 38h38l-30 22 12 38-32-23-32 23 12-38-30-22h38z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

.stripes-texture {
  bottom: 20px;
  left: 20px;
  width: 200px;
  height: 200px;
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 10px, transparent 10px, transparent 20px);
}

.dots-texture {
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 15px 15px;
  transform: translate(-50%, -50%);
}

/* Título atlético americano */
.active-title-banner {
  background-color: var(--navy);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
}

.active-title {
  font-family: 'Oswald', sans-serif !important;
  font-size: 2rem !important;
  font-weight: 800 !important;
  margin: 0 !important;
  color: var(--gold) !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  transform: skewX(5deg) !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.active-exercise-count {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--brick-red);
  color: var(--pure-white);
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Badges de información */
.active-date-badge, .active-time-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--pure-white);
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
  transform: skewX(-5deg);
}

.active-info-icon {
  width: 1rem;
  height: 1rem;
  color: var(--gold);
}

/* Timer y controles */
.active-timer-display {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border-left: 3px solid var(--gold);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.active-timer-value {
  font-family: 'Oswald', monospace;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--pure-white);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.active-control-btn {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: skewX(-5deg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: var(--pure-white);
}

.pause-btn, .play-btn {
  background-color: rgba(255, 255, 255, 0.1);
}

.pause-btn:hover, .play-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.stop-btn {
  background-color: var(--brick-red);
}

.stop-btn:hover {
  background-color: #8a2222;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Sección de ejercicios */
.active-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.active-section-title-banner {
  background-color: var(--brick-red);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.active-section-title-banner h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--pure-white);
  letter-spacing: 1px;
  margin: 0;
  transform: skewX(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Tarjetas de ejercicios */
.active-exercise-card {
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 2px solid #f3f4f6;
  position: relative;
  z-index: 1;
  margin-bottom: 1.5rem;
}

.superset-card {
  border: 2px solid var(--brick-red);
}

/* Texturas atléticas americanas para cards */
.card-texture {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  opacity: 0.07;
}

.stars-small {
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M50 0l12 38h38l-30 22 12 38-32-23-32 23 12-38-30-22h38z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

.stripes-diagonal {
  bottom: 10px;
  left: 10px;
  width: 100px;
  height: 100px;
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 5px, transparent 5px, transparent 10px);
}

.dots-pattern {
  top: 50%;
  left: 20px;
  width: 80px;
  height: 150px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='2' fill='%23FFD700' opacity='0.2'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}

.active-superset-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--brick-red);
  color: var(--pure-white);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-bottom-left-radius: 8px;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  z-index: 10;
}

/* Encabezado del ejercicio */
.active-exercise-header {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

@media (min-width: 768px) {
  .active-exercise-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
}

.active-exercise-header:hover {
  background-color: white;
}

.active-expand-indicator {
  position: absolute;
  right: 1.25rem;
  top: 1rem;
  background-color: var(--brick-red);
  color: var(--pure-white);
  border-radius: 50%;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid var(--gold);
}

.active-expand-indicator:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Información del ejercicio */
.active-exercise-info {
  flex: 1;
  min-width: 0;
}

.active-exercise-name-banner {
  background-color: var(--navy);
  padding: 0.25rem 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
  max-width: 90%;
}

.active-exercise-name {
  font-family: 'Oswald', sans-serif !important;
  font-size: 1.25rem !important;
  font-weight: 800 !important;
  margin: 0 !important;
  color: var(--gold) !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  transform: skewX(5deg) !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-sets-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.active-set-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-weight: 700;
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.completed-set {
  background-color: var(--gold);
  color: var(--navy);
}

.pending-set {
  background-color: var(--navy);
  color: var(--pure-white);
}

.active-sets-count {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--brick-red);
  color: var(--pure-white);
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

/* Estilos para el ejercicio emparejado en superseries */
.active-paired-exercise {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  position: relative;
  padding-top: 1rem;
  border-top: 1px dashed rgba(165, 42, 42, 0.3);
}

@media (min-width: 768px) {
  .active-paired-exercise {
    flex-direction: row;
    align-items: center;
    margin-top: 0;
    padding-top: 0;
    margin-left: 1rem;
    padding-left: 1rem;
    border-top: none;
    border-left: 2px solid var(--navy);
  }
}

/* Etiquetas para información de ejercicios */
.active-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transform: skewX(-5deg);
  font-family: 'Roboto Condensed', sans-serif;
}

.body-part-tag {
  background-color: var(--navy);
  color: var(--pure-white);
}

.equipment-tag {
  background-color: rgba(165, 42, 42, 0.1);
  color: var(--brick-red);
  border: 1px solid var(--brick-red);
}

/* Tarjetas de estadísticas */
.active-stats-card, .active-notes-card {
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 2px solid #f3f4f6;
  position: relative;
  z-index: 1;
  padding: 1.25rem;
}

.active-stats-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.active-stats-container-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background-color: var(--navy);
  border-radius: 0.5rem;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-left: 3px solid var(--gold);
  margin-top: 1rem;
}

.active-stat-item-horizontal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  position: relative;
  text-align: center;
}

.active-stat-item-horizontal:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -0.5rem;
  top: 50%;
  transform: translateY(-50%);
  height: 70%;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.2);
}

.active-stat-label-horizontal {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pure-white);
  opacity: 0.7;
  letter-spacing: 0.5px;
}

.active-stat-value-horizontal {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--pure-white);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.active-stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  padding-bottom: 1.25rem;
  border-bottom: 1px dashed rgba(31, 45, 72, 0.2);
}

.active-stat-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.active-stat-label {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: 0.5px;
}

.active-stat-value-container {
  background-color: var(--navy);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
  align-self: flex-start;
}

.active-stat-value {
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 1px;
  transform: skewX(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Notas */
.active-notes-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(31, 45, 72, 0.05);
  border: 2px solid var(--navy);
  border-radius: 0.5rem;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
}

.active-notes-textarea:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

/* Estilos para la sección de series */
.active-sets-header {
  margin-bottom: 1rem;
}

.active-sets-title-banner {
  background-color: var(--navy);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
  margin-bottom: 1rem;
}

.active-sets-title-banner h4 {
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--pure-white);
  letter-spacing: 1px;
  margin: 0;
  transform: skewX(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.active-sets-table-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: var(--navy);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: var(--pure-white);
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-align: center;
}

.active-sets-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.active-set-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: white;
  border: 2px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  max-width: 100%;
}

.active-set-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='2' fill='%23FFD700' opacity='0.1'/%3E%3C/svg%3E");
  background-size: 20px 20px;
  opacity: 0.1;
  pointer-events: none;
}

.completed-set-row {
  border: 2px solid var(--gold);
  background-color: rgba(255, 245, 200, 1) !important;
  position: relative;
}

.delete-confirm-row {
  border: 2px solid var(--brick-red);
  background-color: rgba(165, 42, 42, 0.05);
}

.delete-animation {
  opacity: 0.5;
  transform: translateX(-100%);
}

.active-set-number {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--navy);
  color: var(--pure-white);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  position: relative;
  border-left: 3px solid var(--gold);
  min-width: 5rem;
}

.active-delete-set-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--pure-white);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-left: 0.5rem;
}

.active-delete-set-btn:hover {
  background-color: var(--brick-red);
  transform: scale(1.1);
}

.active-delete-set-btn.delete-confirm {
  background-color: var(--brick-red);
  color: var(--pure-white);
  animation: pulse 1s infinite;
}

.weight-field-container {
  width: 100%;
}

.active-weight-input-container, .active-reps-input-container {
  position: relative;
  width: 100%;
}

.active-weight-input, .active-reps-input {
  width: 100%;
  height: 3rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  border: 2px solid var(--navy);
  border-radius: 0.5rem;
  background-color: white;
  color: var(--navy);
  transition: all 0.3s ease;
}

.active-weight-input {
  padding: 0.5rem 2.5rem 0.5rem 0.5rem;
  min-width: 6rem;
}

.active-reps-input {
  padding: 0.5rem 0.75rem;
}

.active-weight-input:focus, .active-reps-input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

.active-weight-input:disabled, .active-reps-input:disabled {
  background-color: #f9fafb;
  border-color: #e5e7eb;
  color: #6b7280;
  cursor: not-allowed;
}

.active-weight-unit {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--navy);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 0 0.25rem;
  border-radius: 2px;
}

.active-set-status-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.pending-status {
  background-color: var(--navy);
  color: var(--pure-white);
  border-left: 3px solid var(--gold);
}

.pending-status:hover {
  background-color: #2a3a5a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.completed-status {
  background-color: var(--navy);
  color: white !important;
  border-left: 3px solid var(--gold);
}

.completed-status:hover {
  background-color: #2a3a5a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Botones de acción */
.active-action-btn {
  padding: 0.5rem 1rem;
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.start-btn {
  background-color: var(--brick-red);
  color: var(--pure-white);
  border: none;
}

.start-btn:hover {
  background-color: #8a2222;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-set-btn {
  background-color: var(--navy);
  color: var(--pure-white);
  border: 2px solid var(--gold);
}

.add-set-btn:hover {
  background-color: #2a3a5a;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Botón de finalizar */
.active-finish-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--brick-red);
  color: var(--pure-white);
  font-family: 'Oswald', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: skewX(-5deg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.active-finish-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.active-finish-button:hover {
  background-color: #8a2222;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.active-finish-button:hover::before {
  left: 100%;
}

/* Icono de check */
.check-icon-completed {
  color: var(--navy) !important;
  stroke-width: 3;
  font-weight: bold;
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
