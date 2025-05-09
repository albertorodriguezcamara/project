<template>
  <div class="text-center py-12 px-4">
    <div 
      class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4"
    >
      <component :is="icon" class="w-8 h-8" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500 max-w-sm mx-auto mb-6">{{ description }}</p>
    <slot name="action">
      <button
        v-if="action"
        @click="action.onClick"
        class="btn-primary inline-flex items-center"
      >
        <component :is="action.icon" v-if="action.icon" class="w-4 h-4 mr-2" />
        {{ action.label }}
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Action {
  label: string;
  onClick: () => void;
  icon?: Component;
}

defineProps<{
  title: string;
  description: string;
  icon: Component;
  action?: Action;
}>();
</script>