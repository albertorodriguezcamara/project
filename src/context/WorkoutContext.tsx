import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { exercisesData } from '../data/exercisesData';
import { 
  Mesocycle, 
  Exercise, 
  Workout, 
  ExerciseLog,
  ExerciseSubstitution
} from '../types';

interface WorkoutContextType {
  mesocycles: Mesocycle[];
  exercises: Exercise[];
  workouts: Workout[];
  currentMesocycle: number;
  exerciseSubstitutions: ExerciseSubstitution[];
  completeMesocycle: (id: number) => void;
  saveWorkout: (workout: Workout) => void;
  substituteExercise: (originalId: number, newId: number) => void;
  getExerciseById: (id: number) => Exercise | undefined;
  getCurrentMesocycleData: () => Mesocycle | undefined;
  getExerciseHistory: (exerciseId: number) => ExerciseLog[];
  updateMesocycles: (mesocycles: Mesocycle[]) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}

interface WorkoutProviderProps {
  children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [mesocycles, setMesocycles] = useState<Mesocycle[]>(() => {
    const saved = localStorage.getItem('mesocycles');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('exercises');
    return saved ? JSON.parse(saved) : exercisesData;
  });
  
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('workouts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentMesocycle, setCurrentMesocycle] = useState<number>(() => {
    const saved = localStorage.getItem('currentMesocycle');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [exerciseSubstitutions, setExerciseSubstitutions] = useState<ExerciseSubstitution[]>(() => {
    const saved = localStorage.getItem('exerciseSubstitutions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mesocycles', JSON.stringify(mesocycles));
  }, [mesocycles]);
  
  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
  }, [exercises]);
  
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);
  
  useEffect(() => {
    localStorage.setItem('currentMesocycle', currentMesocycle.toString());
  }, [currentMesocycle]);
  
  useEffect(() => {
    localStorage.setItem('exerciseSubstitutions', JSON.stringify(exerciseSubstitutions));
  }, [exerciseSubstitutions]);

  const completeMesocycle = (id: number) => {
    setMesocycles(prevMesocycles => 
      prevMesocycles.map(mesocycle => 
        mesocycle.id === id ? { ...mesocycle, completed: true } : mesocycle
      )
    );
    
    const nextMesocycle = mesocycles.find(m => m.order === currentMesocycle + 1);
    if (nextMesocycle) {
      setCurrentMesocycle(currentMesocycle + 1);
    }
  };
  
  const saveWorkout = (workout: Workout) => {
    setWorkouts(prevWorkouts => [...prevWorkouts, workout]);
  };
  
  const substituteExercise = (originalId: number, newId: number) => {
    setExerciseSubstitutions(prev => [
      ...prev.filter(sub => sub.originalExerciseId !== originalId),
      { originalExerciseId: originalId, newExerciseId: newId }
    ]);
  };
  
  const getExerciseById = (id: number): Exercise | undefined => {
    const substitution = exerciseSubstitutions.find(sub => sub.originalExerciseId === id);
    
    if (substitution) {
      return exercises.find(ex => ex.id === substitution.newExerciseId);
    }
    
    return exercises.find(ex => ex.id === id);
  };
  
  const getCurrentMesocycleData = (): Mesocycle | undefined => {
    return mesocycles.find(m => m.order === currentMesocycle);
  };
  
  const getExerciseHistory = (exerciseId: number): ExerciseLog[] => {
    const substitution = exerciseSubstitutions.find(sub => sub.originalExerciseId === exerciseId);
    
    return workouts.flatMap(workout => 
      workout.exercises.filter(ex => 
        ex.exerciseId === exerciseId || 
        (substitution && ex.exerciseId === substitution.newExerciseId)
      )
    );
  };

  const updateMesocycles = (newMesocycles: Mesocycle[]) => {
    setMesocycles(newMesocycles);
  };

  const value = {
    mesocycles,
    exercises,
    workouts,
    currentMesocycle,
    exerciseSubstitutions,
    completeMesocycle,
    saveWorkout,
    substituteExercise,
    getExerciseById,
    getCurrentMesocycleData,
    getExerciseHistory,
    updateMesocycles,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}