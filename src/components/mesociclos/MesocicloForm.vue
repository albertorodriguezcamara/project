```vue
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      @click="$emit('cancel')"
    ></div>

    <!-- Modal -->
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg relative animate-scale-in">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">
          {{ mesociclo ? 'Editar' : 'Nuevo' }} Mesociclo
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Mesociclo
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-field"
              placeholder="Ej: Adaptación, Hipertrofia, etc."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Orden en el programa
            </label>
            <div class="flex items-center gap-3">
              <input
                v-model.number="form.order"
                type="number"
                min="1"
                class="input-field w-24"
              />
              <span class="text-sm text-gray-500">
                de {{ totalMesociclos }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="form.active"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded"
            />
            <label class="text-sm text-gray-700">
              Activar este mesociclo
            </label>
          </div>

          <div class="flex justify-end gap-3">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTrainingStore } from '@/stores/training';
import type { Mesociclo } from '@/types';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  mesociclo?: Mesociclo;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'saved'): void;
}>();

const trainingStore = useTrainingStore();
const isLoading = ref(false);

const totalMesociclos = computed(() => trainingStore.mesociclos.length);

const form = ref({
  name: props.mesociclo?.name || '',
  order: props.mesociclo?.order || totalMesociclos.value + 1,
  active: props.mesociclo?.active || false
});

async function handleSubmit() {
  try {
    isLoading.value = true;

    if (props.mesociclo) {
      await trainingStore.updateMesociclo(props.mesociclo.id, form.value);
      toast.success('Mesociclo actualizado correctamente');
    } else {
      await trainingStore.createMesociclo(form.value);
      toast.success('Mesociclo creado correctamente');
    }

    emit('saved');
  } catch (error) {
    console.error('Error al guardar el mesociclo:', error);
    toast.error('Error al guardar el mesociclo');
  } finally {
    isLoading.value = false;
  }
}
</script>
```