import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseCard from '../components/exercises/ExerciseCard';
import ExerciseDetailModal from '../components/exercises/ExerciseDetailModal';
import { Exercise } from '../types';

const ExerciseLibrary = () => {
  const { exercises } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Extract all unique muscle groups
  const allMuscleGroups = Array.from(
    new Set(exercises.flatMap(ex => ex.muscleGroups))
  ).sort();
  
  // Filter exercises based on search and filter
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMuscle = filterMuscle === '' || 
                          exercise.muscleGroups.includes(filterMuscle);
    
    return matchesSearch && matchesMuscle;
  });
  
  const openExerciseDetail = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };
  
  const closeExerciseDetail = () => {
    setSelectedExercise(null);
  };
  
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Ejercicios</h1>
        
        <div className="relative flex items-center w-full md:w-64">
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
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={toggleFilters}
        >
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 mr-2" />
            <h2 className="font-medium text-gray-700">Filtros</h2>
          </div>
          {isFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {isFiltersOpen && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grupo Muscular
              </label>
              <select
                value={filterMuscle}
                onChange={(e) => setFilterMuscle(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Todos los grupos musculares</option>
                {allMuscleGroups.map(muscle => (
                  <option key={muscle} value={muscle}>
                    {muscle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(exercise => (
          <ExerciseCard 
            key={exercise.id}
            exercise={exercise}
            onClick={() => openExerciseDetail(exercise)}
          />
        ))}
        
        {filteredExercises.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No se encontraron ejercicios con los filtros actuales.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMuscle('');
              }}
              className="mt-2 text-emerald-600 hover:text-emerald-700"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
      
      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal 
          exercise={selectedExercise}
          onClose={closeExerciseDetail}
        />
      )}
    </div>
  );
};

export default ExerciseLibrary;