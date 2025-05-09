<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64 bg-white border-r border-gray-200">
        <div class="flex-1 flex flex-col min-h-0">
          <!-- Logo -->
          <div class="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <Dumbbell class="h-8 w-8 text-blue-600" />
            <span class="ml-2 text-xl font-bold text-gray-900">The Natural Way</span>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-2 py-4 space-y-1">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path === item.to
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <component
                :is="item.icon"
                class="mr-3 flex-shrink-0 h-5 w-5"
                :class="[
                  $route.path === item.to
                    ? 'text-blue-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                ]"
              />
              {{ item.name }}
            </router-link>
          </nav>
        </div>

        <!-- User Menu -->
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex items-center w-full">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {{ userInitial }}
              </div>
            </div>
            <div class="ml-3 w-full">
              <div class="text-sm font-medium text-gray-700 group relative">
                {{ userEmail }}
                <button
                  @click="handleLogout"
                  class="absolute left-0 w-full px-4 py-2 mt-2 text-sm text-left text-gray-700 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 hover:bg-gray-50"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile menu -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe-area shadow-xl">
      <nav class="flex justify-between items-center px-2 py-1 h-16" style="padding-bottom: env(safe-area-inset-bottom);">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center flex-1 mx-1 rounded-xl transition-all duration-150 py-2"
          :class="[
            $route.path === item.to
              ? 'bg-blue-50 text-blue-700 shadow font-bold scale-105'
              : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600 active:bg-blue-50'
          ]"
          style="min-width: 60px; min-height: 48px;"
        >
          <component
            :is="item.icon"
            class="h-7 w-7 mb-0.5"
            :class="$route.path === item.to ? 'text-blue-700' : 'text-gray-400'"
          />
          <span class="text-xs leading-tight">{{ item.name }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Ribbon de entrenamiento activo (fijo, solo si no estamos en active-workout) -->
    <div
      v-if="activeWorkout && sourceRoutine && !isActiveWorkoutRoute"
      class="fixed top-0 left-0 right-0 z-40 bg-emerald-600 text-white px-4 py-1 flex items-center justify-between shadow font-semibold text-sm"
      style="min-height: 38px;"
    >
      <span>
        Entrenamiento activo: {{ sourceRoutine.name }}
        <span class="mx-2">|</span>
        <span>
          <span class="font-mono">{{ formatTime(globalTimerSeconds) }}</span>
          <button v-if="!globalIsPaused" @click="pauseGlobalTimer" class="ml-1 p-1 rounded bg-emerald-700 hover:bg-emerald-800">
            <Pause class="inline w-4 h-4" />
          </button>
          <button v-else @click="resumeGlobalTimer" class="ml-1 p-1 rounded bg-emerald-700 hover:bg-emerald-800">
            <Play class="inline w-4 h-4" />
          </button>
        </span>
      </span>
      <button @click="goToActiveWorkout" class="ml-4 px-3 py-1 rounded bg-white text-emerald-700 font-bold hover:bg-emerald-100 transition text-xs">
        Volver al entrenamiento
      </button>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden" :style="ribbonPaddingStyle">
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

const ribbonPaddingStyle = computed(() => {
  return (activeWorkout.value && sourceRoutine.value && !isActiveWorkoutRoute.value)
    ? { paddingTop: '38px' }
    : {};
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