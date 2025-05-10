```vue
<template>
  <div class="space-y-6">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-500 to-blue-700 -mx-4 px-4 py-8 md:rounded-2xl md:mx-0 text-white">
      <div class="max-w-xl">
        <h1 class="text-3xl font-bold mb-2">Biblioteca de Ejercicios</h1>
        <p class="text-blue-100">{{ filteredExercises.length }} ejercicios disponibles</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card">
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar ejercicios..."
            class="input-field pl-10"
          />
        </div>

        <!-- Filter Toggles -->
        <div class="flex gap-2">
          <button
            @click="showMuscleFilter = !showMuscleFilter"
            class="btn-secondary text-sm"
          >
            <Filter class="w-4 h-4 mr-1" />
            Músculos
            <span v-if="selectedMuscles.length" class="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
              {{ selectedMuscles.length }}
            </span>
          </button>

          <button
            @click="showEquipmentFilter = !showEquipmentFilter"
            class="btn-secondary text-sm"
          >
            <Dumbbell class="w-4 h-4 mr-1" />
            Equipamiento
            <span v-if="selectedEquipment" class="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
              1
            </span>
          </button>
        </div>
      </div>

      <!-- Muscle Groups Filter -->
      <div v-if="showMuscleFilter" class="mb-6 animate-scale-in">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Grupos Musculares</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="muscle in muscleGroups"
            :key="muscle"
            @click="toggleMuscleFilter(muscle)"
            class="px-3 py-1.5 rounded-full text-sm transition-colors"
            :class="[
              selectedMuscles.includes(muscle)
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ muscle }}
          </button>
        </div>
      </div>

      <!-- Equipment Filter -->
      <div v-if="showEquipmentFilter" class="mb-6 animate-scale-in">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Equipamiento</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="equipment in equipmentTypes"
            :key="equipment"
            @click="toggleEquipmentFilter(equipment)"
            class="px-4 py-2 rounded-lg text-sm text-left transition-colors flex items-center"
            :class="[
              selectedEquipment === equipment
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <span class="flex-1">{{ translateEquipment(equipment) }}</span>
            <Check v-if="selectedEquipment === equipment" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="flex items-center justify-between">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="muscle in selectedMuscles"
            :key="muscle"
            class="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm"
          >
            {{ muscle }}
            <button
              @click="toggleMuscleFilter(muscle)"
              class="ml-1 text-blue-500 hover:text-blue-700"
            >
              <X class="w-4 h-4" />
            </button>
          </span>

          <span
            v-if="selectedEquipment"
            class="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm"
          >
            {{ translateEquipment(selectedEquipment) }}
            <button
              @click="selectedEquipment = ''"
              class="ml-1 text-blue-500 hover:text-blue-700"
            >
              <X class="w-4 h-4" />
            </button>
          </span>
        </div>

        <button
          @click="clearFilters"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Exercise Grid -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="large" />
    </div>

    <div v-else-if="filteredExercises.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
      <p class="text-gray-600">No se encontraron ejercicios que coincidan con los filtros.</p>
      <button @click="clearFilters" class="mt-2 text-blue-600 hover:text-blue-800">
        Limpiar filtros
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="exercise in lazyLoadedExercises"
        :key="exercise.id"
        class="card hover:scale-[1.02] cursor-pointer"
        @click="showExerciseDetails(exercise)"
      >
        <!-- Exercise Image -->
        <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
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
          <div v-else class="flex flex-col items-center justify-center h-full py-6">
            <Dumbbell class="w-12 h-12 text-gray-400 mb-2" />
            <span class="text-gray-500 text-sm">Sin imagen</span>
            <pre style="font-size:10px;max-width:100%;overflow-x:auto;background:#f3f3f3;color:#333;margin-top:4px;padding:2px 4px;">
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
            </pre>
          </div>
        </div>

        <!-- Exercise Info -->
        <div>
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-gray-900">{{ capitalize(exercise.name_es || exercise.name || exercise.name_english) }}</h3>
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="{
                'bg-green-100 text-green-800': exercise.difficulty_level === 'principiante',
                'bg-yellow-100 text-yellow-800': exercise.difficulty_level === 'intermedio',
                'bg-red-100 text-red-800': exercise.difficulty_level === 'avanzado'
              }"
            >
              {{ exercise.difficulty_level }}
            </span>
          </div>

          <p v-if="exercise.name_english" class="text-sm text-gray-500 mb-3">
            {{ exercise.name_english }}
          </p>

          <div class="flex flex-wrap gap-1">
            <span
              v-for="muscle in [exercise.muscle, ...(exercise.secondaryMuscles || [])]"
              :key="muscle"
              class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
            >
              {{ muscle }}
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
        <div class="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-100 p-5 flex justify-between items-center">
          <div class="flex items-center">
            <div class="bg-blue-600 text-white p-2 rounded-lg mr-3">
              <Dumbbell class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900">{{ capitalize(selectedExercise.name_es) || selectedExercise.name || 'Ejercicio' }}</h2>
          </div>
          <button @click="closeExerciseDetails" class="p-2 rounded-full hover:bg-white/50 active:scale-95 transition-all" aria-label="Cerrar">
            <X class="w-6 h-6 text-gray-500" />
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
```