<template>
  <div class="relative w-full h-full bg-gray-100 rounded-md overflow-hidden group">
    <!-- Imagen (preview estática o gif) -->
    <img
      :src="showGif ? gifUrl : previewUrl"
      alt="Ejercicio GIF"
      class="object-cover w-full h-full transition-transform group-hover:scale-105"
    />

    <!-- Botón play/stop -->
    <button
      v-if="!disableControls"
      @click.stop="togglePlay"
      class="absolute bottom-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70
             transition-opacity"
      title="Reproducir GIF"
    >
      <component :is="showGif ? PauseIcon : PlayIcon" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { Play as PlayIcon, Pause as PauseIcon } from 'lucide-vue-next';

/**
 * Recibe dos URLs:
 *  - gifUrl => la animación real
 *  - previewUrl => un "frame" o imagen estática
 * Se puede simular “pausa” mostrando la preview y “play” mostrando el gifUrl.
 * 
 * disableControls => para que la vista no tenga el botón, si se quiere.
 */
const props = defineProps<{
  gifUrl: string;
  previewUrl: string;
  disableControls?: boolean;
}>();

const showGif = ref(false);

function togglePlay() {
  showGif.value = !showGif.value;
}
</script>

<style scoped>
/* Ajusta estilos a tu gusto */
</style>
