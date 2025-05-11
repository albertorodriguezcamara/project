<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div
      class="bg-gradient-to-br from-emerald-600 to-emerald-800 -mx-4 px-6 py-12 md:rounded-3xl md:mx-0 text-white shadow-xl transition-all duration-300"
    >
      <div class="max-w-xl">
        <h1 class="text-3xl font-bold mb-3">¡Bienvenido de nuevo!</h1>
        <p class="text-lg text-emerald-100">{{ today }}</p>

        <div class="mt-8 flex gap-3">
          <router-link
            to="/training"
            class="inline-flex items-center justify-center px-10 py-4 bg-white text-emerald-700 rounded-xl font-bold shadow-lg hover:bg-emerald-50 text-lg transition duration-300"
          >
            <Dumbbell class="w-6 h-6 mr-2" />
            Comenzar Entrenamiento
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        class="card p-5 flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-md"
      >
        <div
          class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3"
        >
          <Calendar class="w-6 h-6" />
        </div>
        <p class="text-base text-gray-600">Mesociclo</p>
        <p class="text-2xl font-bold text-gray-800">
          {{ currentMesocycle }}/{{ totalMesocycles }}
        </p>
      </div>

      <div
        class="card p-5 flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-md"
      >
        <div
          class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3"
        >
          <Activity class="w-6 h-6" />
        </div>
        <p class="text-base text-gray-600">Rutinas</p>
        <p class="text-2xl font-bold text-gray-800">{{ activeRoutinesCount }}</p>
      </div>

      <div
        class="card p-5 flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-md"
      >
        <div
          class="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3"
        >
          <Timer class="w-6 h-6" />
        </div>
        <p class="text-base text-gray-600">Ejercicios completados</p>
        <p class="text-2xl font-bold text-gray-800">{{ totalExercises }}</p>
      </div>

      <div
        class="card p-5 flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-md"
      >
        <div
          class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3"
        >
          <TrendingUp class="w-6 h-6" />
        </div>
        <p class="text-base text-gray-600">Progreso mesociclo</p>
        <p class="text-2xl font-bold text-gray-800">{{ progressPercentage }}%</p>
      </div>
    </div>

    <!-- Active Mesocycle Overview -->
    <div
      class="card p-0 shadow-md transition-all duration-300 rounded-2xl overflow-hidden"
    >
      <div class="bg-emerald-100 p-5 border-b border-emerald-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Estado del Mesociclo</h2>
          <router-link
            to="/config"
            class="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300"
          >
            <ChevronRight class="w-6 h-6" />
          </router-link>
        </div>
      </div>

      <div class="divide-y divide-gray-100">
        <div
          v-for="meso in sortedMesociclos"
          :key="meso.id"
          class="p-5 transition-colors duration-200"
          :class="{
            'bg-white hover:bg-gray-50': !meso.completed,
            'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200': meso.completed
          }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div v-if="meso.completed" class="mr-3">
                <div class="w-10 h-10 bg-amber-300 rounded-full flex items-center justify-center shadow-sm">
                  <Award class="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-800">{{ meso.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">Orden: {{ meso.order }}</p>
              </div>
            </div>
            <span
              class="text-sm px-3 py-1 rounded-full flex items-center"
              :class="{
                'bg-emerald-100 text-emerald-800 border border-emerald-200': meso.active,
                'bg-amber-200 text-amber-800 border border-amber-300': !meso.active && meso.completed,
                'bg-gray-100 text-gray-500 border border-gray-200': !meso.active && !meso.completed
              }"
            >
              <template v-if="meso.completed">
                <Trophy class="w-3.5 h-3.5 mr-1.5" />
              </template>
              {{
                meso.active
                  ? 'Activo'
                  : meso.completed
                  ? 'Completado'
                  : 'Pendiente'
              }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div
      class="card p-0 shadow-md transition-all duration-300 rounded-2xl overflow-hidden"
    >
      <div class="bg-emerald-100 p-5 border-b border-emerald-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Actividad Reciente</h2>
          <router-link
            to="/history"
            class="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300"
          >
            <ChevronRight class="w-6 h-6" />
          </router-link>
        </div>
      </div>

      <div class="divide-y divide-gray-100">
        <template v-for="(workout, index) in recentWorkouts">
          <router-link
            v-if="workout.id"
            :key="workout.id"
            :to="{ name: 'completed-routine', params: { id: workout.id } }"
            class="block p-5 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            <!-- Workout Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex-1">
                <h4 class="font-bold text-lg text-gray-800 truncate">
                  {{ workout.rutinaName || 'Entrenamiento' }}
                </h4>
                <div class="flex flex-col text-sm text-gray-500 mt-1">
                  <div class="flex items-center">
                    <span class="text-emerald-600 font-medium">TEST</span>
                    <span class="ml-2 text-gray-400">{{ formatDate(workout.date) }}</span>
                  </div>
                </div>
              </div>
              <div class="ml-3 flex flex-col items-end">
                <span class="text-sm font-medium text-blue-600 px-2 py-0.5">
                  {{ workout.exercises.length }} ejercicios
                </span>
                <span v-if="workout.duracion" class="text-sm text-gray-500">
                  {{ workout.duracion }} min
                </span>
              </div>
            </div>

            <!-- Exercise Summary -->
            <div class="mt-3 bg-gray-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-3">
                <h5 class="text-sm font-medium text-gray-600">EJERCICIOS</h5>
                <span class="text-sm text-emerald-600">Ver detalles</span>
              </div>
              <ul class="space-y-3">
                <li
                  v-for="(ex, idx) in workout.exercises.slice(0, 2)"
                  :key="ex.ejercicio_id"
                  class="text-base text-gray-700"
                >
                  <div class="flex items-center">
                    <span
                      class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm mr-2"
                    >
                      {{ idx + 1 }}
                    </span>
                    <span class="font-medium">
                      {{ ex.ejercicioNombre_es || 'Ejercicio' }}
                    </span>
                  </div>
                  <div class="ml-8 text-sm text-gray-500 mt-1">
                    <template
                      v-for="(set, sidx) in ex.series.slice(0, 2)"
                      :key="sidx"
                    >
                      {{ set.peso }}kg × {{ set.repeticiones }}
                      <template
                        v-if="sidx < Math.min(ex.series.length - 1, 1)"
                      >
                        <span class="mx-1">•</span>
                      </template>
                    </template>
                    <template v-if="ex.series.length > 2">
                      <span class="text-gray-400 ml-1"
                        >+{{ ex.series.length - 2 }} más</span
                      >
                    </template>
                  </div>
                </li>
                <li
                  v-if="workout.exercises.length > 2"
                  class="text-sm text-center text-gray-500 italic pt-1"
                >
                  + {{ workout.exercises.length - 2 }} ejercicios más
                </li>
              </ul>
            </div>
          </router-link>
          <div
            v-else
            :key="'no-id-' + index"
            class="block p-5 bg-white text-gray-400 italic text-center text-base"
          >
            Entrenamiento sin datos suficientes
          </div>
        </template>

        <!-- Empty State -->
        <div v-if="recentWorkouts.length === 0" class="p-8 text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Activity class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-500">No hay actividad reciente</p>
          <router-link
            to="/training"
            class="mt-4 inline-block text-sm text-emerald-600"
          >
            Comenzar un entrenamiento
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ----------------------------------------------------
   IMPORTS
---------------------------------------------------- */
import { computed, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import {
  Dumbbell,
  Calendar,
  Activity,
  Timer,
  TrendingUp,
  ChevronRight,
  Award,
  Trophy
} from 'lucide-vue-next';

import { useTrainingStore } from '@/stores/training';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';

/* ----------------------------------------------------
   STORES & ROUTER
---------------------------------------------------- */
const router            = useRouter();
const trainingStore     = useTrainingStore();
const workoutLogsStore  = useWorkoutLogsStore();
const exerciseLibraryStore = useExerciseLibraryStore();

/* ----------------------------------------------------
   CARGA DE DATOS
---------------------------------------------------- */
async function fetchDashboardData() {
  await Promise.all([
    trainingStore.fetchMesociclos(),
    workoutLogsStore.getWorkouts(),
    exerciseLibraryStore.fetchExerciseLibrary()
  ]);
}
onMounted(fetchDashboardData);
onActivated(fetchDashboardData);

/* ----------------------------------------------------
   PROPIEDADES COMPUTADAS BÁSICAS
---------------------------------------------------- */
const today = computed(() =>
  new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
);

const sortedMesociclos     = computed(() => trainingStore.sortedMesociclos);
const currentMesocycle     = computed(() => trainingStore.activeMesociclo?.order || 0);
const totalMesocycles      = computed(() => trainingStore.mesociclos.length);
const activeRoutinesCount  = computed(() => trainingStore.activeMesociclo?.rutinas?.length || 0);

// Total de ejercicios completados desde siempre (basado en los registros de entrenamiento)
const totalExercises = computed(() => {
  // Contar todos los ejercicios completados en todos los entrenamientos
  return workoutLogsStore.workouts.reduce((total, workout) => {
    // Sumar los ejercicios de cada entrenamiento
    return total + (workout.ejercicios?.length || 0);
  }, 0);
});

// Progreso basado en rutinas únicas realizadas vs total de rutinas del mesociclo activo
const progressPercentage = computed(() => {
  // Si no hay mesociclo activo, retornar 0
  if (!trainingStore.activeMesociclo) return 0;
  
  // Total de rutinas en el mesociclo activo
  const totalRoutinesInActiveMesociclo = trainingStore.activeMesociclo.rutinas?.length || 0;
  
  if (!totalRoutinesInActiveMesociclo) return 0;
  
  // Obtener IDs de rutinas en el mesociclo activo
  const activeRutinaIds = new Set();
  trainingStore.activeMesociclo.rutinas?.forEach(rutina => {
    activeRutinaIds.add(rutina.id);
  });
  
  // Contar rutinas completadas que pertenecen al mesociclo activo
  const completedActiveRoutines = new Set();
  workoutLogsStore.workouts.forEach(workout => {
    if (workout.rutina_id && activeRutinaIds.has(workout.rutina_id)) {
      completedActiveRoutines.add(workout.rutina_id);
    }
  });
  
  // Calcular el porcentaje
  return Math.round((completedActiveRoutines.size / totalRoutinesInActiveMesociclo) * 100);
});

/* ----------------------------------------------------
   UTILIDADES
---------------------------------------------------- */
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    // 2025-05-10T19:05:51.949+0000 → 2025-05-10 19:05:51
    return dateString.substring(0, 19).replace('T', ' ');
  } catch {
    return dateString;
  }
};

/* ----------------------------------------------------
   RECENT WORKOUTS
---------------------------------------------------- */
const recentWorkouts = computed(() => {
  const workouts     = workoutLogsStore.workouts      || [];
  const mesocycles   = trainingStore.mesociclos       || [];
  const exerciseLB   = exerciseLibraryStore.exercises || [];

  /* ---- diccionario de fallback id -> nombre_es ---- */
  const exerciseDict: Record<string, string> = {};
  if (Array.isArray(exerciseLibraryStore.exercises)) {
    exerciseLibraryStore.exercises.forEach(e => {
      if (e.uuid) exerciseDict[e.uuid] = e.name_es || e.name_en || 'Ejercicio';
      if (e.id && e.id !== e.uuid) exerciseDict[e.id] = e.name_es || e.name_en || 'Ejercicio';
    });
  }

  return workouts.slice(0, 3).map(w => {
    /* localizar rutina / mesociclo */
    let rutina: any = null;
    let mesociclo: any = null;

    for (const m of mesocycles) {
      if (!m.rutinas) continue;
      const rMatch = m.rutinas.find((r: any) => r.id === w.rutina_id);
      if (rMatch) {
        rutina = rMatch;
        mesociclo = m;
        break;
      }
    }

    /* mapear ejercicios */
    const ejercicios = (w.ejercicios || []).map(ex => {
      let nombre = 'Ejercicio';

      // 1) buscar dentro de la rutina
      if (rutina?.ejercicios?.length) {
        const ej = rutina.ejercicios.find((e: any) => e.id === ex.ejercicio_id);
        if (ej) nombre = ej.name_es || ej.name || nombre;
      }

      // 2) fallback a exerciseLibrary usando ejercicio_id
      if (nombre === 'Ejercicio' && ex.ejercicio_id && exerciseDict[ex.ejercicio_id]) {
        nombre = exerciseDict[ex.ejercicio_id];
      }

      // 3) fallback adicional si hay un campo exercise_id
      if (nombre === 'Ejercicio' && ex.exercise_id && exerciseDict[ex.exercise_id]) {
        nombre = exerciseDict[ex.exercise_id];
      }

      // 4) fallback adicional: buscar en los sets si hay un ejercicio_id
      if (nombre === 'Ejercicio' && ex.sets && ex.sets.length > 0 && ex.sets[0].ejercicio_id && exerciseDict[ex.sets[0].ejercicio_id]) {
        nombre = exerciseDict[ex.sets[0].ejercicio_id];
      }

      return {
        ...ex,
        ejercicioNombre_es: nombre,
        series: ex.sets || []
      };
    });

    /* objeto final */
    return {
      id: w.id,
      rutinaName:    rutina?.name   || 'Entrenamiento',
      mesocicloName: mesociclo?.name || '',
      date: w.fecha,
      duracion: w.duracion || '',
      exercises: ejercicios
    };
  });
});
</script>
