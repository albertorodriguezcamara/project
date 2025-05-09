<template>
  <div 
    class="bg-white rounded-xl shadow-sm border border-gray-100/50 transition-all"
    :class="{
      'p-6': !noPadding,
      'hover:shadow-md hover:border-emerald-200/50 hover:-translate-y-1': interactive,
      [className]: className
    }"
  >
    <div v-if="title || $slots.header" class="flex items-center justify-between mb-4">
      <h2 v-if="title" class="text-lg font-medium text-gray-900">{{ title }}</h2>
      <slot name="header"></slot>
    </div>

    <slot></slot>

    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-100">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  noPadding?: boolean;
  interactive?: boolean;
  className?: string;
}>();
</script>