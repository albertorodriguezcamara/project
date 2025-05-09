<template>
  <div class="bg-white rounded-lg p-4">
    <h3 class="font-medium text-gray-900 mb-4">Progreso de Peso</h3>
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
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  logs: Array<{
    fecha: string;
    peso: number;
    repeticiones: number;
  }>;
}>();

const chartData = computed(() => {
  if (!props.logs.length) return null;

  // Calculate 1RM for each log
  const data = props.logs.map(log => ({
    date: new Date(log.fecha),
    oneRM: Math.round(log.peso * (36 / (37 - log.repeticiones)))
  }));

  // Sort by date
  data.sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    labels: data.map(item => 
      item.date.toLocaleDateString('es-ES', {
        month: 'numeric',
        day: 'numeric'
      })
    ),
    datasets: [
      {
        label: '1RM (kg)',
        data: data.map(item => item.oneRM),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb'
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: (context: any) => `1RM: ${context.parsed.y} kg`
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