```vue
<template>
  <div class="space-y-6">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-emerald-500 to-emerald-700 -mx-4 px-4 py-8 md:rounded-2xl md:mx-0 text-white">
      <div class="max-w-xl">
        <h1 class="text-3xl font-bold mb-2">¡Bienvenido de nuevo!</h1>
        <p class="text-emerald-100">{{ today }}</p>
        
        <div class="mt-6 flex gap-3">
          <router-link 
            to="/training"
            class="inline-flex items-center px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold shadow-lg hover:bg-emerald-50 transition-all"
          >
            <Dumbbell class="w-5 h-5 mr-2" />
            Comenzar Entrenamiento
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-4 flex flex-col items-center text-center">
        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
          <Calendar class="w-6 h-6" />
        </div>
        <p class="text-sm text-gray-500">Mesociclo</p>
        <p class="text-xl font-bold text-gray-900">{{ currentMesocycle }}/{{ totalMesocycles }}</p>
      </div>

      <div class="card p-4 flex flex-col items-center text-center">
        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
          <Activity class="w-6 h-6" />
        </div>
        <p class="text-sm text-gray-500">Rutinas</p>
        <p class="text-xl font-bold text-gray-900">{{ activeRoutinesCount }}</p>
      </div>

      <div class="card p-4 flex flex-col items-center text-center">
        <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
          <Timer class="w-6 h-6" />
        </div>
        <p class="text-sm text-gray-500">Ejercicios</p>
        <p class="text-xl font-bold text-gray-900">{{ totalExercises }}</p>
      </div>

      <div class="card p-4 flex flex-col items-center text-center">
        <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
          <TrendingUp class="w-6 h-6" />
        </div>
        <p class="text-sm text-gray-500">Progreso</p>
        <p class="text-xl font-bold text-gray-900">{{ progressPercentage }}%</p>
      </div>
    </div>

    <!-- Active Mesocycle Overview -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Estado del Mesociclo</h2>
        <router-link 
          to="/config"
          class="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
        >
          Ver todos
          <ChevronRight class="w-4 h-4 ml-1" />
        </router-link>
      </div>

      <div class="space-y-4">
        <div v-for="meso in sortedMesociclos" :key="meso.id" 
          class="p-4 rounded-xl border transition-all"
          :class="[
            meso.active ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'
          ]"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">{{ meso.name }}</h3>
              <p class="text-sm text-gray-500">Orden: {{ meso.order }}</p>
            </div>
            <span 
              class="text-xs px-3 py-1 rounded-full"
              :class="{
                'bg-emerald-100 text-emerald-700': meso.active,
                'bg-gray-100 text-gray-600': !meso.active && !meso.completed,
                'bg-blue-100 text-blue-700': meso.completed
              }"
            >
              {{ meso.active ? 'Activo' : (meso.completed ? 'Completado' : 'Pendiente') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Actividad Reciente</h2>
        <router-link 
          to="/history"
          class="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
        >
          Ver historial
          <ChevronRight class="w-4 h-4 ml-1" />
        </router-link>
      </div>

      <div class="space-y-4">
        <template v-for="(workout, index) in recentWorkouts">
  <router-link
    v-if="workout.id"
    :key="workout.id"
    :to="{ name: 'completed-routine', params: { id: workout.id } }"
    class="block p-4 rounded-xl border border-gray-200 hover:border-emerald-200 transition-all bg-white space-y-2 no-underline cursor-pointer"
  >
    <div class="flex items-center justify-between">
      <div>
        <h4 class="font-medium text-gray-900 truncate">
          {{ workout.rutinaName || 'Entrenamiento' }}
        </h4>
        <p class="text-xs text-gray-500">
          Mesociclo: {{ workout.mesocicloName || 'N/A' }}
        </p>
        <p class="text-xs text-gray-500">
          Fecha: {{ workout.date }}
          <span v-if="workout.duracion"> | Duración: {{ workout.duracion }} min</span>
        </p>
      </div>
      <div class="ml-4 text-right">
        <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
          {{ workout.exercises.length }} ejercicios
        </span>
      </div>
    </div>
    <div class="mt-2">
      <ul class="text-xs text-gray-700 space-y-1">
        <li v-for="ex in workout.exercises" :key="ex.ejercicio_id">
          <span class="font-semibold">{{ ex.ejercicioNombre || 'Ejercicio' }}:</span>
          <span v-for="(set, sidx) in ex.series" :key="sidx">
            {{ set.peso }}kg x {{ set.repeticiones }}
            <span v-if="sidx < ex.series.length - 1"> | </span>
          </span>
        </li>
      </ul>
    </div>
  </router-link>
  <div v-else :key="'no-id-' + index" class="block p-4 rounded-xl border border-gray-200 bg-white text-gray-400 italic">
    Entrenamiento sin datos suficientes
  </div>
</template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Dumbbell,
  Calendar,
  Activity,
  Timer,
  TrendingUp,
  ChevronRight
} from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';

const router = useRouter();
const trainingStore = useTrainingStore();

import { onActivated } from 'vue';

async function fetchDashboardData() {
  await Promise.all([
    trainingStore.fetchMesociclos(),
    workoutLogsStore.getWorkouts()
  ]);
}

onMounted(fetchDashboardData);
onActivated(fetchDashboardData);

const today = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const sortedMesociclos = computed(() => trainingStore.sortedMesociclos);
const currentMesocycle = computed(() => {
  const active = trainingStore.activeMesociclo;
  return active ? active.order : 0;
});
const totalMesocycles = computed(() => trainingStore.mesociclos.length);

const activeRoutinesCount = computed(() => {
  const active = trainingStore.activeMesociclo;
  return active?.rutinas?.length || 0;
});

const totalExercises = computed(() => {
  return trainingStore.mesociclos.reduce((total, meso) => {
    return total + (meso.rutinas?.reduce((rTotal, r) => rTotal + (r.ejercicios?.length || 0), 0) || 0);
  }, 0);
});

const progressPercentage = computed(() => {
  const total = totalMesocycles.value;
  if (!total) return 0;
  const completedCount = trainingStore.mesociclos.filter(m => m.completed).length;
  return Math.round((completedCount / total) * 100);
});

import { useWorkoutLogsStore } from '@/stores/workoutLogs';

const workoutLogsStore = useWorkoutLogsStore();
const recentWorkouts = computed(() => {
  const workouts = workoutLogsStore.workouts || [];
  const mesocycles = trainingStore.mesociclos || [];

  return workouts.slice(0, 3).map(w => {
    // Buscar rutina y mesociclo
    let rutina = null;
    let mesociclo = null;
    for (const m of mesocycles) {
      if (m.rutinas) {
        const r = m.rutinas.find(rut => rut.id === w.rutina_id);
        if (r) {
          rutina = r;
          mesociclo = m;
          break;
        }
      }
    }
    // Mapear ejercicios con nombre
    const ejercicios = (w.ejercicios || []).map(ex => {
      let ejercicioNombre = 'Ejercicio';
      if (rutina && rutina.ejercicios) {
        const ej = rutina.ejercicios.find(ej => ej.id === ex.ejercicio_id);
        if (ej) ejercicioNombre = ej.name;
      }
      // Usar sets del log, no series
      const series = ex.sets || [];
      return {
        ...ex,
        ejercicioNombre,
        series
      };
    });
    return {
      id: w.id, // <-- Añade el id aquí para navegación
      rutinaName: rutina ? rutina.name : 'Entrenamiento',
      mesocicloName: mesociclo ? mesociclo.name : '',
      date: w.fecha,
      duracion: w.duracion || '', // Si existe
      exercises: ejercicios
    };
  });
});


</script>
```