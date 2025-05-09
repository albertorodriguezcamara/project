```vue
<template>
  <div class="space-y-4">
    <TransitionGroup
      name="list"
      tag="div"
      class="space-y-3"
    >
      <div
        v-for="mesociclo in sortedMesociclos"
        :key="mesociclo.id"
        class="card hover:border-blue-200 transition-colors"
        :class="{
          'border-emerald-500': mesociclo.active,
          'opacity-50': isDragging && draggedId === mesociclo.id
        }"
        draggable="true"
        @dragstart="handleDragStart($event, mesociclo)"
        @dragend="handleDragEnd"
        @dragover.prevent
        @dragenter.prevent
        @drop="handleDrop($event, mesociclo)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button class="drag-handle p-1 text-gray-400 hover:text-gray-600">
              <GripVertical class="w-5 h-5" />
            </button>
            <div>
              <h3 class="font-medium text-gray-900">{{ mesociclo.name }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span
                  v-if="mesociclo.active"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                >
                  Activo
                </span>
                <span
                  v-if="mesociclo.completed"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  Completado
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="toggleActive(mesociclo)"
              class="p-1.5 rounded-lg"
              :class="mesociclo.active
                ? 'text-emerald-600 hover:bg-emerald-50'
                : 'text-gray-400 hover:bg-gray-100'"
              :title="mesociclo.active ? 'Desactivar mesociclo' : 'Activar mesociclo'"
            >
              <Power class="w-4 h-4" />
            </button>
            <button
              @click="$emit('edit', mesociclo)"
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="confirmDeleteMesociclo(mesociclo)"
              class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Rutinas Section -->
        <div class="mt-4 pl-9">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-500">
              {{ mesociclo.rutinas?.length || 0 }} rutinas
            </span>
            <button
              @click.stop="$emit('addRutina', mesociclo)"
              class="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              <Plus class="w-4 h-4 mr-1" />
              Añadir Rutina
            </button>
          </div>

          <div
            v-if="mesociclo.rutinas?.length"
            class="space-y-2"
          >
            <div
              v-for="rutina in mesociclo.rutinas"
              :key="rutina.id"
              class="bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition-colors cursor-pointer group"
              @click.stop="$emit('editRutina', rutina)"
            >
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-800">{{ rutina.name }}</span>
                <div class="flex items-center space-x-2">
                  <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {{ rutina.ejercicios?.length || 0 }} ejercicios
                  </span>
                  <!-- Botones de acción que aparecen al hover -->
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <button
                      @click.stop="$emit('editRutina', rutina)"
                      class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg"
                      title="Editar rutina"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button
                      @click.stop="confirmDeleteRutina(rutina)"
                      class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                      title="Eliminar rutina"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <!-- Vista previa de ejercicios -->
              <div v-if="rutina.ejercicios?.length" class="mt-2 space-y-1">
                <div
                  v-for="ejercicio in rutina.ejercicios.slice(0, 3)"
                  :key="ejercicio.id"
                  class="text-sm text-gray-600 flex items-center space-x-2"
                >
                  <span>• {{ ejercicio.exercise?.name_es || ejercicio.name_es }}</span>
                  <span class="text-xs text-gray-500">
                    {{ ejercicio.series }}x{{ ejercicio.repeticiones }}
                  </span>
                </div>
                <div
                  v-if="rutina.ejercicios.length > 3"
                  class="text-xs text-gray-500"
                >
                  Y {{ rutina.ejercicios.length - 3 }} ejercicios más...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <div
      v-if="!sortedMesociclos.length"
      class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p class="text-gray-600">No hay mesociclos configurados.</p>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="cancelConfirmation"></div>
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full relative animate-scale-in">
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ confirmDialogTitle }}</h3>
        <p class="text-gray-600 mb-6">{{ confirmDialogMessage }}</p>
        <div class="flex justify-end gap-3">
          <button 
            class="btn-secondary"
            @click="cancelConfirmation"
          >
            Cancelar
          </button>
          <button 
            class="btn-primary bg-red-600 hover:bg-red-700"
            @click="confirmAction"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GripVertical, Pencil, Trash2, Power, Plus } from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import type { Mesociclo, Rutina } from '@/types';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  mesociclos: Mesociclo[];
}>();

const emit = defineEmits<{
  (e: 'edit', mesociclo: Mesociclo): void;
  (e: 'select', mesociclo: Mesociclo): void;
  (e: 'addRutina', mesociclo: Mesociclo): void;
  (e: 'editRutina', rutina: Rutina): void;
}>();

const trainingStore = useTrainingStore();
const { sortedMesociclos, deleteMesociclo: removeMesociclo, updateMesociclo } = trainingStore;

const isDragging = ref(false);
const draggedId = ref<string | null>(null);

// Confirmation Dialog State
const showConfirmDialog = ref(false);
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');
const pendingAction = ref<(() => void) | null>(null);

function confirmDeleteMesociclo(mesociclo: Mesociclo) {
  confirmDialogTitle.value = 'Eliminar Mesociclo';
  confirmDialogMessage.value = `¿Estás seguro de que deseas eliminar el mesociclo "${mesociclo.name}"? Esta acción no se puede deshacer.`;
  pendingAction.value = () => deleteMesociclo(mesociclo);
  showConfirmDialog.value = true;
}

function confirmDeleteRutina(rutina: Rutina) {
  confirmDialogTitle.value = 'Eliminar Rutina';
  confirmDialogMessage.value = `¿Estás seguro de que deseas eliminar la rutina "${rutina.name}"? Esta acción no se puede deshacer.`;
  pendingAction.value = () => deleteRutina(rutina);
  showConfirmDialog.value = true;
}

function confirmAction() {
  if (pendingAction.value) {
    pendingAction.value();
  }
  cancelConfirmation();
}

function cancelConfirmation() {
  showConfirmDialog.value = false;
  confirmDialogTitle.value = '';
  confirmDialogMessage.value = '';
  pendingAction.value = null;
}

async function deleteMesociclo(mesociclo: Mesociclo) {
  try {
    await removeMesociclo(mesociclo.id);
    toast.success('Mesociclo eliminado correctamente');
  } catch (error) {
    toast.error('Error al eliminar el mesociclo');
  }
}

async function deleteRutina(rutina: Rutina) {
  try {
    await trainingStore.deleteRutina(rutina.id);
    toast.success('Rutina eliminada exitosamente');
  } catch (err) {
    console.error('Error deleting rutina:', err);
    toast.error('Error al eliminar la rutina');
  }
}

async function toggleActive(mesociclo: Mesociclo) {
  try {
    await updateMesociclo(mesociclo.id, { active: !mesociclo.active });
    toast.success(`Mesociclo ${mesociclo.active ? 'desactivado' : 'activado'} correctamente`);
  } catch (error) {
    toast.error('Error al cambiar el estado del mesociclo');
  }
}

function handleDragStart(event: DragEvent, mesociclo: Mesociclo) {
  if (!event.dataTransfer) return;
  isDragging.value = true;
  draggedId.value = mesociclo.id;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', mesociclo.id);
}

function handleDragEnd() {
  isDragging.value = false;
  draggedId.value = null;
}

async function handleDrop(event: DragEvent, dropTarget: Mesociclo) {
  if (!event.dataTransfer || !sortedMesociclos.value) return;

  const draggedMesocicloId = event.dataTransfer.getData('text/plain');
  if (draggedMesocicloId === dropTarget.id) return;

  const draggedIndex = sortedMesociclos.value.findIndex(m => m.id === draggedMesocicloId);
  const droppedIndex = sortedMesociclos.value.findIndex(m => m.id === dropTarget.id);

  if (draggedIndex === -1 || droppedIndex === -1) return;

  try {
    await updateMesociclo(draggedMesocicloId, { order: droppedIndex });
    await updateMesociclo(dropTarget.id, { order: draggedIndex });
  } catch (error) {
    toast.error('Error al reordenar los mesociclos');
  }
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}
.dragging {
  opacity: 0.5;
  cursor: grabbing;
}
</style>
```