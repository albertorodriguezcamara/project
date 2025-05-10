<template>
  <div class="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">
            {{ rutina ? 'Editar' : 'Nueva' }} Rutina
          </h1>
          <p class="text-sm text-gray-500">
            Configura los ejercicios y parámetros de la rutina
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            @click="$emit('cancel')"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            class="btn-primary"
            :disabled="isLoading || !exercises.length"
          >
            {{ isLoading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-12 gap-6">
        <!-- Form Fields -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          <div class="card">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Detalles de la Rutina</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Rutina
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Ej: Push, Pull, Legs, etc."
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia semanal
                  </label>
                  <input
                    v-model.number="form.frequency"
                    type="number"
                    min="1"
                    max="7"
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Orden
                  </label>
                  <input
                    v-model.number="form.order"
                    type="number"
                    min="1"
                    class="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exercise List -->
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium text-gray-900">Ejercicios</h2>
              <button
                @click="showExerciseModal = true"
                class="btn-primary"
              >
                <Plus class="w-4 h-4 mr-1" />
                Añadir Ejercicio
              </button>
            </div>

            <!-- Exercise List Content -->
            <div class="space-y-4">
              <div
                v-for="(exercise, index) in exercises"
                :key="exercise.id"
                class="bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-200 transition-colors
                cursor-pointer"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center space-x-4">
                    <img
                      :src="exercise.gif_url_supabase || exercise.image_url || 'https://via.placeholder.com/50'"
                      :alt="exercise.name_es || exercise.name"
                      class="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 class="font-medium text-gray-900">{{ exercise.name_es || exercise.name }}</h4>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="muscle in (Array.isArray(exercise.musculos_principales) ? exercise.musculos_principales : [])"
                          :key="muscle"
                          class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                        >
                          {{ muscle }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeExercise(index)"
                    class="text-red-500 hover:text-red-700"
                    title="Eliminar este ejercicio de la rutina"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>

                <!-- Modo Avanzado (superserie/dropset) -->
                <div class="flex flex-col md:flex-row md:items-center mb-2">
                  <label class="block md:w-1/3 font-bold mb-1 md:mb-0 pr-4" for="advancedMode">
                    Modo avanzado
                  </label>
                  <select
                    v-model="exercise.advancedMode"
                    class="form-select md:w-2/3"
                    :id="`advancedMode-${index}`"
                    @change="emitDirty"
                  >
                    <option value="">Ninguno</option>
                    <option value="superset">Superset</option>
                    <option value="dropset">Dropset</option>
                  </select>
                </div>

                <!-- Si es Superserie -->
                <div v-if="exercise.advancedMode === 'superset'" class="mt-2">
                  <p class="text-sm text-gray-600 mb-1">Selecciona ejercicio de superserie:</p>
                  <button type="button" @click="showSupersetModal(index)" class="btn-secondary text-xs mb-2">Añadir/Sustituir Superserie</button>
                  <div v-if="exercise.supersetExercise" class="space-y-4">
                    <!-- Info superset -->
                    <div class="flex items-center space-x-3">
                      <img :src="exercise.supersetExercise.gif_url_supabase || exercise.supersetExercise.image_url || 'https://via.placeholder.com/50'" class="w-10 h-10 rounded object-cover" />
                      <p class="text-sm font-medium text-gray-700">{{ exercise.supersetExercise.name_es || exercise.supersetExercise.name }}</p>
                    </div>
                    <!-- Sets editor superset -->
                    <div>
                      <h5 class="text-sm font-medium text-gray-700 mb-1">Series Superserie</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div v-for="(s, si) in exercise.supersetExercise.sets" :key="si" class="flex items-center space-x-4">
                          <div class="w-8 text-center"><span class="text-sm text-gray-500">{{ si + 1 }}</span></div>
                          <div><input v-model.number="s.weight" type="number" min="0" step="0.5" class="input-field w-20" @change="emitDirty" /><span class="text-sm text-gray-500 ml-1">kg</span></div>
                          <div><input v-model.number="s.reps" type="number" min="1" class="input-field w-20" @change="emitDirty" /><span class="text-sm text-gray-500 ml-1">reps</span></div>
                          <div><input v-model.number="s.rest" type="number" min="0" step="15" class="input-field w-24" @change="emitDirty" /><span class="text-sm text-gray-500 ml-1">seg</span></div>
                          <button type="button" @click="removeSet(exercise.supersetExercise, si)" class="text-red-500 hover:text-red-700"><Minus class="w-4 h-4"/></button>
                        </div>
                      </div>
                      <button type="button" @click="addSet(exercise.supersetExercise)" class="text-sm text-blue-600 hover:text-blue-700 flex items-center"><Plus class="w-4 h-4 mr-1"/>Añadir serie</button>
                    </div>
                  </div>
                </div>

                <!-- Si es Dropset -->
                <div v-if="exercise.advancedMode === 'dropset'" class="mt-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Número de descargas
                  </label>
                  <input
                    v-model.number="exercise.dropSets"
                    type="number"
                    min="1"
                    class="input-field w-24"
                    @change="emitDirty"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Indica cuántas reducciones de peso harás en cada serie.
                  </p>
                </div>

                <!-- Sets Configuration -->
                <div class="mt-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-1">
                    {{ exercise.advancedMode === 'dropset' ? 'Pasos de Dropset' : 'Series' }}
                  </h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div
                      v-for="(set, setIndex) in exercise.sets"
                      :key="setIndex"
                      class="flex items-center space-x-4"
                    >
                      <div class="w-8 text-center">
                        <span class="text-sm font-medium text-gray-500">{{ setIndex + 1 }}</span>
                      </div>

                      <!-- Peso -->
                      <div>
                        <input
                          v-model.number="set.weight"
                          type="number"
                          min="0"
                          step="0.5"
                          class="input-field w-20"
                          placeholder="Peso"
                          @change="emitDirty"
                        />
                        <span class="text-sm text-gray-500 ml-1">kg</span>
                      </div>

                      <!-- Repeticiones -->
                      <div>
                        <input
                          v-model.number="set.reps"
                          type="number"
                          min="1"
                          class="input-field w-20"
                          placeholder="Reps"
                          @change="emitDirty"
                        />
                        <span class="text-sm text-gray-500 ml-1">reps</span>
                      </div>

                      <!-- Descanso -->
                      <div>
                        <input
                          v-model.number="set.rest"
                          type="number"
                          min="0"
                          step="15"
                          class="input-field w-24"
                          placeholder="Descanso"
                          @change="emitDirty"
                        />
                        <span class="text-sm text-gray-500 ml-1">seg</span>
                      </div>
                      <button
                        type="button"
                        @click="removeSet(exercise, setIndex)"
                        class="text-red-500 hover:text-red-700"
                        title="Eliminar esta serie"
                      >
                        <Minus class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="addSet(exercise)"
                    class="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <Plus class="w-4 h-4 mr-1" />
                    {{ exercise.advancedMode === 'dropset' ? 'Añadir paso' : 'Añadir serie' }}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Exercise Selection Modal -->
  <div
    v-if="showExerciseModal"
    class="fixed inset-0 z-[60] flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="showExerciseModal = false"></div>
    <div class="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative animate-scale-in">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Seleccionar Ejercicio</h3>
        <button
          @click="showExerciseModal = false"
          class="text-gray-400 hover:text-gray-500"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="p-6">
        <!-- Search and Filters -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4 mb-4">
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
          <div v-if="showMuscleFilter" class="mb-4 animate-scale-in">
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
          <div v-if="showEquipmentFilter" class="mb-4 animate-scale-in">
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
          <div v-if="hasActiveFilters" class="flex items-center justify-between mb-2">
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
          <div
            v-for="exercise in filteredLibraryExercises"
            :key="exercise.id"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors
            cursor-pointer"
            @click="selectExercise(exercise)"
          >
            <div class="aspect-video bg-gray-100">
              <img
                :src="exercise.gif_url_supabase || exercise.image_url || 'https://via.placeholder.com/80x80?text=GIF'"
                :alt="exercise.name_es || exercise.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <h4 class="font-medium text-gray-900">{{ exercise.name_es || exercise.name }}</h4>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="muscle in (Array.isArray(exercise.musculos_principales) ? exercise.musculos_principales : [])"
                  :key="muscle"
                  class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                >
                  {{ muscle }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Superset Selection Modal -->
  <div
    v-if="showSupersetIndex !== null"
    class="fixed inset-0 z-[60] flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="cancelSupersetModal"></div>
    <div class="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative animate-scale-in">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Seleccionar Ejercicio para Superserie</h3>
        <button
          @click="cancelSupersetModal"
          class="text-gray-400 hover:text-gray-500"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="p-6">
        <!-- Search superset -->
        <div class="mb-6">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              v-model="supersetQuery"
              type="text"
              placeholder="Buscar ejercicios..."
              class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        <!-- Exercise Grid (superset) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
          <div
            v-for="exercise in filteredSupersetExercises"
            :key="exercise.id"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors
            cursor-pointer"
            @click="selectSupersetExercise(exercise)"
          >
            <div class="aspect-video bg-gray-100">
              <img
                :src="exercise.gif_url_supabase || exercise.image_url || 'https://via.placeholder.com/80x80?text=GIF'"
                :alt="exercise.name_es || exercise.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <h4 class="font-medium text-gray-900">{{ exercise.name_es || exercise.name }}</h4>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="muscle in (Array.isArray(exercise.musculos_principales) ? exercise.musculos_principales : [])"
                  :key="muscle"
                  class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                >
                  {{ muscle }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Minus, Search, Trash2, X, Dumbbell, Check, Filter } from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';
import type { Rutina } from '@/types';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  mesocicloId: string;
  rutina?: Rutina;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'saved'): void;
  (e: 'dirty'): void;
  (e: 'pristine'): void;
}>();

const trainingStore = useTrainingStore();
const exerciseLibraryStore = useExerciseLibraryStore();

const isLoading = ref(false);
const showExerciseModal = ref(false);
const showSupersetIndex = ref<number | null>(null);

// Filtros y estados para el popup de ejercicios
const searchQuery = ref('');
const selectedMuscles = ref<string[]>([]);
const selectedEquipment = ref('');
const showMuscleFilter = ref(false);
const showEquipmentFilter = ref(false);

// Equipamiento y músculos disponibles
const equipmentTypes = computed(() => {
  // Extrae todos los tipos distintos de equipamiento de la librería
  const all = exerciseLibraryStore.exercises.map(e => e.equipment_es).filter(Boolean);
  return Array.from(new Set(all));
});
const muscleGroups = computed(() => {
  // Extrae todos los músculos principales únicos
  const all = exerciseLibraryStore.exercises.flatMap(e => Array.isArray(e.target_es) ? e.target_es : [e.target_es]).filter(Boolean);
  return Array.from(new Set(all));
});

const hasActiveFilters = computed(() => selectedMuscles.value.length > 0 || !!selectedEquipment.value);

function toggleMuscleFilter(muscle: string) {
  const idx = selectedMuscles.value.indexOf(muscle);
  if (idx === -1) selectedMuscles.value.push(muscle);
  else selectedMuscles.value.splice(idx, 1);
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
function translateEquipment(equipment: string) {
  // Traducción simple, puedes ampliar según tu diccionario
  const dict: Record<string, string> = { 'barbell': 'Barra', 'dumbbell': 'Mancuerna', 'machine': 'Máquina', 'body weight': 'Peso corporal' };
  return dict[equipment] || equipment;
}

const supersetQuery = ref('');

const form = ref({
  name: props.rutina?.name || '',
  order: props.rutina?.order || 1,
  frequency: props.rutina?.frequency || 1,
  mesociclo_id: props.mesocicloId
});

// Lista local de ejercicios con sets, advancedMode, etc.
const exercises = ref<any[]>([]);

function emitDirty() {
  emit('dirty');
}

onMounted(async () => {
  if (!exerciseLibraryStore.exercises.length) {
    await exerciseLibraryStore.fetchExerciseLibrary();
  }
  // Cargar ejercicios guardados usando routine_exercises
  if (props.rutina?.routine_exercises?.length) {
    const raw = [...props.rutina.routine_exercises].sort((a, b) => a.position - b.position);
    const processed: any[] = [];
    const seenGroups = new Set<string>();
    for (const rec of raw) {
      if (rec.superset_group_id) {
        if (seenGroups.has(rec.superset_group_id)) continue;
        seenGroups.add(rec.superset_group_id);
        const pair = raw.filter(r => r.superset_group_id === rec.superset_group_id);
        const mainRec = pair.find(r => r.superset_exercise_id) as any;
        const partnerRec = pair.find(r => !r.superset_exercise_id) as any;
        const mainSets = mainRec.set_data ? JSON.parse(mainRec.set_data) : [];
        const partnerSets = partnerRec.set_data ? JSON.parse(partnerRec.set_data) : [];
        const mainInfo = exerciseLibraryStore.exercises.find(e => e.id === mainRec.exercise_id) || {};
        const partInfo = exerciseLibraryStore.exercises.find(e => e.id === partnerRec.exercise_id) || {};
        processed.push({
          id: mainRec.exercise_id,
          exercise_id: mainRec.exercise_id,
          name: mainInfo.name || mainRec.name,
          name_es: mainInfo.name_es,
          image_url: mainInfo.image_url,
          gif_url_supabase: mainInfo.gif_url_supabase,
          musculos_principales: mainInfo.musculos_principales || [],
          advancedMode: 'superset',
          supersetExerciseId: partnerRec.exercise_id,
          supersetExercise: {
            id: partnerRec.exercise_id,
            exercise_id: partnerRec.exercise_id,
            name: partInfo.name || partnerRec.name,
            name_es: partInfo.name_es,
            image_url: partInfo.image_url,
            gif_url_supabase: partInfo.gif_url_supabase,
            musculos_principales: partInfo.musculos_principales || [],
            advancedMode: 'normal',
            supersetExerciseId: null,
            supersetExercise: null,
            dropSets: 0,
            sets: partnerSets
          },
          dropSets: mainRec.drop_sets || 0,
          sets: mainSets
        });
      } else {
        const sets = rec.set_data ? JSON.parse(rec.set_data) : [];
        const info = exerciseLibraryStore.exercises.find(e => e.id === rec.exercise_id) || {};
        processed.push({
          id: rec.exercise_id,
          exercise_id: rec.exercise_id,
          name: info.name || rec.name,
          name_es: info.name_es,
          image_url: info.image_url,
          gif_url_supabase: info.gif_url_supabase,
          musculos_principales: info.musculos_principales || [],
          advancedMode: rec.advanced_mode || 'normal',
          supersetExerciseId: null,
          supersetExercise: null,
          dropSets: rec.drop_sets || 0,
          sets: sets.length ? sets : [{ weight: rec.peso_inicial, reps: rec.repeticiones, rest: rec.descanso || 90 }]
        });
      }
    }
    exercises.value = processed;
  }
});

const filteredLibraryExercises = computed(() => {
  let filtered = exerciseLibraryStore.exercises;
  const query = searchQuery.value.toLowerCase();
  if (query) {
    filtered = filtered.filter(ex =>
      ex.name.toLowerCase().includes(query) ||
      ex.name_english?.toLowerCase().includes(query) ||
      ex.musculos_principales?.some(m => m.toLowerCase().includes(query))
    );
  }
  return filtered;
});

const filteredSupersetExercises = computed(() => {
  let filtered = exerciseLibraryStore.exercises;
  const query = supersetQuery.value.toLowerCase();
  if (query) {
    filtered = filtered.filter(ex =>
      ex.name.toLowerCase().includes(query) ||
      ex.name_english?.toLowerCase().includes(query) ||
      ex.musculos_principales?.some(m => m.toLowerCase().includes(query))
    );
  }
  return filtered;
});

function selectExercise(exercise: any) {
  const newExercise = {
    id: exercise.id,
    exercise_id: exercise.id,
    name: exercise.name,
    name_es: exercise.name_es,
    image_url: exercise.image_url,
    gif_url_supabase: exercise.gif_url_supabase,
    musculos_principales: exercise.musculos_principales || [],
    advancedMode: 'normal',
    supersetExerciseId: null,
    supersetExercise: null,
    dropSets: 0,
    sets: [{ weight: 0, reps: 12, rest: 90 }]
  };
  exercises.value.push(newExercise);
  showExerciseModal.value = false;
  emitDirty();
}

function removeExercise(index: number) {
  exercises.value.splice(index, 1);
  emitDirty();
}

function addSet(exercise: any) {
  const lastSet = exercise.sets[exercise.sets.length - 1] || { weight: 0, reps: 10, rest: 90 };
  exercise.sets.push({
    weight: lastSet.weight,
    reps: lastSet.reps,
    rest: lastSet.rest
  });
  emitDirty();
}

function removeSet(exercise: any, setIndex: number) {
  if (exercise.sets.length > 1) {
    exercise.sets.splice(setIndex, 1);
    emitDirty();
  }
}

function showSupersetModal(index: number) {
  showSupersetIndex.value = index;
}

function cancelSupersetModal() {
  showSupersetIndex.value = null;
}

function selectSupersetExercise(raw: any) {
  if (showSupersetIndex.value === null) return;
  const i = showSupersetIndex.value;
  // construye objeto de rutina para superset
  const supEx = {
    id: raw.id,
    exercise_id: raw.id,
    name: raw.name,
    name_es: raw.name_es,
    image_url: raw.image_url,
    gif_url_supabase: raw.gif_url_supabase,
    musculos_principales: raw.musculos_principales || [],
    advancedMode: 'normal',
    supersetExerciseId: null,
    supersetExercise: null,
    dropSets: 0,
    sets: [{ weight: 0, reps: 12, rest: 90 }]
  };
  exercises.value[i].supersetExerciseId = raw.id;
  exercises.value[i].supersetExercise = supEx;
  showSupersetIndex.value = null;
  emitDirty();
}

async function handleSubmit() {
  try {
    isLoading.value = true;

    const data = {
      name: form.value.name,
      order: form.value.order,
      frequency: form.value.frequency,
      mesociclo_id: form.value.mesociclo_id,
      ejercicios: exercises.value.map(ex => ({
        exercise_id: ex.exercise_id,
        id: ex.id,
        name: ex.name,
        advancedMode: ex.advancedMode,
        supersetExerciseId: ex.supersetExerciseId,
        supersetExercise: ex.advancedMode === 'superset' ? ex.supersetExercise : null,
        dropSets: ex.dropSets,
        sets: ex.sets
      }))
    };

    if (props.rutina) {
      await trainingStore.updateRutina(props.rutina.id, data);
      toast.success('Rutina actualizada correctamente');
    } else {
      await trainingStore.createRutina(data);
      toast.success('Rutina creada correctamente');
    }

    emit('saved');
  } catch (err) {
    console.error('Error saving routine:', err);
    toast.error('Error al guardar la rutina');
  } finally {
    isLoading.value = false;
  }
}
</script>