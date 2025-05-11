<template>
  <div class="h-full w-full bg-gray-50">
    <!-- Estado de carga -->
    <div v-if="!routineData" class="flex items-center justify-center h-screen">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500 font-medium">Cargando entrenamiento...</p>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div v-else class="flex flex-col h-full">
      <!-- Encabezado fijo -->
      <header class="sticky top-0 z-20 bg-white shadow-sm">
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex items-center gap-3">
            <router-link :to="{ name: 'history' }" class="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
              <ArrowLeft class="w-5 h-5 text-gray-600" />
            </router-link>
            <div class="truncate">
              <h1 class="text-lg font-bold text-gray-900 truncate">{{ routineData.rutinaName }}</h1>
              <p class="text-xs text-gray-500 truncate">{{ routineData.mesocicloName }} · {{ routineData.date }}</p>
            </div>
          </div>
          <span class="bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
            Completado
          </span>
        </div>
        
        <!-- Sistema de pestañas mejorado para móvil -->
        <div class="px-1 border-t border-gray-200">
          <nav class="flex overflow-x-auto hide-scrollbar" aria-label="Tabs">
            <button 
              @click="activeTab = 'summary'" 
              class="flex-1 py-4 relative flex flex-col items-center text-xs font-semibold whitespace-nowrap transition-colors"
              :class="activeTab === 'summary' ? 'text-emerald-600' : 'text-gray-500'"
            >
              <div class="flex items-center justify-center mb-1">
                <ClipboardCheck :class="['w-5 h-5', activeTab === 'summary' ? 'text-emerald-500' : 'text-gray-400']" />
              </div>
              <span>Resumen</span>
              <div 
                class="absolute bottom-0 left-0 w-full h-0.5 transition-colors"
                :class="activeTab === 'summary' ? 'bg-emerald-500' : 'bg-transparent'"
              ></div>
            </button>
            
            <button 
              @click="activeTab = 'exercises'" 
              class="flex-1 py-4 relative flex flex-col items-center text-xs font-semibold whitespace-nowrap transition-colors"
              :class="activeTab === 'exercises' ? 'text-emerald-600' : 'text-gray-500'"
            >
              <div class="flex items-center justify-center mb-1">
                <Dumbbell :class="['w-5 h-5', activeTab === 'exercises' ? 'text-emerald-500' : 'text-gray-400']" />
              </div>
              <span>Ejercicios</span>
              <div class="absolute -bottom-px right-0 left-0 flex justify-center">
                <span v-if="routineData.exercises.length" class="absolute -top-1.5 ml-4 bg-emerald-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {{ routineData.exercises.length }}
                </span>
              </div>
              <div 
                class="absolute bottom-0 left-0 w-full h-0.5 transition-colors"
                :class="activeTab === 'exercises' ? 'bg-emerald-500' : 'bg-transparent'"
              ></div>
            </button>
          </nav>
        </div>
      </header>
      
      <!-- Acciones rápidas flotantes - Rediseñadas para móvil -->
      <div class="fixed bottom-24 right-4 flex flex-col gap-3 z-10">
        <button class="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-200 transform transition-transform active:scale-95">
          <Share2 class="w-5 h-5" />
        </button>
        <button class="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-200 transform transition-transform active:scale-95">
          <Printer class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Contenido principal con scroll - Optimizado para móvil -->
      <main class="flex-1 overflow-y-auto px-4 pt-4 pb-24 bg-gray-50">
        <!-- PESTAÑA: RESUMEN -->
        <div v-if="activeTab === 'summary'" class="space-y-5">
          <!-- Estadísticas del entrenamiento - Mejoradas para móvil -->
          <div class="grid grid-cols-2 gap-4">
            <div class="card p-4 flex items-center gap-3 shadow-sm transition-transform active:scale-98">
              <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Clock class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500">Duración</p>
                <p class="text-xl font-bold text-gray-900">{{ routineData.duracion || '00:00' }}</p>
              </div>
            </div>
            
            <div class="card p-4 flex items-center gap-3 shadow-sm transition-transform active:scale-98">
              <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <Activity class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500">Volumen</p>
                <p class="text-xl font-bold text-gray-900">{{ totalVolume }} kg</p>
              </div>
            </div>
            
            <div class="card p-4 flex items-center gap-3 shadow-sm transition-transform active:scale-98">
              <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Weight class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500">Series</p>
                <p class="text-xl font-bold text-gray-900">{{ totalSets }}</p>
              </div>
            </div>
            
            <div class="card p-4 flex items-center gap-3 shadow-sm transition-transform active:scale-98">
              <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Trophy class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500">1RM Est.</p>
                <p class="text-xl font-bold text-gray-900">{{ averageOneRM }} kg</p>
              </div>
            </div>
          </div>
          
          <!-- Notas del entrenamiento - Mejoradas para móvil -->
          <div v-if="routineData.comentario && routineData.comentario.trim() !== ''" class="card p-4 bg-amber-50 border border-amber-200 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="w-11 h-11 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0 border border-amber-200">
                <StickyNote class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-amber-800 mb-1.5">Notas del entrenamiento</h3>
                <p class="text-sm text-gray-700 leading-relaxed">{{ routineData.comentario }}</p>
              </div>
            </div>
          </div>
          
          <!-- Resumen de ejercicios - Mejorado para móvil -->
          <div class="card overflow-hidden shadow-sm">
            <div class="bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-3.5 border-b border-emerald-200">
              <h2 class="text-base font-semibold text-emerald-800 flex items-center">
                <Dumbbell class="w-5 h-5 mr-2 text-emerald-600" />
                Resumen de ejercicios
              </h2>
            </div>
            
            <div class="divide-y divide-gray-100">
              <div 
                v-for="(ex, index) in routineData.exercises" 
                :key="ex.ejercicio_id"
                class="relative transition-all duration-150 active:bg-gray-100 rounded-lg overflow-hidden mb-1"
                :class="ex.isSuperset ? 'border-l-4 border-l-red-400' : ''"
                @click="activeTab = 'exercises'"
              >
                <div class="p-4 flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <!-- Icono del ejercicio con diseño mejorado -->
                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative shadow-sm">
                      <Dumbbell class="w-6 h-6 text-gray-500" />
                      <!-- Badge de superserie mejorado -->
                      <div v-if="ex.isSuperset" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm border border-white">
                        <span class="text-white text-[9px] font-bold">S</span>
                      </div>
                    </div>
                    
                    <!-- Información del ejercicio mejorada -->
                    <div class="flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h3 class="font-semibold text-gray-900">{{ ex.name_es || ex.ejercicioNombre || ex.ejercicioInfo?.name_es || ex.ejercicioInfo?.name || ex.name || 'Ejercicio' }}</h3>
                        <!-- Etiqueta de superserie mejorada -->
                        <span v-if="ex.isSuperset" class="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium border border-red-100">
                          Superserie
                        </span>
                      </div>
                      <div class="flex items-center gap-1.5 mt-1">
                        <span class="text-xs font-medium text-gray-500">{{ ex.series.length }} series</span>
                        <span class="text-xs text-gray-400">•</span>
                        <span class="text-xs font-medium text-gray-500">{{ ex.totalVolumen }} kg</span>
                        <!-- Si tiene pairedExerciseName, mostrar con qué ejercicio forma superserie -->
                        <span v-if="ex.pairedExerciseName" class="text-xs text-gray-400">•</span>
                        <span v-if="ex.pairedExerciseName" class="text-xs font-medium text-gray-500">Con: {{ ex.pairedExerciseName }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-right flex flex-col items-end">
                    <div class="text-sm font-bold text-gray-900">{{ getMaxWeight(ex) }} kg</div>
                    <div v-if="getWeightProgress(ex) !== 0" 
                         class="text-xs px-2 py-0.5 rounded-full mt-1 flex items-center" 
                         :class="getWeightProgress(ex) > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'">
                      {{ getWeightProgress(ex) > 0 ? '↑' : '↓' }} {{ Math.abs(getWeightProgress(ex)) }} kg
                    </div>
                  </div>
                </div>
                <!-- Indicador de toque -->
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- PESTAÑA: EJERCICIOS - Optimizada para móvil -->  
        <div v-if="activeTab === 'exercises'" class="space-y-4">
          <!-- Acordeón de ejercicios mejorado -->  
          <div class="space-y-4">
            <div 
              v-for="(ex, index) in routineData.exercises" 
              :key="ex.ejercicio_id" 
              class="card overflow-hidden shadow-sm rounded-xl"
            >
              <!-- Cabecera del ejercicio (siempre visible) - Mejorada para móvil -->  
              <div 
                class="p-4 flex items-center justify-between bg-white"
                :class="[ 
                  { 'bg-emerald-50 border-b border-emerald-200': selectedExercise === ex.ejercicio_id },
                  ex.isSuperset ? 'border-l-4 border-l-red-400' : ''
                ]"
                @click="toggleExercise(ex.ejercicio_id)"
              >
                <div class="flex items-center gap-3">
                  <!-- Icono o número del ejercicio - Mejorado para móvil -->
                  <div class="relative">
                    <div 
                      class="w-12 h-12 rounded-lg flex items-center justify-center font-semibold text-base shadow-sm transition-colors"
                      :class="selectedExercise === ex.ejercicio_id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'"
                    >
                      {{ index + 1 }}
                    </div>
                    <!-- Badge de superserie - Mejorado para móvil -->
                    <div v-if="ex.isSuperset" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm border border-white">
                      <span class="text-white text-[9px] font-bold">S</span>
                    </div>
                  </div>
                  
                  <!-- Información del ejercicio - Mejorada para móvil -->
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-semibold text-gray-900">{{ ex.name_es || ex.ejercicioNombre || ex.ejercicioInfo?.name_es || ex.ejercicioInfo?.name || ex.name || 'Ejercicio' }}</h3>
                      <span v-if="ex.isSuperset" class="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium border border-red-100">Superserie</span>
                    </div>
                    <div class="flex items-center gap-1.5 mt-1">
                      <span class="text-xs font-medium text-gray-500">{{ ex.series.length }} series</span>
                      <span class="text-xs text-gray-400">•</span>
                      <span class="text-xs font-medium text-gray-500">{{ ex.totalVolumen }} kg</span>
                      <!-- Información del paired exercise -->
                      <span v-if="ex.pairedExerciseName" class="text-xs text-gray-400">•</span>
                      <span v-if="ex.pairedExerciseName" class="text-xs font-medium text-gray-500">Con: {{ ex.pairedExerciseName }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <div class="text-right mr-1">
                    <div class="text-sm font-bold text-gray-900">{{ getMaxWeight(ex) }} kg</div>
                    <div v-if="getWeightProgress(ex) !== 0" 
                         class="text-xs px-2 py-0.5 rounded-full mt-1 flex items-center justify-center" 
                         :class="getWeightProgress(ex) > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'">
                      {{ getWeightProgress(ex) > 0 ? '↑' : '↓' }} {{ Math.abs(getWeightProgress(ex)) }}
                    </div>
                  </div>
                  <ChevronDown 
                    class="w-6 h-6 text-gray-400 transition-transform duration-200" 
                    :class="{'transform rotate-180': selectedExercise === ex.ejercicio_id}"
                  />
                </div>
              </div>
              
              <!-- Contenido desplegable - Mejorado para móvil -->  
              <div v-if="selectedExercise === ex.ejercicio_id" class="p-4 bg-gray-50 border-t border-gray-100">
                <!-- Tabla de series - Mejorada para móvil -->  
                <div class="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 shadow-sm">
                  <div class="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                    <h4 class="text-sm font-semibold text-emerald-800">Detalle de series</h4>
                  </div>
                  <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Serie</th>
                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Peso</th>
                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Reps</th>
                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">1RM</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="(set, sidx) in ex.series" :key="sidx" class="hover:bg-gray-50 active:bg-gray-100">
                        <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ sidx + 1 }}</td>
                        <td class="px-4 py-3 text-sm text-gray-700">
                          <span class="font-mono font-medium">{{ set.peso }}</span>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-700">
                          <span class="font-mono font-medium">{{ set.repeticiones }}</span>
                        </td>
                        <td class="px-4 py-3 text-sm font-medium" :class="getOneRMColor(set)">
                          <span class="font-mono">{{ calculateOneRM(set.peso, set.repeticiones) }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Gráfico de progreso (con avg, min, max, 1RM) - Mejorado para móvil -->
                <div v-if="hasHistoricalData(ex)" class="mt-4">
                  <div class="px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg shadow-sm mb-3">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-semibold text-blue-800 flex items-center">
                        <Activity class="w-4 h-4 mr-1.5 text-blue-600" />
                        Progreso de Peso
                      </h4>
                      <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{{ getHistoricalLogs(ex).length }} registros</span>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <!-- Gráfica: pasamos logs con (avg, min, max, 1RM) -->
                    <ExerciseProgressChart
                      :logs="getHistoricalLogs(ex)"
                      :exerciseName="ex.name_es || 'Ejercicio'"
                      @mounted="console.log('Nombre enviado a gráfica:', ex.ejercicioNombre, ex.ejercicioInfo?.name_es, ex.ejercicioInfo?.name, ex.name_es, ex.name)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Botón flotante de acción principal - Mejorado para móvil -->  
      <div class="fixed bottom-6 right-4 left-4 z-30 flex justify-center">
        <router-link 
          :to="{ name: 'training' }" 
          class="bg-emerald-600 text-white py-3.5 px-6 rounded-full font-medium text-sm shadow-lg flex items-center justify-center gap-2 w-full max-w-xs transform transition-transform active:scale-98 hover:bg-emerald-700"
        >
          <Plus class="w-5 h-5" />
          Nuevo entrenamiento
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExerciseProgressChart from '@/components/exercises/ExerciseProgressChart.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useTrainingStore } from '@/stores/training';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';

// Import de iconos
import { 
  ArrowLeft, 
  Share2, 
  Printer, 
  Clock, 
  Activity, 
  StickyNote,
  ClipboardCheck,
  Trophy,
  Weight,
  ChevronDown,
  Plus
} from 'lucide-vue-next';

// Icono de mancuerna personalizado
import { h } from 'vue';
const Dumbbell = {
  name: 'Dumbbell',
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

const route = useRoute();
const workoutLogsStore = useWorkoutLogsStore();
const trainingStore = useTrainingStore();
const exerciseLibraryStore = useExerciseLibraryStore();
const routineData = ref<any>(null);
const previousWorkouts = ref<any[]>([]);
const activeTab = ref('summary');
const selectedExercise = ref('');

// Cálculos
const totalVolume = computed(() => {
  if (!routineData.value) return 0;
  let volume = 0;
  routineData.value.exercises.forEach((exercise: any) => {
    exercise.series.forEach((set: any) => {
      volume += set.peso * set.repeticiones;
    });
  });
  return volume;
});

const totalSets = computed(() => {
  if (!routineData.value) return 0;
  let sets = 0;
  routineData.value.exercises.forEach((exercise: any) => {
    sets += exercise.series.length;
  });
  return sets;
});

const averageOneRM = computed(() => {
  if (!routineData.value || !routineData.value.exercises.length) return 0;
  const maxOneRMs = routineData.value.exercises.map((ex: any) => {
    if (!ex.series || !ex.series.length) return 0;
    const oneRMs = ex.series.map((set: any) => {
      if (!set.peso || !set.repeticiones) return 0;
      return parseInt(calculateOneRM(set.peso, set.repeticiones)) || 0;
    });
    return Math.max(...oneRMs);
  }).filter((val: number) => val > 0);

  if (!maxOneRMs.length) return 0;
  const sum = maxOneRMs.reduce((a: number, b: number) => a + b, 0);
  return Math.round(sum / maxOneRMs.length);
});

// Funciones helper
function getMaxWeight(exercise: any): number {
  if (!exercise.series || !exercise.series.length) return 0;
  return Math.max(...exercise.series.map((s: any) => s.peso));
}

function hasHistoricalData(exercise: any): boolean {
  return previousWorkouts.value.some(workout => 
    workout.ejercicios.some((ex: any) => ex.ejercicio_id === exercise.ejercicio_id)
  );
}

function getWeightProgress(exercise: any): number {
  if (!exercise || !previousWorkouts.value.length) return 0;
  const prevWorkoutsWithEx = previousWorkouts.value
    .filter(w => w.id !== route.params.id)
    .filter(w => w.ejercicios.some((e: any) => e.ejercicio_id === exercise.ejercicio_id))
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  
  if (!prevWorkoutsWithEx.length) return 0;
  const lastWorkout = prevWorkoutsWithEx[0];
  const lastEx = lastWorkout.ejercicios.find((e: any) => e.ejercicio_id === exercise.ejercicio_id);
  if (!lastEx || !lastEx.sets?.length) return 0;
  
  const currentMax = getMaxWeight(exercise);
  const previousMax = Math.max(...lastEx.sets.map((s: any) => s.peso));
  return currentMax - previousMax;
}

// 1RM
function calculateOneRM(weight: number, reps: number): string {
  if (!weight || !reps || reps <= 0) return '-';
  const oneRM = weight * (1 + (reps / 32));
  return Math.round(oneRM).toString();
}

function getOneRMColor(set: any): string {
  if (!set.peso || !set.repeticiones) return 'text-gray-400';
  const oneRM = parseInt(calculateOneRM(set.peso, set.repeticiones));
  const ratio = oneRM / set.peso;
  if (ratio >= 1.3) return 'text-emerald-600';
  if (ratio >= 1.15) return 'text-amber-600';
  return 'text-gray-700';
}

// Acordeón
function toggleExercise(exerciseId: string) {
  if (selectedExercise.value === exerciseId) {
    selectedExercise.value = '';
  } else {
    selectedExercise.value = exerciseId;
  }
}

// Historial
function getHistoricalLogs(exercise: any) {
  const logs: {
    fecha: string;
    average: number;
    min: number;
    max: number;
    oneRM: number;
  }[] = [];

  previousWorkouts.value.forEach(workout => {
    const exLog = workout.ejercicios.find((e: any) => e.ejercicio_id === exercise.ejercicio_id);
    if (exLog && exLog.sets && exLog.sets.length) {
      const weights = exLog.sets.map((s: any) => s.peso);
      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);
      const avgWeight = weights.reduce((a: number, b: number) => a + b, 0) / weights.length;
      
      let maxOneRM = 0;
      exLog.sets.forEach((s: any) => {
        const oneRMVal = parseInt(calculateOneRM(s.peso, s.repeticiones));
        if (oneRMVal > maxOneRM) maxOneRM = oneRMVal;
      });

      logs.push({
        fecha: workout.fecha,
        average: avgWeight,
        min: minWeight,
        max: maxWeight,
        oneRM: maxOneRM
      });
    }
  });

  // Ejercicio actual
  if (exercise.series && exercise.series.length) {
    const weights = exercise.series.map((s: any) => s.peso);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const avgWeight = weights.reduce((a: number, b: number) => a + b, 0) / weights.length;
    let maxOneRM = 0;
    exercise.series.forEach((s: any) => {
      const oneRMVal = parseInt(calculateOneRM(s.peso, s.repeticiones));
      if (oneRMVal > maxOneRM) maxOneRM = oneRMVal;
    });
    logs.push({
      fecha: routineData.value.rawDate,
      average: avgWeight,
      min: minWeight,
      max: maxWeight,
      oneRM: maxOneRM
    });
  }
  
  logs.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  return logs;
}

// onMounted
onMounted(async () => {
  exerciseLibraryStore.fetchExerciseLibrary();
  if (!workoutLogsStore.workouts.length) {
    await workoutLogsStore.getWorkouts();
  }
  if (!trainingStore.mesociclos.length) {
    await trainingStore.fetchMesociclos();
  }
  
  const workoutId = route.params.id as string;
  const workout = workoutLogsStore.workouts.find(w => w.id === workoutId);

  if (!workout) {
    console.error('No se encontró el entrenamiento con ID:', workoutId);
    return;
  }

  // Filtrar entrenos previos
  previousWorkouts.value = workoutLogsStore.workouts.filter(w => w.id !== workoutId);

  // Buscar rutina y mesociclo
  let rutina = null;
  let mesociclo = null;
  if (trainingStore.mesociclos) {
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
  }

  // Agrupar IDs de superseries
  const supersetGroups: Record<string, string[]> = {};
  if (rutina && rutina.ejercicios) {
    rutina.ejercicios.forEach(ej => {
      if (ej.advanced_mode === 'superset' && ej.superset_group_id) {
        if (!supersetGroups[ej.superset_group_id]) {
          supersetGroups[ej.superset_group_id] = [];
        }
        supersetGroups[ej.superset_group_id].push(String(ej.id));
      }
    });
  }

  // Mapear ejercicios con nombres desde exerciseLibraryStore
  const exerciseDict: Record<string, string> = {};
  if (Array.isArray(exerciseLibraryStore.exercises)) {
    exerciseLibraryStore.exercises.forEach(e => {
      if (e.uuid) exerciseDict[e.uuid] = e.name_es || e.name_en || 'Ejercicio';
      if (e.id && e.id !== e.uuid) exerciseDict[e.id] = e.name_es || e.name_en || 'Ejercicio';
    });
  }

  const ejercicios = (workout.ejercicios || []).map(ex => {
    let nombre = 'Ejercicio';

    // 1) buscar dentro de la rutina si existe
    if (rutina?.ejercicios?.length) {
      const ej = rutina.ejercicios.find((e) => e.id === ex.ejercicio_id);
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

    const series = (ex.sets || []).map((s: any) => ({
      peso: s.peso,
      repeticiones: s.repeticiones,
      descanso: s.descanso || '',
      volumen: s.peso * s.repeticiones,
      completed: s.completed || true
    }));
    
    return {
      ...ex,
      ejercicioNombre: nombre,
      series,
      totalVolumen: series.reduce((acc: number, ss: any) => acc + ss.volumen, 0),
      pesoMaximo: Math.max(...series.map((ss: any) => ss.peso), 0),
      isSuperset: supersetGroups[ex.ejercicio_id] ? true : false,
      pairedExerciseName: supersetGroups[ex.ejercicio_id] ? rutina.ejercicios.find(ej => ej.id !== ex.ejercicio_id && ej.superset_group_id === ex.superset_group_id)?.name_es : null
    };
  });

  const formattedDate = new Date(workout.fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  routineData.value = {
    id: workout.id,
    rutinaId: workout.rutina_id,
    rutinaName: rutina ? rutina.name : 'Entrenamiento',
    mesocicloName: mesociclo ? mesociclo.name : '',
    date: formattedDate,
    rawDate: workout.fecha,
    duracion: workout.duracion || '',
    comentario: workout.notas || '',
    exercises: ejercicios,
    totalEjercicios: ejercicios.length
  };

  console.log('Datos de rutina cargados:', routineData.value);
});
</script>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Estilos para botones */
.btn-primary {
  @apply bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors;
}
.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm transition-colors;
}

/* Estilos para cards */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100;
}

/* Animaciones */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
