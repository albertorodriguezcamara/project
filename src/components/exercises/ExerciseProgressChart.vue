<template>
  <div class="bg-white rounded-lg p-4">
    <h3 class="font-medium text-gray-900 mb-4">
  Progreso: {{ displayExerciseName }}
</h3>
    <div class="h-64">
      <Line
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
      <div
        v-else
        class="h-full flex items-center justify-center text-gray-500"
      >
        No hay datos suficientes para mostrar el gráfico
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  logs: Array<{
    fecha: string;
    average: number;
    min: number;
    max: number;
    oneRM: number;
  }>;
  exerciseName: string;
}>();

console.log('ExerciseProgressChart props:', { logs: props.logs, exerciseName: props.exerciseName });

// Computed para mostrar el nombre más informativo
const displayExerciseName = computed(() => {
  if (props.exerciseName && props.exerciseName !== 'Ejercicio') return props.exerciseName;
  // Si la prop es 'Ejercicio', intenta obtener el nombre desde los logs
  const firstLog = props.logs && props.logs.length > 0 ? props.logs[0] : null;
  return firstLog?.name_es || firstLog?.name || 'Ejercicio';
});


const chartData = computed(() => {
  if (!props.logs.length) return null;

  // Usar los logs directamente, asumiendo que cada log es un punto con todos los valores calculados
  const labels = props.logs.map(log => new Date(log.fecha).toLocaleDateString('es-ES', { month: 'numeric', day: 'numeric' }));
  const avgPesos = props.logs.map(log => log.average);
  const minPesos = props.logs.map(log => log.min);
  const maxPesos = props.logs.map(log => log.max);
  const oneRMs   = props.logs.map(log => log.oneRM);

  return {
    labels,
    datasets: [
      {
        label: 'Peso Medio (kg)',
        data: avgPesos,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointBackgroundColor: '#10b981',
        type: 'line',
        order: 2
      },
      {
        label: 'Peso Mínimo (kg)',
        data: minPesos,
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245, 158, 66, 0.1)',
        tension: 0.2,
        fill: false,
        pointRadius: 2,
        pointBackgroundColor: '#f59e42',
        borderDash: [4,2],
        type: 'line',
        order: 2
      },
      {
        label: 'Peso Máximo (kg)',
        data: maxPesos,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.2,
        fill: false,
        pointRadius: 2,
        pointBackgroundColor: '#ef4444',
        borderDash: [4,2],
        type: 'line',
        order: 2
      },
      {
        label: '1RM Estimado (kg)',
        data: oneRMs,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
        type: 'line',
        order: 1
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: { size: 13 },
        padding: 14
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || '';
          return `${label}: ${context.parsed.y} kg`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value: number) => `${value} kg`
      }
    }
  }
};
</script>