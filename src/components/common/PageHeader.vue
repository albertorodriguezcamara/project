<template>
  <div class="mb-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
      </div>
      
      <div class="flex items-center gap-3">
        <slot name="actions"></slot>
      </div>
    </div>

    <div v-if="$slots.tabs" class="mt-6 border-b border-gray-200">
      <slot name="tabs"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>