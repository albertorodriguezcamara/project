```vue
<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="rest-timer-modal relative animate-scale-in">
      <!-- Texturas decorativas -->
      <div class="texture-element stars-texture"></div>
      <div class="texture-element stripes-texture"></div>
      <div class="texture-element dots-texture"></div>
      
      <!-- Header -->
      <div class="rest-timer-header">
        <div class="rest-timer-title-banner">
          <h3>TIEMPO DE DESCANSO</h3>
        </div>
        <p class="rest-timer-subtitle">SIGUIENTE SERIE EN:</p>
        
        <!-- Mute Button -->
        <button 
          @click="toggleMute"
          class="rest-timer-mute-btn"
          :title="isMuted ? 'Activar sonido' : 'Silenciar'"
        >
          <Volume2 v-if="!isMuted" class="w-5 h-5" />
          <VolumeX v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Timer Display -->
      <div class="rest-timer-display">
        <!-- Circular Progress -->
        <div class="rest-timer-progress">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              stroke-width="12"
              fill="none"
              class="rest-timer-track"
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
              class="rest-timer-progress-circle"
            />
          </svg>
          <div class="rest-timer-time">
            <span>{{ formatTime(timeLeft) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="rest-timer-controls">
          <button
            @click="addTime(10)"
            class="rest-timer-time-btn add-time-btn"
          >
            +10s
          </button>
          <button
            @click="removeTime(10)"
            class="rest-timer-time-btn remove-time-btn"
            :disabled="timeLeft < 10"
          >
            -10s
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="rest-timer-actions">
          <button
            @click="$emit('close')"
            class="rest-timer-action-btn cancel-btn"
          >
            CANCELAR
          </button>
          <button
            @click="finishRest"
            class="rest-timer-action-btn finish-btn"
          >
            TERMINAR
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

<style scoped>
/* Variables de colores */
:root {
  --navy: #1F2D48;
  --brick-red: #A52A2A;
  --gold: #FFD700;
  --pure-white: #FFFFFF;
  --deep-black: #111111;
}

/* Modal de temporizador de descanso */
.rest-timer-modal {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 24rem;
  position: relative;
  overflow: hidden;
  border: 3px solid var(--navy);
  animation: scale-in 0.3s ease-out;
}

/* Texturas decorativas */
.texture-element {
  position: absolute;
  pointer-events: none;
  z-index: 0;
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
  background-image: repeating-linear-gradient(45deg, rgba(31, 45, 72, 0.1) 0, rgba(31, 45, 72, 0.1) 10px, transparent 10px, transparent 20px);
}

.dots-texture {
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background-image: radial-gradient(circle, rgba(31, 45, 72, 0.1) 1px, transparent 1px);
  background-size: 15px 15px;
  transform: translate(-50%, -50%);
}

/* Encabezado del temporizador */
.rest-timer-header {
  padding: 1.5rem 1.5rem 1rem;
  text-align: center;
  position: relative;
}

.rest-timer-title-banner {
  background-color: var(--navy);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 3px solid var(--gold);
  margin-bottom: 0.5rem;
}

.rest-timer-title-banner h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--pure-white);
  letter-spacing: 1px;
  margin: 0;
  transform: skewX(5deg);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.rest-timer-subtitle {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--navy);
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
}

.rest-timer-mute-btn {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: var(--navy);
  color: var(--gold);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rest-timer-mute-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Pantalla del temporizador */
.rest-timer-display {
  padding: 0 1.5rem 1.5rem;
}

.rest-timer-progress {
  position: relative;
  width: 12rem;
  height: 12rem;
  margin: 0 auto 1.5rem;
}

.rest-timer-track {
  color: #e5e7eb;
}

.rest-timer-progress-circle {
  color: var(--brick-red);
  transition: all 1s linear;
}

.rest-timer-time {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rest-timer-time span {
  font-family: 'Oswald', monospace;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: 2px;
}

/* Controles del temporizador */
.rest-timer-controls {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.rest-timer-time-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  cursor: pointer;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
}

.add-time-btn {
  background-color: var(--navy);
  color: var(--pure-white);
  border: 2px solid var(--gold);
}

.add-time-btn:hover {
  background-color: #2a3a5a;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.remove-time-btn {
  background-color: var(--brick-red);
  color: var(--pure-white);
}

.remove-time-btn:hover {
  background-color: #8a2222;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.remove-time-btn:disabled {
  background-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Botones de acción */
.rest-timer-actions {
  display: flex;
  gap: 0.75rem;
}

.rest-timer-action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  cursor: pointer;
  transform: skewX(-5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background-color: white;
  color: var(--navy);
  border: 2px solid var(--navy);
}

.cancel-btn:hover {
  background-color: #f9fafb;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.finish-btn {
  background-color: var(--brick-red);
  color: var(--pure-white);
  border: none;
}

.finish-btn:hover {
  background-color: #8a2222;
  transform: skewX(-5deg) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Animaciones */
@keyframes scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
```