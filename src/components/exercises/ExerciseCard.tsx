import React, { useState, useEffect } from 'react';
import { fetchExerciseGif } from '../../utils/exerciseGifCache';

interface Exercise {
  id: string;
  name: string;
  imageUrl: string;       // GIF principal
  previewUrl?: string;    // Preview static
  muscleGroups: string[];
  description?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
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

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // no disparar el onClick de la card
    setShowGif(!showGif);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:border-emerald-300
                 transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden relative group">
        <img
          src={showGif && gifUrl ? gifUrl : (exercise.previewUrl || exercise.imageUrl)}
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <button
          className="absolute bottom-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white
                     hover:bg-opacity-70"
          onClick={togglePlay}
        >
          {showGif ? 'Pause' : 'Play'}
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {exercise.muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full"
            >
              {muscle}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {exercise.description}
        </p>
      </div>
    </div>
  );
};

export default ExerciseCard;
