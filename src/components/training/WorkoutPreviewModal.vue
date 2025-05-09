<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="$emit('close')"
    ></div>

    <!-- Modal Card -->
    <div class="relative bg-white rounded-lg shadow-lg max-w-2xl w-full z-10">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">{{ routine.name }}</h2>
        <button
          @click="$emit('close')"
          class="p-1 text-gray-400 hover:text-gray-500 rounded-full"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-4">
        <p class="text-sm text-gray-600">Vista previa de los ejercicios en la rutina:</p>

        <!-- Lista de ejercicios con series y repeticiones -->
        <div v-for="ej in routine.ejercicios" :key="ej.id" class="bg-gray-50 p-3 rounded-lg border">
          <h3 class="font-medium text-gray-800">{{ ej.name }}</h3>
          <p class="text-sm text-gray-500">
            {{ ej.series }}x{{ ej.repeticiones }} @ {{ ej.peso_inicial }}kg
          </p>
        </div>
      </div>

      <!-- Footer botones -->
      <div class="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
        <button
          @click="$emit('edit', routine)"
          class="btn-secondary"
        >
          Editar
        </button>
        <button
          @click="$emit('start', routine)"
          class="btn-primary"
        >
          Comenzar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { X } from 'lucide-vue-next';
import type { Rutina } from '@/types';

/**
 * show: boolean para mostrar u ocultar el modal.
 * routine: la rutina sobre la cual se mostrará la preview.
 */
const props = defineProps<{
  show: boolean;
  routine: Rutina;
}>();

/**
 * Eventos:
 * - close: se cierra el modal
 * - edit: pide abrir la vista de configuración
 * - start: comienza el entrenamiento real
 */
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', routine: Rutina): void;
  (e: 'start', routine: Rutina): void;
}>();
</script>

<style scoped>
</style>
