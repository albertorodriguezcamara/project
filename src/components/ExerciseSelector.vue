<template>
  <div class="exercise-selector-modal bg-white rounded-xl shadow-xl max-w-4xl w-full mx-auto relative">
    <!-- Botón de cierre -->
    <button
      class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 z-10"
      @click="emit('close')"
      title="Cerrar"
    >
      <X class="w-6 h-6" />
    </button>

    <!-- Header con título -->
    <div class="bg-gradient-to-br from-emerald-600 to-emerald-800 px-6 py-8 rounded-t-xl text-white shadow-md">
      <div class="max-w-xl">
        <h1 class="text-2xl font-bold mb-2">Seleccionar Ejercicio</h1>
        <p class="text-emerald-100">{{ filteredExercises.length }} ejercicios disponibles</p>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="p-6">
      <!-- Search and Filters -->
      <div class="card p-6 shadow-md rounded-2xl mb-6">
        <div class="flex flex-col md:flex-row gap-5 mb-6">
          <!-- Search -->
          <div class="flex-1 relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              v-model="search"
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
        <div v-if="showMuscleFilter" class="mb-6 animate-scale-in bg-gray-50 p-5 rounded-xl border border-gray-100">
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
        <div v-if="showEquipmentFilter" class="mb-6 animate-scale-in bg-gray-50 p-5 rounded-xl border border-gray-100">
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
              class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100 flex items-center"
            >
              {{ muscle }}
              <button @click="removeMuscleFilter(muscle)" class="ml-1 text-emerald-500 hover:text-emerald-700">
                <X class="w-4 h-4" />
              </button>
            </span>
            <span
              v-if="selectedEquipment"
              class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 flex items-center"
            >
              {{ translateEquipment(selectedEquipment) }}
              <button @click="selectedEquipment = ''" class="ml-1 text-blue-500 hover:text-blue-700">
                <X class="w-4 h-4" />
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

      <!-- Loading spinner (si el store está cargando) -->
      <div v-if="exerciseLibraryStore.isLoading" class="flex justify-center py-16">
        <LoadingSpinner size="large" class="w-16 h-16 text-emerald-600" />
      </div>

      <!-- No results message with clear filters button -->
      <div v-else-if="filteredExercises.length === 0" class="text-center py-12 space-y-4">
        <div class="text-gray-500 text-lg">No se encontraron ejercicios con los filtros actuales.</div>
        <button @click="clearFilters" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-base font-medium transition-colors">
          Limpiar filtros
        </button>
      </div>

      <!-- Exercise Grid -->
      <div v-else class="space-y-3 md:space-y-4 px-1 sm:px-2 max-h-[60vh] overflow-y-auto">
        <div
          v-for="exercise in filteredExercises"
          :key="exercise.id"
          class="flex items-center p-3 bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
          @click="selectExercise(exercise)"
        >
          <!-- Exercise Image -->
          <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
            <template v-if="exercise.gif_url_supabase">
              <div class="relative group w-full h-full">
                <img
                  :src="exercise.gif_url_supabase"
                  :alt="exercise.name_es || exercise.name || 'Imagen ejercicio'"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
            </template>
            <div v-else class="flex flex-col items-center justify-center h-full w-full bg-gray-50">
              <Dumbbell class="w-8 h-8 text-emerald-300 mb-1" />
              <span class="text-gray-500 text-xs font-medium">Sin imagen</span>
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
              <!-- Secondary Muscles Tags -->
              <span
                v-for="muscle in getSecondaryMuscles(exercise)"
                :key="muscle"
                class="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium border border-emerald-100"
              >
                {{ capitalize(muscle) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { X, Search, Filter, Check, Dumbbell } from 'lucide-vue-next';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// Props (por si luego necesitas un modo "view" o algo similar).
const props = defineProps({
  mode: { type: String, default: 'select' },
});

// Eventos que emite el componente:
//  - "select": cuando el usuario elige un ejercicio para añadir a su rutina.
//  - "close": cuando cierra el modal.
const emit = defineEmits(['select', 'close']);

// Accedemos a la store de ejercicios
const exerciseLibraryStore = useExerciseLibraryStore();

// Estados locales de búsqueda y filtros
const search = ref('');
const selectedEquipment = ref('');
const selectedMuscles = ref([]);
const showMuscleFilter = ref(false);
const showEquipmentFilter = ref(false);

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

// Computed properties
const hasActiveFilters = computed(() => {
  return selectedMuscles.value.length > 0 || selectedEquipment.value !== '';
});

// Obtenemos los arrays de equipamiento y grupos musculares de la store
const equipmentTypes = computed(() => {
  if (!Array.isArray(exerciseLibraryStore.exercises)) return [];
  // Solo mostrar equipamiento disponible en los ejercicios filtrados
  return [...new Set(exerciseLibraryStore.exercises.map(e => e.equipment_es))].filter(Boolean).sort();
});

const muscleGroups = computed(() => {
  // Mostrar todos los músculos principales únicos (target_es) de los ejercicios
  const present = new Set();
  exerciseLibraryStore.exercises.forEach(e => {
    if (e.target_es && e.target_es.trim()) present.add(e.target_es.trim());
  });
  return Array.from(present).sort((a, b) => a.localeCompare(b, 'es'));
});

// Computed que filtra la lista de ejercicios según búsqueda y filtros
const filteredExercises = computed(() => {
  let list = exerciseLibraryStore.exercises || [];

  // Filtrar por texto (nombre)
  if (search.value.trim()) {
    const query = search.value.toLowerCase();
    list = list.filter(ex => {
      const name = (ex.name_es || ex.name_en || '').toLowerCase();
      const instructions = (ex.instructions_es || '').toLowerCase();
      return name.includes(query) || instructions.includes(query);
    });
  }

  // Filtrar por músculos seleccionados
  if (selectedMuscles.value.length > 0) {
    list = list.filter(exercise => {
      // Filtrar solo por target_es (músculo principal)
      const principal = (exercise.target_es || '').toLowerCase().trim();
      return selectedMuscles.value.some(selected => principal === selected.toLowerCase().trim());
    });
  }

  // Filtrar por equipamiento
  if (selectedEquipment.value) {
    list = list.filter(ex => ex.equipment_es === selectedEquipment.value);
  }

  return list;
});

// Asegurarnos de que los ejercicios estén cargados al montar el componente
onMounted(() => {
  console.log('Modal montado: ExerciseSelector.vue - Vista de selección de ejercicios activada');  
  if (exerciseLibraryStore.exercises.length === 0) {
    exerciseLibraryStore.fetchExerciseLibrary();
  }
});

// Función para obtener el array de músculos secundarios
function getSecondaryMuscles(exercise) {
  if (!exercise.secondaryMuscles_es) return [];
  return exercise.secondaryMuscles_es
    .split(',')
    .map(m => m.trim())
    .filter(Boolean);
}

// Función para capitalizar la primera letra
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Traducir equipamiento
function translateEquipment(equipment) {
  return EQUIPMENT_TRANSLATIONS[equipment] || equipment;
}

// Funciones para manejar los filtros
function toggleMuscleFilter(muscle) {
  const index = selectedMuscles.value.indexOf(muscle);
  if (index === -1) selectedMuscles.value.push(muscle);
  else selectedMuscles.value.splice(index, 1);
}

function removeMuscleFilter(muscle) {
  const index = selectedMuscles.value.indexOf(muscle);
  if (index !== -1) selectedMuscles.value.splice(index, 1);
}

function toggleEquipmentFilter(equipment) {
  selectedEquipment.value = selectedEquipment.value === equipment ? '' : equipment;
}

function clearFilters() {
  search.value = '';
  selectedMuscles.value = [];
  selectedEquipment.value = '';
  showMuscleFilter.value = false;
  showEquipmentFilter.value = false;
}

// Manejar errores de imagen
function handleImageError(event) {
  const imgElement = event.target;
  imgElement.style.display = 'none';
}

// Emitimos el ejercicio seleccionado al padre
function selectExercise(exercise) {
  emit('select', exercise);
}
</script>

<style scoped>
.exercise-selector-modal {
  z-index: 60; /* Para asegurar que quede por encima de otros elementos */
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
