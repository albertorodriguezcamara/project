import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, BarChart3 } from 'lucide-react';
import { Workout } from '../../types'; // path is correct if src/types.ts exists at this relative location
import { useWorkout } from '../../context/WorkoutContext';

interface WorkoutSummaryProps {
  workouts: Workout[];
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({ workouts }) => {
  const navigate = useNavigate();
  const { getExerciseById } = useWorkout();
  
  // Calculate volume for a workout
  const calculateVolume = (workout: Workout): number => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exTotal, set) => {
        return exTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  };
  
  // Format date to a readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  
  // Get workout summary - show exercise count and total sets
  const getWorkoutSummary = (workout: Workout): string => {
    const exerciseCount = workout.exercises.length;
    const totalSets = workout.exercises.reduce(
      (total, ex) => total + ex.sets.length, 0
    );
    
    return `${exerciseCount} ejercicios, ${totalSets} series`;
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Entrenamientos Recientes
        </h2>
        <button
          onClick={() => navigate('/historical-data')}
          className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center font-semibold active:scale-98 transition-all"
        >
          Ver todos
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      
      {workouts.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No hay entrenamientos registrados todavía.</p>
          <button
            onClick={() => navigate('/training-diary')}
            className="mt-2 text-emerald-600 hover:text-emerald-700"
          >
            Registrar tu primer entrenamiento
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {workouts.map(workout => (
            <div 
              key={workout.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors flex justify-between items-center"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800 text-base">
                    Rutina {workout.routineId} - Mesociclo {workout.mesocycleId}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {getWorkoutSummary(workout)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(workout.date)}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <BarChart3 size={14} className="mr-1" />
                    {Math.round(calculateVolume(workout)).toLocaleString()} kg
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutSummary;