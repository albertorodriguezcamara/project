import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Workout, ExerciseLog } from '../../types'; // path is correct if src/types.ts exists at this relative location
import { useWorkout } from '../../context/WorkoutContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StrengthMetricsProps {
  workouts: Workout[];
}

const StrengthMetrics: React.FC<StrengthMetricsProps> = ({ workouts }) => {
  const { exercises, getExerciseById } = useWorkout();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  
  // Pick a default exercise when component mounts
  useEffect(() => {
    if (exercises.length > 0 && selectedExerciseId === null) {
      setSelectedExerciseId(exercises[0].id);
    }
  }, [exercises, selectedExerciseId]);
  
  const selectedExercise = selectedExerciseId 
    ? exercises.find(ex => ex.id === selectedExerciseId) 
    : null;
  
  // Cycle through exercises
  const selectNextExercise = () => {
    if (!selectedExerciseId) return;
    
    const currentIndex = exercises.findIndex(ex => ex.id === selectedExerciseId);
    if (currentIndex === exercises.length - 1) {
      setSelectedExerciseId(exercises[0].id);
    } else {
      setSelectedExerciseId(exercises[currentIndex + 1].id);
    }
  };
  
  const selectPrevExercise = () => {
    if (!selectedExerciseId) return;
    
    const currentIndex = exercises.findIndex(ex => ex.id === selectedExerciseId);
    if (currentIndex === 0) {
      setSelectedExerciseId(exercises[exercises.length - 1].id);
    } else {
      setSelectedExerciseId(exercises[currentIndex - 1].id);
    }
  };
  
  const getExerciseHistory = (exerciseId: number): ExerciseLog[] => {
    return workouts.flatMap(workout => 
      workout.exercises.filter(ex => ex.exerciseId === exerciseId)
    );
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!selectedExerciseId) return null;
    
    const history = getExerciseHistory(selectedExerciseId);
    if (history.length === 0) return null;
    
    // Group by date and get max weight for each date
    const dateMap = new Map<string, number>();
    
    history.forEach(log => {
      const workout = workouts.find(w => 
        w.exercises.some(ex => ex.exerciseId === log.exerciseId)
      );
      
      if (!workout) return;
      
      const date = workout.date;
      
      // Find max weight in log sets
      const maxWeight = Math.max(...log.sets.map(set => set.weight));
      
      if (!dateMap.has(date) || maxWeight > dateMap.get(date)!) {
        dateMap.set(date, maxWeight);
      }
    });
    
    // Sort dates chronologically
    const sortedDates = Array.from(dateMap.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    
    // Create chart data
    return {
      labels: sortedDates.map(date => new Date(date).toLocaleDateString('es-ES')),
      datasets: [
        {
          label: 'Peso máximo (kg)',
          data: sortedDates.map(date => dateMap.get(date) || 0),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: true,
        }
      ]
    };
  };
  
  const chartData = selectedExerciseId ? prepareChartData() : null;
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Peso (kg)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Progreso de Fuerza
        </h2>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={selectPrevExercise} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-98 transition-all"
            aria-label="Ejercicio anterior"
          >
            <ChevronLeft size={20} />
          </button>
          
          <select 
            value={selectedExerciseId || ''}
            onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
            className="text-sm sm:text-base md:text-lg border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {exercises.map(exercise => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={selectNextExercise} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-98 transition-all"
            aria-label="Ejercicio siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {selectedExercise && (
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800 text-lg sm:text-xl md:text-2xl">{selectedExercise.name}</h3>
            <div className="text-xs sm:text-sm md:text-base bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
              {selectedExercise.muscleGroups.join(', ')}
            </div>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1">{selectedExercise.description}</p>
        </div>
      )}
      
      <div className="h-64 sm:h-80 md:h-96 lg:h-128 xl:h-160 mt-6">
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrengthMetrics;