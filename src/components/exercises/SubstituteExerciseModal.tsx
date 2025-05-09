import React, { useState } from 'react';
import { X, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { Exercise } from '../../types';
import { useWorkout } from '../../context/WorkoutContext';

interface SubstituteExerciseModalProps {
  originalExercise: Exercise;
  onClose: () => void;
  onSubstitute: () => void;
}

const SubstituteExerciseModal: React.FC<SubstituteExerciseModalProps> = ({ 
  originalExercise, 
  onClose,
  onSubstitute
}) => {
  const { exercises, substituteExercise } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  
  // Filter exercises by search term and exclude the original exercise
  const filteredExercises = exercises
    .filter(exercise => 
      exercise.id !== originalExercise.id &&
      (exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       exercise.muscleGroups.some(muscle => 
         muscle.toLowerCase().includes(searchTerm.toLowerCase())
       ))
    );
  
  // Prioritize recommended substitutes if they exist
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    const aIsRecommended = originalExercise.substitutes?.includes(a.id) || false;
    const bIsRecommended = originalExercise.substitutes?.includes(b.id) || false;
    
    if (aIsRecommended && !bIsRecommended) return -1;
    if (!aIsRecommended && bIsRecommended) return 1;
    return 0;
  });
  
  const handleSubstitute = () => {
    if (selectedExerciseId) {
      substituteExercise(originalExercise.id, selectedExerciseId);
      onSubstitute();
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Sustituir Ejercicio</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-amber-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-amber-800 text-sm">
                    Estás a punto de sustituir <strong>{originalExercise.name}</strong>. 
                    Esto sustituirá el ejercicio en todos tus entrenamientos futuros.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar un ejercicio sustituto
              </label>
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ejercicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mb-4 max-h-64 overflow-y-auto">
              {sortedExercises.length === 0 ? (
                <p className="text-center py-4 text-gray-500">
                  No se encontraron ejercicios que coincidan con tu búsqueda.
                </p>
              ) : (
                <div className="space-y-2">
                  {sortedExercises.map(exercise => (
                    <div 
                      key={exercise.id} 
                      className={`
                        p-3 border rounded-md cursor-pointer transition-colors flex items-center
                        ${selectedExerciseId === exercise.id 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-emerald-300'}
                        ${originalExercise.substitutes?.includes(exercise.id) 
                          ? 'ring-1 ring-amber-300' 
                          : ''}
                      `}
                      onClick={() => setSelectedExerciseId(exercise.id)}
                    >
                      {exercise.imageUrl ? (
                        <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={exercise.imageUrl} 
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-3 flex-shrink-0">
                          <RefreshCw size={20} className="text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">
                          {exercise.name}
                          {originalExercise.substitutes?.includes(exercise.id) && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                              Recomendado
                            </span>
                          )}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exercise.muscleGroups.slice(0, 3).map((muscle, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate"
                            >
                              {muscle}
                            </span>
                          ))}
                          {exercise.muscleGroups.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{exercise.muscleGroups.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center ml-2">
                        {selectedExerciseId === exercise.id && (
                          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleSubstitute}
                disabled={!selectedExerciseId}
                className={`
                  px-4 py-2 rounded-md text-white transition-colors flex items-center
                  ${selectedExerciseId 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-gray-300 cursor-not-allowed'}
                `}
              >
                <RefreshCw size={16} className="mr-2" />
                Confirmar Sustitución
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubstituteExerciseModal;