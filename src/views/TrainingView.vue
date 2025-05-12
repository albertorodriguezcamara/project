<template>
  <div class="training-container">
    <RoutinePreviewModal
      v-if="selectedRoutine"
      :rutina="selectedRoutine"
      :visible="!!selectedRoutine"
      @close="closeRoutineModal"
      @edit="editRoutine"
      @start="startRoutine"
    />

    <!-- Hero Section -->
    <div class="hero-section">
      <!-- Texturas americanas decorativas -->
      <div class="texture-element stars-texture"></div>
      <div class="texture-element stripes-texture"></div>
      <div class="texture-element dots-texture"></div>
      
      <div class="hero-content">
        <div class="welcome-text">
          <div class="title-container">
            <h1>ENTRENAMIENTO</h1>
          </div>
          <div class="date-container">
            <p class="date">{{ today }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Active Mesocycle Warning -->
    <div v-if="!activeMesociclo" class="warning-section">
      <div class="warning-icon-container">
        <AlertTriangle class="warning-icon" />
      </div>
      <h2 class="warning-title">NO HAY MESOCICLO ACTIVO</h2>
      <p class="warning-message">
        Para comenzar tu entrenamiento, necesitas seleccionar un mesociclo activo.
      </p>
      <router-link to="/config" class="btn-config">
        <Settings class="btn-icon" />
        <span>IR A CONFIGURACIÓN</span>
      </router-link>
    </div>

    <!-- Active Mesocycle Content -->
    <template v-else>
      <!-- Current Mesocycle Status -->
      <div class="mesocycle-status" :class="{'completed': isMesocicloComplete}">
        <div class="mesocycle-header">
          <div class="mesocycle-title">
            <h2>{{ activeMesociclo.name }}</h2>
            <div class="mesocycle-badge">
              <span>{{ activeMesociclo.order }}</span>
              <span class="separator">/</span>
              <span>{{ trainingStore.mesociclos.length }}</span>
            </div>
          </div>
        </div>
        
        <!-- Festive Message when Mesocycle is 100% complete -->
        <div v-if="isMesocicloComplete" class="completion-message">
          <div class="award-container">
            <Award class="award-icon" />
          </div>
          <p class="congrats-text">¡FELICIDADES! HAS COMPLETADO ESTE MESOCICLO</p>
          <button @click="goToConfiguration" class="next-mesocycle-btn">
            ACTIVAR SIGUIENTE MESOCICLO
          </button>
        </div>
        
        <!-- Progress Bar - Based on completed workouts -->
        <div class="progress-container">
          <div class="progress-header">
            <span class="progress-label">PROGRESO DEL MESOCICLO</span>
            <span class="progress-percentage">{{ Math.round(mesocicloProgress) }}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" 
                 :class="{'completed-bar': isMesocicloComplete}"
                 :style="`width: ${mesocicloProgress}%`">
            </div>
          </div>
          <div class="progress-stats">
            <span class="workout-count">{{ completedRoutinesCount }} DE {{ totalRoutinesInMesociclo }} ENTRENAMIENTOS COMPLETADOS</span>
          </div>
        </div>
      </div>

      <!-- Routines Grid -->
      <div class="routines-grid">
        <div
          v-for="rutina in activeMesociclo.rutinas"
          :key="rutina.id"
          class="routine-card"
          @click="openRoutine(rutina)"
        >
          <div class="routine-card-decoration top"></div>
          <div class="routine-card-decoration bottom"></div>
          <div class="card-texture stars-small"></div>
          <div class="card-texture stripes-diagonal"></div>
          <div class="card-texture dots-pattern"></div>
          

          <!-- Status Badge -->
          <div class="status-badge" :class="isRoutineCompleted(rutina.id) ? 'completed' : 'pending'">
            {{ isRoutineCompleted(rutina.id) ? 'COMPLETADO' : 'PENDIENTE' }}
          </div>

          <!-- Header -->
          <div class="routine-header">
            <div class="routine-title">
              <div class="title-banner">
                <h3 class="routine-name" style="color: #FFD700 !important;">{{ rutina.name }}</h3>
              </div>
              <div class="exercise-count">
                <Activity class="count-icon" />
                <span>{{ rutina.routine_exercises?.length || 0 }} EJERCICIOS</span>
              </div>
            </div>
            <div class="routine-action-icon" :class="isRoutineCompleted(rutina.id) ? 'completed' : 'pending'">
              <CheckCircle v-if="isRoutineCompleted(rutina.id)" />
              <Play v-else />
            </div>
          </div>

          <!-- Exercise Preview with athletic design -->
          <div class="exercise-preview">
            <div class="exercise-preview-header">
              <div class="section-title-banner">
                <h5>EJERCICIOS</h5>
              </div>
            </div>
            <ul class="exercise-list">
              <li 
                v-for="(ejercicio, index) in rutina.routine_exercises?.slice(0, 3)"
                :key="ejercicio.id"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100/80 transition-colors"
              >
                <div class="exercise-number">
                  {{ index + 1 }}
                </div>
                <div class="exercise-details">
                  <p class="exercise-name">{{ ejercicio.exercise?.name_es || ejercicio.exercise?.name || 'Ejercicio' }}</p>
                  <div class="exercise-sets-chip">
                    <span>{{ ejercicio.sets }} SERIES</span>
                  </div>
                </div>
              </li>
              <li v-if="(rutina.routine_exercises?.length || 0) > 3" 
                class="more-exercises"
              >
                <span class="more-badge">+{{ rutina.routine_exercises!.length - 3 }}</span>
                <span>EJERCICIOS MÁS</span>
              </li>
            </ul>
          </div>

          <!-- Stats with athletic design -->
          <div class="routine-stats">
            <div class="stat-card completion">
              <div class="stat-content">
                <div class="stat-banner">
                  <p class="stat-label">COMPLETADO</p>
                </div>
                <div class="stat-value-container">
                  <Trophy class="stat-icon" />
                  <p class="stat-value">{{ getCompletionCount(rutina.id) }}x</p>
                </div>
              </div>
              <div class="stat-texture stars-pattern"></div>
            </div>
            <div class="stat-card duration">
              <div class="stat-content">
                <div class="stat-banner">
                  <p class="stat-label">DURACIÓN EST.</p>
                </div>
                <p class="stat-value">45-60<span class="stat-unit">MIN</span></p>
              </div>
              <div class="stat-texture stripes-pattern"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Settings, 
  AlertTriangle, 
  Activity,
  CheckCircle,
  Play,
  Award,
  Trophy
} from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import type { Rutina } from '@/types';
import RoutinePreviewModal from '@/components/training/RoutinePreviewModal.vue';
import { useActiveWorkoutStore } from '@/stores/activeWorkout';
import { toast } from 'vue3-toastify';

const router = useRouter();
const trainingStore = useTrainingStore();
const workoutLogsStore = useWorkoutLogsStore();
const selectedRoutine = ref<Rutina | null>(null);
const activeWorkoutStore = useActiveWorkoutStore();

onMounted(async () => {
  await trainingStore.fetchMesociclos();
  // Cargar los registros de entrenamientos completados
  if (workoutLogsStore.workouts.length === 0) {
    await workoutLogsStore.getWorkouts();
  }
});

const activeMesociclo = computed(() => trainingStore.activeMesociclo);

const today = computed(() => new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));

// Total de rutinas en el mesociclo activo
const totalRoutinesInMesociclo = computed(() => {
  if (!activeMesociclo.value) return 0;
  return activeMesociclo.value.rutinas?.length || 0;
});

// Contar rutinas completadas en el mesociclo activo
const completedRoutinesCount = computed(() => {
  if (!activeMesociclo.value) return 0;
  
  // Obtener IDs únicos de rutinas completadas (para no contar repeticiones)
  const completedRoutineIds = new Set();
  activeMesociclo.value.rutinas?.forEach(rutina => {
    if (isRoutineCompleted(rutina.id)) {
      completedRoutineIds.add(rutina.id);
    }
  });
  
  return completedRoutineIds.size;
});

// Calcular el progreso del mesociclo basado en entrenamientos completados
const mesocicloProgress = computed(() => {
  if (!activeMesociclo.value || totalRoutinesInMesociclo.value === 0) return 0;
  return (completedRoutinesCount.value / totalRoutinesInMesociclo.value) * 100;
});

// Comprobar si el mesociclo está completo (100%)
const isMesocicloComplete = computed(() => {
  return mesocicloProgress.value === 100;
});

function openRoutine(rutina: Rutina) {
  selectedRoutine.value = rutina;
}

function closeRoutineModal() {
  selectedRoutine.value = null;
}

function editRoutine(rutina: Rutina) {
  router.push(`/config?edit=rutina&id=${rutina.id}`);
}

function startRoutine(rutina: Rutina) {
  activeWorkoutStore.startFromRoutine(rutina);
  selectedRoutine.value = null;
  router.push('/active-workout');
}

function isRoutineCompleted(rutinaId: string) {
  // Verificar si hay al menos un workout completado para esta rutina
  return workoutLogsStore.workouts.some(w => w.rutina_id === rutinaId);
}

function getCompletionCount(rutinaId: string) {
  // Contar cuántas veces se ha completado esta rutina
  return workoutLogsStore.workouts.filter(w => w.rutina_id === rutinaId).length;
}

// Función para ir a la pestaña de configuración
function goToConfiguration() {
  router.push('/config');
}
</script>

<style scoped>
:root {
  --navy: #1F2D48;
  --brick-red: #A52A2A;
  --gold: #FFD700;
  --pure-white: #FFFFFF;
  --deep-black: #111111;
}

/* Base container styles */
.training-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

/* Hero section styles */
.hero-section {
  background: var(--navy);
  margin: 0 -1rem;
  padding: 2rem 1.5rem;
  border-radius: 0;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero-section {
    margin: 0;
    border-radius: 1rem;
    padding: 3rem 2rem;
  }
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h50v50H0z' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M50 0h50v50H50z' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M0 50h50v50H0z' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M50 50h50v50H50z' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E");
  opacity: 0.3;
  transform: rotate(15deg);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.title-container {
  background-color: var(--navy);
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.title-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.welcome-text h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
  margin: 0;
  padding: 0;
}

/* Texturas americanas decorativas */
.texture-element {
  position: absolute;
  pointer-events: none;
  opacity: 0.15;
  z-index: 0;
}

.stars-texture {
  top: 10px;
  right: 10px;
  width: 120px;
  height: 120px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23ffffff' d='M50 0l12 38h38l-30 22 12 38-32-23-32 23 12-38-30-22h38z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  transform: rotate(15deg);
}

.stripes-texture {
  bottom: 20px;
  left: 20px;
  width: 150px;
  height: 150px;
  background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px);
  border-radius: 50%;
}

.dots-texture {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background-image: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px);
  background-size: 20px 20px;
  border-radius: 50%;
  opacity: 0.1;
}

/* Contenedor de fecha */
.date-container {
  background-color: var(--brick-red);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  margin-top: 0.5rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: skewX(-5deg);
}

.welcome-text .date {
  font-family: 'Oswald', sans-serif;
  font-size: 1.125rem;
  color: var(--pure-white);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  transform: skewX(5deg);
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Warning section styles */
.warning-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 2px solid #f3f4f6;
}

.warning-icon-container {
  width: 80px;
  height: 80px;
  background-color: var(--brick-red);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 10px rgba(239, 131, 84, 0.3);
}

.warning-icon {
  width: 40px;
  height: 40px;
}

.warning-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #0b2545;
  letter-spacing: 0.5px;
}

.warning-message {
  font-size: 1.125rem;
  color: #4a5568;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.btn-config {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  background-color: var(--navy);
  color: white;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(31, 45, 72, 0.2);
}

.btn-config:hover {
  background-color: var(--brick-red);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(239, 131, 84, 0.3);
}

.btn-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
}

.stat-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--gold);
  margin-right: 0.5rem;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.2));
}

/* Mesocycle status styles */
.mesocycle-status {
  background: var(--navy);
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.mesocycle-status.completed {
  background: var(--brick-red);
  animation: pulse 2s infinite;
}

.mesocycle-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.mesocycle-title h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--pure-white);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.mesocycle-badge {
  display: inline-flex;
  align-items: center;
  background: var(--gold);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 600;
  color: var(--navy);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mesocycle-badge .separator {
  margin: 0 0.25rem;
  color: var(--navy);
  font-weight: 800;
}

.completion-message {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.award-container {
  width: 60px;
  height: 60px;
  background: var(--gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
}

.award-icon {
  width: 35px;
  height: 35px;
  color: #0b2545;
}

.congrats-text {
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.next-mesocycle-btn {
  background: var(--pure-white);
  color: var(--brick-red);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-mesocycle-btn:hover {
  background: var(--gold);
  color: var(--navy);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
}

.progress-container {
  margin-top: 1.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.progress-percentage {
  font-family: 'Oswald', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
}

.progress-bar-container {
  height: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: white;
  border-radius: 1rem;
  transition: width 0.5s ease-out;
}

.progress-bar.completed-bar {
  background: var(--gold);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.workout-count {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Routines grid styles */
.routines-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .routines-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .routines-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.routine-card {
  position: relative;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 2px solid #f3f4f6;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.stat-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.stars-pattern {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='%23FFD700' opacity='0.1' d='M30 0l7 22h23l-18 13 7 22-19-14-19 14 7-22-18-13h23z'/%3E%3C/svg%3E");
  background-size: 60px;
  background-position: center right;
  background-repeat: no-repeat;
}

.stripes-pattern {
  background-image: repeating-linear-gradient(45deg, rgba(31, 45, 72, 0.03) 0, rgba(31, 45, 72, 0.03) 5px, transparent 5px, transparent 10px);
}

.routine-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.routine-card-decoration {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  z-index: 0;
}

.routine-card-decoration.top {
  top: -60px;
  right: -60px;
  background: linear-gradient(135deg, rgba(31, 45, 72, 0.05) 0%, rgba(31, 45, 72, 0.1) 100%);
}

.routine-card-decoration.bottom {
  bottom: -60px;
  left: -60px;
  background: linear-gradient(135deg, rgba(165, 42, 42, 0.05) 0%, rgba(165, 42, 42, 0.1) 100%);
}

/* Texturas atléticas americanas para cards */
.card-texture {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.stars-small {
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M50 0l12 38h38l-30 22 12 38-32-23-32 23 12-38-30-22h38z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.15;
  transform: rotate(15deg);
}

.stripes-diagonal {
  bottom: 10px;
  left: 10px;
  width: 100px;
  height: 100px;
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 5px, transparent 5px, transparent 10px);
  border-radius: 0;
  opacity: 0.3;
}

.dots-pattern {
  top: 50%;
  left: 20px;
  width: 80px;
  height: 150px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='2' fill='%23FFD700' opacity='0.2'/%3E%3C/svg%3E");
  background-size: 20px 20px;
  opacity: 0.5;
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.status-badge.completed {
  background-color: var(--gold);
  color: var(--navy);
  border: none;
}

.status-badge.pending {
  background-color: var(--navy);
  color: var(--pure-white);
  border: none;
}

.routine-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  z-index: 1;
}

.routine-title {
  flex: 1;
}

.title-banner {
  background-color: var(--navy);
  padding: 0.25rem 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
}

.title-banner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

h3.routine-name,
.routine-name,
[class*='routine-name'],
.title-banner h3 {
  font-family: 'Oswald', sans-serif !important;
  font-size: 1.25rem !important;
  font-weight: 800 !important;
  margin: 0 !important;
  color: var(--gold) !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  transform: skewX(5deg) !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.routine-card:hover .routine-title h3 {
  color: #EF8354;
}

.exercise-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--brick-red);
  color: var(--pure-white);
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-flex;
  margin-top: 0.5rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.count-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--pure-white);
  margin-right: 0.25rem;
}

.routine-action-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: rotate(-5deg);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.routine-action-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.routine-action-icon.completed {
  background-color: var(--gold);
  color: var(--navy);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFFFFF' opacity='0.1' d='M50 0l12 38h38l-30 22 12 38-32-23-32 23 12-38-30-22h38z'/%3E%3C/svg%3E");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}

.routine-action-icon.pending {
  background-color: var(--navy);
  color: var(--pure-white);
  background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 0, rgba(255, 255, 255, 0.05) 5px, transparent 5px, transparent 10px);
}

.routine-card:hover .routine-action-icon.completed {
  background-color: var(--gold);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(-8deg) scale(1.05);
}

.routine-card:hover .routine-action-icon.pending {
  background-color: var(--navy);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(-8deg) scale(1.05);
}

/* Exercise preview styles */
.exercise-preview {
  position: relative;
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  z-index: 1;
  transition: all 0.3s ease;
}

.routine-card:hover .exercise-preview {
  background: white;
  border-color: #cbd5e1;
}

.exercise-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title-banner {
  background-color: var(--brick-red);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.section-title-banner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.exercise-preview-header h5 {
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--pure-white);
  letter-spacing: 1px;
  margin: 0;
  transform: skewX(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.exercise-item:hover {
  background-color: rgba(241, 245, 249, 0.8);
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
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.exercise-details {
  flex: 1;
  min-width: 0;
}

.exercise-name {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-banner {
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

.stat-banner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.stat-label {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
  letter-spacing: 0.5px;
  transform: skewX(5deg);
}

.exercise-sets-chip {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background-color: rgba(31, 45, 72, 0.1);
  color: var(--navy);
  border-radius: 0.25rem;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
}

.more-exercises {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  transition: color 0.3s ease;
}

.more-exercises:hover {
  color: #0b2545;
}

.more-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background-color: var(--brick-red);
  color: white;
  border-radius: 0.25rem;
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Stats styles */
.routine-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.stat-card {
  position: relative;
  padding: 1rem;
  border-radius: 0.75rem;
  overflow: hidden;
}

.stat-card.completion {
  background: linear-gradient(135deg, rgba(31, 45, 72, 0.05) 0%, rgba(31, 45, 72, 0.1) 100%);
  border: 1px solid rgba(31, 45, 72, 0.1);
}

.stat-card.duration {
  background: linear-gradient(135deg, rgba(239, 131, 84, 0.05) 0%, rgba(239, 131, 84, 0.1) 100%);
  border: 1px solid rgba(239, 131, 84, 0.1);
}

.stat-content {
  position: relative;
  z-index: 1;
}

.stat-label {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #64748b;
}

.stat-value-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--gold);
}

.stat-value {
  font-family: 'Oswald', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--navy);
  margin: 0;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
  display: inline-block;
  position: relative;
}

.stat-unit {
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

/* Animation keyframes */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 131, 84, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(239, 131, 84, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 131, 84, 0);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>