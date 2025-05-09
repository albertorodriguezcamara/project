import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useWorkout } from '../../context/WorkoutContext';
import { Workout, Exercise, ExerciseLog, Set } from '../../types';
import ExerciseFormSection from './ExerciseFormSection';
import RestTimer from './RestTimer';

interface WorkoutFormProps {
  onComplete: () => void;
  defaultRestTime: number;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ 
  onComplete,
  defaultRestTime
}) => {
  const { getCurrentMesocycleData, saveWorkout } = useWorkout();
  const currentMesocycle = getCurrentMesocycleData();
  
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(defaultRestTime);
  
  // Initialize exercise selection when routine changes
  useEffect(() => {
    if (!currentMesocycle || !selectedRoutineId) {
      setExercises([]);
      return;
    }
    
    const selectedRoutine = currentMesocycle.routines.find(
      r => r.id === selectedRoutineId
    );
    
    if (!selectedRoutine) {
      setExercises([]);
      return;
    }
    
    // Initialize exercise logs with empty sets
    const initialExercises: ExerciseLog[] = selectedRoutine.exercises.map(exerciseId => ({
      exerciseId,
      sets: [
        {
          setNumber: 1,
          weight: 0,
          reps: 0,
          completed: false,
          restTime: defaultRestTime
        }
      ]
    }));
    
    setExercises(initialExercises);
  }, [currentMesocycle, selectedRoutineId, defaultRestTime]);
  
  const handleSaveWorkout = () => {
    if (!currentMesocycle || !selectedRoutineId) return;
    
    const newWorkout: Workout = {
      id: uuidv4(),
      date,
      mesocycleId: currentMesocycle.id,
      routineId: selectedRoutineId,
      notes,
      exercises
    };
    
    saveWorkout(newWorkout);
    onComplete();
  };
  
  const updateExerciseSets = (exerciseId: number, sets: Set[]) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.exerciseId === exerciseId 
          ? { ...ex, sets } 
          : ex
      )
    );
  };
  
  const startRestTimer = (duration: number) => {
    setTimerDuration(duration);
    setTimerActive(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Registrar Nuevo Entrenamiento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rutina
            </label>
            <select
              value={selectedRoutineId}
              onChange={(e) => setSelectedRoutineId(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Seleccionar rutina</option>
              {currentMesocycle?.routines.map(routine => (
                <option key={routine.id} value={routine.id}>
                  {routine.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anota cómo te sentiste, cualquier molestia, o ideas para la próxima sesión..."
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-24"
          />
        </div>
        
        {selectedRoutineId && exercises.length > 0 ? (
          <div className="space-y-6">
            {exercises.map((exercise, index) => (
              <ExerciseFormSection
                key={exercise.exerciseId}
                exerciseId={exercise.exerciseId}
                sets={exercise.sets}
                onChange={(sets) => updateExerciseSets(exercise.exerciseId, sets)}
                onTimerStart={startRestTimer}
                defaultRestTime={defaultRestTime}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">
              Selecciona una rutina para comenzar a registrar ejercicios.
            </p>
          </div>
        )}
        
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onComplete}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSaveWorkout}
            disabled={!selectedRoutineId || exercises.length === 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Guardar Entrenamiento
          </button>
        </div>
      </div>
      
      {timerActive && (
        <RestTimer 
          duration={timerDuration} 
          onComplete={() => setTimerActive(false)}
          onCancel={() => setTimerActive(false)}
        />
      )}
    </div>
  );
};

export default WorkoutForm;