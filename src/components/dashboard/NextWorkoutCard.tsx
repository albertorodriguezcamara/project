import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Mesocycle } from '../../types'; // path is correct if src/types.ts exists at this relative location

interface NextWorkoutCardProps {
  mesocycleData: Mesocycle | undefined;
  lastWorkoutDate: string | null;
}

const NextWorkoutCard: React.FC<NextWorkoutCardProps> = ({ 
  mesocycleData,
  lastWorkoutDate 
}) => {
  const navigate = useNavigate();
  
  if (!mesocycleData) {
    return <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <p>No hay datos disponibles.</p>
    </div>;
  }
  
  // Determine which routine to suggest next
  const determineNextRoutine = () => {
    if (!lastWorkoutDate || !mesocycleData.routines || mesocycleData.routines.length === 0) {
      return mesocycleData.routines[0];
    }
    
    // Find the last routine used
    const lastWorkoutTime = new Date(lastWorkoutDate).getTime();
    const now = new Date().getTime();
    const daysSinceLastWorkout = Math.floor((now - lastWorkoutTime) / (1000 * 60 * 60 * 24));
    
    // Simple alternating logic - if it's been less than 2 days, suggest the other routine
    if (mesocycleData.routines.length > 1 && daysSinceLastWorkout < 2) {
      // Return the alternative routine
      return mesocycleData.routines[1];
    }
    
    // Default to first routine
    return mesocycleData.routines[0];
  };
  
  const nextRoutine = determineNextRoutine();
  
  if (!nextRoutine) {
    return <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <p>No hay rutinas disponibles para este mesociclo.</p>
    </div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
        Tu próximo entrenamiento
      </h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <h3 className="text-lg font-bold text-emerald-800">{nextRoutine.name}</h3>
          <p className="text-xs text-emerald-700 mt-1">
            {nextRoutine.exercises.length} ejercicios
          </p>
          
          <div className="flex items-center mt-3 text-xs text-emerald-800">
            <Calendar size={16} className="mr-1" />
            <span>Recomendado para hoy</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center text-gray-600 text-xs">
            <Clock size={16} className="mr-2" />
            <span>Duración estimada</span>
          </div>
          <div className="font-semibold text-xs">45-60 min</div>
        </div>
        
        <button 
          onClick={() => navigate('/training-diary')}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold shadow-md hover:bg-emerald-700 active:scale-98 transition-all flex items-center justify-center"
        >
          Comenzar Entrenamiento
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default NextWorkoutCard;