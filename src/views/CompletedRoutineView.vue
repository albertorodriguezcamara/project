<template>
  <div class="h-full w-full" style="background-color: #f5f5f5; background-image: repeating-linear-gradient(45deg, rgba(11, 37, 69, 0.02) 0, rgba(11, 37, 69, 0.02) 10px, transparent 10px, transparent 20px);">
    <!-- Estado de carga - Estilo Atlético Americano -->
    <div v-if="!routineData" class="flex items-center justify-center h-screen">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4" style="border-color: #ffd700 transparent #a52a2a transparent;"></div>
        <p class="font-extrabold uppercase tracking-wide" style="color: #0b2545;">CARGANDO ENTRENAMIENTO...</p>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div v-else class="flex flex-col h-full">
      <!-- Encabezado fijo - Estilo Atlético Americano -->
      <header class="sticky top-0 z-20 shadow-md" style="background-color: #0b2545;">
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex items-center gap-3">
            <router-link :to="{ name: 'history' }" class="p-2 rounded-full hover:bg-opacity-20 hover:bg-white active:bg-opacity-30 transition-colors">
              <ArrowLeft class="w-5 h-5 text-white" />
            </router-link>
            <div class="truncate">
              <h1 class="text-lg font-extrabold text-white uppercase tracking-tight truncate">{{ routineData.rutinaName }}</h1>
              <p class="text-xs font-bold truncate" style="color: #ffd700;">{{ routineData.mesocicloName }} · {{ routineData.date }}</p>
            </div>
          </div>
          <span class="text-xs px-4 py-2 rounded-lg font-extrabold uppercase tracking-wide whitespace-nowrap transform -skew-x-6 shadow-lg" style="background-color: #ffd700; color: #0b2545; border: 2px solid #0b2545;">
            COMPLETADO
          </span>
        </div>
        
        <!-- Sistema de pestañas - Estilo Atlético Americano -->
        <div class="border-t-4" style="border-color: #ffd700;">
          <nav class="flex overflow-x-auto hide-scrollbar" aria-label="Tabs">
            <button 
              @click="activeTab = 'summary'" 
              class="flex-1 py-3 relative flex flex-col items-center text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors transform -skew-x-6"
              :class="activeTab === 'summary' ? 'text-white' : 'text-gray-300 hover:text-white'"
              :style="{
                backgroundColor: activeTab === 'summary' ? 'rgba(165, 42, 42, 0.8)' : 'transparent'
              }"
            >
              <div class="flex items-center justify-center mb-1 transform skew-x-6">
                <ClipboardCheck :class="['w-5 h-5', activeTab === 'summary' ? 'text-yellow-400' : 'text-gray-300']" />
              </div>
              <span class="transform skew-x-6">RESUMEN</span>
              <div 
                class="absolute bottom-0 left-0 w-full h-1 transition-colors"
                :style="{
                  backgroundColor: activeTab === 'summary' ? '#ffd700' : 'transparent'
                }"
              ></div>
            </button>
            
            <button 
              @click="activeTab = 'exercises'" 
              class="flex-1 py-3 relative flex flex-col items-center text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors transform -skew-x-6"
              :class="activeTab === 'exercises' ? 'text-white' : 'text-gray-300 hover:text-white'"
              :style="{
                backgroundColor: activeTab === 'exercises' ? 'rgba(165, 42, 42, 0.8)' : 'transparent'
              }"
            >
              <div class="flex items-center justify-center mb-1 transform skew-x-6">
                <Dumbbell :class="['w-5 h-5', activeTab === 'exercises' ? 'text-yellow-400' : 'text-gray-300']" />
              </div>
              <span class="transform skew-x-6">EJERCICIOS</span>
              <div class="absolute -bottom-px right-0 left-0 flex justify-center">
                <span v-if="routineData.exercises.length" class="absolute -top-1.5 ml-4 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold transform skew-x-6" style="background-color: #a52a2a;">
                  {{ routineData.exercises.length }}
                </span>
              </div>
              <div 
                class="absolute bottom-0 left-0 w-full h-1 transition-colors"
                :style="{
                  backgroundColor: activeTab === 'exercises' ? '#ffd700' : 'transparent'
                }"
              ></div>
            </button>
          </nav>
        </div>
      </header>
      
      <!-- Quitamos los iconos sociales y de imprimir como solicitado -->
      
      <!-- Contenido principal con scroll - Estilo Atlético Americano -->
      <main class="flex-1 overflow-y-auto px-4 pt-6 pb-24" style="background-color: #f5f5f5; background-image: repeating-linear-gradient(45deg, rgba(11, 37, 69, 0.02) 0, rgba(11, 37, 69, 0.02) 10px, transparent 10px, transparent 20px);">
        <!-- PESTAÑA: RESUMEN -->
        <div v-if="activeTab === 'summary'" class="space-y-5">
          <!-- Estadísticas del entrenamiento - Estilo Atlético Americano -->
          <div class="grid grid-cols-2 gap-4">
            <div class="stat-card">
              <div class="stat-icon-container navy">
                <Clock class="stat-icon" />
              </div>
              <div class="stat-content">
                <p class="stat-label">DURACIÓN</p>
                <p class="stat-value">{{ routineData.duracion || 'N/A' }}<span class="stat-unit">MIN</span></p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon-container brick">
                <Dumbbell class="stat-icon" />
              </div>
              <div class="stat-content">
                <p class="stat-label">EJERCICIOS</p>
                <p class="stat-value">{{ routineData.totalEjercicios }}</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon-container navy">
                <Weight class="stat-icon" />
              </div>
              <div class="stat-content">
                <p class="stat-label">VOLUMEN</p>
                <p class="stat-value">{{ totalVolume }}<span class="stat-unit">KG</span></p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon-container brick">
                <Trophy class="stat-icon" />
              </div>
              <div class="stat-content">
                <p class="stat-label">1RM EST.</p>
                <p class="stat-value">{{ averageOneRM }}<span class="stat-unit">KG</span></p>
              </div>
            </div>
          </div>
          
          <!-- Notas del entrenamiento - Mejoradas para móvil -->
          <div v-if="routineData.comentario && routineData.comentario.trim() !== ''" class="card p-4 bg-amber-50 border border-amber-200 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="w-11 h-11 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0 border border-amber-200">
                <StickyNote class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-amber-800 mb-1.5">Notas del entrenamiento</h3>
                <p class="text-sm text-gray-700 leading-relaxed">{{ routineData.comentario }}</p>
              </div>
            </div>
          </div>
          
          <!-- Resumen de ejercicios - Estilo Atlético Americano -->
          <div class="exercise-summary-section">
            <div class="section-header" style="background-color: #0b2545; border-bottom: 2px solid #ffd700;">
              <h2 style="color: #ffd700; display: flex; align-items: center;">
                <ClipboardList class="mr-2" style="width: 20px; height: 20px; color: #ffd700;" />
                RESUMEN DE EJERCICIOS
              </h2>
              <!-- Decoración -->
              <div class="absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-6 -translate-y-6" style="background-color: #ffd700; opacity: 0.2;"></div>
            </div>
            
            <div class="divide-y divide-gray-200">
              <div 
                v-for="(ex, index) in routineData.exercises" 
                :key="ex.ejercicio_id"
                class="relative transition-all duration-150 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                :class="ex.isSuperset ? 'border-l-4' : ''"
                :style="ex.isSuperset ? 'border-left-color: #a52a2a;' : ''"
                @click="activeTab = 'exercises'; selectedExercise = ex.ejercicio_id"
              >
                <div class="exercise-item" style="display: flex; justify-content: space-between; padding: 1rem 1.5rem; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 1rem; width: 70%;">
                    <div style="width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; background-color: #0b2545; color: #ffd700; font-weight: 700; border-radius: 50%; flex-shrink: 0;">{{ index + 1 }}</div>
                    <div style="min-width: 0; width: 100%;">
                      <h3 style="color: #0b2545; font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem; white-space: normal; overflow: visible; font-size: 1rem;">{{ ex.ejercicioNombre }}</h3>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.25rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: #0b2545; background-color: rgba(11, 37, 69, 0.1); padding: 0.125rem 0.5rem; border-radius: 0.25rem; text-transform: uppercase;">{{ ex.series?.length || 0 }} series</span>
                        <span style="font-size: 0.75rem; font-weight: 600; color: #0b2545; background-color: rgba(11, 37, 69, 0.1); padding: 0.125rem 0.5rem; border-radius: 0.25rem; text-transform: uppercase;">{{ ex.totalVolumen || 0 }} kg</span>
                        <!-- Si tiene pairedExerciseName, mostrar con qué ejercicio forma superserie -->
                        <span v-if="ex.pairedExerciseName" style="font-size: 0.75rem; font-weight: 600; color: white; background-color: #a52a2a; padding: 0.125rem 0.5rem; border-radius: 0.25rem; text-transform: uppercase;">SUPERSET</span>
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: flex-end; width: 30%; flex-shrink: 0;">
                    <div style="font-size: 1.25rem; font-weight: 800; color: #0b2545;">{{ getMaxWeight(ex) }} kg</div>
                    <div v-if="getWeightProgress(ex) !== 0" 
                         :style="{
                           backgroundColor: getWeightProgress(ex) > 0 ? '#0b2545' : '#a52a2a',
                           color: 'white',
                           fontWeight: '700',
                           padding: '0.25rem 0.75rem',
                           borderRadius: '0.375rem',
                           marginTop: '0.5rem',
                           textTransform: 'uppercase',
                           transform: 'skew(-6deg)',
                           border: '1px solid rgba(255, 215, 0, 0.5)',
                           display: 'inline-block'
                         }">
                      <span v-if="getWeightProgress(ex) > 0" style="transform: skew(6deg); display: inline-block;">+</span>
                      <span style="transform: skew(6deg); display: inline-block;">{{ getWeightProgress(ex) }} kg</span>
                    </div>
                  </div>
                </div>
                <!-- Indicador de toque -->
                <div class="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 transition-transform origin-left hover:scale-x-100" style="background-color: #ffd700;"></div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- PESTAÑA: EJERCICIOS - Optimizada para móvil -->  
        <div v-if="activeTab === 'exercises'" class="space-y-4">
          <!-- Acordeón de ejercicios mejorado -->  
          <div class="space-y-4">
            <div 
              v-for="(ex, index) in routineData.exercises" 
              :key="ex.ejercicio_id" 
              class="card overflow-hidden shadow-sm rounded-xl"
            >
              <!-- Cabecera del ejercicio (siempre visible) - Mejorada para móvil -->  
              <div 
                class="p-4 flex items-center justify-between bg-white"
                :class="[ 
                  { 'border-b-2': selectedExercise === ex.ejercicio_id },
                  ex.isSuperset ? 'border-l-4' : ''
                ]"
                :style="{
                  backgroundColor: selectedExercise === ex.ejercicio_id ? 'rgba(11, 37, 69, 0.05)' : 'white',
                  borderBottomColor: selectedExercise === ex.ejercicio_id ? '#ffd700' : 'transparent',
                  borderLeftColor: ex.isSuperset ? '#a52a2a' : 'transparent'
                }"
                @click="toggleExercise(ex.ejercicio_id)"
              >
                <div class="flex items-center gap-3">
                  <!-- Icono o número del ejercicio - Estilo Atlético Americano -->
                  <div class="relative">
                    <div 
                      class="w-12 h-12 rounded-lg flex items-center justify-center font-extrabold text-lg shadow-md transition-colors transform -skew-x-6"
                      :style="{
                        backgroundColor: selectedExercise === ex.ejercicio_id ? '#0b2545' : '#ffd700',
                        color: selectedExercise === ex.ejercicio_id ? '#ffd700' : '#0b2545',
                        border: selectedExercise === ex.ejercicio_id ? '2px solid #ffd700' : 'none'
                      }"
                    >
                      <span class="transform skew-x-6">{{ index + 1 }}</span>
                    </div>
                    <!-- Badge de superserie - Estilo Atlético Americano -->
                    <div v-if="ex.isSuperset" class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm border border-white" style="background-color: #a52a2a;">
                      <span class="text-white text-[9px] font-bold">S</span>
                    </div>
                  </div>
                  
                  <!-- Información del ejercicio - Estilo Atlético Americano -->
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-bold uppercase" style="color: #0b2545;">{{ ex.name_es || ex.ejercicioNombre || ex.ejercicioInfo?.name_es || ex.ejercicioInfo?.name || ex.name || 'Ejercicio' }}</h3>
                      <span v-if="ex.isSuperset" class="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-tight" style="background-color: #a52a2a; color: white; border: 1px solid #ffd700;">SUPER</span>
                    </div>
                    <div class="flex items-center gap-1.5 mt-1">
                      <span class="text-xs font-bold" style="color: #a52a2a;">{{ ex.series.length }} series</span>
                      <span class="text-xs" style="color: #0b2545;">•</span>
                      <span class="text-xs font-bold" style="color: #a52a2a;">{{ ex.totalVolumen }} kg</span>
                      <!-- Información del paired exercise -->
                      <span v-if="ex.pairedExerciseName" class="text-xs" style="color: #0b2545;">•</span>
                      <span v-if="ex.pairedExerciseName" class="text-xs font-bold" style="color: #a52a2a;">Con: {{ ex.pairedExerciseName }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <div class="text-right mr-2">
                    <div class="text-lg font-extrabold" style="color: #0b2545;">{{ getMaxWeight(ex) }} kg</div>
                    <div v-if="getWeightProgress(ex) !== 0" 
                         class="text-xs px-2 py-0.5 rounded-full mt-1 flex items-center justify-center font-bold" 
                         :style="{
                           backgroundColor: getWeightProgress(ex) > 0 ? '#0b2545' : '#a52a2a',
                           color: '#ffd700',
                           border: '1px solid #ffd700'
                         }">
                      <span v-if="getWeightProgress(ex) > 0" class="mr-1">+</span>{{ getWeightProgress(ex) }} kg
                    </div>
                  </div>
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: #0b2545;">
                    <ChevronDown 
                      class="w-5 h-5 transition-transform duration-200" 
                      :class="{'transform rotate-180': selectedExercise === ex.ejercicio_id}"
                      style="color: #ffd700;"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Contenido desplegable - Mejorado para móvil -->  
              <div v-if="selectedExercise === ex.ejercicio_id" class="p-4 bg-gray-50 border-t border-gray-100">
                <!-- Tabla de series - Mejorada para móvil -->  
                <div class="px-4 py-3 rounded-lg shadow-md mb-4 relative overflow-hidden" style="background-color: #0b2545; border: 2px solid #ffd700;">
                  <!-- Franja decorativa -->
                  <div class="absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-6 -translate-y-6" style="background-color: #ffd700; opacity: 0.2;"></div>
                  
                  <div class="flex items-center justify-between relative z-10">
                    <h4 class="text-sm font-extrabold uppercase tracking-wide flex items-center" style="color: #ffd700;">
                      <ClipboardList class="w-5 h-5 mr-2" style="color: #ffd700;" />
                      DETALLE DE SERIES
                    </h4>
                  </div>
                </div>
                
                <div class="rounded-lg overflow-hidden shadow-md mb-6" style="border: 2px solid #0b2545;">
                  <table class="min-w-full divide-y divide-gray-200 border-collapse">
                    <thead style="background-color: #0b2545;">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider" style="color: #ffd700; border-bottom: 2px solid #ffd700;">Serie</th>
                        <th class="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider" style="color: #ffd700; border-bottom: 2px solid #ffd700;">Peso</th>
                        <th class="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider" style="color: #ffd700; border-bottom: 2px solid #ffd700;">Reps</th>
                        <th class="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider" style="color: #ffd700; border-bottom: 2px solid #ffd700;">1RM</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y" style="border: 2px solid #0b2545;">
                      <tr v-for="(set, sidx) in ex.series" :key="sidx" class="hover:bg-gray-50 active:bg-gray-100" :style="sidx % 2 === 0 ? 'background-color: #f5f5f5' : 'background-color: white'">
                        <td class="px-4 py-3">
                          <div class="w-6 h-6 rounded flex items-center justify-center font-bold" style="background-color: #0b2545; color: #ffd700;">{{ sidx + 1 }}</div>
                        </td>
                        <td class="px-4 py-3 text-sm">
                          <span class="font-mono font-bold" style="color: #0b2545;">{{ set.peso }} kg</span>
                        </td>
                        <td class="px-4 py-3 text-sm">
                          <span class="font-mono font-bold" style="color: #0b2545;">{{ set.repeticiones }}</span>
                        </td>
                        <td class="px-4 py-3 text-sm font-bold">
                          <span class="font-mono px-2 py-1 rounded" style="background-color: #0b2545; color: #ffd700;">{{ calculateOneRM(set.peso, set.repeticiones) }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Gráfico de progreso (con avg, min, max, 1RM) - Mejorado para móvil -->
                <div v-if="hasHistoricalData(ex)" class="mt-6">
                  <div class="px-4 py-3 rounded-lg shadow-md mb-4 relative overflow-hidden" style="background-color: #0b2545; border: 2px solid #ffd700;">
                    <!-- Franja decorativa -->
                    <div class="absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-6 -translate-y-6" style="background-color: #ffd700; opacity: 0.2;"></div>
                    
                    <div class="flex items-center justify-between relative z-10">
                      <h4 class="text-sm font-extrabold uppercase tracking-wide flex items-center" style="color: #ffd700;">
                        <Activity class="w-5 h-5 mr-2" style="color: #ffd700;" />
                        PROGRESO DE PESO
                      </h4>
                      <span class="text-xs px-3 py-1 rounded font-bold uppercase tracking-tight" style="background-color: #ffd700; color: #0b2545;">{{ getHistoricalLogs(ex).length }} REGISTROS</span>
                    </div>
                  </div>
                  
                  <div class="rounded-lg overflow-hidden shadow-md" style="border: 2px solid #0b2545;">
                    <!-- Cabecera de la gráfica -->
                    <div class="px-4 py-3" style="background-color: #0b2545;">
                      <div class="flex flex-wrap gap-3 justify-between">
                        <div class="flex items-center">
                          <div class="w-3 h-3 mr-1" style="background-color: #ffd700;"></div>
                          <span class="text-xs font-bold uppercase" style="color: #ffd700;">1RM EST.</span>
                        </div>
                        <div class="flex items-center">
                          <div class="w-3 h-3 mr-1" style="background-color: #2ea043;"></div>
                          <span class="text-xs font-bold uppercase" style="color: #ffd700;">PESO MEDIO</span>
                        </div>
                        <div class="flex items-center">
                          <div class="w-3 h-3 mr-1 border" style="border-color: #fd8c73; border-style: dashed;"></div>
                          <span class="text-xs font-bold uppercase" style="color: #ffd700;">PESO MÍN.</span>
                        </div>
                        <div class="flex items-center">
                          <div class="w-3 h-3 mr-1 border" style="border-color: #cf222e; border-style: dashed;"></div>
                          <span class="text-xs font-bold uppercase" style="color: #ffd700;">PESO MÁX.</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Contenedor de la gráfica -->
                    <div class="p-4 bg-white">
                      <ExerciseProgressChart
                        :logs="getHistoricalLogs(ex)"
                        :exerciseName="ex.name_es || 'Ejercicio'"
                        @mounted="console.log('Nombre enviado a gráfica:', ex.ejercicioNombre, ex.ejercicioInfo?.name_es, ex.ejercicioInfo?.name, ex.name_es, ex.name)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Botón flotante de acción principal - Estilo Atlético Americano -->  
      <div class="fixed bottom-6 right-4 left-4 z-30 flex justify-center">
        <router-link 
          :to="{ name: 'training' }" 
          class="py-4 px-8 rounded-lg font-extrabold text-sm uppercase tracking-wide shadow-lg flex items-center justify-center gap-3 w-full max-w-xs transform transition-transform active:scale-98 -skew-x-6"
          style="background-color: #0b2545; color: #ffd700; border: 2px solid #ffd700;"
        >
          <Plus class="w-5 h-5 transform skew-x-6" />
          <span class="transform skew-x-6">NUEVO ENTRENAMIENTO</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExerciseProgressChart from '@/components/exercises/ExerciseProgressChart.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useTrainingStore } from '@/stores/training';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';

// Import de iconos
import { 
  ArrowLeft, 
  Share2, 
  Printer, 
  Clock, 
  Activity, 
  StickyNote,
  ClipboardCheck,
  Trophy,
  Weight,
  ChevronDown,
  Plus
} from 'lucide-vue-next';

// Icono de mancuerna personalizado
import { h } from 'vue';
const Dumbbell = {
  name: 'Dumbbell',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, [
      h('path', { d: 'M6.5 6.5h11' }),
      h('path', { d: 'M6.5 17.5h11' }),
      h('path', { d: 'M4 9.5v5' }),
      h('path', { d: 'M20 9.5v5' }),
      h('path', { d: 'M6.5 6.5A2.5 2.5 0 0 0 4 9v0a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 9v0a2.5 2.5 0 0 0-2.5-2.5h-11z' }),
      h('path', { d: 'M6.5 14.5A2.5 2.5 0 0 0 4 17v0a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 17v0a2.5 2.5 0 0 0-2.5-2.5h-11z' })
    ]);
  }
};

const route = useRoute();
const workoutLogsStore = useWorkoutLogsStore();
const trainingStore = useTrainingStore();
const exerciseLibraryStore = useExerciseLibraryStore();
const routineData = ref<any>(null);
const previousWorkouts = ref<any[]>([]);
const activeTab = ref('summary');
const selectedExercise = ref('');

// Cálculos
const totalVolume = computed(() => {
  if (!routineData.value) return 0;
  let volume = 0;
  routineData.value.exercises.forEach((exercise: any) => {
    exercise.series.forEach((set: any) => {
      volume += set.peso * set.repeticiones;
    });
  });
  return volume;
});

const totalSets = computed(() => {
  if (!routineData.value) return 0;
  let sets = 0;
  routineData.value.exercises.forEach((exercise: any) => {
    sets += exercise.series.length;
  });
  return sets;
});

const averageOneRM = computed(() => {
  if (!routineData.value || !routineData.value.exercises.length) return 0;
  const maxOneRMs = routineData.value.exercises.map((ex: any) => {
    if (!ex.series || !ex.series.length) return 0;
    const oneRMs = ex.series.map((set: any) => {
      if (!set.peso || !set.repeticiones) return 0;
      return parseInt(calculateOneRM(set.peso, set.repeticiones)) || 0;
    });
    return Math.max(...oneRMs);
  }).filter((val: number) => val > 0);

  if (!maxOneRMs.length) return 0;
  const sum = maxOneRMs.reduce((a: number, b: number) => a + b, 0);
  return Math.round(sum / maxOneRMs.length);
});

// Funciones helper
function getMaxWeight(exercise: any): number {
  if (!exercise.series || !exercise.series.length) return 0;
  return Math.max(...exercise.series.map((s: any) => s.peso));
}

function hasHistoricalData(exercise: any): boolean {
  return previousWorkouts.value.some(workout => 
    workout.ejercicios.some((ex: any) => ex.ejercicio_id === exercise.ejercicio_id)
  );
}

function getWeightProgress(exercise: any): number {
  if (!exercise || !previousWorkouts.value.length) return 0;
  const prevWorkoutsWithEx = previousWorkouts.value
    .filter(w => w.id !== route.params.id)
    .filter(w => w.ejercicios.some((e: any) => e.ejercicio_id === exercise.ejercicio_id))
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  
  if (!prevWorkoutsWithEx.length) return 0;
  const lastWorkout = prevWorkoutsWithEx[0];
  const lastEx = lastWorkout.ejercicios.find((e: any) => e.ejercicio_id === exercise.ejercicio_id);
  if (!lastEx || !lastEx.sets?.length) return 0;
  
  const currentMax = getMaxWeight(exercise);
  const previousMax = Math.max(...lastEx.sets.map((s: any) => s.peso));
  return currentMax - previousMax;
}

// 1RM
function calculateOneRM(weight: number, reps: number): string {
  if (!weight || !reps || reps <= 0) return '-';
  const oneRM = weight * (1 + (reps / 32));
  return Math.round(oneRM).toString();
}

function getOneRMColor(set: any): string {
  if (!set.peso || !set.repeticiones) return 'text-gray-400';
  const oneRM = parseInt(calculateOneRM(set.peso, set.repeticiones));
  const ratio = oneRM / set.peso;
  if (ratio >= 1.3) return 'text-emerald-600';
  if (ratio >= 1.15) return 'text-amber-600';
  return 'text-gray-700';
}

// Acordeón
function toggleExercise(exerciseId: string) {
  if (selectedExercise.value === exerciseId) {
    selectedExercise.value = '';
  } else {
    selectedExercise.value = exerciseId;
  }
}

// Historial
function getHistoricalLogs(exercise: any) {
  const logs: {
    fecha: string;
    average: number;
    min: number;
    max: number;
    oneRM: number;
  }[] = [];

  previousWorkouts.value.forEach(workout => {
    const exLog = workout.ejercicios.find((e: any) => e.ejercicio_id === exercise.ejercicio_id);
    if (exLog && exLog.sets && exLog.sets.length) {
      const weights = exLog.sets.map((s: any) => s.peso);
      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);
      const avgWeight = weights.reduce((a: number, b: number) => a + b, 0) / weights.length;
      
      let maxOneRM = 0;
      exLog.sets.forEach((s: any) => {
        const oneRMVal = parseInt(calculateOneRM(s.peso, s.repeticiones));
        if (oneRMVal > maxOneRM) maxOneRM = oneRMVal;
      });

      logs.push({
        fecha: workout.fecha,
        average: avgWeight,
        min: minWeight,
        max: maxWeight,
        oneRM: maxOneRM
      });
    }
  });

  // Ejercicio actual
  if (exercise.series && exercise.series.length) {
    const weights = exercise.series.map((s: any) => s.peso);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const avgWeight = weights.reduce((a: number, b: number) => a + b, 0) / weights.length;
    let maxOneRM = 0;
    exercise.series.forEach((s: any) => {
      const oneRMVal = parseInt(calculateOneRM(s.peso, s.repeticiones));
      if (oneRMVal > maxOneRM) maxOneRM = oneRMVal;
    });
    logs.push({
      fecha: routineData.value.rawDate,
      average: avgWeight,
      min: minWeight,
      max: maxWeight,
      oneRM: maxOneRM
    });
  }
  
  logs.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  return logs;
}

// onMounted
onMounted(async () => {
  exerciseLibraryStore.fetchExerciseLibrary();
  if (!workoutLogsStore.workouts.length) {
    await workoutLogsStore.getWorkouts();
  }
  if (!trainingStore.mesociclos.length) {
    await trainingStore.fetchMesociclos();
  }
  
  const workoutId = route.params.id as string;
  const workout = workoutLogsStore.workouts.find(w => w.id === workoutId);

  if (!workout) {
    console.error('No se encontró el entrenamiento con ID:', workoutId);
    return;
  }

  // Filtrar entrenos previos
  previousWorkouts.value = workoutLogsStore.workouts.filter(w => w.id !== workoutId);

  // Buscar rutina y mesociclo
  let rutina = null;
  let mesociclo = null;
  if (trainingStore.mesociclos) {
    for (const m of trainingStore.mesociclos) {
      if (m.rutinas) {
        const r = m.rutinas.find(rut => rut.id === workout.rutina_id);
        if (r) {
          rutina = r;
          mesociclo = m;
          break;
        }
      }
    }
  }

  // Agrupar IDs de superseries
  const supersetGroups: Record<string, string[]> = {};
  if (rutina && rutina.ejercicios) {
    rutina.ejercicios.forEach(ej => {
      if (ej.advanced_mode === 'superset' && ej.superset_group_id) {
        if (!supersetGroups[ej.superset_group_id]) {
          supersetGroups[ej.superset_group_id] = [];
        }
        supersetGroups[ej.superset_group_id].push(String(ej.id));
      }
    });
  }

  // Mapear ejercicios con nombres desde exerciseLibraryStore
  const exerciseDict: Record<string, string> = {};
  if (Array.isArray(exerciseLibraryStore.exercises)) {
    exerciseLibraryStore.exercises.forEach(e => {
      if (e.uuid) exerciseDict[e.uuid] = e.name_es || e.name_en || 'Ejercicio';
      if (e.id && e.id !== e.uuid) exerciseDict[e.id] = e.name_es || e.name_en || 'Ejercicio';
    });
  }

  const ejercicios = (workout.ejercicios || []).map(ex => {
    let nombre = 'Ejercicio';

    // 1) buscar dentro de la rutina si existe
    if (rutina?.ejercicios?.length) {
      const ej = rutina.ejercicios.find((e) => e.id === ex.ejercicio_id);
      if (ej) nombre = ej.name_es || ej.name || nombre;
    }

    // 2) fallback a exerciseLibrary usando ejercicio_id
    if (nombre === 'Ejercicio' && ex.ejercicio_id && exerciseDict[ex.ejercicio_id]) {
      nombre = exerciseDict[ex.ejercicio_id];
    }

    // 3) fallback adicional si hay un campo exercise_id
    if (nombre === 'Ejercicio' && ex.exercise_id && exerciseDict[ex.exercise_id]) {
      nombre = exerciseDict[ex.exercise_id];
    }

    // 4) fallback adicional: buscar en los sets si hay un ejercicio_id
    if (nombre === 'Ejercicio' && ex.sets && ex.sets.length > 0 && ex.sets[0].ejercicio_id && exerciseDict[ex.sets[0].ejercicio_id]) {
      nombre = exerciseDict[ex.sets[0].ejercicio_id];
    }

    const series = (ex.sets || []).map((s: any) => ({
      peso: s.peso,
      repeticiones: s.repeticiones,
      descanso: s.descanso || '',
      volumen: s.peso * s.repeticiones,
      completed: s.completed || true
    }));
    
    return {
      ...ex,
      ejercicioNombre: nombre,
      series,
      totalVolumen: series.reduce((acc: number, ss: any) => acc + ss.volumen, 0),
      pesoMaximo: Math.max(...series.map((ss: any) => ss.peso), 0),
      isSuperset: supersetGroups[ex.ejercicio_id] ? true : false,
      pairedExerciseName: supersetGroups[ex.ejercicio_id] ? rutina.ejercicios.find(ej => ej.id !== ex.ejercicio_id && ej.superset_group_id === ex.superset_group_id)?.name_es : null
    };
  });

  const formattedDate = new Date(workout.fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  routineData.value = {
    id: workout.id,
    rutinaId: workout.rutina_id,
    rutinaName: rutina ? rutina.name : 'Entrenamiento',
    mesocicloName: mesociclo ? mesociclo.name : '',
    date: formattedDate,
    rawDate: workout.fecha,
    duracion: workout.duracion || '',
    comentario: workout.notas || '',
    exercises: ejercicios,
    totalEjercicios: ejercicios.length
  };

  console.log('Datos de rutina cargados:', routineData.value);
});
</script>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Variables de colores */
:root {
  --navy: #0b2545;
  --brick-red: #a52a2a;
  --gold: #ffd700;
  --pure-white: #ffffff;
  --deep-black: #1a1a1a;
}

/* Estilos para las tarjetas de estadísticas */
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-container.navy {
  background-color: var(--navy);
}

.stat-icon-container.brick {
  background-color: var(--brick-red);
}

.stat-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--pure-white);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--navy);
  display: flex;
  align-items: baseline;
}

.stat-unit {
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.25rem;
  color: var(--brick-red);
  background-color: rgba(165, 42, 42, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

/* Estilos para la sección de resumen de ejercicios */
.exercise-summary-section {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 1.5rem;
}

.section-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--navy);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos para los elementos de ejercicio */
.exercise-item {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.exercise-item:hover {
  background-color: #f8fafc;
}

.exercise-name {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.exercise-number {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--navy);
  color: var(--pure-white);
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
}

.exercise-details {
  flex: 1;
  min-width: 0;
}

.exercise-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--deep-black);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exercise-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.exercise-sets-chip,
.exercise-volume-chip {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--navy);
  background-color: rgba(11, 37, 69, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.superset-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: var(--brick-red);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.exercise-weight {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.max-weight {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--navy);
}

.weight-progress {
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  text-transform: uppercase;
}

.weight-progress.positive {
  color: white;
  background-color: var(--navy);
}

.weight-progress.negative {
  color: white;
  background-color: var(--brick-red);
}

/* Estilos para botones */
.btn-primary {
  @apply bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors;
}
.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm transition-colors;
}

/* Estilos para cards */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100;
}

/* Animaciones */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
