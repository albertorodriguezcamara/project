<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative animate-scale-in">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ rutina.name }}</h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ rutina.routine_exercises?.length || 0 }} ejercicios
            </p>
          </div>
          <button 
            @click="$emit('close')"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X class="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ totalSets }}
            </div>
            <p class="text-sm text-gray-500">Series totales</p>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ totalReps }}
            </div>
            <p class="text-sm text-gray-500">Repeticiones</p>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-gray-900">45-60</div>
            <p class="text-sm text-gray-500">Minutos aprox.</p>
          </div>
        </div>

        <!-- Exercise List -->
        <div class="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
          <div 
            v-for="(ejercicio, index) in rutina.routine_exercises" 
            :key="ejercicio.id"
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <!-- Exercise Number -->
            <div class="w-8 h-8 rounded-lg bg-white shadow-inner-lg flex items-center justify-center">
              <span class="text-sm font-medium text-gray-500">{{ index + 1 }}</span>
            </div>

            <!-- Exercise Info -->
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ ejercicio.exercise?.name_es || ejercicio.name }}</h3>
              <div class="flex flex-col gap-1 mt-1">
                <template v-if="ejercicio.advanced_mode !== 'dropset'">
                  <span class="text-sm text-gray-500">
                    {{ ejercicio.sets }}×{{ ejercicio.reps }}
                  </span>
                </template>
                <template v-else>
                  <span v-for="(s,i) in (ejercicio.set_data ? JSON.parse(ejercicio.set_data) : ejercicio.sets)" :key="i" class="text-sm text-gray-500">
                    {{ s.weight }}kg×{{ s.reps }}
                  </span>
                </template>
              </div>
            </div>

            <!-- Advanced Mode Indicator -->
            <div v-if="ejercicio.advanced_mode !== 'normal'" class="shrink-0">
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="{
                  'bg-purple-100 text-purple-700': ejercicio.advanced_mode === 'superset',
                  'bg-amber-100 text-amber-700': ejercicio.advanced_mode === 'dropset'
                }"
              >
                {{ ejercicio.advanced_mode === 'superset' ? 'Superserie' : 'Dropset' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex gap-3">
          <button
            @click="$emit('edit', rutina)"
            class="btn-secondary flex-1"
          >
            <Pencil class="w-4 h-4 mr-2" />
            Editar rutina
          </button>
          <button
            @click="$emit('start', rutina)"
            class="btn-primary flex-1"
          >
            <Play class="w-4 h-4 mr-2" />
            Comenzar entrenamiento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { X, Play, Pencil } from 'lucide-vue-next';
import type { Rutina } from '@/types';

const props = defineProps<{
  rutina: Rutina;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', rutina: Rutina): void;
  (e: 'start', rutina: Rutina): void;
}>();

const totalSets = computed(() => {
  return props.rutina.routine_exercises?.reduce((total, re) => total + re.sets, 0) || 0;
});

const totalReps = computed(() => {
  return props.rutina.routine_exercises?.reduce((total, re) => total + (re.sets * re.reps), 0) || 0;
});
</script>