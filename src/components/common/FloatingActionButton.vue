<template>
  <button
    class="fixed z-30 bottom-20 right-4 md:bottom-8 md:right-8 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 active:scale-95 transition-all p-4"
    :class="{ 'opacity-0 pointer-events-none': hidden }"
    @click="$emit('click')"
  >
    <component :is="icon" class="w-6 h-6" />
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  hidden?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>