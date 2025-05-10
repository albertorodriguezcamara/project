<template>
  <div class="space-y-8">
    <!-- Selector de período -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-900">Progreso de Entrenamiento</h2>
      <div class="flex gap-2">
        <button 
          v-for="period in periods" 
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-3 py-1.5 text-sm rounded-lg',
            selectedPeriod === period.value 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Gráfica de frecuencia de entrenamientos -->
    <div class="card">
      <h3 class="text-base font-medium text-gray-800 mb-4">Frecuencia de Entrenamientos</h3>
      <div class="h-64">
        <Line 
          v-if="workoutFrequencyData.datasets[0].data.length > 0"
          :data="workoutFrequencyData" 
          :options="chartOptions.frequency"
        />
        <div v-else class="h-full flex items-center justify-center text-gray-400">
          No hay suficientes datos para mostrar la gráfica
        </div>
      </div>
    </div>

    <!-- Gráfica de progreso por ejercicio -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-base font-medium text-gray-800">Progreso por Ejercicio</h3>
        <select 
          v-model="selectedExercise" 
          class="input-field py-1 px-3 text-sm"
          :disabled="!exerciseOptions.length"
        >
          <option v-for="ex in exerciseOptions" :key="ex.id" :value="ex.id">
            {{ ex.name }}
          </option>
        </select>
      </div>
      <div class="h-64">
        <Line 
          v-if="exerciseProgressData.datasets[0].data.length > 0"
          :data="exerciseProgressData" 
          :options="chartOptions.exercise"
        />
        <div v-else class="h-full flex items-center justify-center text-gray-400">
          {{ exerciseOptions.length ? 'No hay suficientes datos para este ejercicio' : 'No hay ejercicios disponibles' }}
        </div>
      </div>
    </div>

    <!-- Gráfica de volumen total -->
    <div class="card">
      <h3 class="text-base font-medium text-gray-800 mb-4">Volumen Total de Entrenamiento</h3>
      <div class="h-64">
        <Bar 
          v-if="volumeData.datasets[0].data.length > 0"
          :data="volumeData" 
          :options="chartOptions.volume"
        />
        <div v-else class="h-full flex items-center justify-center text-gray-400">
          No hay suficientes datos para mostrar la gráfica
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Line, Bar } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useTrainingStore } from '@/stores/training';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  workouts: {
    type: Array,
    required: true
  }
});

const workoutLogsStore = useWorkoutLogsStore();
const trainingStore = useTrainingStore();

// Períodos disponibles
const periods = [
  { label: '1M', value: '1month' },
  { label: '3M', value: '3months' },
  { label: '6M', value: '6months' },
  { label: '1A', value: '1year' },
  { label: 'Todo', value: 'all' }
];

// Estados
const selectedPeriod = ref('3months');
const selectedExercise = ref('');

// Opciones de ejercicios
const exerciseOptions = computed(() => {
  const exercisesMap = new Map();
  
  // Recopilar todos los ejercicios de los entrenamientos
  props.workouts.forEach((workout: any) => {
    workout.ejercicios?.forEach((ex: any) => {
      if (ex.ejercicio_id) {
        // Buscar el nombre del ejercicio
        for (const m of trainingStore.mesociclos) {
          if (m.rutinas) {
            for (const r of m.rutinas) {
              if (r.ejercicios) {
                const ejercicio = r.ejercicios.find(e => e.id === ex.ejercicio_id);
                if (ejercicio && !exercisesMap.has(ejercicio.id)) {
                  exercisesMap.set(ejercicio.id, ejercicio);
                }
              }
            }
          }
        }
      }
    });
  });
  
  return Array.from(exercisesMap.values());
});

// Seleccionar automáticamente el primer ejercicio cuando estén disponibles
watch(exerciseOptions, (newOptions) => {
  if (newOptions.length && !selectedExercise.value) {
    selectedExercise.value = newOptions[0].id;
  }
});

// Filtrar workouts por período seleccionado
const filteredWorkouts = computed(() => {
  const now = new Date();
  let startDate: Date;
  
  switch (selectedPeriod.value) {
    case '1month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case '3months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case '6months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case '1year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default: // 'all'
      startDate = new Date(0); // Desde el inicio de los tiempos
  }
  
  return props.workouts
    .filter((workout: any) => new Date(workout.fecha) >= startDate)
    .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
});

// Datos para la gráfica de frecuencia de entrenamientos
const workoutFrequencyData = computed(() => {
  const workouts = filteredWorkouts.value;
  const dateMap = new Map();
  
  // Agrupar por semana
  workouts.forEach((workout: any) => {
    const date = new Date(workout.fecha);
    // Obtener el lunes de la semana
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekKey = monday.toISOString().split('T')[0];
    
    if (dateMap.has(weekKey)) {
      dateMap.set(weekKey, dateMap.get(weekKey) + 1);
    } else {
      dateMap.set(weekKey, 1);
    }
  });
  
  // Convertir a arrays para Chart.js
  const labels = Array.from(dateMap.keys()).map(date => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}`;
  });
  
  const data = Array.from(dateMap.values());
  
  return {
    labels,
    datasets: [
      {
        label: 'Entrenamientos por semana',
        data,
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  };
});

// Datos para la gráfica de progreso por ejercicio
const exerciseProgressData = computed(() => {
  if (!selectedExercise.value) {
    return { labels: [], datasets: [{ data: [], label: '' }] };
  }
  
  const workouts = filteredWorkouts.value;
  const progressMap = new Map();
  
  // Recopilar datos de progreso para el ejercicio seleccionado
  workouts.forEach((workout: any) => {
    const ejercicio = workout.ejercicios?.find((ex: any) => ex.ejercicio_id === selectedExercise.value);
    if (ejercicio && ejercicio.sets && ejercicio.sets.length) {
      // Encontrar el peso máximo usado en este ejercicio
      const maxWeight = Math.max(...ejercicio.sets.map((set: any) => set.peso || 0));
      if (maxWeight > 0) {
        progressMap.set(workout.fecha, maxWeight);
      }
    }
  });
  
  // Convertir a arrays para Chart.js
  const sortedDates = Array.from(progressMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const labels = sortedDates.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  });
  
  const data = sortedDates.map(date => progressMap.get(date));
  
  // Obtener el nombre del ejercicio
  let exerciseName = 'Ejercicio';
  for (const m of trainingStore.mesociclos) {
    if (m.rutinas) {
      for (const r of m.rutinas) {
        if (r.ejercicios) {
          const ejercicio = r.ejercicios.find(e => e.id === selectedExercise.value);
          if (ejercicio) {
            exerciseName = ejercicio.name;
            break;
          }
        }
      }
    }
  }
  
  return {
    labels,
    datasets: [
      {
        label: `Peso máximo (kg) - ${exerciseName}`,
        data,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        fill: false,
        tension: 0.1
      }
    ]
  };
});

// Datos para la gráfica de volumen total
const volumeData = computed(() => {
  const workouts = filteredWorkouts.value;
  const volumeMap = new Map();
  
  // Calcular volumen total por entrenamiento
  workouts.forEach((workout: any) => {
    let totalVolume = 0;
    
    workout.ejercicios?.forEach((ex: any) => {
      ex.sets?.forEach((set: any) => {
        if (set.peso && set.repeticiones) {
          totalVolume += set.peso * set.repeticiones;
        }
      });
    });
    
    if (totalVolume > 0) {
      volumeMap.set(workout.fecha, totalVolume);
    }
  });
  
  // Convertir a arrays para Chart.js
  const sortedDates = Array.from(volumeMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const labels = sortedDates.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  });
  
  const data = sortedDates.map(date => volumeMap.get(date));
  
  return {
    labels,
    datasets: [
      {
        label: 'Volumen total (kg)',
        data,
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: '#f59e0b',
        borderWidth: 1
      }
    ]
  };
});

// Opciones de las gráficas
const chartOptions = {
  frequency: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            return `Semana del ${context[0].label}`;
          }
        }
      }
    }
  },
  exercise: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  },
  volume: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  // Si no hay ejercicio seleccionado y hay opciones disponibles
  if (!selectedExercise.value && exerciseOptions.value.length) {
    selectedExercise.value = exerciseOptions.value[0].id;
  }
});
</script>
