import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Mesocycle } from '../../types'; // path is correct if src/types.ts exists at this relative location
import { useWorkout } from '../../context/WorkoutContext';

interface MesocycleProgressProps {
  currentMesocycle: number;
  mesocycleData: Mesocycle | undefined;
}

const MesocycleProgress: React.FC<MesocycleProgressProps> = ({ 
  currentMesocycle, 
  mesocycleData 
}) => {
  const navigate = useNavigate();
  const { completeMesocycle } = useWorkout();
  
  if (!mesocycleData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <p>No hay datos del mesociclo actual.</p>
      </div>
    );
  }
  
  const handleCompleteMesocycle = () => {
    if (window.confirm(`¿Estás seguro de que quieres marcar el mesociclo ${mesocycleData.name} como completado?`)) {
      completeMesocycle(currentMesocycle);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Progreso del Mesociclo
        </h2>
        <button
          onClick={() => navigate('/historical-data')}
          className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center font-semibold active:scale-98 transition-all"
        >
          Ver histórico
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-gray-800">{mesocycleData.name}</h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 py-1 px-2 rounded-full">
            {mesocycleData.durationWeeks} semanas
          </span>
        </div>
        <p className="text-gray-600 text-xs">{mesocycleData.description}</p>
      </div>
      
      {/* Mesocycle progress visualization */}
      <div className="grid grid-cols-8 gap-1 my-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full ${
              i + 1 < currentMesocycle
                ? 'bg-emerald-500'
                : i + 1 === currentMesocycle
                ? 'bg-amber-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      {/* Current routines */}
      <div className="mt-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Rutinas del mesociclo actual:</h3>
        <div className="flex flex-col gap-2">
          {mesocycleData.routines.map(routine => (
            <div key={routine.id} className="border border-gray-200 rounded-xl p-3 hover:border-emerald-300 transition-colors flex justify-between items-center">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800 text-sm">{routine.name}</span>
                <span className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded-full font-semibold">
                  {routine.exercises.length} ejercicios
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleCompleteMesocycle}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow-md hover:bg-emerald-700 active:scale-98 transition-all"
        >
          Completar Mesociclo
        </button>
      </div>
    </div>
  );
};

export default MesocycleProgress;