<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-500 to-blue-700 -mx-4 px-4 py-8 md:rounded-2xl md:mx-0 text-white mb-6">
      <div class="max-w-xl">
        <h1 class="text-3xl font-bold mb-2">Configuración</h1>
        <p class="text-blue-100">Personaliza tu experiencia de entrenamiento</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-12 gap-6">
        <!-- Sidebar Navigation -->
        <div class="col-span-12 lg:col-span-3">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <nav class="flex flex-col divide-y divide-gray-200">
              <button
                v-for="section in configSections"
                :key="section.id"
                @click="activeSection = section.id"
                class="flex items-center gap-3 p-4 text-left transition-colors"
                :class="[
                  activeSection === section.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                <component :is="section.icon" class="w-5 h-5" />
                <span class="font-medium">{{ section.name }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-span-12 lg:col-span-9 space-y-6">
          <!-- Training Settings -->
          <div v-show="activeSection === 'training'" class="space-y-6">
            <!-- Mesocycles Management -->
            <div class="card">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-lg font-bold text-gray-900">Mesociclos</h2>
                  <p class="text-sm text-gray-500 mt-1">
                    Gestiona tus ciclos de entrenamiento
                  </p>
                </div>
                <button 
                  class="btn-primary"
                  @click="showMesocicloForm = true"
                >
                  <Plus class="w-4 h-4 mr-2" />
                  Nuevo Mesociclo
                </button>
              </div>

              <MesocicloList
                :mesociclos="trainingStore.mesociclos"
                @edit="editMesociclo"
                @select="selectMesociclo"
                @add-rutina="handleAddRutina"
                @edit-rutina="editRutina"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <MesocicloForm
      v-if="showMesocicloForm"
      :mesociclo="selectedMesociclo"
      @cancel="cancelMesocicloForm"
      @saved="handleMesocicloSaved"
    />

    <template v-if="showRutinaForm">
  <RutinaForm
    v-if="selectedMesociclo"
    :mesociclo-id="selectedMesociclo.id"
    :rutina="selectedRutina"
    @cancel="cancelRutinaForm"
    @saved="handleRutinaSaved"
    @dirty="isRutinaDirty = true"
    @pristine="isRutinaDirty = false"
  />
  <div v-else class="fixed inset-0 z-50 bg-gray-900/70 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-xl text-center">
      <h2 class="text-lg font-bold mb-2">Error</h2>
      <p>No se ha seleccionado un mesociclo. Por favor, selecciona uno antes de añadir una rutina.</p>
      <button class="btn-primary mt-4" @click="showRutinaForm = false">Cerrar</button>
    </div>
  </div>
</template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  UserCircle, 
  Dumbbell, 
  Settings,
  Plus
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useTrainingStore } from '@/stores/training';
import type { Mesociclo, Rutina } from '@/types';
import MesocicloList from '@/components/mesociclos/MesocicloList.vue';
import MesocicloForm from '@/components/mesociclos/MesocicloForm.vue';
import RutinaForm from '@/components/rutinas/RutinaForm.vue';
import { toast } from 'vue3-toastify';

const router = useRouter();
const trainingStore = useTrainingStore();

// Navigation
const configSections = [
  { id: 'profile', name: 'Perfil', icon: UserCircle },
  { id: 'training', name: 'Entrenamiento', icon: Dumbbell },
  { id: 'settings', name: 'Ajustes', icon: Settings },
];
const activeSection = ref('training');

// Mesociclos & Rutinas State
const showMesocicloForm = ref(false);
const showRutinaForm = ref(false);
const selectedMesociclo = ref<Mesociclo | undefined>();
const selectedRutina = ref<Rutina | undefined>();
const isRutinaDirty = ref(false);

// Methods
function editMesociclo(mesociclo: Mesociclo) {
  if (showRutinaForm.value && isRutinaDirty.value) {
    if (!confirm('Tienes cambios sin guardar en la rutina. ¿Descartar cambios?')) {
      return;
    }
  }
  selectedMesociclo.value = mesociclo;
  showMesocicloForm.value = true;
  showRutinaForm.value = false;
  selectedRutina.value = undefined;
  isRutinaDirty.value = false;
}

function selectMesociclo(mesociclo: Mesociclo) {
  if (showRutinaForm.value && isRutinaDirty.value) {
    if (!confirm('Tienes cambios sin guardar en la rutina. ¿Descartar cambios?')) {
      return;
    }
  }
  selectedMesociclo.value = mesociclo;
  showRutinaForm.value = false;
  selectedRutina.value = undefined;
  showMesocicloForm.value = false;
  isRutinaDirty.value = false;
}

function handleAddRutina(mesociclo: Mesociclo) {
  if (showRutinaForm.value && isRutinaDirty.value) {
    if (!confirm('Tienes cambios sin guardar. ¿Descartar cambios?')) {
      return;
    }
  }
  selectedMesociclo.value = mesociclo;
  selectedRutina.value = undefined;
  showRutinaForm.value = true;
  showMesocicloForm.value = false;
  isRutinaDirty.value = false;
}

function editRutina(rutina: Rutina) {
  if (showRutinaForm.value && isRutinaDirty.value && selectedRutina.value?.id !== rutina.id) {
    if (!confirm('Tienes cambios sin guardar en otra rutina. ¿Descartar cambios?')) {
      return;
    }
  }
  selectedRutina.value = rutina;
  selectedMesociclo.value = trainingStore.mesociclos.find(m =>
    m.rutinas?.some(r => r.id === rutina.id)
  );
  showRutinaForm.value = true;
  showMesocicloForm.value = false;
  isRutinaDirty.value = false;
}

function cancelMesocicloForm() {
  showMesocicloForm.value = false;
  selectedMesociclo.value = undefined;
}

function handleMesocicloSaved() {
  showMesocicloForm.value = false;
  selectedMesociclo.value = undefined;
  trainingStore.fetchMesociclos();
}

function cancelRutinaForm() {
  if (isRutinaDirty.value) {
    if (!confirm('Tienes cambios sin guardar. ¿Descartar cambios?')) {
      return;
    }
  }
  showRutinaForm.value = false;
  selectedRutina.value = undefined;
  isRutinaDirty.value = false;
}

function handleRutinaSaved() {
  showRutinaForm.value = false;
  selectedRutina.value = undefined;
  isRutinaDirty.value = false;
  trainingStore.fetchMesociclos();
}
</script>