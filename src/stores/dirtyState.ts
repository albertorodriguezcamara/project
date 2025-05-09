import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDirtyStateStore = defineStore('dirtyState', () => {
  const isDirty = ref(false);
  const dirtyMessage = ref('Hay cambios sin guardar. ¿Deseas descartarlos?');

  function setDirty(dirty: boolean, message?: string) {
    isDirty.value = dirty;
    if (message) {
      dirtyMessage.value = message;
    }
  }

  function clearDirty() {
    isDirty.value = false;
    dirtyMessage.value = 'Hay cambios sin guardar. ¿Deseas descartarlos?';
  }

  return {
    isDirty,
    dirtyMessage,
    setDirty,
    clearDirty
  };
});