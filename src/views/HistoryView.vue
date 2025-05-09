<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Historial de Entrenamientos</h1>
    
    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            v-model="filters.startDate"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            v-model="filters.endDate"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Mesociclo
          </label>
          <select
            v-model="filters.mesocicloId"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option
              v-for="mesociclo in mesociclos"
              :key="mesociclo.id"
              :value="mesociclo.id"
            >
              {{ mesociclo.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Ejercicio
          </label>
          <select
            v-model="filters.ejercicioId"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option
              v-for="ejercicio in ejercicios"
              :key="ejercicio.id"
              :value="ejercicio.id"
            >
              {{ ejercicio.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- History List -->
    <div class="space-y-4">
      <div
        v-for="log in filteredLogs"
        :key="log.id"
        class="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-medium text-gray-900">
              {{ getEjercicioName(log.ejercicio_id) }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ formatDate(log.fecha) }}
            </p>
          </div>
          <div class="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            {{ log.peso }}kg × {{ log.repeticiones }}
          </div>
        </div>
      </div>

      <div
        v-if="filteredLogs.length === 0"
        class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200"
      >
        <p class="text-gray-600">No hay registros que coincidan con los filtros seleccionados.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTrainingStore } from '@/stores/training';

const trainingStore = useTrainingStore();

const filters = ref({
  startDate: '',
  endDate: '',
  mesocicloId: '',
  ejercicioId: ''
});

const logs = ref([]);
const mesociclos = computed(() => trainingStore.mesociclos);
const ejercicios = computed(() => {
  const allEjercicios = [];
  mesociclos.value.forEach(mesociclo => {
    mesociclo.rutinas?.forEach(rutina => {
      rutina.ejercicios?.forEach(ejercicio => {
        allEjercicios.push(ejercicio);
      });
    });
  });
  return allEjercicios;
});

const filteredLogs = computed(() => {
  let filtered = [...logs.value];

  if (filters.value.startDate) {
    filtered = filtered.filter(log => 
      new Date(log.fecha) >= new Date(filters.value.startDate)
    );
  }

  if (filters.value.endDate) {
    filtered = filtered.filter(log => 
      new Date(log.fecha) <= new Date(filters.value.endDate)
    );
  }

  if (filters.value.ejercicioId) {
    filtered = filtered.filter(log => 
      log.ejercicio_id === filters.value.ejercicioId
    );
  }

  return filtered;
});

function getEjercicioName(id: string): string {
  const ejercicio = ejercicios.value.find(e => e.id === id);
  return ejercicio?.name || 'Ejercicio desconocido';
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

onMounted(async () => {
  await trainingStore.fetchMesociclos();
  // TODO: Fetch logs from database
});
</script>