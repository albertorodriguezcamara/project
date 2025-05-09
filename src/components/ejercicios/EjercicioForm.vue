<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="exercise_id" class="block text-sm font-medium text-gray-700 mb-1">
        Ejercicio
      </label>
      <select
        id="exercise_id"
        v-model="form.exercise_id"
        required
        class="input-field"
        :disabled="isLoading || !exercises.length"
      >
        <option value="" disabled>
          {{ isLoading || !exercises.length ? 'Cargando ejercicios...' : 'Selecciona un ejercicio' }}
        </option>
        <option v-for="ex in exercises" :key="ex.id" :value="ex.id">
          {{ ex.name_es }}
        </option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="series" class="block text-sm font-medium text-gray-700 mb-1">
          Series
        </label>
        <input
          id="series"
          v-model.number="form.series"
          type="number"
          required
          min="1"
          class="input-field"
        />
      </div>

      <div>
        <label for="repeticiones" class="block text-sm font-medium text-gray-700 mb-1">
          Repeticiones
        </label>
        <input
          id="repeticiones"
          v-model.number="form.repeticiones"
          type="number"
          required
          min="1"
          class="input-field"
        />
      </div>

      <div>
        <label for="peso_inicial" class="block text-sm font-medium text-gray-700 mb-1">
          Peso Inicial (kg)
        </label>
        <input
          id="peso_inicial"
          v-model.number="form.peso_inicial"
          type="number"
          required
          min="0"
          step="0.5"
          class="input-field"
        />
      </div>

      <div>
        <label for="descanso" class="block text-sm font-medium text-gray-700 mb-1">
          Descanso (segundos)
        </label>
        <input
          id="descanso"
          v-model.number="form.descanso"
          type="number"
          required
          min="0"
          step="5"
          class="input-field"
        />
      </div>
    </div>

    <div>
      <label for="video_url" class="block text-sm font-medium text-gray-700 mb-1">
        URL del Video (opcional)
      </label>
      <input
        id="video_url"
        v-model="form.video_url"
        type="url"
        class="input-field"
        placeholder="https://youtube.com/..."
      />
    </div>

    <div>
      <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">
        Descripción (opcional)
      </label>
      <textarea
        id="descripcion"
        v-model="form.descripcion"
        rows="3"
        class="input-field"
        placeholder="Describe la técnica correcta y puntos clave..."
      ></textarea>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        class="btn-secondary"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="btn-primary"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ref, computed, onMounted } from 'vue';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';
import type { Exercise } from '@/stores/exerciseLibrary';

const props = defineProps<{
  rutinaId: string;
  routineExercise?: any; // Contains info from routine_exercises if editing
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'saved'): void;
}>();

const exerciseLibraryStore = useExerciseLibraryStore();
const isLoading = ref(false);

const exercises = computed(() => exerciseLibraryStore.exercises);

watchEffect(() => {
  if (!exerciseLibraryStore.exercises.length && !isLoading.value) {
    isLoading.value = true;
    exerciseLibraryStore.fetchExerciseLibrary().finally(() => {
      isLoading.value = false;
    });
  }
});

const form = ref({
  exercise_id: props.routineExercise?.exercise_id || '',
  series: props.routineExercise?.series || 3,
  repeticiones: props.routineExercise?.repeticiones || 10,
  peso_inicial: props.routineExercise?.peso_inicial || 0,
  descanso: props.routineExercise?.descanso || 90,
  gif_url_supabase: props.routineExercise?.exercise?.gif_url_supabase || '',
  instructions_es: props.routineExercise?.exercise?.instructions_es || '',
  rutina_id: props.rutinaId
});

onMounted(() => {
  if (!exercises.value.length) {
    exerciseLibraryStore.fetchExerciseLibrary();
  }
});

function onExerciseChange(id: string) {
  const ex = exercises.value.find(e => e.id === id);
  if (ex) {
    form.value.gif_url_supabase = ex.gif_url_supabase || '';
    form.value.instructions_es = ex.instructions_es || '';
  }
}

async function handleSubmit() {
  try {
    isLoading.value = true;
    emit('saved', { ...form.value });
  } catch (error) {
    console.error('Error al guardar el ejercicio:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>