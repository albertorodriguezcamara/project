```vue
<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm relative animate-scale-in">
      <!-- Header -->
      <div class="p-6 text-center relative">
        <h3 class="text-xl font-bold text-gray-900 mb-1">Tiempo de Descanso</h3>
        <p class="text-sm text-gray-500">Siguiente serie en:</p>
        
        <!-- Mute Button -->
        <button 
          @click="toggleMute"
          class="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100"
          :title="isMuted ? 'Activar sonido' : 'Silenciar'"
        >
          <Volume2 v-if="!isMuted" class="w-5 h-5 text-gray-500" />
          <VolumeX v-else class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Timer Display -->
      <div class="px-6 pb-6">
        <!-- Circular Progress -->
        <div class="relative w-48 h-48 mx-auto mb-6">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              stroke-width="12"
              fill="none"
              class="text-gray-200"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              stroke-width="12"
              fill="none"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
              class="text-emerald-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-4xl font-mono font-bold">{{ formatTime(timeLeft) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex justify-center gap-3 mb-6">
          <button
            @click="addTime(10)"
            class="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 transition-colors"
          >
            +10s
          </button>
          <button
            @click="removeTime(10)"
            class="px-3 py-2 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
            :disabled="timeLeft < 10"
          >
            -10s
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="finishRest"
            class="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Terminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { Volume2, VolumeX } from 'lucide-vue-next';

const props = defineProps<{
  visible: boolean;
  initial: number;
}>();

const emit = defineEmits(['close', 'finished']);

const timeLeft = ref(props.initial);
const circumference = 2 * Math.PI * 88; // 2πr where r=88 (radius of circle)
let intervalId: number | null = null;
const isMuted = ref(false);

// Create audio elements
let warningSound: HTMLAudioElement;
let finishSound: HTMLAudioElement;

// Initialize audio elements
onMounted(() => {
  warningSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3');
  finishSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
  
  // Preload audio
  warningSound.load();
  finishSound.load();
});

// Compute the stroke-dashoffset for the progress circle
const dashOffset = computed(() => {
  const progress = timeLeft.value / props.initial;
  return circumference * (1 - progress);
});

// Start timer when modal becomes visible
watch(() => props.visible, (newVal) => {
  if (newVal) {
    timeLeft.value = props.initial;
    startTimer();
  } else {
    stopTimer();
  }
}, { immediate: true });

// Watch for initial value changes
watch(() => props.initial, (newVal) => {
  timeLeft.value = newVal;
}, { immediate: true });

async function playSound(sound: HTMLAudioElement) {
  if (isMuted.value) return;
  
  try {
    // Reset the audio to start
    sound.currentTime = 0;
    // Create and resolve a play promise
    await sound.play();
  } catch (err) {
    console.warn('Error playing sound:', err);
  }
}

function startTimer() {
  stopTimer(); // Clear any existing interval
  intervalId = window.setInterval(async () => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      
      // Play warning sound at 10 seconds
      if (timeLeft.value === 10) {
        await playSound(warningSound);
      }
      
      // Play finish sound and complete timer at 0 seconds
      if (timeLeft.value === 0) {
        await playSound(finishSound);
        finishRest();
      }
    }
  }, 1000);
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function toggleMute() {
  isMuted.value = !isMuted.value;
}

function addTime(sec: number) {
  timeLeft.value += sec;
}

function removeTime(sec: number) {
  timeLeft.value = Math.max(0, timeLeft.value - sec);
}

function finishRest() {
  stopTimer();
  emit('finished');
  emit('close');
}

function formatTime(t: number) {
  const mins = Math.floor(t / 60);
  const secs = t % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

onUnmounted(() => {
  stopTimer();
});
</script>
```