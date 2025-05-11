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
        class="card p-5 hover:shadow-lg transition-all rounded-xl border border-gray-200"
        :class="{
          'border-emerald-500 bg-emerald-50/30': mesociclo.active,
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
          <div class="flex items-center space-x-4">
            <button class="drag-handle p-1.5 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <GripVertical class="w-5 h-5" />
            </button>
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ mesociclo.name }}</h3>
              <div class="flex items-center gap-2 mt-2">
                <span
                  v-if="mesociclo.active"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                >
                  Activo
                </span>
                <span
                  v-if="mesociclo.completed"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                >
                  Completado
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="toggleActive(mesociclo)"
              class="p-2 rounded-lg transition-colors shadow-sm"
              :class="mesociclo.active
                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'"
              :title="mesociclo.active ? 'Desactivar mesociclo' : 'Activar mesociclo'"
            >
              <Power class="w-5 h-5" />
            </button>
            <button
              @click="$emit('edit', mesociclo)"
              class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm border border-blue-200"
            >
              <Pencil class="w-5 h-5" />
            </button>
            <button
              @click="confirmDeleteMesociclo(mesociclo)"
              class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shadow-sm border border-red-200"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Rutinas Section -->
        <div class="mt-6 w-full">
          <div class="flex items-center justify-between mb-4 px-2">
            <span class="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {{ mesociclo.rutinas?.length || 0 }} rutinas
            </span>
            <button
              @click.stop="$emit('addRutina', mesociclo)"
              class="text-sm bg-emerald-600 text-white hover:bg-emerald-700 flex items-center px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus class="w-4 h-4 mr-1.5" />
              Añadir Rutina
            </button>
          </div>

          <div
            v-if="mesociclo.rutinas?.length"
            class="space-y-5 mt-4 w-full"
          >
            <div
              v-for="rutina in mesociclo.rutinas"
              :key="rutina.id"
              class="bg-white rounded-xl p-8 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm hover:shadow-md w-full mb-6"
            >
              <!-- Título de la rutina -->
              <div class="w-full mb-6">
                <h3 
                  class="font-bold text-gray-800 text-2xl cursor-pointer" 
                  @click.stop="$emit('editRutina', rutina)"
                >
                  {{ rutina.name }}
                </h3>
              </div>
              
              <!-- Botones de acción -->
              <div class="flex justify-end items-center mb-6">
                <div class="flex items-center space-x-4">
                  <button 
                    @click.stop="$emit('editRutina', rutina)"
                    class="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors shadow-sm flex items-center"
                    title="Editar rutina"
                  >
                    <Pencil class="w-5 h-5 mr-2" />
                    <span class="text-sm font-medium">Editar</span>
                  </button>
                  <button 
                    @click.stop="confirmDeleteRutina(rutina)"
                    class="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors shadow-sm flex items-center"
                    title="Eliminar rutina"
                  >
                    <Trash2 class="w-5 h-5 mr-2" />
                    <span class="text-sm font-medium">Eliminar</span>
                  </button>
                </div>
              </div>
              <!-- Vista previa de ejercicios con diseño mejorado -->
              <div 
                v-if="rutina.routine_exercises?.length" 
                class="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200 cursor-pointer w-full"
                @click.stop="$emit('editRutina', rutina)"
              >
                <!-- Lista de ejercicios -->
                <div class="space-y-5">
                  <div
                    v-for="ejercicio in rutina.routine_exercises.slice(0, 3)"
                    :key="ejercicio.id"
                    class="text-base text-gray-700 flex items-center gap-3 py-1"
                  >
                    <span class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium border border-emerald-200">{{ ejercicio.order }}</span>
                    <span class="font-medium">{{ ejercicio.exercise?.name_es || 'Ejercicio' }}</span>
                  </div>
                  <div 
                    v-if="rutina.routine_exercises.length > 3"
                    class="text-sm text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-full inline-block mt-3"
                  >
                    + {{ rutina.routine_exercises.length - 3 }} ejercicios más
                  </div>
                </div>
                
                <!-- Contador de ejercicios al final -->
                <div class="mt-5 flex items-center justify-center">
                  <span class="text-sm bg-blue-100 text-blue-700 px-5 py-2.5 rounded-full border border-blue-200 font-medium flex items-center">
                    <Dumbbell class="w-4 h-4 mr-2 text-blue-600" />
                    {{ rutina.routine_exercises?.length || 0 }} ejercicios
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <div
      v-if="!sortedMesociclos.length"
      class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
    >
      <div class="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <Activity class="w-8 h-8 text-gray-400" />
      </div>
      <p class="text-gray-600 text-lg">No hay mesociclos configurados.</p>
      <p class="text-gray-500 mt-2">Crea tu primer mesociclo para comenzar.</p>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <h3 class="text-xl font-bold mb-3 text-gray-900">{{ confirmDialogTitle }}</h3>
        <p class="text-gray-700 mb-8">{{ confirmDialogMessage }}</p>
        <div class="flex justify-end space-x-4">
          <button 
            class="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            @click="cancelConfirmation"
          >
            Cancelar
          </button>
          <button 
            class="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
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
import { ref, watch, onMounted } from 'vue';
import { GripVertical, Pencil, Trash2, Power, Plus, Activity, Dumbbell } from 'lucide-vue-next';
import { useTrainingStore } from '@/stores/training';
import { storeToRefs } from 'pinia';
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
// Reactive refs for store state and getters
const { sortedMesociclos } = storeToRefs(trainingStore);
const removeMesociclo = trainingStore.deleteMesociclo;
const updateMesociclo = trainingStore.updateMesociclo;

console.log('MesocicloList mounted, initial sortedMesociclos:', sortedMesociclos);
onMounted(() => {
  console.log('MesocicloList onMounted, sortedMesociclos:', sortedMesociclos);
});
watch(sortedMesociclos, (val) => {
  console.log('MesocicloList watch sortedMesociclos changed:', val);
});

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