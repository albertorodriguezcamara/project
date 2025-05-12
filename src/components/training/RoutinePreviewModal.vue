<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative animate-scale-in modal-container">
      <!-- Texturas americanas decorativas para el modal -->
      <div class="modal-texture stars-texture"></div>
      <div class="modal-texture stripes-texture"></div>
      <div class="modal-texture dots-texture"></div>
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 modal-header">
        <div class="flex items-start justify-between">
          <div>
            <div class="modal-title-banner">
              <h2 class="modal-title" style="color: #FFD700 !important;">{{ rutina.name }}</h2>
            </div>
            <div class="exercise-count-badge">
              <span>{{ rutina.routine_exercises?.length || 0 }} EJERCICIOS</span>
            </div>
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
          <div class="modal-stat-card">
            <div class="modal-stat-content">
              <div class="modal-stat-banner">
                <p class="modal-stat-label">SERIES</p>
              </div>
              <p class="modal-stat-value">{{ totalSets }}</p>
            </div>
            <div class="modal-stat-texture stars-pattern"></div>
          </div>
          
          <div class="modal-stat-card">
            <div class="modal-stat-content">
              <div class="modal-stat-banner">
                <p class="modal-stat-label">REPETICIONES</p>
              </div>
              <p class="modal-stat-value">{{ totalReps }}</p>
            </div>
            <div class="modal-stat-texture dots-pattern"></div>
          </div>
          
          <div class="modal-stat-card">
            <div class="modal-stat-content">
              <div class="modal-stat-banner">
                <p class="modal-stat-label">DURACIÓN</p>
              </div>
              <p class="modal-stat-value">45-60<span class="modal-stat-unit">MIN</span></p>
            </div>
            <div class="modal-stat-texture stripes-pattern"></div>
          </div>
        </div>

        <!-- Exercise List -->
        <div class="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
          <div class="modal-exercise-header">
            <div class="modal-section-title-banner">
              <h5>EJERCICIOS</h5>
            </div>
          </div>
          <div 
            v-for="(ejercicio, index) in rutina.routine_exercises" 
            :key="ejercicio.id"
            class="modal-exercise-item"
          >
            <!-- Exercise Number -->
            <div class="modal-exercise-number">
              <span>{{ index + 1 }}</span>
            </div>

            <!-- Exercise Info -->
            <div class="modal-exercise-details">
              <h3 class="modal-exercise-name">{{ ejercicio.exercise?.name_es || ejercicio.name }}</h3>
              <div class="modal-exercise-sets">
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
      <div class="p-6 border-t border-gray-200 modal-footer">
        <div class="flex gap-3">
          <button
            @click="$emit('edit', rutina)"
            class="modal-btn-edit flex-1"
          >
            <Pencil class="w-4 h-4 mr-2" />
            EDITAR RUTINA
          </button>
          <button
            @click="$emit('start', rutina)"
            class="modal-btn-start flex-1"
          >
            <Play class="w-4 h-4 mr-2" />
            COMENZAR ENTRENAMIENTO
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

<style scoped>
/* Variables de colores */
:root {
  --navy: #1F2D48;
  --brick-red: #A52A2A;
  --gold: #FFD700;
  --pure-white: #FFFFFF;
  --deep-black: #111111;
}

/* Contenedor del modal */
.modal-container {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* Texturas decorativas */
.modal-texture {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  opacity: 0.05;
}

.stars-texture {
  top: 20px;
  right: 20px;
  width: 120px;
  height: 120px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M50 0l12 38h38l-30 22 12 38-32-23-32 23 12-38-30-22h38z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

.stripes-texture {
  bottom: 20px;
  left: 20px;
  width: 200px;
  height: 200px;
  background-image: repeating-linear-gradient(45deg, rgba(165, 42, 42, 0.05) 0, rgba(165, 42, 42, 0.05) 10px, transparent 10px, transparent 20px);
}

.dots-texture {
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background-image: radial-gradient(circle, rgba(31, 45, 72, 0.05) 1px, transparent 1px);
  background-size: 15px 15px;
  transform: translate(-50%, -50%);
}

/* Header del modal */
.modal-header {
  position: relative;
  z-index: 2;
}

.modal-title-banner {
  background-color: var(--navy);
  padding: 0.5rem 1rem;
  margin-bottom: 0.75rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
}

.modal-title {
  font-family: 'Oswald', sans-serif !important;
  font-size: 1.5rem !important;
  font-weight: 800 !important;
  margin: 0 !important;
  color: var(--gold) !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  transform: skewX(5deg) !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.exercise-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--brick-red);
  color: var(--pure-white);
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Tarjetas de estadísticas */
.modal-stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.modal-stat-content {
  position: relative;
  z-index: 1;
}

.modal-stat-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.stars-pattern {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='%23FFD700' opacity='0.1' d='M30 0l7 22h23l-18 13 7 22-19-14-19 14 7-22-18-13h23z'/%3E%3C/svg%3E");
  background-size: 60px;
  background-position: center right;
  background-repeat: no-repeat;
}

.dots-pattern {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='2' fill='%23FFD700' opacity='0.2'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}

.stripes-pattern {
  background-image: repeating-linear-gradient(45deg, rgba(31, 45, 72, 0.03) 0, rgba(31, 45, 72, 0.03) 5px, transparent 5px, transparent 10px);
}

.modal-stat-banner {
  background-color: var(--navy);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.modal-stat-label {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
  letter-spacing: 0.5px;
  transform: skewX(5deg);
}

.modal-stat-value {
  font-family: 'Oswald', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--navy);
  margin: 0;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
  display: inline-block;
  position: relative;
}

.modal-stat-unit {
  font-size: 0.875rem;
  font-weight: 700;
  margin-left: 0.25rem;
  color: var(--brick-red);
  background-color: rgba(165, 42, 42, 0.1);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  vertical-align: middle;
  letter-spacing: 0.5px;
}

/* Sección de ejercicios */
.modal-exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-section-title-banner {
  background-color: var(--brick-red);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-section-title-banner h5 {
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--pure-white);
  letter-spacing: 1px;
  margin: 0;
  transform: skewX(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.modal-exercise-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
  position: relative;
  overflow: hidden;
}

.modal-exercise-item:hover {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.modal-exercise-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--navy);
  color: var(--pure-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-exercise-details {
  flex: 1;
  min-width: 0;
}

.modal-exercise-name {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-exercise-sets {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Botones del footer */
.modal-footer {
  background-color: #f8fafc;
  position: relative;
  z-index: 2;
}

.modal-btn-edit {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: var(--navy);
  color: var(--pure-white);
  border: none;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(31, 45, 72, 0.2);
}

.modal-btn-edit:hover {
  background-color: #2a3c5c;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(31, 45, 72, 0.3);
}

.modal-btn-start {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: var(--brick-red);
  color: var(--pure-white);
  border: none;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(165, 42, 42, 0.2);
}

.modal-btn-start:hover {
  background-color: #8a2222;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(165, 42, 42, 0.3);
}
</style>