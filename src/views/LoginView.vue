<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          The Natural Way
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Plataforma de Entrenamiento
        </p>
      </div>

      <div class="flex justify-center space-x-4">
        <button
          @click="mode = 'login'"
          class="text-sm font-medium"
          :class="mode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          Iniciar Sesión
        </button>
        <button
          @click="mode = 'register'"
          class="text-sm font-medium"
          :class="mode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          Registrarse
        </button>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="mode === 'register' ? 'Contraseña (mínimo 6 caracteres)' : 'Contraseña'"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isLoading"
          >
            <span v-if="isLoading">
              {{ mode === 'login' ? 'Iniciando sesión...' : 'Registrando...' }}
            </span>
            <span v-else>
              {{ mode === 'login' ? 'Iniciar sesión' : 'Registrarse' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'vue3-toastify';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const mode = ref<'login' | 'register'>('login');

async function handleSubmit() {
  try {
    isLoading.value = true;

    if (mode.value === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          emailRedirectTo: `${window.location.origin}/config`
        }
      });
      if (error) throw error;
      toast.success('Registro exitoso. Ya puedes iniciar sesión.');
      mode.value = 'login';
      return;
    }

    router.push('/config');
  } catch (error: any) {
    toast.error(error.message || 'Error en la autenticación');
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>