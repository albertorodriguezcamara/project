<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="$emit('update:modelValue', false)"
    ></div>

    <!-- Bottom Sheet -->
    <div
      class="fixed inset-x-0 bottom-0 transform bg-white rounded-t-2xl shadow-lg z-50 transition-transform duration-300 pb-safe-bottom"
      :class="[modelValue ? 'translate-y-0' : 'translate-y-full']"
    >
      <!-- Handle -->
      <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3"></div>

      <!-- Header -->
      <div v-if="title" class="px-4 py-3 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      </div>

      <!-- Content -->
      <div class="px-4 py-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>