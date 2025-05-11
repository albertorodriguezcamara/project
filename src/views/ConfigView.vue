<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-emerald-600 to-emerald-800 -mx-4 px-6 py-12 md:rounded-3xl md:mx-0 text-white shadow-xl transition-all duration-300 mb-8">
      <div class="max-w-xl">
        <h1 class="text-3xl font-bold mb-3">Configuración</h1>
        <p class="text-lg text-emerald-100">Personaliza tu experiencia de entrenamiento</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-12 gap-8">
        <!-- Sidebar Navigation -->
        <div class="col-span-12 lg:col-span-3">
          <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden sticky top-6">
            <nav class="flex flex-col">
              <button
                v-for="section in configSections"
                :key="section.id"
                @click="activeSection = section.id"
                class="flex items-center gap-3 p-5 text-left transition-colors border-l-4"
                :class="[
                  activeSection === section.id 
                    ? 'bg-emerald-50 text-emerald-700 border-l-emerald-500' 
                    : 'text-gray-700 hover:bg-gray-50 border-l-transparent'
                ]"
              >
                <component :is="section.icon" class="w-5 h-5" />
                <span class="font-semibold">{{ section.name }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-span-12 lg:col-span-9 space-y-8">
          <!-- Training Settings -->
          <div v-show="activeSection === 'training'" class="space-y-8">
            <!-- Mesocycles Management -->
            <div class="card p-6 rounded-xl shadow-md border border-gray-200">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Mesociclos</h2>
                  <p class="text-base text-gray-600 mt-2">
                    Gestiona tus ciclos de entrenamiento
                  </p>
                </div>
                <button 
                  class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-5 rounded-xl font-medium text-sm shadow-md flex items-center transition-colors duration-200"
                  @click="showMesocicloForm = true"
                >
                  <Plus class="w-5 h-5 mr-2" />
                  Nuevo Mesociclo
                </button>
              </div>

              <MesocicloList
                :mesociclos="trainingStore.sortedMesociclos"
                @edit="editMesociclo"
                @select="selectMesociclo"
                @add-rutina="handleAddRutina"
                @edit-rutina="editRutina"
              />
            </div>
          </div>

          <!-- Advanced Settings -->
          <div v-show="activeSection === 'settings'">
            <SettingsView />
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
import { ref, onMounted } from 'vue';
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
import SettingsView from '@/views/SettingsView.vue';
import { toast } from 'vue3-toastify';

const router = useRouter();
const trainingStore = useTrainingStore();
console.log('ConfigView mounted, initial mesociclos:', trainingStore.mesociclos);
onMounted(async () => {
  console.log('Fetching mesociclos on mount');
  await trainingStore.fetchMesociclos();
  console.log('Mesociclos after fetch:', trainingStore.mesociclos);
});

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

async function handleMesocicloSaved() {
  console.log('handleMesocicloSaved start');
  showMesocicloForm.value = false;
  selectedMesociclo.value = undefined;
  await trainingStore.fetchMesociclos();
  console.log('Mesociclos after saving mesociclo:', trainingStore.mesociclos);
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

async function handleRutinaSaved() {
  console.log('handleRutinaSaved start');
  showRutinaForm.value = false;
  selectedRutina.value = undefined;
  isRutinaDirty.value = false;
  await trainingStore.fetchMesociclos();
  console.log('Mesociclos after saving rutina:', trainingStore.mesociclos);
}
</script>