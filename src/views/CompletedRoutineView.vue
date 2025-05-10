<template>
  <div class="max-w-5xl mx-auto pb-16">
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
      <header class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-3">
            <router-link :to="{ name: 'history' }" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft class="w-5 h-5 text-gray-500" />
            </router-link>
            <div class="truncate">
              <h1 class="text-lg font-bold text-gray-900 truncate">{{ routineData.rutinaName }}</h1>
              <p class="text-xs text-gray-500 truncate">{{ routineData.mesocicloName }} · {{ routineData.date }}</p>
            </div>
          </div>
          <span class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
            Completado
          </span>
        </div>
        
        <!-- Sistema de pestañas -->
        <div class="px-1">
          <nav class="flex overflow-x-auto hide-scrollbar" aria-label="Tabs">
            <button 
              @click="activeTab = 'summary'" 
              class="flex-1 py-3 relative flex flex-col items-center text-xs font-medium whitespace-nowrap"
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
              class="flex-1 py-3 relative flex flex-col items-center text-xs font-medium whitespace-nowrap"
              :class="activeTab === 'exercises' ? 'text-emerald-600' : 'text-gray-500'"
            >
              <div class="flex items-center justify-center mb-1">
                <Dumbbell :class="['w-5 h-5', activeTab === 'exercises' ? 'text-emerald-500' : 'text-gray-400']" />
              </div>
              <span>Ejercicios</span>
              <div class="absolute -bottom-px right-0 left-0 flex justify-center">
                <span v-if="routineData.exercises.length" class="absolute -top-1.5 ml-4 bg-emerald-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
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
      
      <!-- Acciones rápidas flotantes -->
      <div class="fixed bottom-20 right-4 flex flex-col gap-2 z-10">
        <button class="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 border border-gray-200">
          <Share2 class="w-5 h-5" />
        </button>
        <button class="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 border border-gray-200">
          <Printer class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Contenido principal con scroll -->
      <main class="flex-1 overflow-y-auto px-4 pt-3 pb-16">
        <!-- PESTAÑA: RESUMEN -->
        <div v-if="activeTab === 'summary'" class="space-y-5">
          <!-- Estadísticas del entrenamiento -->
          <div class="grid grid-cols-2 gap-3">
            <div class="card p-3 flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Clock class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Duración</p>
                <p class="text-lg font-bold text-gray-900">{{ routineData.duracion || 'N/A' }} min</p>
              </div>
            </div>
            
            <div class="card p-3 flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Weight class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Volumen</p>
                <p class="text-lg font-bold text-gray-900">{{ totalVolume }} kg</p>
              </div>
            </div>
            
            <div class="card p-3 flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <Activity class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Series</p>
                <p class="text-lg font-bold text-gray-900">{{ totalSets }}</p>
              </div>
            </div>
            
            <div class="card p-3 flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Trophy class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs text-gray-500">1RM Est.</p>
                <p class="text-lg font-bold text-gray-900">{{ averageOneRM }} kg</p>
              </div>
            </div>
          </div>
          
          <!-- Notas del entrenamiento -->
          <div v-if="routineData.comentario && routineData.comentario.trim() !== ''" class="card p-4 bg-amber-50/30 border border-amber-100">
            <div class="flex items-start gap-3">
              <div class="p-1.5 bg-amber-100 rounded-full">
                <StickyNote class="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-1">Notas del entrenamiento</h3>
                <p class="text-sm text-gray-700">{{ routineData.comentario }}</p>
              </div>
            </div>
          </div>
          
          <!-- Resumen de ejercicios -->
          <div class="card overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-3 border-b border-emerald-200">
              <h2 class="text-base font-medium text-emerald-800">Resumen de ejercicios</h2>
            </div>
            
            <div class="divide-y divide-gray-100">
              <div 
                v-for="(ex, index) in routineData.exercises" 
                :key="ex.ejercicio_id"
                :class="[
                  'p-3 flex justify-between items-center active:bg-gray-50',
                  ex.isSuperset ? 'border-l-4 border-l-red-400' : ''
                ]"
                @click="activeTab = 'exercises'"
              >
                <div class="flex items-center gap-3">
                  <!-- Icono del ejercicio -->
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center relative">
                    <Dumbbell class="w-5 h-5 text-gray-400" />
                    <!-- Badge de superserie si corresponde -->
                    <div v-if="ex.isSuperset" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-[8px] font-bold">S</span>
                    </div>
                  </div>
                  
                  <!-- Información del ejercicio -->
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <h3 class="font-medium text-gray-900">{{ ex.name_es || ex.ejercicioNombre || ex.ejercicioInfo?.name_es || ex.ejercicioInfo?.name || ex.name || 'Ejercicio' }}</h3>
                      <!-- Etiqueta de superserie si corresponde -->
                      <span v-if="ex.isSuperset" class="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded font-medium">Superserie</span>
                    </div>
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="text-xs text-gray-500">{{ ex.series.length }} series</span>
                      <span class="text-xs text-gray-400">•</span>
                      <span class="text-xs text-gray-500">{{ ex.totalVolumen }} kg</span>
                      <!-- Si tiene pairedExerciseName, mostrar con qué ejercicio forma superserie -->
                      <span v-if="ex.pairedExerciseName" class="text-xs text-gray-400">•</span>
                      <span v-if="ex.pairedExerciseName" class="text-xs text-gray-500">Con: {{ ex.pairedExerciseName }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">{{ getMaxWeight(ex) }} kg</div>
                  <div v-if="getWeightProgress(ex) !== 0" class="text-xs" :class="getWeightProgress(ex) > 0 ? 'text-emerald-600' : 'text-red-600'">
                    {{ getWeightProgress(ex) > 0 ? '↑' : '↓' }} {{ Math.abs(getWeightProgress(ex)) }} kg
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- PESTAÑA: EJERCICIOS -->  
        <div v-if="activeTab === 'exercises'" class="space-y-4">
          <!-- Acordeón de ejercicios -->  
          <div class="space-y-3">
            <div 
              v-for="(ex, index) in routineData.exercises" 
              :key="ex.ejercicio_id" 
              class="card overflow-hidden"
            >
              <!-- Cabecera del ejercicio (siempre visible) -->  
              <div 
                class="p-3 flex items-center justify-between bg-white border-b border-gray-100"
                :class="[ 
                  { 'bg-emerald-50': selectedExercise === ex.ejercicio_id },
                  ex.isSuperset ? 'border-l-4 border-l-red-400' : ''
                ]"
                @click="toggleExercise(ex.ejercicio_id)"
              >
                <div class="flex items-center gap-3">
                  <!-- Icono o número del ejercicio -->
                  <div class="relative">
                    <div 
                      class="w-10 h-10 rounded-lg flex items-center justify-center font-medium text-sm"
                      :class="selectedExercise === ex.ejercicio_id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'"
                    >
                      {{ index + 1 }}
                    </div>
                    <!-- Badge de superserie -->
                    <div v-if="ex.isSuperset" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-[8px] font-bold">S</span>
                    </div>
                  </div>
                  
                  <!-- Información del ejercicio -->
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-medium text-gray-900">{{ ex.name_es || ex.ejercicioNombre || ex.ejercicioInfo?.name_es || ex.ejercicioInfo?.name || ex.name || 'Ejercicio' }}</h3>
                      <span v-if="ex.isSuperset" class="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded font-medium">Superserie</span>
                    </div>
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="text-xs text-gray-500">{{ ex.series.length }} series</span>
                      <span class="text-xs text-gray-400">•</span>
                      <span class="text-xs text-gray-500">{{ ex.totalVolumen }} kg</span>
                      <!-- Información del paired exercise -->
                      <span v-if="ex.pairedExerciseName" class="text-xs text-gray-400">•</span>
                      <span v-if="ex.pairedExerciseName" class="text-xs text-gray-500">Con: {{ ex.pairedExerciseName }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <div class="text-right mr-1">
                    <div class="text-sm font-medium text-gray-900">{{ getMaxWeight(ex) }} kg</div>
                    <div v-if="getWeightProgress(ex) !== 0" class="text-xs" :class="getWeightProgress(ex) > 0 ? 'text-emerald-600' : 'text-red-600'">
                      {{ getWeightProgress(ex) > 0 ? '↑' : '↓' }} {{ Math.abs(getWeightProgress(ex)) }}
                    </div>
                  </div>
                  <ChevronDown 
                    class="w-5 h-5 text-gray-400 transition-transform duration-200" 
                    :class="{'transform rotate-180': selectedExercise === ex.ejercicio_id}"
                  />
                </div>
              </div>
              
              <!-- Contenido desplegable -->  
              <div v-if="selectedExercise === ex.ejercicio_id" class="p-3 bg-gray-50 border-t border-gray-100">
                <!-- Tabla de series -->  
                <div class="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
                  <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Serie</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Peso</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Reps</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">1RM</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="(set, sidx) in ex.series" :key="sidx" class="hover:bg-gray-50">
                        <td class="px-3 py-2 text-sm font-medium text-gray-900">{{ sidx + 1 }}</td>
                        <td class="px-3 py-2 text-sm text-gray-700">
                          <span class="font-mono">{{ set.peso }}</span>
                        </td>
                        <td class="px-3 py-2 text-sm text-gray-700">
                          <span class="font-mono">{{ set.repeticiones }}</span>
                        </td>
                        <td class="px-3 py-2 text-sm font-medium" :class="getOneRMColor(set)">
                          <span class="font-mono">{{ calculateOneRM(set.peso, set.repeticiones) }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Gráfico de progreso (con avg, min, max, 1RM) -->
                <div v-if="hasHistoricalData(ex)" class="mt-3">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-xs font-medium text-gray-700">Progreso de Peso</h4>
                    <span class="text-xs text-gray-500">{{ getHistoricalLogs(ex).length }} registros</span>
                  </div>
                  <div class="bg-white rounded-lg border border-gray-200 p-2">
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
      
      <!-- Botón flotante de acción principal -->  
      <div class="fixed bottom-4 right-4 left-4 z-30 flex justify-center">
        <router-link 
          :to="{ name: 'training' }" 
          class="bg-emerald-600 text-white py-3 px-6 rounded-full font-medium text-sm shadow-lg flex items-center justify-center gap-2 w-full max-w-xs"
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

  // Construir ejercicios con info
  const ejercicios = (workout.ejercicios || []).map(ex => {
    let ejercicioInfo = null;
    // Si no hay name_es, buscar el ejercicio en la rutina por id y usar name_es de la BBDD
    let ejercicioNombre = ex.name_es;
    if (!ejercicioNombre && rutina && rutina.ejercicios) {
      const match = rutina.ejercicios.find(eji => String(eji.id) === String(ex.ejercicio_id));
      if (match && match.name_es) {
        ejercicioNombre = match.name_es;
      }
    }
    if (!ejercicioNombre) ejercicioNombre = 'Ejercicio'; 
    let isSuperset = false;
    let pairedExerciseName = null;

    if (rutina && rutina.ejercicios) {
      // Buscamos un match
      ejercicioInfo = rutina.ejercicios.find(eji => String(eji.id) === String(ex.ejercicio_id));
      // Depuración: mostrar ids y nombres
      console.log('[DEBUG] Buscando ejercicioInfo para:', ex.ejercicio_id, 'en', rutina.ejercicios.map(e => e.id));
      if (ejercicioInfo) {
        // Si el match existe, sobreescribe el nombre por el de la rutina (preferencia name_es)
        ejercicioNombre = ejercicioInfo.name_es 
          ?? ejercicioNombre; 

        console.log('[DEBUG] ejercicioInfo encontrado:', ejercicioInfo);

        if (ejercicioInfo.advanced_mode === 'superset' && ejercicioInfo.superset_group_id) {
          isSuperset = true;
          const groupExercises = supersetGroups[ejercicioInfo.superset_group_id] || [];
          const pairedId = groupExercises.find(id => String(id) !== String(ex.ejercicio_id));
          if (pairedId) {
            const pairedInfo = rutina.ejercicios.find(ejj => String(ejj.id) === pairedId);
            if (pairedInfo) {
              pairedExerciseName = pairedInfo.name_es 
                ?? pairedInfo.name 
                ?? 'Ejercicio';
            }
          }
        }
      } else {
        console.warn('[DEBUG] No se encontró un ejercicioInfo para ejercicio_id:', ex.ejercicio_id, 'Nombre log:', ex.name_es || ex.name);
      }
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
      ejercicioInfo,
      ejercicioNombre,
      series,
      totalVolumen: series.reduce((acc: number, ss: any) => acc + ss.volumen, 0),
      pesoMaximo: Math.max(...series.map((ss: any) => ss.peso), 0),
      isSuperset,
      pairedExerciseName
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
