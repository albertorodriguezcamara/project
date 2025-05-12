import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import { useDirtyStateStore } from '@/stores/dirtyState';
import AppLayout from '@/components/layout/AppLayout.vue';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ConfigView from '@/views/ConfigView.vue';
import TrainingView from '@/views/TrainingView.vue';
import ExerciseLibraryView from '@/views/ExerciseLibraryView.vue';
import HistoryView from '@/views/HistoryView.vue';
import LandingView from '@/views/LandingView.vue';

// NUEVA RUTA LAZY para ActiveWorkoutView:
const ActiveWorkoutView = () => import('@/views/ActiveWorkoutView.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'landing',
      component: LandingView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'training',
          name: 'training',
          component: TrainingView
        },
        {
          path: 'exercises',
          name: 'exercises',
          component: ExerciseLibraryView
        },
        {
          path: 'history',
          name: 'history',
          component: HistoryView
        },
        {
          path: 'completed-routine/:id',
          name: 'completed-routine',
          component: () => import('@/views/CompletedRoutineView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'config',
          name: 'config',
          component: ConfigView
        },
        // AÑADIMOS LA RUTA 'active-workout/:rutinaId' Y LA PLANA
        {
          path: 'active-workout',
          name: 'active-workout-flat',
          component: ActiveWorkoutView,
          meta: { requiresAuth: true }
        },
        {
          path: 'active-workout/:rutinaId',
          name: 'active-workout',
          component: ActiveWorkoutView,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
});

// Navigation guard for dirty state
router.beforeEach(async (to, from, next) => {
  const dirtyStateStore = useDirtyStateStore();

  // Check if there are unsaved changes
  if (dirtyStateStore.isDirty) {
    const confirmed = window.confirm(dirtyStateStore.dirtyMessage);
    if (!confirmed) {
      next(false);
      return;
    }
    dirtyStateStore.clearDirty();
  }

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !session) {
    next('/login');
  } else if (to.path === '/login' && session) {
    next('/dashboard');
  } else if (to.path === '/' && session) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;