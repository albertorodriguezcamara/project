<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <img :src="logo" alt="Rutina.es" class="auth-logo" />
        <p class="auth-slogan">TRAIN HARD. LIVE STRONG.</p>
      </div>

      <div class="auth-tabs">
        <button
          @click="mode = 'login'"
          class="auth-tab"
          :class="{ 'active': mode === 'login' }"
        >
          Iniciar Sesión
        </button>
        <button
          @click="mode = 'register'"
          class="auth-tab"
          :class="{ 'active': mode === 'register' }"
        >
          Registrarse
        </button>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-fields">
          <div class="form-field">
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="auth-input"
              placeholder="Email"
            />
          </div>
          <div class="form-field">
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="auth-input"
              :placeholder="mode === 'register' ? 'Contraseña (mínimo 6 caracteres)' : 'Contraseña'"
            />
          </div>
        </div>

        <div class="form-action">
          <button
            type="submit"
            class="auth-button"
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
import logoImg from '../assets/logo.png';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const mode = ref<'login' | 'register'>('login');
const logo = ref(logoImg);

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

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--gradient-hero);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  background: var(--pure-white);
  border-radius: var(--border-radius-md);
  padding: 2.5rem;
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--navy);
  border-bottom: var(--border-athletic);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  width: 200px;
  height: auto;
  margin-bottom: 1rem;
}

.auth-slogan {
  color: var(--deep-black);
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.auth-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.auth-tab {
  color: var(--deep-black);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-normal);
  position: relative;
}

.auth-tab::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--brick-red);
  transform: scaleX(0);
  transition: var(--transition-normal);
}

.auth-tab:hover::after,
.auth-tab.active::after {
  transform: scaleX(1);
}

.auth-tab.active {
  color: var(--brick-red);
}

.auth-form {
  margin-top: 2rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.auth-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--navy);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  transition: var(--transition-normal);
}

.auth-input:focus {
  outline: none;
  border-color: var(--brick-red);
  box-shadow: var(--shadow-sm);
}

.auth-button {
  width: 100%;
  background: var(--gradient-red);
  color: var(--pure-white);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  border: none;
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.auth-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-accent);
  opacity: 0;
  transition: var(--transition-normal);
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.auth-button:hover::before {
  opacity: 1;
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>