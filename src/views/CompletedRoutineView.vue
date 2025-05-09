<template>
  <div class="max-w-2xl mx-auto py-8">
  <div v-if="!routineData">
    <p class="text-center text-gray-500">Cargando rutina completada...</p>
  </div>
  <div v-else>
    <PageHeader :title="routineData.rutinaName" :subtitle="`Mesociclo: ${routineData.mesocicloName} · Fecha: ${routineData.date}`" />
    <div class="grid gap-4">
      <Card>
        <template #header>
          <div class="flex gap-4 items-center">
            <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Duración: {{ routineData.duracion !== undefined && routineData.duracion !== null && routineData.duracion !== '' ? routineData.duracion : 'N/A' }} min</span>
<span v-if="routineData.comentario && routineData.comentario.trim() !== ''" class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Comentario: {{ routineData.comentario }}</span>
          </div>
        </template>
        <h3 class="font-semibold text-lg mb-4">Ejercicios realizados</h3>
        <ul class="divide-y divide-gray-100">
          <li v-for="ex in routineData.exercises" :key="ex.ejercicio_id" class="py-3">
            <div class="font-medium text-gray-800 mb-1">{{ ex.ejercicioNombre }}</div>
            <ul class="ml-3 mt-1 space-y-1">
              <li v-for="(set, sidx) in ex.series" :key="sidx" class="flex items-center space-x-2 text-xs text-gray-700">
                <span class="font-mono">{{ set.peso }}kg x {{ set.repeticiones }} reps</span>
                <span v-if="set.descanso" class="text-gray-400">| Descanso: {{ set.descanso }}s</span>
              </li>
            </ul>
          </li>
        </ul>
        <div v-if="routineData.descansosTotales !== undefined" class="mt-4 text-xs text-gray-400">
          Descansos totales: {{ routineData.descansosTotales }}
        </div>
      </Card>
      <router-link :to="{ name: 'history' }" class="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">Volver al historial</router-link>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useTrainingStore } from '@/stores/training';
import PageHeader from '@/components/common/PageHeader.vue';
import Card from '@/components/common/Card.vue';

const route = useRoute();
const workoutLogsStore = useWorkoutLogsStore();
const trainingStore = useTrainingStore();
const routineData = ref<any>(null);

onMounted(async () => {
  const workoutId = route.params.id;
  if (!workoutLogsStore.workouts.length) {
    await workoutLogsStore.getWorkouts();
  }
  const workout = workoutLogsStore.workouts.find(w => w.id === workoutId);
  if (!workout) return;

  let rutina = null;
  let mesociclo = null;
  for (const m of trainingStore.mesociclos) {
    if (m.rutinas) {
      const r = m.rutinas.find(rut => rut.id === workout.rutina_id);
      if (r) {
        rutina = r;
        mesociclo = m;
        break;
      }
    }
  }

  // Mapear ejercicios y sets
  const ejercicios = (workout.ejercicios || []).map(ex => {
    let ejercicioNombre = 'Ejercicio';
    if (rutina && rutina.ejercicios) {
      const ej = rutina.ejercicios.find(ej => ej.id === ex.ejercicio_id);
      if (ej) ejercicioNombre = ej.name;
    }
    // Usar sets del log, agregar descanso si está
    const series = (ex.sets || []).map(set => ({
      peso: set.peso,
      repeticiones: set.repeticiones,
      descanso: set.descanso || '',
    }));
    return {
      ...ex,
      ejercicioNombre,
      series
    };
  });

  // Calcular descansos totales
  let descansosTotales = 0;
  ejercicios.forEach(ex => {
    descansosTotales += ex.series.filter(s => s.descanso).length;
  });

  routineData.value = {
    rutinaName: rutina ? rutina.name : 'Entrenamiento',
    mesocicloName: mesociclo ? mesociclo.name : '',
    date: workout.fecha,
    duracion: workout.duracion || '',
    comentario: workout.notas || '',
    exercises: ejercicios,
    descansosTotales
  };
});
</script>
