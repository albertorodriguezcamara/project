<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="$emit('close')"
    ></div>

    <!-- Modal Card -->
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 overflow-hidden">
      <!-- Header with gradient background -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">{{ routine.name }}</h2>
            <div class="flex items-center gap-3">
              <span class="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                {{ routine.ejercicios?.length || 0 }} ejercicios
              </span>
              <span class="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                ~45-60 min
              </span>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <!-- Lista de ejercicios con series y repeticiones -->
        <div v-for="(ej, index) in routine.ejercicios" :key="ej.id" 
          class="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
        >
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 mb-1">{{ ej.name }}</h3>
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-1 text-sm text-gray-600">
                  <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                  {{ ej.series }}x{{ ej.repeticiones }}
                </span>
                <span class="inline-flex items-center gap-1 text-sm text-gray-600">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {{ ej.peso_inicial }}kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer botones con gradiente sutil -->
      <div class="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
        <button
          @click="$emit('edit', routine)"
          class="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
        >
          Editar
        </button>
        <button
          @click="$emit('start', routine)"
          class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Comenzar entrenamiento
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
