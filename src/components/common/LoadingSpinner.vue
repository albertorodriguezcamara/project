<template>
  <div class="flex items-center justify-center" :class="size === 'large' ? 'p-8' : 'p-4'">
    <div 
      class="animate-spin rounded-full border-t-2 border-b-2"
      :class="{
        'w-12 h-12 border-4': size === 'large',
        'w-6 h-6 border-2': size === 'small',
        'border-emerald-600': variant === 'primary',
        'border-white': variant === 'light',
        'border-gray-600': variant === 'dark'
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size?: 'small' | 'large';
  variant?: 'primary' | 'light' | 'dark';
}>();
</script>