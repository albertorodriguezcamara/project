import React, { useState } from 'react';
import { Save, Bell, Clock, Plus, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { Mesocycle, Routine, RoutineExercise } from '../types';

const Settings = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { mesocycles, updateMesocycles } = useWorkout();
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    weight: userProfile?.weight || 75,
    experience: userProfile?.experience || 'Intermedio',
    goals: userProfile?.goals || 'Hipertrofia y fuerza',
    defaultRestTime: userProfile?.defaultRestTime || 90,
    notificationsEnabled: userProfile?.notificationsEnabled || false,
    programName: userProfile?.programName || 'Mi Programa de Entrenamiento'
  });

  const [editingMesocycle, setEditingMesocycle] = useState<Mesocycle | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  const handleAddMesocycle = () => {
    const newMesocycle: Mesocycle = {
      id: mesocycles.length + 1,
      name: `Mesociclo ${mesocycles.length + 1}`,
      description: '',
      completed: false,
      durationWeeks: 4,
      routines: [],
      order: mesocycles.length + 1
    };
    updateMesocycles([...mesocycles, newMesocycle]);
  };

  const handleEditMesocycle = (mesocycle: Mesocycle) => {
    setEditingMesocycle(mesocycle);
  };

  const handleSaveMesocycle = (updatedMesocycle: Mesocycle) => {
    updateMesocycles(
      mesocycles.map(m => m.id === updatedMesocycle.id ? updatedMesocycle : m)
    );
    setEditingMesocycle(null);
  };

  const handleDeleteMesocycle = (mesocycleId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mesociclo?')) {
      updateMesocycles(mesocycles.filter(m => m.id !== mesocycleId));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Program Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Programa</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Programa
              </label>
              <input
                type="text"
                value={formData.programName}
                onChange={(e) => setFormData(prev => ({ ...prev, programName: e.target.value }))}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mesocycles Management */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mesociclos</h2>
            <button
              type="button"
              onClick={handleAddMesocycle}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Añadir Mesociclo
            </button>
          </div>

          <div className="space-y-4">
            {mesocycles.map(mesocycle => (
              <div key={mesocycle.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{mesocycle.name}</h3>
                    <p className="text-sm text-gray-500">{mesocycle.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditMesocycle(mesocycle)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMesocycle(mesocycle.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Routines list */}
                <div className="mt-4 space-y-2">
                  {mesocycle.routines.map(routine => (
                    <div key={routine.id} className="bg-gray-50 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{routine.name}</span>
                        <div className="text-sm text-gray-500">
                          {routine.exercises.length} ejercicios
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Perfil Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Experiencia
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivos
              </label>
              <select
                value={formData.goals}
                onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="Hipertrofia y fuerza">Hipertrofia y fuerza</option>
                <option value="Fuerza máxima">Fuerza máxima</option>
                <option value="Resistencia muscular">Resistencia muscular</option>
                <option value="Pérdida de grasa">Pérdida de grasa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Training Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de Entrenamiento</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="text-gray-400 mr-3" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Tiempo de Descanso Predeterminado</h3>
                  <p className="text-sm text-gray-500">Tiempo entre series en segundos</p>
                </div>
              </div>
              <input
                type="number"
                value={formData.defaultRestTime}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultRestTime: Number(e.target.value) }))}
                className="w-24 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="text-gray-400 mr-3" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
                  <p className="text-sm text-gray-500">Recordatorios de entrenamiento</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notificationsEnabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center"
          >
            <Save size={18} className="mr-2" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;