import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import Vue3Toastify from 'vue3-toastify';
import { useDirtyStateStore } from './stores/dirtyState';
import 'vue3-toastify/dist/index.css';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'bottom-center',
});

// Handle unsaved changes when user tries to close/refresh
window.addEventListener('beforeunload', (e) => {
  const dirtyStateStore = useDirtyStateStore();
  if (dirtyStateStore.isDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});

app.mount('#app');