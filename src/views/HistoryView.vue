<template>
  <div class="max-w-5xl mx-auto py-8 px-4 space-y-8">
    <!-- Encabezado y estadísticas - Estilo Atlético Americano -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold uppercase tracking-tight text-white drop-shadow-md" style="color: #0b2545;">HISTORIAL DE ENTRENAMIENTOS</h1>
        <p class="mt-1 text-sm font-bold" style="color: #a52a2a;">REVISA TUS ENTRENAMIENTOS COMPLETADOS</p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <div class="rounded-lg shadow-md px-4 py-3 flex items-center gap-3" style="background-color: #0b2545; border: 2px solid #ffd700;">
          <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #ffd700;">
            <CalendarIcon class="w-5 h-5" style="color: #0b2545;" />
          </div>
          <div>
            <div class="text-xs font-bold uppercase tracking-wide" style="color: #ffd700;">TOTAL</div>
            <div class="font-extrabold text-white text-lg">{{ workouts.length }}</div>
          </div>
        </div>
        
        <div class="rounded-lg shadow-md px-4 py-3 flex items-center gap-3" style="background-color: #0b2545; border: 2px solid #ffd700;">
          <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: #ffd700;">
            <TrendingUpIcon class="w-5 h-5" style="color: #0b2545;" />
          </div>
          <div>
            <div class="text-xs font-bold uppercase tracking-wide" style="color: #ffd700;">ESTE MES</div>
            <div class="font-extrabold text-white text-lg">{{ workoutsThisMonth }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pestañas de navegación - Estilo Atlético Americano -->
    <div class="border-b-4" style="border-color: #ffd700;">
      <nav class="flex space-x-2" aria-label="Tabs">
        <button 
          @click="activeTab = 'list'" 
          :class="[
            'py-3 px-6 font-bold text-sm uppercase tracking-wide whitespace-nowrap rounded-t-lg transform -skew-x-6',
            activeTab === 'list' 
              ? 'text-white border-b-4 border-red-700' 
              : 'text-white hover:text-yellow-200'
          ]"
          :style="{
            backgroundColor: activeTab === 'list' ? '#0b2545' : 'rgba(11, 37, 69, 0.7)',
            boxShadow: activeTab === 'list' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
          }"
        >
          <div class="flex items-center gap-2 transform skew-x-6">
            <ListIcon class="w-5 h-5" :style="{ color: activeTab === 'list' ? '#ffd700' : 'white' }" />
            LISTA
          </div>
        </button>
        
        <button 
          @click="activeTab = 'progress'" 
          :class="[
            'py-3 px-6 font-bold text-sm uppercase tracking-wide whitespace-nowrap rounded-t-lg transform -skew-x-6',
            activeTab === 'progress' 
              ? 'text-white border-b-4 border-red-700' 
              : 'text-white hover:text-yellow-200'
          ]"
          :style="{
            backgroundColor: activeTab === 'progress' ? '#0b2545' : 'rgba(11, 37, 69, 0.7)',
            boxShadow: activeTab === 'progress' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
          }"
        >
          <div class="flex items-center gap-2 transform skew-x-6">
            <BarChartIcon class="w-5 h-5" :style="{ color: activeTab === 'progress' ? '#ffd700' : 'white' }" />
            PROGRESO
          </div>
        </button>
      </nav>
    </div>
    
    <!-- Contenido según la pestaña seleccionada -->
    <div v-if="activeTab === 'list'">
      <!-- Filtros - Estilo Atlético Americano -->
      <div class="rounded-lg shadow-lg p-5" style="background-color: #0b2545; border: 3px solid #ffd700;">
        <h2 class="text-xl font-extrabold uppercase tracking-wide mb-4 text-white flex items-center">
          <span class="mr-2 inline-block w-6 h-6 rounded-full" style="background-color: #ffd700;"></span>
          FILTROS
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-bold uppercase tracking-wide text-white mb-2">
              FECHA INICIO
            </label>
            <input
              type="date"
              v-model="filters.startDate"
              class="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
              style="border-color: #ffd700; background-color: white; color: #0b2545; font-weight: 600;"
            />
          </div>
          
          <div>
            <label class="block text-sm font-bold uppercase tracking-wide text-white mb-2">
              FECHA FIN
            </label>
            <input
              type="date"
              v-model="filters.endDate"
              class="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
              style="border-color: #ffd700; background-color: white; color: #0b2545; font-weight: 600;"
            />
          </div>
          
          <div>
            <label class="block text-sm font-bold uppercase tracking-wide text-white mb-2">
              MESOCICLO
            </label>
            <select
              v-model="filters.mesocicloId"
              class="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
              style="border-color: #ffd700; background-color: white; color: #0b2545; font-weight: 600;"
            >
              <option value="">Todos los mesociclos</option>
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
            <label class="block text-sm font-bold uppercase tracking-wide text-white mb-2">
              EJERCICIO
            </label>
            <select
              v-model="filters.ejercicioId"
              class="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
              style="border-color: #ffd700; background-color: white; color: #0b2545; font-weight: 600;"
            >
              <option value="">Todos los ejercicios</option>
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

      <!-- Estado de carga - Estilo Atlético Americano -->
      <div v-if="isLoading" class="flex justify-center py-12 mt-8">
        <div class="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style="border-color: #ffd700 transparent #a52a2a transparent;"></div>
      </div>

      <!-- Lista de entrenamientos - Estilo Atlético Americano -->
      <div v-else class="space-y-6 mt-8">
        <div
          v-for="workout in filteredWorkouts"
          :key="workout.id"
          class="rounded-lg shadow-lg p-4 cursor-pointer transition-all transform hover:scale-[1.01] hover:shadow-xl relative overflow-hidden"
          style="background-color: white; border: 2px solid #0b2545;"
          @click="navigateToWorkoutDetails(workout.id)"
        >
          <!-- Franja decorativa diagonal -->
          <div class="absolute top-0 right-0 w-24 h-24 transform rotate-45 translate-x-8 -translate-y-10" style="background-color: #ffd700;"></div>
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-lg font-extrabold text-gray-900 truncate uppercase" style="color: #0b2545;">{{ getRutinaName(workout.rutina_id) }}</h3>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
                  style="background-color: #a52a2a; color: white;"
                >
                  COMPLETADO
                </span>
              </div>
              <p class="text-sm font-bold mt-1" style="color: #0b2545;">
                {{ formatDate(workout.fecha) }}
              </p>
            </div>
            
            <div class="flex flex-wrap gap-3 relative z-10">
              <div class="px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1" style="background-color: #0b2545; color: white;">
                <ClockIcon class="w-4 h-4" style="color: #ffd700;" />
                {{ workout.duracion || 'N/A' }} min
              </div>
              
              <div class="px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1" style="background-color: #0b2545; color: white;">
                <DumbbellIcon class="w-4 h-4" style="color: #ffd700;" />
                {{ workout.ejercicios?.length || 0 }} ejercicios
              </div>
              
              <router-link 
                :to="{ name: 'completed-routine', params: { id: workout.id } }" 
                class="text-xs px-3 py-1.5 flex items-center gap-1 rounded font-bold uppercase tracking-wide transform -skew-x-6 transition-all"
                style="background-color: #a52a2a; color: white; border: 2px solid #ffd700;"
                @click.stop
              >
                <EyeIcon class="w-4 h-4 transform skew-x-6" />
                <span class="transform skew-x-6">DETALLES</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div
          v-if="filteredWorkouts.length === 0 && !isLoading"
          class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="flex flex-col items-center gap-3">
            <ClipboardIcon class="w-12 h-12 text-gray-300" />
            <div>
              <p class="text-gray-600 font-medium">No hay entrenamientos que coincidan con los filtros</p>
              <p class="text-gray-500 text-sm mt-1">Intenta ajustar los filtros o crear un nuevo entrenamiento</p>
            </div>
            <router-link :to="{ name: 'training' }" class="btn-primary mt-4">
              Nuevo entrenamiento
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Vista de gráficas de progreso -->
    <div v-else-if="activeTab === 'progress'">
      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <!-- Gráficas de progreso -->
      <ProgressCharts 
        v-else-if="workouts.length > 0" 
        :workouts="workouts" 
      />
      
      <!-- Mensaje cuando no hay datos para las gráficas -->
      <div 
        v-else 
        class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200"
      >
        <div class="flex flex-col items-center gap-3">
          <BarChart2Icon class="w-12 h-12 text-gray-300" />
          <div>
            <p class="text-gray-600 font-medium">No hay datos suficientes para mostrar gráficas</p>
            <p class="text-gray-500 text-sm mt-1">Completa algunos entrenamientos para ver tu progreso</p>
          </div>
          <router-link :to="{ name: 'training' }" class="btn-primary mt-4">
            Nuevo entrenamiento
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTrainingStore } from '@/stores/training';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import ProgressCharts from '@/components/history/ProgressCharts.vue';
// Importamos los iconos necesarios
import { 
  Calendar as CalendarIcon, 
  TrendingUp as TrendingUpIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  Clipboard as ClipboardIcon,
  List as ListIcon,
  BarChart as BarChartIcon,
  BarChart2 as BarChart2Icon
} from 'lucide-vue-next';

// Componente personalizado para el icono de mancuerna
const DumbbellIcon = {
  name: 'DumbbellIcon',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, [
      h('path', { d: 'M6.5 6.5h11' }),
      h('path', { d: 'M6.5 17.5h11' }),
      h('path', { d: 'M4 9.5v5' }),
      h('path', { d: 'M20 9.5v5' }),
      h('path', { d: 'M6.5 6.5A2.5 2.5 0 0 0 4 9v0a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 9v0a2.5 2.5 0 0 0-2.5-2.5h-11z' }),
      h('path', { d: 'M6.5 14.5A2.5 2.5 0 0 0 4 17v0a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 17v0a2.5 2.5 0 0 0-2.5-2.5h-11z' })
    ]);
  }
};

import { h } from 'vue';

const router = useRouter();
const trainingStore = useTrainingStore();
const workoutLogsStore = useWorkoutLogsStore();

// Estado de carga y control de pestañas
const isLoading = ref(true);
const activeTab = ref('list'); // 'list' o 'progress'

// Filtros para los entrenamientos
const filters = ref({
  startDate: '',
  endDate: '',
  mesocicloId: '',
  ejercicioId: ''
});

// Referencias a los datos
const workouts = ref<any[]>([]);
const mesociclos = computed(() => trainingStore.mesociclos);

// Obtener todos los ejercicios disponibles para el filtro
const ejercicios = computed(() => {
  const allEjercicios: any[] = [];
  const ejerciciosMap = new Map(); // Para evitar duplicados
  
  mesociclos.value.forEach(mesociclo => {
    mesociclo.rutinas?.forEach(rutina => {
      rutina.ejercicios?.forEach(ejercicio => {
        if (!ejerciciosMap.has(ejercicio.id)) {
          ejerciciosMap.set(ejercicio.id, ejercicio);
          allEjercicios.push(ejercicio);
        }
      });
    });
  });
  
  return allEjercicios;
});

// Calcular la cantidad de entrenamientos este mes
const workoutsThisMonth = computed(() => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return workouts.value.filter(workout => 
    new Date(workout.fecha) >= firstDayOfMonth
  ).length;
});

// Filtrar los entrenamientos según los criterios seleccionados
const filteredWorkouts = computed(() => {
  let filtered = [...workouts.value];

  // Filtrar por fecha de inicio
  if (filters.value.startDate) {
    filtered = filtered.filter(workout => 
      new Date(workout.fecha) >= new Date(filters.value.startDate)
    );
  }

  // Filtrar por fecha final
  if (filters.value.endDate) {
    filtered = filtered.filter(workout => 
      new Date(workout.fecha) <= new Date(filters.value.endDate)
    );
  }

  // Filtrar por mesociclo (usando la rutina asociada)
  if (filters.value.mesocicloId) {
    filtered = filtered.filter(workout => {
      // Buscar la rutina y verificar si pertenece al mesociclo seleccionado
      for (const m of mesociclos.value) {
        if (m.id === filters.value.mesocicloId) {
          return m.rutinas?.some(r => r.id === workout.rutina_id);
        }
      }
      return false;
    });
  }

  // Filtrar por ejercicio
  if (filters.value.ejercicioId) {
    filtered = filtered.filter(workout => 
      workout.ejercicios?.some((ex: any) => ex.ejercicio_id === filters.value.ejercicioId)
    );
  }

  // Ordenar por fecha más reciente primero
  return filtered.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
});

// Obtener el nombre de la rutina a partir de su ID
function getRutinaName(rutinaId: string): string {
  for (const m of mesociclos.value) {
    if (m.rutinas) {
      const rutina = m.rutinas.find(r => r.id === rutinaId);
      if (rutina) return rutina.name;
    }
  }
  return 'Entrenamiento';
}

// Formatear la fecha para mostrarla de manera amigable
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Navegar a la vista detallada de un entrenamiento
function navigateToWorkoutDetails(workoutId: string) {
  router.push({ name: 'completed-routine', params: { id: workoutId } });
}

// Al montar el componente, cargar los datos necesarios
onMounted(async () => {
  try {
    isLoading.value = true;
    
    // Cargar mesociclos si no están cargados
    if (!trainingStore.mesociclos.length) {
      await trainingStore.fetchMesociclos();
    }
    
    // Cargar los entrenamientos completados
    await workoutLogsStore.getWorkouts();
    workouts.value = workoutLogsStore.workouts;
    
    console.log('Entrenamientos cargados:', workouts.value.length);
  } catch (error) {
    console.error('Error al cargar datos de historial:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Estilos adicionales específicos para esta vista */
.input-field:focus {
  @apply ring-emerald-500 border-emerald-500;
}
</style>