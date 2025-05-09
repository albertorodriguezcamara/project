import React from 'react';
import { Plus, Minus, Timer } from 'lucide-react';
import { Set } from '../../types';
import { useWorkout } from '../../context/WorkoutContext';

interface ExerciseFormSectionProps {
  exerciseId: number;
  sets: Set[];
  onChange: (sets: Set[]) => void;
  onTimerStart: (duration: number) => void;
  defaultRestTime: number;
}

const ExerciseFormSection: React.FC<ExerciseFormSectionProps> = ({
  exerciseId,
  sets,
  onChange,
  onTimerStart,
  defaultRestTime
}) => {
  const { getExerciseById } = useWorkout();
  const exercise = getExerciseById(exerciseId);
  
  if (!exercise) {
    return null;
  }
  
  const handleUpdateSet = (index: number, field: keyof Set, value: any) => {
    const updatedSets = [...sets];
    updatedSets[index] = {
      ...updatedSets[index],
      [field]: value
    };
    onChange(updatedSets);
  };
  
  const handleAddSet = () => {
    const nextSetNumber = sets.length + 1;
    // Copy values from the last set as a starting point
    const lastSet = sets[sets.length - 1];
    
    const newSet: Set = {
      setNumber: nextSetNumber,
      weight: lastSet.weight,
      reps: lastSet.reps,
      completed: false,
      restTime: lastSet.restTime || defaultRestTime
    };
    
    onChange([...sets, newSet]);
  };
  
  const handleRemoveSet = (index: number) => {
    if (sets.length <= 1) return;
    
    const updatedSets = sets
      .filter((_, i) => i !== index)
      .map((set, i) => ({ ...set, setNumber: i + 1 }));
    
    onChange(updatedSets);
  };
  
  const startRestTimer = (index: number) => {
    const restTime = sets[index].restTime || defaultRestTime;
    handleUpdateSet(index, 'completed', true);
    onTimerStart(restTime);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{exercise.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {exercise.muscleGroups.map((muscle, idx) => (
              <span 
                key={idx}
                className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
        
        {exercise.imageUrl && (
          <div className="mt-3 md:mt-0 w-16 h-16 rounded-md overflow-hidden">
            <img 
              src={exercise.imageUrl} 
              alt={exercise.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Serie</th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Peso (kg)</th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Reps</th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Descanso</th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set, index) => (
              <tr key={index} className={`border-t border-gray-200 ${set.completed ? 'bg-emerald-50' : ''}`}>
                <td className="px-4 py-2 text-sm">
                  {set.setNumber}
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={set.weight}
                    onChange={(e) => handleUpdateSet(index, 'weight', Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={set.reps}
                    onChange={(e) => handleUpdateSet(index, 'reps', Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={set.restTime || defaultRestTime}
                      onChange={(e) => handleUpdateSet(index, 'restTime', Number(e.target.value))}
                      className="w-20 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <span className="ml-1 text-sm text-gray-500">s</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startRestTimer(index)}
                      className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      title="Iniciar temporizador de descanso"
                    >
                      <Timer size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleUpdateSet(index, 'completed', !set.completed)}
                      className={`p-1 rounded transition-colors ${
                        set.completed 
                          ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={set.completed ? 'Marcar como incompleta' : 'Marcar como completada'}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleRemoveSet(index)}
                      disabled={sets.length <= 1}
                      className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Eliminar serie"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleAddSet}
          className="flex items-center text-sm text-emerald-600 hover:text-emerald-700"
        >
          <Plus size={16} className="mr-1" />
          Añadir serie
        </button>
      </div>
    </div>
  );
};

export default ExerciseFormSection;