<template>
  <div class="dashboard-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="welcome-text">
          <h1>¡BIENVENIDO<br>DE NUEVO!</h1>
          <p class="date">{{ today }}</p>
        </div>

        <div class="action-buttons">
          <router-link to="/training" class="btn-primary">
            <Dumbbell class="btn-icon" />
            <span>COMENZAR ENTRENAMIENTO</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-container navy">
          <Calendar class="stat-icon" />
        </div>
        <div class="stat-content">
          <p class="stat-label">MESOCICLO</p>
          <p class="stat-value">{{ currentMesocycle }}/{{ totalMesocycles }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-container brick">
          <Activity class="stat-icon" />
        </div>
        <div class="stat-content">
          <p class="stat-label">RUTINAS</p>
          <p class="stat-value">{{ activeRoutinesCount }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-container navy">
          <Timer class="stat-icon" />
        </div>
        <div class="stat-content">
          <p class="stat-label">EJERCICIOS</p>
          <p class="stat-value">{{ totalExercises }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-container brick">
          <TrendingUp class="stat-icon" />
        </div>
        <div class="stat-content">
          <p class="stat-label">PROGRESO</p>
          <p class="stat-value">{{ progressPercentage }}%</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Mesocycle Overview -->
    <div class="mesocycle-section">
      <div class="section-header">
        <h2>ESTADO DEL MESOCICLO</h2>
        <router-link to="/config" class="section-action">
          <ChevronRight class="action-icon" />
        </router-link>
      </div>

      <div class="mesocycle-list">
        <div
          v-for="meso in sortedMesociclos"
          :key="meso.id"
          class="mesocycle-item"
          :class="{
            'active': meso.active,
            'completed': meso.completed,
            'pending': !meso.active && !meso.completed
          }"
        >
          <div class="mesocycle-content">
            <div class="mesocycle-icon-container">
              <Trophy v-if="meso.completed" class="mesocycle-icon completed" />
              <div v-else-if="meso.active" class="active-indicator"></div>
            </div>
            <div class="mesocycle-info">
              <h3>{{ meso.name }}</h3>
              <p>{{ meso.rutinas?.length || 0 }} rutinas</p>
            </div>
            <div class="mesocycle-status">
              <span :class="{
                'status-active': meso.active,
                'status-completed': meso.completed,
                'status-pending': !meso.active && !meso.completed
              }">
                {{
                  meso.active
                    ? 'ACTIVO'
                    : meso.completed
                    ? 'COMPLETADO'
                    : 'PENDIENTE'
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="section-header">
        <h2>ACTIVIDAD RECIENTE</h2>
        <router-link to="/history" class="section-action">
          <ChevronRight class="action-icon" />
        </router-link>
      </div>

      <div class="activity-list">
        <template v-for="(workout, index) in recentWorkouts">
          <router-link
            v-if="workout.id"
            :key="workout.id"
            :to="{ name: 'completed-routine', params: { id: workout.id } }"
            class="activity-item"
          >
            <!-- Workout Header -->
            <div class="activity-header">
              <div class="activity-title">
                <h4>Entrenamiento</h4>
                <div class="activity-meta-mobile">
                  <span class="activity-date">{{ formatDate(workout.date).split(' ')[0] }}</span>
                  <span v-if="workout.duracion" class="activity-duration">{{ workout.duracion }} min</span>
                </div>
              </div>
              <div class="activity-time">
                <span>{{ formatDate(workout.date).split(' ')[1] }}</span>
              </div>
            </div>

            <!-- Exercise Summary -->
            <div class="exercise-summary">
              <div class="summary-header">
                <h5>EJERCICIOS</h5>
                <span class="view-details">Ver detalles</span>
              </div>
              <ul class="exercise-list">
                <li
                  v-for="(ex, idx) in workout.exercises.slice(0, 2)"
                  :key="ex.ejercicio_id"
                  class="exercise-item"
                >
                  <div class="exercise-name">
                    <span class="exercise-number">{{ idx + 1 }}</span>
                    <span class="exercise-title">{{ ex.ejercicioNombre_es || 'Ejercicio' }}</span>
                  </div>
                  <div class="exercise-sets">
                    <div class="set-chips">
                      <template
                        v-for="(set, sidx) in ex.series.slice(0, 2)"
                        :key="sidx"
                      >
                        <span class="set-chip">{{ set.peso }}kg × {{ set.repeticiones }}</span>
                      </template>
                      <span v-if="ex.series.length > 2" class="more-sets-chip">+{{ ex.series.length - 2 }}</span>
                    </div>
                  </div>
                </li>
                <li v-if="workout.exercises.length > 2" class="more-exercises">
                  <span class="more-exercises-badge">+{{ workout.exercises.length - 2 }}</span> ejercicios más
                </li>
              </ul>
            </div>
          </router-link>
          <div
            v-else
            :key="'no-id-' + index"
            class="empty-activity"
          >
            Entrenamiento sin datos suficientes
          </div>
        </template>

        <!-- Empty State -->
        <div v-if="recentWorkouts.length === 0" class="empty-state">
          <div class="empty-icon-container">
            <Activity class="empty-icon" />
          </div>
          <p class="empty-text">No hay actividad reciente</p>
          <router-link to="/training" class="start-training-link">
            COMENZAR UN ENTRENAMIENTO
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ----------------------------------------------------
   IMPORTS
---------------------------------------------------- */
import { computed, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import {
  Dumbbell,
  Calendar,
  Activity,
  Timer,
  TrendingUp,
  ChevronRight,
  Award,
  Trophy
} from 'lucide-vue-next';

import { useTrainingStore } from '@/stores/training';
import { useWorkoutLogsStore } from '@/stores/workoutLogs';
import { useExerciseLibraryStore } from '@/stores/exerciseLibrary';

/* ----------------------------------------------------
   STORES & ROUTER
---------------------------------------------------- */
const router            = useRouter();
const trainingStore     = useTrainingStore();
const workoutLogsStore  = useWorkoutLogsStore();
const exerciseLibraryStore = useExerciseLibraryStore();

/* ----------------------------------------------------
   CARGA DE DATOS
---------------------------------------------------- */
async function fetchDashboardData() {
  await Promise.all([
    trainingStore.fetchMesociclos(),
    workoutLogsStore.getWorkouts(),
    exerciseLibraryStore.fetchExerciseLibrary()
  ]);
}
onMounted(fetchDashboardData);
onActivated(fetchDashboardData);

/* ----------------------------------------------------
   PROPIEDADES COMPUTADAS BÁSICAS
---------------------------------------------------- */
const today = computed(() =>
  new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
);

const sortedMesociclos     = computed(() => trainingStore.sortedMesociclos);
const currentMesocycle     = computed(() => trainingStore.activeMesociclo?.order || 0);
const totalMesocycles      = computed(() => trainingStore.mesociclos.length);
const activeRoutinesCount  = computed(() => trainingStore.activeMesociclo?.rutinas?.length || 0);

// Total de ejercicios completados desde siempre (basado en los registros de entrenamiento)
const totalExercises = computed(() => {
  // Contar todos los ejercicios completados en todos los entrenamientos
  return workoutLogsStore.workouts.reduce((total, workout) => {
    // Sumar los ejercicios de cada entrenamiento
    return total + (workout.ejercicios?.length || 0);
  }, 0);
});

// Progreso basado en rutinas únicas realizadas vs total de rutinas del mesociclo activo
const progressPercentage = computed(() => {
  // Si no hay mesociclo activo, retornar 0
  if (!trainingStore.activeMesociclo) return 0;
  
  // Total de rutinas en el mesociclo activo
  const totalRoutinesInActiveMesociclo = trainingStore.activeMesociclo.rutinas?.length || 0;
  
  if (!totalRoutinesInActiveMesociclo) return 0;
  
  // Obtener IDs de rutinas en el mesociclo activo
  const activeRutinaIds = new Set();
  trainingStore.activeMesociclo.rutinas?.forEach(rutina => {
    activeRutinaIds.add(rutina.id);
  });
  
  // Contar rutinas completadas que pertenecen al mesociclo activo
  const completedActiveRoutines = new Set();
  workoutLogsStore.workouts.forEach(workout => {
    if (workout.rutina_id && activeRutinaIds.has(workout.rutina_id)) {
      completedActiveRoutines.add(workout.rutina_id);
    }
  });
  
  // Calcular el porcentaje
  return Math.round((completedActiveRoutines.size / totalRoutinesInActiveMesociclo) * 100);
});

/* ----------------------------------------------------
   UTILIDADES
---------------------------------------------------- */
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    // 2025-05-10T19:05:51.949+0000 → 2025-05-10 19:05:51
    return dateString.substring(0, 19).replace('T', ' ');
  } catch {
    return dateString;
  }
};

/* ----------------------------------------------------
   RECENT WORKOUTS
---------------------------------------------------- */
const recentWorkouts = computed(() => {
  const workouts     = workoutLogsStore.workouts      || [];
  const mesocycles   = trainingStore.mesociclos       || [];
  const exerciseLB   = exerciseLibraryStore.exercises || [];

  /* ---- diccionario de fallback id -> nombre_es ---- */
  const exerciseDict: Record<string, string> = {};
  if (Array.isArray(exerciseLibraryStore.exercises)) {
    exerciseLibraryStore.exercises.forEach(e => {
      if (e.uuid) exerciseDict[e.uuid] = e.name_es || e.name_en || 'Ejercicio';
      if (e.id && e.id !== e.uuid) exerciseDict[e.id] = e.name_es || e.name_en || 'Ejercicio';
    });
  }

  return workouts.slice(0, 3).map(w => {
    /* localizar rutina / mesociclo */
    let rutina: any = null;
    let mesociclo: any = null;

    for (const m of mesocycles) {
      if (!m.rutinas) continue;
      const rMatch = m.rutinas.find((r: any) => r.id === w.rutina_id);
      if (rMatch) {
        rutina = rMatch;
        mesociclo = m;
        break;
      }
    }

    /* mapear ejercicios */
    const ejercicios = (w.ejercicios || []).map(ex => {
      let nombre = 'Ejercicio';

      // 1) buscar dentro de la rutina
      if (rutina?.ejercicios?.length) {
        const ej = rutina.ejercicios.find((e: any) => e.id === ex.ejercicio_id);
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

      return {
        ...ex,
        ejercicioNombre_es: nombre,
        series: ex.sets || []
      };
    });

    /* objeto final */
    return {
      id: w.id,
      rutinaName:    rutina?.name   || 'Entrenamiento',
      mesocicloName: mesociclo?.name || '',
      date: w.fecha,
      duracion: w.duracion || '',
      exercises: ejercicios
    };
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap');

/* Variables */
:root {
  /* Colores base */
  --navy: #1F2D48;
  --navy-dark: #141E32;
  --brick-red: #A52A2A;
  --brick-red-dark: #8B2323;
  --pure-white: #FFFFFF;
  --deep-black: #111111;
  --gold-accent: #FFD700;
  --silver-accent: #C0C0C0;

  /* Sombras y efectos */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.25);
  --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.3);
  --text-shadow-strong: 2px 2px 0px rgba(0, 0, 0, 0.3);
}

/* Container principal */
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 2rem;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%), 
              url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20zm40 0h20v20H60V20zm20 20h20v20H80V40zm-20 0h20v20H60V40zm-40 0h20v20H20V40zm60 40h20v20H80V80zm-20 0h20v20H60V80zm-40 0h20v20H20V80zm60-80h20v20H80V0z'/%3E%3C/g%3E%3C/svg%3E");
  color: var(--pure-white);
  border-radius: 1rem;
  padding: 2.5rem 1.5rem;
  margin: -1rem -1rem 0;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
  border-bottom: 4px solid var(--brick-red);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.welcome-text h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  text-shadow: var(--text-shadow-strong);
  -webkit-text-stroke: 1px rgba(0,0,0,0.2);
}

.welcome-text .date {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.action-buttons {
  margin-top: 2rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, var(--brick-red) 0%, var(--brick-red-dark) 100%);
  color: var(--pure-white);
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: var(--shadow-md);
  clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: var(--shadow-lg);
}

.btn-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background-color: var(--pure-white);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.stat-icon-container.navy {
  background-color: var(--navy);
  color: var(--pure-white);
}

.stat-icon-container.brick {
  background-color: var(--brick-red);
  color: var(--pure-white);
}

.stat-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--deep-black);
  opacity: 0.7;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--deep-black);
}

.progress-bar {
  height: 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--brick-red) 0%, var(--brick-red-dark) 100%);
  border-radius: 1rem;
  transition: width 0.5s ease;
}

/* Section Styles */
.mesocycle-section,
.activity-section {
  background-color: var(--pure-white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header {
  background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid var(--brick-red);
}

.section-header h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--pure-white);
}

.section-action {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--pure-white);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--navy);
  transition: all 0.3s ease;
}

.section-action:hover {
  background-color: var(--brick-red);
  color: var(--pure-white);
  transform: scale(1.1);
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Mesocycle List */
.mesocycle-list {
  display: flex;
  flex-direction: column;
}

.mesocycle-item {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.mesocycle-item.active {
  background-color: rgba(31, 45, 72, 0.05);
}

.mesocycle-item.completed {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.1) 100%);
}

.mesocycle-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.mesocycle-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mesocycle-icon-container {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.mesocycle-icon.completed {
  color: var(--gold-accent);
  width: 1.5rem;
  height: 1.5rem;
}

.active-indicator {
  width: 0.75rem;
  height: 0.75rem;
  background-color: var(--brick-red);
  border-radius: 50%;
}

.mesocycle-info {
  flex: 1;
}

.mesocycle-info h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--deep-black);
  margin-bottom: 0.25rem;
}

.mesocycle-info p {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}

.mesocycle-status span {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.status-active {
  background-color: var(--navy);
  color: var(--pure-white);
}

.status-completed {
  background-color: var(--gold-accent);
  color: var(--deep-black);
}

.status-pending {
  background-color: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.6);
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: block;
}

.activity-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.activity-title h4 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-meta-mobile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.activity-date {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--brick-red);
  background-color: rgba(165, 42, 42, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.activity-duration {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--navy);
  display: flex;
  align-items: center;
}

.activity-time {
  background-color: var(--navy);
  color: white;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.exercise-summary {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-top: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
}

.summary-header h5 {
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--navy);
  letter-spacing: 1px;
}

.view-details {
  font-size: 0.75rem;
  color: white;
  font-weight: 700;
  background-color: var(--brick-red);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: 'Roboto Condensed', sans-serif;
}

.exercise-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exercise-item {
  display: flex;
  flex-direction: column;
}

.exercise-name {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.exercise-number {
  width: 1.75rem;
  height: 1.75rem;
  background-color: var(--navy);
  color: var(--pure-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  margin-right: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.exercise-title {
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--deep-black);
  letter-spacing: 0.25px;
}

.exercise-sets {
  margin-left: 2rem;
  margin-top: 0.5rem;
}

.set-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.set-chip {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--navy);
  background-color: rgba(31, 45, 72, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.more-sets-chip {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: var(--navy);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.more-exercises {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  padding-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.more-exercises-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  background-color: var(--brick-red);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.empty-activity {
  padding: 1.25rem;
  text-align: center;
  color: rgba(0, 0, 0, 0.4);
  font-style: italic;
}

.empty-state {
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon-container {
  width: 4rem;
  height: 4rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.empty-icon {
  width: 2rem;
  height: 2rem;
  color: rgba(0, 0, 0, 0.3);
}

.empty-text {
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.start-training-link {
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--brick-red);
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.start-training-link:hover {
  color: var(--navy);
}

/* Media Queries */
@media (min-width: 768px) {
  .hero-section {
    padding: 3rem 2rem;
    margin: 0;
    border-radius: 1rem;
  }

  .welcome-text h1 {
    font-size: 3rem;
  }

  .stats-grid {
    gap: 1.5rem;
  }

  .mesocycle-item,
  .activity-item {
    padding: 1.5rem;
  }
}
</style>
