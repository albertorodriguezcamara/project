import React, { useState, useEffect } from 'react';
import { fetchExerciseGif } from '../../utils/exerciseGifCache';
import { X, PlayCircle, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import { Exercise } from '../../types';
import { useWorkout } from '../../context/WorkoutContext';
import SubstituteExerciseModal from './SubstituteExerciseModal';

/**
 * Si deseas un GIF "pausado", necesitamos un previewUrl y un gifUrl.
 * Ajustamos la interface por si no lo tienes en tu 'Exercise' y 
 * usas 'imageUrl' para todo. Aquí supondremos que:
 *  - exercise.imageUrl es el GIF real
 *  - exercise.previewUrl (opcional) es la imagen estática
 */
interface ExerciseDetailModalProps {
  exercise: Exercise;       // conteniendo e.g. { imageUrl, previewUrl, muscleGroups, substitutes, ... }
  onClose: () => void;
}

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ 
  exercise, 
  onClose 
}) => {
  const { getExerciseHistory, getExerciseById } = useWorkout();
  const [showSubstituteModal, setShowSubstituteModal] = useState(false);

  // Estado para "pausar" el gif
  const [showGif, setShowGif] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadGif() {
      if (exercise.name) {
        const url = await fetchExerciseGif(exercise.name);
        if (isMounted) setGifUrl(url);
      }
    }
    loadGif();
    return () => { isMounted = false; };
  }, [exercise.name]);

  const exerciseHistory = getExerciseHistory(exercise.id);

  // Calcular peso máximo
  const getMaxWeight = (): number => {
    if (!exerciseHistory.length) return 0;
    return Math.max(
      ...exerciseHistory.flatMap(log => 
        log.sets.map(set => set.weight)
      )
    );
  };
  
  // Volumen total
  const getTotalVolume = (): number => {
    return exerciseHistory.reduce((total, log) => {
      return total + log.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  };
  
  // Cuántos entrenamientos incluyeron este ejercicio
  const getWorkoutCount = (): number => {
    return exerciseHistory.length;
  };

  // Navegar a otra vista al hacer clic en un sustituto
  const handleExerciseClick = (substituteId: number) => {
    onClose();
    window.location.href = `/exercise-library?exercise=${substituteId}`;
  };

  // Togle para "pausar" / "reproducir" la animación
  const toggleGif = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGif(!showGif);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose} 
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{exercise.name}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div 
            className="overflow-y-auto p-6" 
            style={{ maxHeight: 'calc(90vh - 76px)' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div>
                {/* Bloque de la imagen (GIF / Preview) */}
                {(gifUrl || exercise.imageUrl) && (
                  <div className="mb-6 rounded-lg overflow-hidden relative h-64 group">
                    <img 
                      src={showGif && gifUrl ? gifUrl : (exercise.previewUrl || exercise.imageUrl)}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Botón para togglear */}
                    <button
                      onClick={toggleGif}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white 
                                 hover:bg-opacity-70 transition-opacity"
                    >
                      {showGif ? (
                        <span className="flex items-center"><PlayCircle size={18} className="mr-1" /> Pausa</span>
                      ) : (
                        <span className="flex items-center"><PlayCircle size={18} className="mr-1" /> Reproducir</span>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Muscle groups */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {exercise.muscleGroups?.map((muscle, index) => (
                    <span 
                      key={index}
                      className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
                
                {/* Descripción */}
                {exercise.description && (
                  <p className="text-gray-700 mb-6">{exercise.description}</p>
                )}

                {/* Video de demostración */}
                {exercise.videoUrl && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <PlayCircle size={18} className="mr-2 text-emerald-600" />
                      Video de demostración
                    </h3>
                    <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden">
                      <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src={exercise.videoUrl}
                        title={`Video de ${exercise.name}`}
                        allow="accelerometer; autoplay; clipboard-write; 
                               encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Instrucciones */}
                {exercise.instructions && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Instrucciones</h3>
                    <div className="text-gray-600 text-sm whitespace-pre-line">
                      {exercise.instructions}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column */}
              <div>
                {/* Estadísticas */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">Estadísticas</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg text-center">
                      <span className="block text-gray-500 text-xs mb-1">Peso Máximo</span>
                      <span className="text-xl font-bold text-gray-900">
                        {getMaxWeight()} kg
                      </span>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg text-center">
                      <span className="block text-gray-500 text-xs mb-1">Volumen Total</span>
                      <span className="text-xl font-bold text-gray-900">
                        {Math.round(getTotalVolume())} kg
                      </span>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg text-center">
                      <span className="block text-gray-500 text-xs mb-1">Entrenamientos</span>
                      <span className="text-xl font-bold text-gray-900">
                        {getWorkoutCount()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Sustitutos recomendados */}
                {exercise.substitutes && exercise.substitutes.length > 0 && (
                  <div className="border border-gray-200 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <RefreshCw size={18} className="mr-2 text-amber-500" />
                      Ejercicios Sustitutos Recomendados
                    </h3>
                    
                    <div className="space-y-3">
                      {exercise.substitutes.map(subId => {
                        const substituteExercise = getExerciseById(subId);
                        if (!substituteExercise) return null;
                        
                        return (
                          <div 
                            key={subId}
                            className="p-3 border border-gray-200 rounded-md hover:border-emerald-300 
                                       transition-colors cursor-pointer flex justify-between items-center"
                            onClick={() => handleExerciseClick(subId)}
                          >
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {substituteExercise.name}
                              </h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {substituteExercise.muscleGroups.map((m, i) => (
                                  <span 
                                    key={i}
                                    className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full"
                                  >
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <ExternalLink size={16} className="text-gray-400" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Botón para abrir SubstitueExerciseModal */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowSubstituteModal(true)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors 
                               flex items-center"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Sustituir Ejercicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SubstitueExerciseModal */}
      {showSubstituteModal && (
        <SubstituteExerciseModal
          originalExercise={exercise}
          onClose={() => setShowSubstituteModal(false)}
          onSubstitute={() => {
            setShowSubstituteModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default ExerciseDetailModal;
