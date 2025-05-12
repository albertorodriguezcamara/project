<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar - Athletic American Style -->
    <aside class="hidden md:flex md:flex-shrink-0">
      <div class="sidebar-container">
        <div class="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          <!-- Texturas decorativas -->
          <div class="sidebar-texture stars-texture"></div>
          <div class="sidebar-texture stripes-texture"></div>
          <div class="sidebar-texture dots-texture"></div>
          
          <!-- Logo - Athletic American Style -->
          <div class="app-logo-container">
            <div class="app-logo-banner">
              <Dumbbell class="app-logo-icon" />
              <span class="app-logo-text">RUTINAS.ES</span>
            </div>
          </div>

          <!-- Navigation - Athletic American Style -->
          <nav class="sidebar-nav">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="nav-link"
              :class="{
                'nav-link-active': $route.path === item.to
              }"
            >
              <div class="nav-link-content">
                <component
                  :is="item.icon"
                  class="nav-icon"
                  :class="{
                    'nav-icon-active': $route.path === item.to
                  }"
                />
                <span class="nav-text">{{ item.name }}</span>
              </div>
            </router-link>
          </nav>
        </div>

        <!-- User Menu - Athletic American Style -->
        <div class="user-menu-container">
          <div class="user-menu-content">
            <div class="user-avatar">
              <div class="user-initial">{{ userInitial }}</div>
            </div>
            <div class="user-info">
              <div class="user-email group">
                {{ userEmail }}
                <button
                  @click="handleLogout"
                  class="logout-button"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile menu - Athletic American Style -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe-area shadow-xl" style="background-color: #0b2545; padding-bottom: env(safe-area-inset-bottom);">
      <nav class="flex justify-between items-center px-2 py-1 h-16 relative">
        <!-- Fondo con textura -->
        <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.1) 0, rgba(255, 215, 0, 0.1) 10px, transparent 10px, transparent 20px);"></div>
        
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center justify-center flex-1 mx-0.5 rounded-lg transition-all duration-150 py-1 relative z-10"
          :class="[
            $route.path === item.to
              ? 'text-yellow-400 scale-105'
              : 'text-white hover:text-yellow-200'
          ]"
          style="min-width: 50px; min-height: 48px;"
        >
          <component
            :is="item.icon"
            class="h-6 w-6 mb-1"
            :class="$route.path === item.to ? 'text-yellow-400' : 'text-white'"
          />
          <span class="text-[10px] font-bold uppercase tracking-tight truncate w-full text-center">{{ item.name }}</span>
          
          <!-- Indicador activo -->
          <div 
            v-if="$route.path === item.to" 
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-t"
            style="background-color: #a52a2a;"
          ></div>
        </router-link>
      </nav>
    </div>

    <!-- Ribbon de entrenamiento activo - Athletic American Style -->
    <div
      v-if="activeWorkout && sourceRoutine && !isActiveWorkoutRoute"
      class="active-workout-ribbon fixed top-0 left-0 right-0 z-40"
    >
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <span class="text-xs font-extrabold uppercase tracking-wide text-yellow-400 drop-shadow-sm">ENTRENAMIENTO ACTIVO:</span>
          <span class="text-sm font-bold text-white max-w-[120px] md:max-w-[200px] truncate drop-shadow-sm">{{ sourceRoutine.name }}</span>
          <div class="flex items-center bg-black bg-opacity-30 rounded-md px-2 py-1 border-l-2 border-red-700">
            <span class="font-mono text-base font-bold text-white mr-2 drop-shadow-sm">{{ formatTime(globalTimerSeconds) }}</span>
            <button v-if="!globalIsPaused" @click="pauseGlobalTimer" class="w-7 h-7 flex items-center justify-center rounded-full bg-red-700 text-white border border-white border-opacity-30">
              <Pause class="w-4 h-4" />
            </button>
            <button v-else @click="resumeGlobalTimer" class="w-7 h-7 flex items-center justify-center rounded-full bg-yellow-400 text-navy border border-black border-opacity-10">
              <Play class="w-4 h-4" />
            </button>
          </div>
        </div>
        <button @click="goToActiveWorkout" class="bg-red-700 text-white font-bold uppercase text-xs tracking-wide py-2 px-3 rounded border-2 border-yellow-400 transform -skew-x-6 shadow-md hover:bg-white hover:text-red-700 transition-all ml-2 mr-4">
          <div class="flex flex-col items-center">
            <span>VOLVER AL</span>
            <span>ENTRENAMIENTO</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden" style="padding-top: 0;" :style="ribbonPaddingStyle">
      <main class="flex-1 overflow-y-auto pb-20 md:pb-0 bg-white rounded-t-3xl shadow-xl mt-2 md:mt-0">
        <div class="py-3 px-2 sm:px-4">
          <router-view v-slot="{ Component }" :key="route.fullPath + '-' + (activeWorkout && sourceRoutine && !isActiveWorkoutRoute ? 'ribbon' : 'noribbon')">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import { Dumbbell, LayoutDashboard, Settings, Dumbbell as Training, History, Library, Pause, Play } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import { useActiveWorkoutStore } from '@/stores/activeWorkout';

const router = useRouter();
const authStore = useAuthStore();
const activeWorkoutStore = useActiveWorkoutStore();
const activeWorkout = computed(() => activeWorkoutStore.activeWorkout);
const sourceRoutine = computed(() => activeWorkoutStore.sourceRoutine);
const route = useRoute();

const isActiveWorkoutRoute = computed(() => {
  return route.path.startsWith('/active-workout');
});

// Global timer state for ribbon
const globalTimerSeconds = ref(0);
const globalIsPaused = ref(false);
let globalIntervalId: number | null = null;

function syncGlobalTimerFromStore() {
  const workout = activeWorkoutStore.activeWorkout;
  if (workout) {
    globalTimerSeconds.value = workout.timerSeconds || 0;
    globalIsPaused.value = workout.isPaused || false;
  }
}

function startGlobalTimer() {
  if (globalIntervalId) clearInterval(globalIntervalId);
  globalIntervalId = window.setInterval(() => {
    if (!globalIsPaused.value && activeWorkoutStore.activeWorkout) {
      globalTimerSeconds.value++;
      activeWorkoutStore.activeWorkout.timerSeconds = globalTimerSeconds.value;
    }
  }, 1000);
}

function pauseGlobalTimer() {
  globalIsPaused.value = true;
  if (activeWorkoutStore.activeWorkout) {
    activeWorkoutStore.activeWorkout.isPaused = true;
  }
}

function resumeGlobalTimer() {
  globalIsPaused.value = false;
  if (activeWorkoutStore.activeWorkout) {
    activeWorkoutStore.activeWorkout.isPaused = false;
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

onMounted(() => {
  syncGlobalTimerFromStore();
  startGlobalTimer();
});

onUnmounted(() => {
  if (globalIntervalId) clearInterval(globalIntervalId);
});

// Watch for changes in the store (if user pauses/resumes from workout view)
import { watch } from 'vue';
watch(
  () => [activeWorkoutStore.activeWorkout?.timerSeconds, activeWorkoutStore.activeWorkout?.isPaused],
  ([newSeconds, newPaused]) => {
    if (typeof newSeconds === 'number') globalTimerSeconds.value = newSeconds;
    if (typeof newPaused === 'boolean') globalIsPaused.value = newPaused;
  }
);

function goToActiveWorkout() {
  router.push('/active-workout');
}

// Estilo para el padding del contenido cuando hay ribbon
const ribbonPaddingStyle = computed(() => {
  return (activeWorkout.value && sourceRoutine.value && !isActiveWorkoutRoute.value)
    ? { paddingTop: '50px' }
    : { paddingTop: '0' };
});

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Entrenamiento', to: '/training', icon: Training },
  { name: 'Ejercicios', to: '/exercises', icon: Library },
  { name: 'Histórico', to: '/history', icon: History },
  { name: 'Configuración', to: '/config', icon: Settings },
];

const userEmail = computed(() => {
  const session = supabase.auth.getSession();
  return session?.user?.email || 'Usuario';
});

const userInitial = computed(() => {
  return userEmail.value.charAt(0).toUpperCase();
});

async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/login');
  } catch (error: any) {
    toast.error('Error al cerrar sesión');
    console.error('Error:', error);
  }
}
</script>

<style scoped>
:root {
  --navy: #0b2545;
  --brick-red: #a52a2a;
  --gold: #ffd700;
  --pure-white: #ffffff;
}

/* Estilos para el sidebar */
.sidebar-container {
  display: flex;
  flex-direction: column;
  width: 280px;
  background-color: var(--navy);
  position: relative;
  overflow: hidden;
  height: 100vh;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-texture {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  opacity: 0.05;
}

.stars-texture {
  top: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFD700' d='M50 0l12 38h38l-30 22 12 38-32-23-32 23 12-38-30-22h38z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

.stripes-texture {
  bottom: 20px;
  left: 20px;
  width: 150px;
  height: 150px;
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 10px, transparent 10px, transparent 20px);
}

.dots-texture {
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 15px 15px;
  transform: translate(-50%, -50%);
}

/* Logo de la aplicación */
.app-logo-container {
  padding: 1.5rem 1rem;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-logo-banner {
  background-color: var(--brick-red);
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  transform: skew(-5deg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-left: 3px solid var(--gold);
  border-right: 3px solid var(--gold);
}

.app-logo-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--pure-white);
  margin-right: 0.75rem;
  transform: skew(5deg);
}

.app-logo-text {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--pure-white);
  letter-spacing: 1px;
  transform: skew(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Navegación del sidebar */
.sidebar-nav {
  padding: 1.5rem 1rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-link {
  position: relative;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background-color: var(--gold);
  transition: width 0.3s ease;
  opacity: 0.1;
  z-index: 0;
}

.nav-link:hover::before {
  width: 100%;
}

.nav-link-active {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link-active::before {
  width: 100%;
  background-color: var(--gold);
  opacity: 0.2;
}

.nav-link-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.nav-icon-active {
  color: var(--gold);
}

.nav-text {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--pure-white);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos para el menú móvil se manejan con clases de Tailwind */

/* Estilos del menú de usuario */
.user-menu-container {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  margin-top: auto;
  position: relative;
  z-index: 2;
}

.user-menu-content {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  border-left: 2px solid var(--gold);
}

.user-avatar {
  flex-shrink: 0;
}

.user-initial {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-color: var(--brick-red);
  color: var(--pure-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  border: 2px solid var(--gold);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-info {
  margin-left: 0.75rem;
  width: 100%;
}

.user-email {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--pure-white);
  position: relative;
}

.logout-button {
  position: absolute;
  left: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  text-align: left;
  font-size: 0.875rem;
  color: var(--navy);
  background-color: var(--pure-white);
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  border-left: 2px solid var(--gold);
  font-weight: 600;
}

.logout-button:hover {
  background-color: #f3f4f6;
}

.user-email:hover .logout-button {
  opacity: 1;
  visibility: visible;
}

/* Estilos del ribbon de entrenamiento activo */
.active-workout-ribbon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  min-height: 50px;
  background-color: #0b2545;
  background-image: 
    repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.1) 0, rgba(255, 215, 0, 0.1) 10px, transparent 10px, transparent 20px),
    linear-gradient(to bottom, rgba(11, 37, 69, 1), rgba(11, 37, 69, 0.9));
  border-bottom: 3px solid #ffd700;
}

/* Media queries */
@media (max-width: 768px) {
  /* Ajuste de padding inferior para el contenido principal en móvil */
  main {
    padding-bottom: 70px !important; /* Asegura espacio para el menú móvil */
  }
}
</style>