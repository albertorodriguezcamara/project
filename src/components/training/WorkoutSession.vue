<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <button
        @click="$emit('cancel')"
        class="flex items-center text-gray-600 hover:text-gray-800"
      >
        <ChevronLeft class="w-5 h-5 mr-1" />
        Cancelar
      </button>

      <button
        @click="handleComplete"
        class="btn-primary"
        :disabled="!isWorkoutComplete"
      >
        Finalizar Entrenamiento
      </button>
    </div>

    <!-- Temporizador de descanso -->
    <div
      v-if="activeTimer"
      class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
    >
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {{ formatTime(timerSeconds) }}
        </div>
        <div class="mt-2 flex justify-center space-x-2">
          <button
            v-if="!isPaused"
            @click="pauseTimer"
            class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Pause class="w-5 h-5" />
          </button>
          <button
            v-else
            @click="resumeTimer"
            class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Play class="w-5 h-5" />
          </button>
          <button
            @click="stopTimer"
            class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de ejercicios -->
    <div class="space-y-6">
      <div
        v-for="(ejercicio, idx) in workout.ejercicios"
        :key="ejercicio.ejercicio_id"
        class="card"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ getEjercicioName(ejercicio.ejercicio_id) }}
          </h3>

          <!-- Botón "Comenzar" si aún no se han generado series -->
          <button
            v-if="ejercicio.series.length === 0"
            @click="startExercise(ejercicio)"
            class="btn-primary text-sm"
          >
            Comenzar
          </button>
        </div>

        <!-- Si hay series generadas, mostramos la tabla -->
        <div v-if="ejercicio.series.length > 0" class="space-y-4">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Serie
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Peso (kg)
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reps
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(serie, sIndex) in ejercicio.series"
                  :key="sIndex"
                  :class="{ 'bg-green-50': serie.completed }"
                >
                  <td class="px-4 py-2 text-sm text-gray-900">
                    {{ sIndex + 1 }}
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model.number="serie.peso"
                      type="number"
                      min="0"
                      step="0.5"
                      class="w-20 px-2 py-1 border border-gray-300 rounded-md"
                      :disabled="serie.completed"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model.number="serie.repeticiones"
                      type="number"
                      min="0"
                      class="w-20 px-2 py-1 border border-gray-300 rounded-md"
                      :disabled="serie.completed"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="!serie.completed"
                        @click="completeSerie(ejercicio, sIndex)"
                        class="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                      >
                        <Check class="w-5 h-5" />
                      </button>
                      <button
                        v-if="serie.completed"
                        @click="startTimer(ejercicio.descanso || 90)"
                        class="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Descanso
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-end">
            <button
              @click="addSerie(ejercicio)"
              class="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Plus class="w-4 h-4 mr-1" />
              Añadir serie
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  Plus,
  Check,
  Play,
  Pause,
  X
} from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import type {
  Workout,
  WorkoutEjercicio,
  WorkoutSet
} from '@/types';

const props = defineProps<{
  workout: Workout;
}>();

const emit = defineEmits<{
  (e: 'complete', workout: Workout): void;
  (e: 'cancel'): void;
}>();

const trainingStore = useTrainingStore();

const activeTimer = ref<number | null>(null);
const timerSeconds = ref(0);
const isPaused = ref(false);
let timerInterval: number | null = null;

const isWorkoutComplete = computed(() => {
  return props.workout.ejercicios.every(ejercicio =>
    ejercicio.series.length > 0 &&
    ejercicio.series.every(serie => serie.completed)
  );
});

/** Obtener el nombre del ejercicio, teniendo en cuenta su advanced_mode, etc. */
function getEjercicioName(ejercicioId: string): string {
  // Buscamos en la rutina real
  const rutina = trainingStore.mesociclos
    .flatMap(m => m.rutinas || [])
    .find(r => r.id === props.workout.rutina_id);

  const eje = rutina?.ejercicios?.find(e => e.id === ejercicioId);
  if (!eje) return 'Ejercicio';
  // p.ej. si adv mode = superset
  if (eje.advanced_mode === 'superset' && eje.superset_exercise_id) {
    return `${eje.name} + Superset`;
  }
  if (eje.advanced_mode === 'dropset') {
    return `${eje.name} (Dropset)`;
  }
  return eje.name;
}

/** "Comenzar" un ejercicio => crear las series en la UI.
 *  Si es modo superset, creamos 2 series en un array "principal + superset"? */
function startExercise(ejercicio: WorkoutEjercicio) {
  const rutinaEjercicio = trainingStore.mesociclos
    .flatMap(m => m.rutinas || [])
    .find(r => r.id === props.workout.rutina_id)
    ?.ejercicios?.find(e => e.id === ejercicio.ejercicio_id);

  if (!rutinaEjercicio) return;

  // Generamos las series
  const baseSeries = Array(rutinaEjercicio.series).fill(null).map(() => {
    return {
      peso: rutinaEjercicio.peso_inicial,
      repeticiones: rutinaEjercicio.repeticiones,
      completed: false
    };
  });

  ejercicio.series = [...baseSeries];

  // Si es modo superset, "simulamos" que la segunda parte es un sub-ejercicio
  if (rutinaEjercicio.advanced_mode === 'superset') {
    // Podrías crear un sub-array, UI especial, etc.
    // Aquí, como demo, solo agregamos un "sub-ejercicio" por cada serie
    ejercicio.series.forEach(serie => {
      // Podríamos meter datos del superset, p.ej. sufijo "S"
      // (Esto es conceptual, la UI no lo refleja con mucho detalle)
      (serie as any).subexercise = {
        peso: rutinaEjercicio.peso_inicial,
        reps: rutinaEjercicio.repeticiones
      };
    });
  }
}

/** Completar una serie => si hay dropset, bajamos peso en la siguiente */
function completeSerie(ejercicio: WorkoutEjercicio, serieIndex: number) {
  const serieActual = ejercicio.series[serieIndex];
  if (!serieActual) return;
  serieActual.completed = true;

  // Ver si el ejercicio define dropset
  const rutinaEjercicio = trainingStore.mesociclos
    .flatMap(m => m.rutinas || [])
    .find(r => r.id === props.workout.rutina_id)
    ?.ejercicios?.find(e => e.id === ejercicio.ejercicio_id);

  // Si es dropset => reducimos un 10% (o lo que quieras) el peso en la siguiente serie
  if (rutinaEjercicio?.advanced_mode === 'dropset') {
    const nextSerie = ejercicio.series[serieIndex + 1];
    if (nextSerie && !nextSerie.completed) {
      // Bajamos el peso un 10% como ejemplo
      nextSerie.peso = Math.round(nextSerie.peso * 0.9 * 10) / 10;
    }
  }

  // Si no es la última serie, iniciamos temporizador
  if (serieIndex < ejercicio.series.length - 1) {
    startTimer(rutinaEjercicio?.descanso || 90);
  }
}

/** Añadir una serie manualmente */
function addSerie(ejercicio: WorkoutEjercicio) {
  // Copiamos última serie
  const lastSerie = ejercicio.series[ejercicio.series.length - 1] || { peso: 0, repeticiones: 10, completed: false };
  ejercicio.series.push({
    peso: lastSerie.peso,
    repeticiones: lastSerie.repeticiones,
    completed: false
  });
}

/** Temporizador de descanso */
function startTimer(seconds: number) {
  stopTimer();
  activeTimer.value = seconds;
  timerSeconds.value = seconds;
  isPaused.value = false;

  timerInterval = window.setInterval(() => {
    if (!isPaused.value) {
      timerSeconds.value--;
      if (timerSeconds.value <= 0) {
        stopTimer();
        // Pequeño beep
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
      }
    }
  }, 1000);
}
function pauseTimer() {
  isPaused.value = true;
}
function resumeTimer() {
  isPaused.value = false;
}
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  activeTimer.value = null;
  timerSeconds.value = 0;
  isPaused.value = false;
}

/** Formatea el tiempo mm:ss */
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/** "Finalizar Entrenamiento" => enviamos el workout con todos los datos de series reales */
function handleComplete() {
  // Emite al padre para que él guarde en logs
  emit('complete', props.workout);
}
</script>
