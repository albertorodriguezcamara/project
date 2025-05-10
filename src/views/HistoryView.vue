<template>
  <div class="max-w-5xl mx-auto py-8 px-4 space-y-8">
    <!-- Encabezado y estadísticas -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Historial de Entrenamientos</h1>
        <p class="text-gray-500 mt-1">Revisa tus entrenamientos completados</p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-2 flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <CalendarIcon class="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div class="text-xs text-gray-500">Total</div>
            <div class="font-medium">{{ workouts.length }} entrenamientos</div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-2 flex items-center gap-2">
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUpIcon class="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div class="text-xs text-gray-500">Este mes</div>
            <div class="font-medium">{{ workoutsThisMonth }} entrenamientos</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pestañas de navegación -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button 
          @click="activeTab = 'list'" 
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
            activeTab === 'list' 
              ? 'border-emerald-500 text-emerald-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center gap-2">
            <ListIcon class="w-4 h-4" />
            Lista de Entrenamientos
          </div>
        </button>
        
        <button 
          @click="activeTab = 'progress'" 
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
            activeTab === 'progress' 
              ? 'border-emerald-500 text-emerald-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center gap-2">
            <BarChartIcon class="w-4 h-4" />
            Gráficas de Progreso
          </div>
        </button>
      </nav>
    </div>
    
    <!-- Contenido según la pestaña seleccionada -->
    <div v-if="activeTab === 'list'">
      <!-- Filtros -->
      <div class="card">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              v-model="filters.startDate"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              v-model="filters.endDate"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mesociclo
            </label>
            <select
              v-model="filters.mesocicloId"
              class="input-field"
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
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Ejercicio
            </label>
            <select
              v-model="filters.ejercicioId"
              class="input-field"
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

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Lista de entrenamientos -->
      <div v-else class="space-y-4">
        <div
          v-for="workout in filteredWorkouts"
          :key="workout.id"
          class="card hover:border-emerald-200 cursor-pointer transition-all"
          @click="navigateToWorkoutDetails(workout.id)"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-medium text-gray-900">{{ getRutinaName(workout.rutina_id) }}</h3>
                <span class="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full">
                  Completado
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatDate(workout.fecha) }}
              </p>
            </div>
            
            <div class="flex flex-wrap gap-3">
              <div class="bg-gray-50 px-3 py-1 rounded-lg text-sm text-gray-700 flex items-center gap-1">
                <ClockIcon class="w-4 h-4 text-gray-500" />
                {{ workout.duracion || 'N/A' }} min
              </div>
              
              <div class="bg-gray-50 px-3 py-1 rounded-lg text-sm text-gray-700 flex items-center gap-1">
                <DumbbellIcon class="w-4 h-4 text-gray-500" />
                {{ workout.ejercicios?.length || 0 }} ejercicios
              </div>
              
              <router-link 
                :to="{ name: 'completed-routine', params: { id: workout.id } }" 
                class="bg-emerald-50 px-3 py-1 rounded-lg text-sm text-emerald-700 flex items-center gap-1 hover:bg-emerald-100"
                @click.stop
              >
                <EyeIcon class="w-4 h-4" />
                Ver detalles
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