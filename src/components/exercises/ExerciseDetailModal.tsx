import React, { useState, useEffect } from 'react';
import { fetchExerciseGif } from '../../utils/exerciseGifCache';
import { X, PlayCircle, ExternalLink, Clock, RefreshCw, Info, Dumbbell, History, ChevronRight } from 'lucide-react';
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
        className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-100 animate-scaleIn">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <div className="flex items-center">
              <div className="bg-emerald-600 text-white p-2 rounded-lg mr-3">
                <Dumbbell size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{exercise.name} 🚀</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/50 active:scale-95 transition-all"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div 
            className="overflow-y-auto p-6 md:p-8" 
            style={{ maxHeight: 'calc(90vh - 88px)' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div>
                {/* Bloque de la imagen (GIF / Preview) */}
                {(gifUrl || exercise.imageUrl) && (
                  <div className="mb-6 rounded-xl overflow-hidden relative h-72 group shadow-md border border-gray-100/50">
                    <img 
                      src={showGif && gifUrl ? gifUrl : (exercise.previewUrl || exercise.imageUrl)}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Overlay gradiente en la parte inferior */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent"></div>
                    
                    {/* Botón para togglear */}
                    <button
                      onClick={toggleGif}
                      className="absolute bottom-3 right-3 px-4 py-2 rounded-full bg-emerald-600 text-white
                                 hover:bg-emerald-700 shadow-lg active:scale-95 transition-all flex items-center"
                    >
                      {showGif ? (
                        <span className="flex items-center"><PlayCircle size={18} className="mr-2" /> Pausar</span>
                      ) : (
                        <span className="flex items-center"><PlayCircle size={18} className="mr-2" /> Reproducir</span>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Muscle groups */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {exercise.muscleGroups?.map((muscle, index) => (
                    <span 
                      key={index}
                      className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 font-medium"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
                
                {/* Descripción */}
                {exercise.description && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Info size={18} className="mr-2 text-emerald-600" />
                      Descripción
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{exercise.description}</p>
                  </div>
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
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100/80 shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Info size={18} className="mr-2 text-emerald-600" />
                      Instrucciones
                    </h3>
                    <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                      {exercise.instructions}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column */}
              <div>
                {/* Estadísticas */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl mb-6 border border-emerald-100/50 shadow-sm">
                  <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                    <History size={18} className="mr-2 text-emerald-600" />
                    Estadísticas
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Dumbbell size={18} className="text-amber-600" />
                      </div>
                      <span className="block text-gray-500 text-xs mb-1 uppercase tracking-wide">Peso Máximo</span>
                      <span className="text-xl font-bold text-gray-900">
                        {getMaxWeight()} kg
                      </span>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock size={18} className="text-emerald-600" />
                      </div>
                      <span className="block text-gray-500 text-xs mb-1 uppercase tracking-wide">Volumen Total</span>
                      <span className="text-xl font-bold text-gray-900">
                        {Math.round(getTotalVolume())} kg
                      </span>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <History size={18} className="text-blue-600" />
                      </div>
                      <span className="block text-gray-500 text-xs mb-1 uppercase tracking-wide">Entrenamientos</span>
                      <span className="text-xl font-bold text-gray-900">
                        {getWorkoutCount()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Sustitutos recomendados */}
                {exercise.substitutes && exercise.substitutes.length > 0 && (
                  <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-xl mb-6 shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <RefreshCw size={18} className="mr-2 text-amber-600" />
                      Ejercicios Sustitutos Recomendados
                    </h3>
                    
                    <div className="space-y-3">
                      {exercise.substitutes.map(subId => {
                        const substituteExercise = getExerciseById(subId);
                        if (!substituteExercise) return null;
                        
                        return (
                          <div 
                            key={subId}
                            className="p-4 border bg-white border-amber-200/50 rounded-lg hover:border-amber-300 
                                       transition-all cursor-pointer flex justify-between items-center hover:shadow-md active:scale-99"
                            onClick={() => handleExerciseClick(subId)}
                          >
                            <div className="flex items-start space-x-3">
                              {substituteExercise.previewUrl && (
                                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                                  <img 
                                    src={substituteExercise.previewUrl} 
                                    alt={substituteExercise.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {substituteExercise.name}
                                </h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {substituteExercise.muscleGroups.map((m, i) => (
                                    <span 
                                      key={i}
                                      className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                                    >
                                      {m}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <ChevronRight size={18} className="text-amber-400" />
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
                    className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all 
                              shadow-md hover:shadow-lg active:scale-95 flex items-center font-medium"
                  >
                    <RefreshCw size={18} className="mr-2" />
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
