<template>
  <div class="space-y-12">
    <!-- Hero Section - Athletic American Style -->
    <div class="exercise-library-header -mx-4 px-6 py-12 md:rounded-3xl md:mx-0 shadow-xl transition-all duration-300 relative overflow-hidden">
      <!-- Texturas americanas decorativas -->
      <div class="texture-element stars-texture"></div>
      <div class="texture-element stripes-texture"></div>
      <div class="texture-element dots-texture"></div>
      <div class="texture-element flag-stripes"></div>
      <div class="texture-element shield-icon"></div>
      <div class="texture-element eagle-silhouette"></div>
      
      <div class="max-w-xl relative z-10">
        <div class="exercise-title-banner">
          <h1>BIBLIOTECA DE EJERCICIOS</h1>
        </div>
        <div class="exercise-count-badge">
          <span>{{ filteredExercises.length }} EJERCICIOS DISPONIBLES</span>
        </div>
      </div>
    </div>

    <!-- Search and Filters - Athletic American Style -->
    <div class="exercise-filter-card">
      <!-- Texturas decorativas -->
      <div class="card-texture stars-small"></div>
      <div class="card-texture stripes-diagonal"></div>
      <div class="card-texture dots-pattern"></div>
      
      <div class="flex flex-col md:flex-row gap-5 mb-8">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-navy w-6 h-6" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="BUSCAR EJERCICIOS..."
            class="exercise-search-input"
          />
        </div>

        <!-- Filter Toggles -->
        <div class="flex gap-3">
          <button
            @click="showMuscleFilter = !showMuscleFilter"
            class="exercise-filter-btn muscle-filter-btn"
          >
            <Filter class="w-5 h-5 mr-2" />
            MÚSCULOS
            <span v-if="selectedMuscles.length" class="exercise-filter-badge">
              {{ selectedMuscles.length }}
            </span>
          </button>

          <button
            @click="showEquipmentFilter = !showEquipmentFilter"
            class="exercise-filter-btn equipment-filter-btn"
          >
            <Dumbbell class="w-5 h-5 mr-2" />
            EQUIPAMIENTO
            <span v-if="selectedEquipment" class="exercise-filter-badge">
              1
            </span>
          </button>
        </div>
      </div>

      <!-- Muscle Groups Filter - Athletic American Style -->
      <div v-if="showMuscleFilter" class="exercise-filter-panel animate-scale-in">
        <div class="exercise-filter-header">
          <div class="exercise-filter-title-banner">
            <h3>GRUPOS MUSCULARES</h3>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 mt-4">
          <button
            v-for="muscle in muscleGroups"
            :key="muscle"
            @click="toggleMuscleFilter(muscle)"
            class="exercise-muscle-btn"
            :class="{
              'selected-muscle-btn': selectedMuscles.includes(muscle)
            }"
          >
            {{ muscle }}
          </button>
        </div>
      </div>

      <!-- Equipment Filter - Athletic American Style -->
      <div v-if="showEquipmentFilter" class="exercise-filter-panel animate-scale-in">
        <div class="exercise-filter-header">
          <div class="exercise-filter-title-banner">
            <h3>EQUIPAMIENTO</h3>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <button
            v-for="equipment in equipmentTypes"
            :key="equipment"
            @click="toggleEquipmentFilter(equipment)"
            class="exercise-equipment-btn"
            :class="{
              'selected-equipment-btn': selectedEquipment === equipment
            }"
          >
            <span class="flex-1">{{ translateEquipment(equipment) }}</span>
            <Check v-if="selectedEquipment === equipment" class="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <!-- Active Filters - Athletic American Style -->
      <div v-if="hasActiveFilters" class="exercise-active-filters">
        <div class="flex flex-wrap gap-3 mb-3 md:mb-0">
          <span
            v-for="muscle in selectedMuscles"
            :key="muscle"
            class="exercise-filter-tag filter-muscle-tag"
          >
            {{ muscle }}
            <button @click="toggleMuscleFilter(muscle)" class="exercise-filter-remove-btn">
              <X class="w-4 h-4" />
            </button>
          </span>

          <span
            v-if="selectedEquipment"
            class="exercise-filter-tag filter-equipment-tag"
          >
            {{ translateEquipment(selectedEquipment) }}
            <button @click="toggleEquipmentFilter(selectedEquipment)" class="exercise-filter-remove-btn">
              <X class="w-4 h-4" />
            </button>
          </span>
        </div>

        <button
          @click="clearFilters"
          class="exercise-clear-filters-btn"
        >
          LIMPIAR FILTROS
        </button>
      </div>
    </div>

    <!-- Exercise Grid - Athletic American Style -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <LoadingSpinner size="large" class="w-16 h-16 text-brick-red" />
    </div>

    <div v-else-if="filteredExercises.length === 0" class="exercise-empty-state">
      <div class="exercise-empty-message">
        <p>NO SE ENCONTRARON EJERCICIOS CON LOS FILTROS SELECCIONADOS.</p>
      </div>
      <button @click="clearFilters" class="exercise-action-btn">
        LIMPIAR FILTROS
      </button>
    </div>

    <div v-else class="exercise-grid">
      <div
        v-for="exercise in lazyLoadedExercises"
        :key="exercise.id"
        class="exercise-card"
        @click="showExerciseDetails(exercise)"
      >
        <!-- Texturas decorativas -->
        <div class="card-texture stars-small"></div>
        <div class="card-texture stripes-diagonal"></div>
        <div class="card-texture dots-pattern"></div>
        
        <div class="exercise-card-content">
          <!-- Exercise Image - Athletic American Style -->
          <div class="exercise-image-container">
            <template v-if="exercise.gif_url_supabase">
              <img
                :src="exercise.gif_url_supabase"
                :alt="exercise.name_es || exercise.name || 'Imagen ejercicio'"
                class="exercise-image"
                @error="handleImageError"
              />
            </template>
            <template v-else-if="getExerciseMediaUrl(exercise, 'image') || getExerciseMediaUrl(exercise, 'auto')">
              <img
                :src="getExerciseMediaUrl(exercise, 'image') || getExerciseMediaUrl(exercise, 'auto')"
                :alt="exercise.name_es || exercise.name || 'Imagen ejercicio'"
                class="exercise-image"
                @error="handleImageError"
              />
            </template>
            <div v-else class="exercise-image-placeholder">
              <Dumbbell class="w-8 h-8 text-gold mb-1" />
              <span class="text-navy text-xs font-bold">SIN IMAGEN</span>
            </div>
          </div>

          <!-- Exercise Info - Athletic American Style -->
          <div class="exercise-info">
            <div class="exercise-name-banner">
              <h3 class="exercise-title">{{ exercise.name_es || exercise.name }}</h3>
            </div>
            <div class="exercise-tags">
              <span v-if="exercise.equipment_es" class="exercise-tag equipment-tag">{{ exercise.equipment_es }}</span>
              <span v-if="exercise.target_es" class="exercise-tag muscle-tag">{{ exercise.target_es }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exercise Detail Modal - Athletic American Style -->
    <div
      v-if="selectedExercise"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      @click.self="closeExerciseDetails"
    >
      <div class="modal-container animate-scale-in">
        <!-- Texturas decorativas -->
        <div class="modal-texture stars-texture"></div>
        <div class="modal-texture stripes-texture"></div>
        <div class="modal-texture dots-texture"></div>
        <div class="modal-texture flag-stripes"></div>
        
        <!-- Header - Athletic American Style -->
        <div class="modal-header">
          <div class="modal-title-banner">
            <h2 class="modal-title">{{ capitalize(selectedExercise.name_es) || selectedExercise.name || 'Ejercicio' }}</h2>
          </div>
          <button @click="closeExerciseDetails" class="modal-close-btn" aria-label="Cerrar">
            <X class="w-6 h-6 text-white" />
          </button>
        </div>

        <!-- Body - Athletic American Style -->
        <div class="modal-body">
          <div class="modal-content-grid">
            <!-- Left Column -->
            <div class="modal-left-column">
              <!-- Exercise Image/GIF Container -->
              <div class="modal-exercise-media">
                <template v-if="selectedExercise.gif_url_supabase">
                  <div class="modal-image-container">
                    <img
                      :src="selectedExercise.gif_url_supabase"
                      :alt="selectedExercise.name_es || selectedExercise.name_english || 'GIF ejercicio'"
                      class="modal-exercise-image"
                    />
                  </div>
                </template>
                <template v-else-if="getExerciseMediaUrl(selectedExercise, 'image') || getExerciseMediaUrl(selectedExercise, 'auto')">
                  <div class="modal-image-container">
                    <img
                      :src="getExerciseMediaUrl(selectedExercise, 'image') || getExerciseMediaUrl(selectedExercise, 'auto')"
                      :alt="selectedExercise.name_es || selectedExercise.name_english || 'Imagen ejercicio'"
                      class="modal-exercise-image"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="modal-exercise-placeholder">
                    <Dumbbell class="w-16 h-16 text-gold" />
                    <span class="text-navy font-bold mt-2">SIN IMAGEN</span>
                  </div>
                </template>
              </div>

              <!-- Grupos musculares y equipo -->
              <div class="modal-tags-container">
                <div class="modal-section-title">
                  <h3>DETALLES DEL EJERCICIO</h3>
                </div>
                <div class="modal-tags">
                  <span class="modal-tag modal-tag-bodypart">
                    {{ selectedExercise.bodyPart_es || 'Grupo muscular no disponible' }}
                  </span>
                  <span class="modal-tag modal-tag-target">
                    {{ selectedExercise.target_es || 'Músculo principal no disponible' }}
                  </span>
                  <span class="modal-tag modal-tag-secondary" v-if="selectedExercise.secondaryMuscles_es">
                    {{ selectedExercise.secondaryMuscles_es }}
                  </span>
                  <span class="modal-tag modal-tag-equipment">
                    <Dumbbell class="inline w-4 h-4 mr-1" />
                    {{ selectedExercise.equipment_es || 'Sin equipamiento' }}
                  </span>
                </div>
              </div>

              <!-- Instrucciones -->
              <div class="modal-instructions-container">
                <div class="modal-section-title">
                  <h3>INSTRUCCIONES</h3>
                </div>
                <ul class="modal-instructions-list">
                  <li v-if="selectedExercise.instructions_es" v-for="(step, idx) in selectedExercise.instructions_es.split('\n')" :key="idx" class="modal-instruction-step">
                    <span class="modal-step-number">{{ idx + 1 }}</span>
                    <span class="modal-step-text">{{ step }}</span>
                  </li>
                  <li v-else class="modal-no-instructions">Instrucciones no disponibles</li>
                </ul>
              </div>
            </div>

            <!-- Right Column -->
            <div class="modal-right-column">
              <div class="modal-section-title">
                <h3>TU PROGRESO</h3>
              </div>
              <!-- Progress Chart -->
              <div class="modal-chart-container">
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

<style scoped>
/* Variables de colores */
:root {
  --navy: #1F2D48;
  --brick-red: #A52A2A;
  --gold: #FFD700;
  --pure-white: #FFFFFF;
  --deep-black: #111111;
}

/* Estilos para el encabezado de la biblioteca de ejercicios */
.exercise-library-header {
  background-color: var(--navy);
  color: var(--pure-white);
  position: relative;
  overflow: hidden;
}

/* Texturas decorativas */
.texture-element {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  opacity: 0.05;
}

.stars-texture {
  top: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M50 0l12 38h38l-30 22 12 38-32-23-32 23 12-38-30-22h38z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

.stripes-texture {
  bottom: 20px;
  left: 20px;
  width: 150px;
  height: 150px;
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 10px, transparent 10px, transparent 20px);
}

.dots-texture {
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 15px 15px;
  transform: translate(-50%, -50%);
}

.flag-stripes {
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  background-image: repeating-linear-gradient(90deg, 
    rgba(255, 255, 255, 0.1) 0px, 
    rgba(255, 255, 255, 0.1) 20px, 
    rgba(165, 42, 42, 0.1) 20px, 
    rgba(165, 42, 42, 0.1) 40px);
  opacity: 0.1;
}

.shield-icon {
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.1;
}

.eagle-silhouette {
  top: 20px;
  left: 20px;
  width: 100px;
  height: 100px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='white' d='M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zM256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm13.8 279.9L160 344V168l109.8 16.1 32.2-48.1 32.2 48.1L444 168v176l-109.8-16.1-32.2 48.1-32.2-48.1z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.1;
}

/* Texturas para tarjetas */
.card-texture {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  opacity: 0.05;
}

.stars-small {
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Cpath fill='%23FFD700' d='M25 0l6 19h19l-15 11 6 19-16-12-16 12 6-19-15-11h19z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

.stripes-diagonal {
  bottom: 10px;
  left: 10px;
  width: 75px;
  height: 75px;
  background-image: repeating-linear-gradient(45deg, rgba(31, 45, 72, 0.1) 0, rgba(31, 45, 72, 0.1) 5px, transparent 5px, transparent 10px);
}

.dots-pattern {
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  background-image: radial-gradient(circle, rgba(31, 45, 72, 0.1) 1px, transparent 1px);
  background-size: 10px 10px;
  transform: translate(-50%, -50%);
}

/* Título principal y contador de ejercicios */
.exercise-title-banner {
  background-color: var(--brick-red);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
  margin-bottom: 1rem;
}

.exercise-title-banner h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--pure-white);
  letter-spacing: 1px;
  margin: 0;
  transform: skewX(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Título de cada ejercicio */
.exercise-name-banner {
  background-color: var(--brick-red);
  transform: skew(-5deg);
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.25rem;
  position: relative;
  display: inline-block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  border-left: 4px solid var(--gold);
  border-right: 4px solid var(--navy);
  max-width: 100%;
  z-index: 10;
}

.exercise-title {
  color: var(--pure-white);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transform: skew(5deg);
  margin: 0;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.2;
  max-width: 100%;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.exercise-count-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  border-left: 2px solid var(--gold);
}

.exercise-count-badge span {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--pure-white);
  letter-spacing: 0.5px;
}

/* Tarjeta de filtros */
.exercise-filter-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 2px solid #f3f4f6;
  position: relative;
  overflow: hidden;
}

/* Campo de búsqueda */
.exercise-search-input {
  width: 100%;
  padding: 0.75rem 3rem;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid var(--navy);
  border-radius: 0.5rem;
  background-color: white;
  color: var(--navy);
  transition: all 0.3s ease;
}

.exercise-search-input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

.exercise-search-input::placeholder {
  color: rgba(31, 45, 72, 0.5);
  font-weight: 600;
}

/* Estilos para filtros aplicados */
.exercise-filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-muscle-tag {
  background-color: var(--navy);
  color: var(--pure-white);
  border: 2px solid var(--gold);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-equipment-tag {
  background-color: #2c5282;
  color: var(--pure-white);
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Botones de filtro */
.exercise-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.muscle-filter-btn {
  background-color: var(--navy);
  color: var(--pure-white);
  border: 2px solid var(--gold);
}

.muscle-filter-btn:hover {
  background-color: #2a3a5a;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.equipment-filter-btn {
  background-color: var(--brick-red);
  color: var(--pure-white);
  border: none;
}

.equipment-filter-btn:hover {
  background-color: #8a2222;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.exercise-filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  margin-left: 0.5rem;
  background-color: var(--gold);
  color: var(--navy);
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  border-radius: 1rem;
}

/* Paneles de filtro */
.exercise-filter-panel {
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  position: relative;
}

.exercise-filter-header {
  margin-bottom: 1rem;
}

.exercise-filter-title-banner {
  background-color: var(--navy);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
}

.exercise-filter-title-banner h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: var(--pure-white);
  letter-spacing: 1px;
  margin: 0;
  transform: skewX(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Botones de filtro de músculos */
.exercise-muscle-btn {
  padding: 0.5rem 1rem;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: white;
  color: var(--navy);
  border: 2px solid var(--navy);
}

.exercise-muscle-btn:hover {
  background-color: #f9fafb;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selected-muscle-btn {
  background-color: var(--navy);
  color: var(--pure-white);
  border-left: 3px solid var(--gold);
}

.selected-muscle-btn:hover {
  background-color: #2a3a5a;
}

/* Botones de filtro de equipamiento */
.exercise-equipment-btn {
  padding: 0.75rem 1rem;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: white;
  color: var(--navy);
  border: 2px solid var(--navy);
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
}

.exercise-equipment-btn:hover {
  background-color: #f9fafb;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selected-equipment-btn {
  background-color: var(--brick-red);
  color: var(--pure-white);
  border: none;
}

.selected-equipment-btn:hover {
  background-color: #8a2222;
}

/* Filtros activos */
.exercise-active-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: rgba(31, 45, 72, 0.05);
  border-radius: 0.75rem;
  border: 1px solid rgba(31, 45, 72, 0.1);
}

@media (min-width: 768px) {
  .exercise-active-filters {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.exercise-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.5rem;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 0.35rem;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.body-part-tag {
  background-color: var(--navy);
  color: var(--pure-white);
  border-left: 2px solid var(--gold);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.equipment-tag {
  background-color: #2c5282; /* Azul más oscuro que no compita con el título */
  color: var(--pure-white);
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.muscle-tag {
  background-color: var(--navy);
  color: var(--pure-white);
  border: 1px solid var(--gold);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

.exercise-filter-remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  padding: 0.25rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--pure-white);
  transition: all 0.3s ease;
  cursor: pointer;
}

.exercise-filter-remove-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.exercise-clear-filters-btn {
  padding: 0.5rem 1rem;
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: white;
  color: var(--navy);
  border: 2px solid var(--navy);
  transform: skewX(-5deg);
}

.exercise-clear-filters-btn:hover {
  background-color: #f9fafb;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estado vacío */
.exercise-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 2px solid #f3f4f6;
  text-align: center;
}

.exercise-empty-message {
  margin-bottom: 1.5rem;
}

.exercise-empty-message p {
  font-family: 'Oswald', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: 0.5px;
}

.exercise-action-btn {
  padding: 0.75rem 1.5rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: var(--brick-red);
  color: var(--pure-white);
  border: none;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.exercise-action-btn:hover {
  background-color: #8a2222;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Cuadrícula de ejercicios */
.exercise-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  padding: 0.25rem;
}

@media (min-width: 640px) {
  .exercise-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    padding: 0.5rem;
  }
}

@media (min-width: 1024px) {
  .exercise-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tarjeta de ejercicio */
.exercise-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: 
    linear-gradient(45deg, rgba(255, 215, 0, 0.03) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255, 215, 0, 0.03) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255, 215, 0, 0.03) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255, 215, 0, 0.03) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.exercise-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath fill='rgba(255, 215, 0, 0.1)' d='M0 0l20 20L40 0H0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none;
}

.exercise-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
}

/* Contenedor de tarjeta */
.exercise-card-content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
}

/* Contenedor de imagen */
.exercise-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  aspect-ratio: 1 / 1;
  width: 100px;
  height: 100px;
  min-width: 100px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--navy);
}

@media (min-width: 768px) {
  .exercise-image-container {
    width: 120px;
    height: 120px;
    min-width: 120px;
  }
}

.exercise-image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.exercise-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.exercise-card:hover .exercise-image {
  transform: scale(1.1);
}

.exercise-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #f9fafb;
}

/* Animaciones */
@keyframes scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
/* Estilos para el modal de ejercicios - Athletic American Style */
.modal-container {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 500px;
  height: 90vh;
  position: relative;
  border: 2px solid var(--navy);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--navy) transparent;
}

.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container::-webkit-scrollbar-thumb {
  background-color: var(--navy);
  border-radius: 20px;
  border: 2px solid white;
}

.modal-texture {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  opacity: 0.05;
}

.modal-header {
  background-color: var(--navy);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title-banner {
  background-color: var(--brick-red);
  padding: 0.75rem 1.25rem;
  transform: skew(-5deg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 3px solid var(--gold);
  flex: 1;
  margin-right: 1rem;
}

.modal-title {
  color: var(--pure-white);
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  transform: skew(5deg);
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.modal-close-btn {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-close-btn:active {
  transform: scale(0.95);
}

.modal-body {
  padding: 1.5rem;
  position: relative;
  z-index: 2;
}

.modal-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .modal-container {
    max-width: 700px;
  }
  
  .modal-content-grid {
    grid-template-columns: 1fr;
  }
}

.modal-section-title {
  margin-bottom: 1rem;
  position: relative;
}

.modal-section-title h3 {
  background-color: var(--navy);
  color: var(--pure-white);
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  display: inline-block;
  margin: 0;
  position: relative;
  transform: skew(-5deg);
  border-left: 2px solid var(--gold);
}

.modal-exercise-media {
  margin-bottom: 1.5rem;
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-image-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 2px solid var(--navy);
  border-radius: 0.75rem;
  overflow: hidden;
}

.modal-exercise-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.modal-exercise-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.modal-tags-container {
  margin-bottom: 1.5rem;
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.modal-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  font-family: 'Roboto Condensed', sans-serif;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-tag-bodypart {
  background-color: var(--navy);
  color: var(--pure-white);
  border-left: 2px solid var(--gold);
}

.modal-tag-target {
  background-color: #2c5282;
  color: var(--pure-white);
  border: none;
}

.modal-tag-secondary {
  background-color: var(--gold);
  color: var(--navy);
  border: none;
}

.modal-tag-equipment {
  background-color: var(--brick-red);
  color: var(--pure-white);
  border: none;
}

.modal-instructions-container {
  margin-bottom: 1.5rem;
}

.modal-instructions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: white;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.modal-instruction-step {
  display: flex;
  margin-bottom: 0.75rem;
  align-items: flex-start;
}

.modal-instruction-step:last-child {
  margin-bottom: 0;
}

.modal-step-number {
  background-color: var(--gold);
  color: var(--navy);
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.modal-step-text {
  flex: 1;
  line-height: 1.5;
}

.modal-no-instructions {
  color: #6b7280;
  font-style: italic;
  padding: 0.5rem 0;
}

.modal-chart-container {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 100%;
}
</style>