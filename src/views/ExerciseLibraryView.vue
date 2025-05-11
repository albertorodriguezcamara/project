<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-emerald-600 to-emerald-800 -mx-4 px-6 py-12 md:rounded-3xl md:mx-0 text-white shadow-xl transition-all duration-300">
      <div class="max-w-xl">
        <h1 class="text-3xl font-bold mb-3">Biblioteca de Ejercicios</h1>
        <p class="text-lg text-emerald-100">{{ filteredExercises.length }} ejercicios disponibles</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card p-6 shadow-md rounded-2xl">
      <div class="flex flex-col md:flex-row gap-5 mb-8">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar ejercicios..."
            class="w-full py-3 px-12 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        <!-- Filter Toggles -->
        <div class="flex gap-3">
          <button
            @click="showMuscleFilter = !showMuscleFilter"
            class="flex items-center justify-center px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all text-base"
          >
            <Filter class="w-5 h-5 mr-2" />
            Músculos
            <span v-if="selectedMuscles.length" class="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
              {{ selectedMuscles.length }}
            </span>
          </button>

          <button
            @click="showEquipmentFilter = !showEquipmentFilter"
            class="flex items-center justify-center px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all text-base"
          >
            <Dumbbell class="w-5 h-5 mr-2" />
            Equipamiento
            <span v-if="selectedEquipment" class="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
              1
            </span>
          </button>
        </div>
      </div>

      <!-- Muscle Groups Filter -->
      <div v-if="showMuscleFilter" class="mb-8 animate-scale-in bg-gray-50 p-5 rounded-xl border border-gray-100">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Grupos Musculares</h3>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="muscle in muscleGroups"
            :key="muscle"
            @click="toggleMuscleFilter(muscle)"
            class="px-4 py-2 rounded-xl text-base font-medium transition-colors"
            :class="[
              selectedMuscles.includes(muscle)
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ muscle }}
          </button>
        </div>
      </div>

      <!-- Equipment Filter -->
      <div v-if="showEquipmentFilter" class="mb-8 animate-scale-in bg-gray-50 p-5 rounded-xl border border-gray-100">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Equipamiento</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="equipment in equipmentTypes"
            :key="equipment"
            @click="toggleEquipmentFilter(equipment)"
            class="px-5 py-3 rounded-xl text-base font-medium text-left transition-colors flex items-center shadow-sm"
            :class="[
              selectedEquipment === equipment
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            ]"
          >
            <span class="flex-1">{{ translateEquipment(equipment) }}</span>
            <Check v-if="selectedEquipment === equipment" class="w-5 h-5 text-emerald-600" />
          </button>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
        <div class="flex flex-wrap gap-3 mb-3 md:mb-0">
          <span
            v-for="muscle in selectedMuscles"
            :key="muscle"
            class="inline-flex items-center px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-base font-medium border border-emerald-100"
          >
            {{ muscle }}
            <button
              @click="toggleMuscleFilter(muscle)"
              class="ml-2 text-emerald-500 hover:text-emerald-700 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </span>

          <span
            v-if="selectedEquipment"
            class="inline-flex items-center px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-base font-medium border border-emerald-100"
          >
            {{ translateEquipment(selectedEquipment) }}
            <button
              @click="toggleEquipmentFilter(selectedEquipment)"
              class="ml-2 text-emerald-500 hover:text-emerald-700 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </span>
        </div>

        <button
          @click="clearFilters"
          class="text-base font-medium text-gray-600 hover:text-gray-800 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Exercise Grid -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <LoadingSpinner size="large" class="w-16 h-16 text-emerald-600" />
    </div>

    <div v-else-if="filteredExercises.length === 0" class="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 shadow-md">
      <p class="text-gray-700 text-lg mb-4">No se encontraron ejercicios que coincidan con los filtros.</p>
      <button @click="clearFilters" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-base font-medium transition-colors">
        Limpiar filtros
      </button>
    </div>

    <div v-else class="space-y-3 md:space-y-4 px-1 sm:px-2">
      <div
        v-for="exercise in lazyLoadedExercises"
        :key="exercise.id"
        class="flex items-center p-3 bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
        @click="showExerciseDetails(exercise)"
      >
        <!-- Exercise Image -->
        <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
          <template v-if="exercise.gif_url_supabase">
            <div class="relative group w-full h-full">
              <img
                :src="exercise.gif_url_supabase"
                :alt="exercise.name_es || exercise.name_english || 'GIF ejercicio'"
                class="w-full h-full object-cover rounded-lg"
                draggable="false"
              />
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition duration-200 cursor-pointer select-none"
                style="pointer-events: none;"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#fff" fill-opacity="0.7"/>
                  <polygon points="16,13 28,20 16,27" fill="#222"/>
                </svg>
              </div>
            </div>
          </template>
          <template v-else-if="getExerciseMediaUrl(exercise, 'image') || getExerciseMediaUrl(exercise, 'auto')">
            <img
              :src="getExerciseMediaUrl(exercise, 'image') || getExerciseMediaUrl(exercise, 'auto')"
              :alt="exercise.name_es || exercise.name || 'Imagen ejercicio'"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </template>
          <div v-else class="flex flex-col items-center justify-center h-full w-full bg-gray-50">
            <Dumbbell class="w-8 h-8 text-emerald-300 mb-1" />
            <span class="text-gray-500 text-xs font-medium">Sin imagen</span>
            <!-- <pre style="font-size:8px;max-width:100%;overflow-x:auto;background:#f3f3f3;color:#333;margin-top:2px;padding:1px 2px;">
              {{ JSON.stringify({
                gif_url_supabase: exercise.gif_url_supabase,
                gifUrl: exercise.gifUrl,
                gifurl: exercise.gifurl,
                supabasegifurl: exercise.supabasegifurl,
                imageurl: exercise.imageurl,
                supabaseimageurl: exercise.supabaseimageurl,
                name: exercise.name,
                name_es: exercise.name_es
              }, null, 2) }}
            </pre> -->
          </div>
        </div>

        <!-- Exercise Info -->
        <div class="flex-grow min-w-0">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-bold text-gray-900 text-base truncate">{{ capitalize(exercise.name_es || exercise.name || exercise.name_english) }}</h3>
          </div>

          <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
            <!-- Main Muscle Tag -->
            <span
              class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium border border-blue-100"
            >
              {{ capitalize(exercise.target_es) || 'Músculo' }}
            </span>
            <!-- Equipment Tag -->
            <span
              class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium border border-gray-200"
            >
              {{ translateEquipment(exercise.equipment_es) || 'Sin equipamiento' }}
            </span>
            <!-- Other Primary Muscles Tags -->
            <span
              v-for="muscle in (exercise.primaryMuscles || []).filter(m => m.toLowerCase() !== (exercise.target_es || '').toLowerCase())"
              :key="muscle"
              class="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium border border-emerald-100"
            >
              {{ capitalize(muscle) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Exercise Detail Modal -->
    <div
      v-if="selectedExercise"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      @click.self="closeExerciseDetails"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-scale-in">
        <!-- Header -->
        <div class="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 flex justify-between items-center shadow-md">
          <div class="flex items-center">
            <div class="bg-white text-emerald-700 p-3 rounded-xl mr-4 shadow-md">
              <Dumbbell class="w-7 h-7" />
            </div>
            <h2 class="text-2xl font-bold text-white">{{ capitalize(selectedExercise.name_es) || selectedExercise.name || 'Ejercicio' }}</h2>
          </div>
          <button @click="closeExerciseDetails" class="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all" aria-label="Cerrar">
            <X class="w-7 h-7 text-white" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div>
              <div class="rounded-xl overflow-hidden relative h-64 shadow-md border border-gray-100/50 mb-6">
                <template v-if="selectedExercise.gif_url_supabase">
                  <img
                    :src="selectedExercise.gif_url_supabase"
                    :alt="selectedExercise.name_es || selectedExercise.name_english || 'GIF ejercicio'"
                    class="w-full h-full object-cover"
                  />
                </template>
                <template v-else-if="getExerciseMediaUrl(selectedExercise, 'image') || getExerciseMediaUrl(selectedExercise, 'auto')">
                  <img
                    :src="getExerciseMediaUrl(selectedExercise, 'image') || getExerciseMediaUrl(selectedExercise, 'auto')"
                    :alt="selectedExercise.name_es || selectedExercise.name_english || 'Imagen ejercicio'"
                    class="w-full h-full object-cover"
                  />
                </template>
                <template v-else>
                  <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Dumbbell class="w-12 h-12 text-gray-400" />
                  </div>
                </template>
                <!-- Overlay gradiente en la parte inferior -->
                <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>

              <!-- Grupos musculares y equipo -->
              <div class="flex flex-wrap gap-2 mb-5">
                <span class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 font-medium">
                  {{ selectedExercise.bodyPart_es || 'Grupo muscular no disponible' }}
                </span>
                <span class="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 font-medium">
                  Principal: {{ selectedExercise.target_es || 'No disponible' }}
                </span>
                <span class="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-100 font-medium">
                  Secundarios: {{ selectedExercise.secondaryMuscles_es || 'No disponible' }}
                </span>
                <span class="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100 font-medium flex items-center">
                  <Dumbbell class="inline w-4 h-4 mr-1 text-purple-400" />
                  Equipo: {{ selectedExercise.equipment_es || 'No disponible' }}
                </span>
              </div>
                <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-100/80 shadow-md mt-4">
                  <h3 class="font-semibold text-blue-900 mb-3 flex items-center text-base">
                    <span class="mr-2">📋</span>
                    Instrucciones
                  </h3>
                  <ul class="list-decimal list-inside text-gray-800 text-[15px] leading-relaxed pl-2 space-y-1">
                    <li v-if="selectedExercise.instructions_es" v-for="(step, idx) in selectedExercise.instructions_es.split('\n')" :key="idx">
                      <span class="font-medium">Paso {{ idx + 1 }}:</span> <span class="font-normal">{{ step }}</span>
                    </li>
                    <li v-else class="text-gray-400 italic">No disponible</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div>
              <!-- Progress Chart -->
              <ExerciseProgressChart 
                :logs="exerciseLogsForSelected" 
                v-if="!logsLoading" 
              />
              <LoadingSpinner v-else size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">

function capitalize(str?: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
import GifThumbnail from '@/components/common/GifThumbnail.vue';
import { renderGifThumbnail } from '@/utils/renderGifThumbnail';
import { ref, computed, onMounted } from 'vue';
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Dumbbell 
} from 'lucide-vue-next';
import { supabase } from '@/lib/supabaseClient';
import ExerciseProgressChart from '@/components/exercises/ExerciseProgressChart.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// State
const searchQuery = ref('');
const selectedMuscles = ref<string[]>([]);
const selectedEquipment = ref('');
const selectedExercise = ref<any>(null);
const showMuscleFilter = ref(false);
const showEquipmentFilter = ref(false);
const exercises = ref<any[]>([]);
const isLoading = ref(false);
const errorMsg = ref('');
const exerciseLogsForSelected = ref<Array<{fecha: string, peso: number, repeticiones: number}>>([]);
const logsLoading = ref(false);

// Muscle Groups Mapping
const MUSCLE_GROUP_MAP = {
  espalda: ['espalda', 'dorsal', 'lats', 'latissimus dorsi', 'zona lumbar', 'espalda baja', 'espalda alta', 'deltoides posteriores', 'romboides', 'trapecio', 'traps'],
  hombros: ['hombros', 'deltoides', 'deltoides posteriores', 'manguito rotador'],
  pecho: ['pecho', 'pectoral', 'parte superior del pecho'],
  gluteos: ['glúteos', 'gluteos'],
  piernas: ['piernas', 'isquiotibiales', 'pantorrillas', 'tobillos', 'pies', 'aductores', 'abductores', 'flexores de cadera', 'ingle'],
  cuadriceps: ['cuádriceps', 'quadriceps', 'quads'],
  biceps: ['bíceps', 'biceps', 'braquial'],
  triceps: ['tríceps', 'triceps'],
  abdominales: ['abdominales', 'core', 'abdomen', 'abdominales inferiores'],
  antebrazos: ['forearms', 'wrist flexors', 'wrist extensors', 'wrists'],
};

const muscleGroups = computed(() => {
  // Mostrar todos los músculos principales únicos (target_es) de los ejercicios filtrados
  const present = new Set<string>();
  filteredExercises.value.forEach(e => {
    if (e.target_es && e.target_es.trim()) present.add(e.target_es.trim());
  });
  return Array.from(present).sort((a, b) => a.localeCompare(b, 'es'));
});

// Equipment Translations
const EQUIPMENT_TRANSLATIONS = {
  'assisted': 'asistido',
  'band': 'banda',
  'barbell': 'barra',
  'body weight': 'peso corporal',
  'cable': 'polea',
  'dumbbell': 'mancuerna',
  'ez barbell': 'barra EZ',
  'leverage machine': 'máquina de palanca',
  'medicine ball': 'balón medicinal',
};

const equipmentTypes = computed(() => {
  if (!Array.isArray(filteredExercises.value)) return [];
  // Solo mostrar equipamiento disponible en los ejercicios filtrados
  return [...new Set(filteredExercises.value.map(e => e.equipment_es))].filter(Boolean).sort();
});

// Computed
const hasActiveFilters = computed(() => {
  return selectedMuscles.value.length > 0 || selectedEquipment.value !== '';
});

const filteredExercises = computed(() => {
  let filtered = exercises.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(exercise =>
      (exercise.name_es || '').toLowerCase().includes(query) ||
      (exercise.instructions_es || '').toLowerCase().includes(query)
    );
  }

  if (selectedMuscles.value.length > 0) {
    filtered = filtered.filter(exercise => {
      // Filtrar solo por target_es (músculo principal)
      const principal = (exercise.target_es || '').toLowerCase().trim();
      return selectedMuscles.value.some(selected => principal === selected.toLowerCase().trim());
    });
  }

  if (selectedEquipment.value) {
    filtered = filtered.filter(exercise => {
      return exercise.equipment_es === selectedEquipment.value;
    });
  }

  return filtered;
});

// Lazy Loading
const pageSize = 30;
const currentPage = ref(1);
const lazyLoadedExercises = computed(() => 
  filteredExercises.value.slice(0, currentPage.value * pageSize)
);

// Methods
function translateEquipment(equipment: string) {
  return EQUIPMENT_TRANSLATIONS[equipment] || equipment;
}

function toggleMuscleFilter(muscle: string) {
  const index = selectedMuscles.value.indexOf(muscle);
  if (index === -1) selectedMuscles.value.push(muscle);
  else selectedMuscles.value.splice(index, 1);
}

function toggleEquipmentFilter(equipment: string) {
  selectedEquipment.value = selectedEquipment.value === equipment ? '' : equipment;
}

function clearFilters() {
  searchQuery.value = '';
  selectedMuscles.value = [];
  selectedEquipment.value = '';
  showMuscleFilter.value = false;
  showEquipmentFilter.value = false;
}

async function loadExercisesFromSupabase() {
  isLoading.value = true;
  errorMsg.value = '';
  
  const { data, error } = await supabase.from('exercises').select('*');
  
  if (error) {
    errorMsg.value = 'Error leyendo los ejercicios de la base de datos.';
    exercises.value = [];
  } else {
    console.log('Ejercicios recibidos de Supabase:', data ? data.length : 0);
    const mapped = (data || []).map(e => ({
      ...e,
      id: e.id || e.uuid || e.ejercicio_id || e.exercise_uuid || '',
      exercise_id: e.exercise_id || e.ejercicio_id || e.id || '',
      name_es: e.name_es || '',
      name_english: e.name_english || e.nameEnglish || '',
      description: e.description || e.descripcion || '',
      muscle: e.muscle || e.musculo || '',
      secondaryMuscles: e.secondaryMuscles || e.secondarymuscles || e.musculos_secundarios || [],
      equipment: e.equipment || e.equipo || '',
      bodyPart: e.bodyPart || e.bodypart || e.categoria || '',
      gifUrl: e.gifUrl || e.gifurl || '',
    }));
    console.log('Ejercicios tras el mapeo:', mapped.length);
    exercises.value = mapped;
  }
  
  isLoading.value = false;
}

async function showExerciseDetails(exercise: any) {
  // Asignar directamente el ejercicio recibido, así el popup siempre corresponde al click
  selectedExercise.value = { ...exercise };
  console.log('Detalles del ejercicio seleccionado:', selectedExercise.value);

  // Inicializar valores para logs
  logsLoading.value = true;
  exerciseLogsForSelected.value = []; // Siempre inicializar vacío
  
  try {
    // Primero, intentar obtener solo la estructura de la tabla
    const { error: schemaError } = await supabase
      .from('workout_set_logs')
      .select('*')
      .limit(1);
    
    // Si hay error de esquema, probablemente la tabla no existe o no tenemos acceso
    if (schemaError) {
      console.warn('La tabla workout_set_logs no existe o no es accesible:', schemaError);
      // No hacemos más intentos, simplemente continuamos sin logs
    } else {
      // La tabla existe, podemos intentar obtener logs específicos
      // Consulta directa con ID de rutina si está disponible
      if (exercise.rutina_id) {
        const { data } = await supabase
          .from('workout_set_logs')
          .select('*')
          .eq('rutina_id', exercise.rutina_id)
          .order('created_at', { ascending: true });
        
        if (data && data.length > 0) {
          console.log('Logs encontrados por rutina_id:', data.length);
          mapLogsData(data);
        }
      }
    }
  } catch (e) {
    console.error('Error inesperado al buscar logs:', e);
  } finally {
    logsLoading.value = false;
  }
}

// Función helper para mapear datos de logs con diferentes estructuras posibles
function mapLogsData(data: any[]) {
  if (!data || data.length === 0) return;
  
  // Intentar determinar qué campos contiene el primer registro
  const firstLog = data[0];
  const fields = Object.keys(firstLog);
  
  console.log('Campos disponibles en logs:', fields);
  
  // Mapear datos basados en los campos disponibles
  exerciseLogsForSelected.value = data.map(log => ({
    fecha: tryGetField(log, ['fecha', 'date', 'created_at']),
    peso: tryGetField(log, ['peso', 'weight'], 0),
    repeticiones: tryGetField(log, ['repeticiones', 'reps', 'repeats'], 0)
  }));
}

// Función helper para obtener un campo con varios nombres posibles
function tryGetField(obj: any, fieldNames: string[], defaultValue: any = '') {
  for (const name of fieldNames) {
    if (obj[name] !== undefined) return obj[name];
  }
  return defaultValue;
}


function closeExerciseDetails() {
  selectedExercise.value = null;
}

function getExerciseMediaUrl(exercise: any, type = 'auto') {
  if (!exercise) return '';

  const urls = [
    type === 'video' || type === 'auto' ? exercise.supabasevideourl : null,
    type === 'video' || type === 'auto' ? exercise.videourl : null,
    type === 'image' || type === 'auto' ? exercise.supabaseimageurl : null,
    type === 'image' || type === 'auto' ? exercise.imageurl : null,
    type === 'image' || type === 'auto' ? exercise.supabasegifurl : null,
    type === 'image' || type === 'auto' ? exercise.gifurl : null,
  ];

  return urls.find(url => url && url.startsWith('http')) || '';
}

function handleImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.style.display = 'none';
}

// Infinite Scroll
function handleScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
  if (bottom && lazyLoadedExercises.value.length < filteredExercises.value.length) {
    currentPage.value++;
  }
}

// Lifecycle
onMounted(async () => {
  await loadExercisesFromSupabase();
  window.addEventListener('scroll', handleScroll);
});
</script>