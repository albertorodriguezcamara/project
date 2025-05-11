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
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-5">Detalles de la Rutina</h2>
            
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Rutina
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ej: Push, Pull, Legs, etc."
                />
              </div>

              <div class="grid grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia semanal
                  </label>
                  <input
                    v-model.number="form.frequency"
                    type="number"
                    min="1"
                    max="7"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Orden
                  </label>
                  <input
                    v-model.number="form.order"
                    type="number"
                    min="1"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exercise List -->
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-xl font-bold text-gray-900">Ejercicios</h2>
              <button
                @click="() => { console.log('Botón Añadir Ejercicio clickeado'); showExerciseModal = true; }"
                class="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center"
              >
                <Plus class="w-5 h-5 mr-2" />
                Añadir Ejercicio
              </button>
            </div>

            <!-- Exercise List Content -->
            <div class="space-y-5">
              <div
                v-for="(exercise, index) in exercises"
                :key="exercise.id"
                class="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-emerald-200 transition-colors shadow-sm
                cursor-pointer"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-4">
                    <img
                      :src="exercise.gif_url_supabase || exercise.image_url || 'https://via.placeholder.com/50'"
                      :alt="exercise.name_es || exercise.name"
                      class="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                    />
                    <div>
                      <h4 class="font-bold text-gray-900 text-lg">
                        {{ exercise.name_es || exercise.name }}
                      </h4>
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
                    @click.stop="removeExercise(index)"
                    class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors shadow-sm flex items-center"
                    title="Eliminar este ejercicio de la rutina"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>

                <!-- Modo Avanzado (superserie/dropset) -->
                <div class="flex flex-col md:flex-row md:items-center mb-4 bg-white p-4 rounded-lg border border-gray-200">
                  <label class="block md:w-1/3 font-medium text-gray-700 mb-2 md:mb-0 pr-4" for="advancedMode">
                    Modo Avanzado:
                  </label>
                  <select
                    v-model="exercise.advancedMode"
                    id="advancedMode"
                    class="md:w-2/3 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="normal">Normal</option>
                    <option value="superset">Superserie</option>
                    <option value="dropset">Dropset</option>
                  </select>
                </div>

                <!-- Series del ejercicio principal (solo si NO es superserie) -->
                <div v-if="exercise.advancedMode !== 'superset'" class="mt-4">
                  <h5 class="text-base font-semibold text-gray-800 mb-3">
                    Series del ejercicio principal
                  </h5>
                  <div class="space-y-3">
                    <div 
                      v-for="(s, si) in exercise.sets" 
                      :key="si" 
                      class="bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {{ si + 1 }}
                        </div>
                        <button 
                          type="button" 
                          @click="removeSet(exercise, si)" 
                          class="p-1 text-red-600 hover:text-red-800"
                        >
                          <Minus class="w-4 h-4"/>
                        </button>
                      </div>
                      
                      <div class="grid grid-cols-3 gap-2">
                        <!-- Peso -->
                        <div class="flex flex-col">
                          <input 
                            v-model.number="s.weight" 
                            type="number" 
                            min="0" 
                            step="0.5" 
                            class="px-2 py-1 rounded border border-gray-300 w-full text-center" 
                            @change="emitDirty"
                          />
                          <span class="text-xs text-gray-500 mt-1 text-center">kg</span>
                        </div>
                        
                        <!-- Repeticiones -->
                        <div class="flex flex-col">
                          <input 
                            v-model.number="s.reps" 
                            type="number" 
                            min="1" 
                            class="px-2 py-1 rounded border border-gray-300 w-full text-center" 
                            @change="emitDirty"
                          />
                          <span class="text-xs text-gray-500 mt-1 text-center">reps</span>
                        </div>
                        
                        <!-- Descanso -->
                        <div class="flex flex-col">
                          <input 
                            v-model.number="s.rest" 
                            type="number" 
                            min="0" 
                            step="15" 
                            class="px-2 py-1 rounded border border-gray-300 w-full text-center"
                            @change="emitDirty" 
                          />
                          <span class="text-xs text-gray-500 mt-1 text-center">seg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    @click="addSet(exercise)" 
                    class="mt-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center w-fit"
                  >
                    <Plus class="w-3 h-3 mr-1"/>
                    Añadir serie
                  </button>
                </div>

                <!-- Si es Superserie -->
                <div 
                  v-if="exercise.advancedMode === 'superset'" 
                  class="mt-5 rounded-xl border-2 border-red-300 overflow-hidden relative"
                >
                  <!-- Etiqueta de superserie -->
                  <div class="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-bl">
                    SUPERSERIE
                  </div>
                  
                  <!-- Contenido de la superserie -->
                  <div class="p-5 bg-white">
                    <!-- Encabezado -->
                    <div class="flex justify-between items-center mb-4">
                      <h4 class="font-bold text-gray-900">Configuración de Superserie</h4>
                      <button 
                        type="button" 
                        @click="showSupersetModal(index)" 
                        class="px-3 py-1.5 bg-blue-50 text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm flex items-center"
                      >
                        <Plus class="w-4 h-4 mr-1.5" />
                        Añadir/Cambiar
                      </button>
                    </div>
                    
                    <!-- Visualización de los dos ejercicios -->
                    <div class="flex flex-col md:flex-row gap-4 mb-5 bg-red-50 p-4 rounded-lg border border-red-200">
                      <!-- Ejercicio principal -->
                      <div class="flex items-center space-x-3 flex-1">
                        <img 
                          :src="exercise.gif_url_supabase || exercise.image_url || 'https://via.placeholder.com/50'" 
                          :alt="exercise.name_es || exercise.name"
                          class="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" 
                        />
                        <div>
                          <h5 class="font-bold text-gray-900">
                            {{ exercise.name_es || exercise.name }}
                          </h5>
                          <p class="text-xs text-gray-600">Ejercicio principal</p>
                        </div>
                      </div>
                      
                      <!-- Flecha que conecta ambos ejercicios -->
                      <div class="flex items-center justify-center">
                        <div class="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <!-- Ejercicio de superserie -->
                      <div v-if="exercise.supersetExercise" class="flex items-center space-x-3 flex-1">
                        <img 
                          :src="exercise.supersetExercise.gif_url_supabase || exercise.supersetExercise.image_url || 'https://via.placeholder.com/50'" 
                          :alt="exercise.supersetExercise.name_es || exercise.supersetExercise.name"
                          class="w-12 h-12 rounded-lg object-cover border border-red-200 shadow-sm" 
                        />
                        <div>
                          <h5 class="font-bold text-gray-900">
                            {{ exercise.supersetExercise.name_es || exercise.supersetExercise.name }}
                          </h5>
                          <p class="text-xs text-red-600 font-medium">Realizar inmediatamente después</p>
                        </div>
                      </div>
                      
                      <!-- Mensaje si no hay ejercicio seleccionado -->
                      <div v-else class="flex items-center justify-center flex-1">
                        <button 
                          type="button" 
                          @click="showSupersetModal(index)" 
                          class="px-3 py-1.5 bg-red-100 text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-200 transition-colors shadow-sm inline-flex items-center"
                        >
                          <Plus class="w-4 h-4 mr-2" />
                          Seleccionar ejercicio
                        </button>
                      </div>
                    </div>
                    
                    <!-- Series del ejercicio principal -->
                    <div class="mt-4">
                      <div class="mb-6">
                        <h5 class="text-base font-semibold text-gray-800 mb-3">
                          Series del ejercicio principal
                        </h5>
                        <div class="space-y-3">
                          <div 
                            v-for="(s, si) in exercise.sets" 
                            :key="si" 
                            class="bg-white p-3 rounded-lg border border-gray-200"
                          >
                            <div class="flex items-center justify-between mb-2">
                              <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                {{ si + 1 }}
                              </div>
                              <button 
                                type="button" 
                                @click="removeSet(exercise, si)" 
                                class="p-1 text-red-600 hover:text-red-800"
                              >
                                <Minus class="w-4 h-4"/>
                              </button>
                            </div>
                            
                            <div class="grid grid-cols-3 gap-2">
                              <!-- Peso -->
                              <div class="flex flex-col">
                                <input 
                                  v-model.number="s.weight" 
                                  type="number" 
                                  min="0" 
                                  step="0.5" 
                                  class="px-2 py-1 rounded border border-gray-300 w-full text-center" 
                                  @change="emitDirty" 
                                />
                                <span class="text-xs text-gray-500 mt-1 text-center">kg</span>
                              </div>
                              
                              <!-- Repeticiones -->
                              <div class="flex flex-col">
                                <input 
                                  v-model.number="s.reps" 
                                  type="number" 
                                  min="1" 
                                  class="px-2 py-1 rounded border border-gray-300 w-full text-center"
                                  @change="emitDirty" 
                                />
                                <span class="text-xs text-gray-500 mt-1 text-center">reps</span>
                              </div>
                              
                              <!-- Descanso -->
                              <div class="flex flex-col">
                                <input 
                                  v-model.number="s.rest" 
                                  type="number" 
                                  min="0" 
                                  step="15" 
                                  class="px-2 py-1 rounded border border-gray-300 w-full text-center"
                                  @change="emitDirty"
                                />
                                <span class="text-xs text-gray-500 mt-1 text-center">seg</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          type="button" 
                          @click="addSet(exercise)" 
                          class="mt-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center w-fit"
                        >
                          <Plus class="w-3 h-3 mr-1"/>
                          Añadir serie
                        </button>
                      </div>
                      
                      <!-- Series del ejercicio de superserie (solo si hay ejercicio seleccionado) -->
                      <div v-if="exercise.supersetExercise" class="mt-5">
                        <h5 class="text-base font-semibold text-gray-800 mb-3">
                          Series del ejercicio de superserie
                        </h5>
                        <div class="space-y-3">
                          <div 
                            v-for="(s, si) in exercise.supersetExercise.sets" 
                            :key="si" 
                            class="bg-red-50 p-3 rounded-lg border border-red-200"
                          >
                            <div class="flex items-center justify-between mb-2">
                              <div class="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-medium">
                                {{ si + 1 }}
                              </div>
                              <button 
                                type="button" 
                                @click="removeSet(exercise.supersetExercise, si)" 
                                class="p-1 text-red-600 hover:text-red-800"
                              >
                                <Minus class="w-4 h-4"/>
                              </button>
                            </div>
                            
                            <div class="grid grid-cols-3 gap-2">
                              <!-- Peso -->
                              <div class="flex flex-col">
                                <input 
                                  v-model.number="s.weight" 
                                  type="number" 
                                  min="0" 
                                  step="0.5" 
                                  class="px-2 py-1 rounded border border-red-200 w-full text-center"
                                  @change="emitDirty" 
                                />
                                <span class="text-xs text-gray-500 mt-1 text-center">kg</span>
                              </div>
                              
                              <!-- Repeticiones -->
                              <div class="flex flex-col">
                                <input 
                                  v-model.number="s.reps" 
                                  type="number" 
                                  min="1" 
                                  class="px-2 py-1 rounded border border-red-200 w-full text-center"
                                  @change="emitDirty"
                                />
                                <span class="text-xs text-gray-500 mt-1 text-center">reps</span>
                              </div>
                              
                              <!-- Descanso -->
                              <div class="flex flex-col">
                                <input 
                                  v-model.number="s.rest" 
                                  type="number" 
                                  min="0" 
                                  step="15" 
                                  class="px-2 py-1 rounded border border-red-200 w-full text-center"
                                  @change="emitDirty"
                                />
                                <span class="text-xs text-gray-500 mt-1 text-center">seg</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          type="button" 
                          @click="addSet(exercise.supersetExercise)" 
                          class="mt-2 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex items-center w-fit"
                        >
                          <Plus class="w-3 h-3 mr-1"/>
                          Añadir serie
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Si es Dropset -->
                <div 
                  v-if="exercise.advancedMode === 'dropset'" 
                  class="mt-4 bg-white p-4 rounded-lg border border-gray-200"
                >
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Número de descargas
                  </label>
                  <div class="flex items-center">
                    <input
                      v-model.number="exercise.dropSets"
                      type="number"
                      min="1"
                      class="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-24"
                      @change="emitDirty"
                    />
                    <p class="text-sm text-gray-600 ml-3">
                      Indica cuántas reducciones de peso harás en cada serie.
                    </p>
                  </div>
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
    <div class="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-auto">
      <ExerciseSelector
        @select="onExerciseSelected"
        @close="showExerciseModal = false"
      />
    </div>
  </div>

  <!-- Superset Selection Modal -->
  <div
    v-if="showSupersetIndex !== null"
    class="fixed inset-0 z-[60] flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="cancelSupersetModal"></div>
    <div class="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-auto">
      <ExerciseSelector
        @select="selectSupersetExercise"
        @close="cancelSupersetModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Minus, Search, Trash2, X, Dumbbell, Check, Filter } from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';
import ExerciseSelector from '@/components/ExerciseSelector.vue';
import type { Rutina } from '@/types';
import { toast } from 'vue3-toastify';

// Props y emits
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

// Stores
const trainingStore = useTrainingStore();
const exerciseLibraryStore = useExerciseLibraryStore();

// Estados reactividad
const isLoading = ref(false);
const showExerciseModal = ref(false);
const showSupersetIndex = ref<number | null>(null);

// Para el formulario de detalles de la rutina
const form = ref({
  name: props.rutina?.name || '',
  order: props.rutina?.order || 1,
  frequency: props.rutina?.frequency || 1,
  mesociclo_id: props.mesocicloId
});

// Lista local de ejercicios (ya enriquecidos, con sets, etc.)
const exercises = ref<any[]>([]);

// Lifecycle
onMounted(async () => {
  // Asegurarte de que la librería de ejercicios está cargada
  if (!exerciseLibraryStore.exercises.length) {
    await exerciseLibraryStore.fetchExerciseLibrary();
  }

  // Si es edición, mapear los ejercicios según la query
  if (props.rutina?.routine_exercises?.length) {
    const raw = [...props.rutina.routine_exercises].sort((a, b) => a.position - b.position);
    console.log("RUTINE_EXERCISES RECEIVED:", raw);

    const processed = [];
    const seenGroups = new Set();

    for (const rec of raw) {
      // Caso superserie (solo procesar el que tiene superset_exercise_id)
      if (
        rec.advanced_mode === 'superset' &&
        rec.superset_group_id &&
        !seenGroups.has(rec.superset_group_id) &&
        rec.superset_exercise_id
      ) {
        // Buscar el partner (el que no tiene superset_exercise_id)
        const partnerRec = raw.find(
          r =>
            r.superset_group_id === rec.superset_group_id &&
            !r.superset_exercise_id
        );

        processed.push({
          id: rec.exercise_id,
          exercise_id: rec.exercise?.uuid || rec.exercise_id,
          name: rec.exercise?.name_es,
          image_url: rec.exercise?.gif_url_supabase,
          musculos_principales: rec.exercise?.target_es,
          advancedMode: 'superset',
          supersetExerciseId: partnerRec ? (partnerRec.exercise?.uuid || partnerRec.exercise_id) : null,
          sets: rec.set_data ? JSON.parse(rec.set_data) : [],
          supersetExercise: partnerRec
            ? {
                id: partnerRec.exercise_id,
                exercise_id: partnerRec.exercise?.uuid || partnerRec.exercise_id,
                name: partnerRec.exercise?.name_es,
                image_url: partnerRec.exercise?.gif_url_supabase,
                musculos_principales: partnerRec.exercise?.target_es,
                advancedMode: 'normal',
                sets: partnerRec.set_data ? JSON.parse(partnerRec.set_data) : [],
              }
            : null,
        });
        seenGroups.add(rec.superset_group_id);
      }
      // Caso normal (no es superserie)
      else if (!rec.superset_group_id) {
        processed.push({
          id: rec.exercise_id,
          exercise_id: rec.exercise?.uuid || rec.exercise_id,
          name: rec.exercise?.name_es,
          image_url: rec.exercise?.gif_url_supabase,
          musculos_principales: rec.exercise?.target_es,
          advancedMode: rec.advanced_mode || 'normal',
          sets: rec.set_data ? JSON.parse(rec.set_data) : [],
          supersetExercise: null,
        });
      }
    }
    exercises.value = processed;
  }
});

// Métodos generales
function emitDirty() {
  emit('dirty');
}

// Añadir Ejercicio Normal
function onExerciseSelected(exercise: any) {
  addExerciseToRoutine(exercise);
  showExerciseModal.value = false;
}

function addExerciseToRoutine(exercise: any) {
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
  emitDirty();
}

// Quitar ejercicio de la lista
function removeExercise(index: number) {
  exercises.value.splice(index, 1);
  emitDirty();
}

// Añadir/Eliminar series
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

// Abrir/Cerrar modal de superserie
function showSupersetModal(index: number) {
  showSupersetIndex.value = index;
}

function cancelSupersetModal() {
  showSupersetIndex.value = null;
}

// Seleccionar ejercicio para superserie
function selectSupersetExercise(raw: any) {
  if (showSupersetIndex.value === null) return;
  const i = showSupersetIndex.value;

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

// Guardar la rutina
async function handleSubmit() {
  try {
    isLoading.value = true;

    const data = {
      name: form.value.name,
      order: form.value.order,
      frequency: form.value.frequency,
      mesociclo_id: form.value.mesociclo_id,
      ejercicios: exercises.value.map(ex => ({
        // Usa UUIDs en vez de ids numéricos
        exercise_id: ex.exercise?.uuid || ex.exercise_id,
        id: ex.id,
        name: ex.name,
        advancedMode: ex.advancedMode,
        supersetExerciseId: ex.supersetExercise?.uuid || null,
        supersetExercise: ex.advancedMode === 'superset' && ex.supersetExercise ? {
          ...ex.supersetExercise,
          exercise_id: ex.supersetExercise?.uuid || ex.supersetExercise?.exercise_id
        } : null,
        dropSets: ex.dropSets,
        sets: ex.sets
      }))
    };

    if (props.rutina) {
      // Modo edición
      await trainingStore.updateRutina(props.rutina.id, data);
      toast.success('Rutina actualizada correctamente');
    } else {
      // Modo creación
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
