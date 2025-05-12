<template>
  <slot v-if="resolved" :data="data" :error="error" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  promise: Promise<any>;
}>();

const resolved = ref(false);
const data = ref<any>(null);
const error = ref<Error | null>(null);

watch(() => props.promise, async (promise) => {
  resolved.value = false;
  try {
    data.value = await promise;
  } catch (e) {
    error.value = e as Error;
  } finally {
    resolved.value = true;
  }
}, { immediate: true });
</script>
