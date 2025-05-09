import React, { useState } from 'react';
import { Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const HistoricalData = () => {
  const { workouts, getExerciseById } = useWorkout();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedMesocycle, setSelectedMesocycle] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const filteredWorkouts = workouts
    .filter(workout => {
      if (selectedMesocycle && workout.mesocycleId !== parseInt(selectedMesocycle)) {
        return false;
      }
      if (dateRange.start && workout.date < dateRange.start) {
        return false;
      }
      if (dateRange.end && workout.date > dateRange.end) {
        return false;
      }
      if (selectedExercise) {
        return workout.exercises.some(ex => ex.exerciseId === parseInt(selectedExercise));
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Histórico de Entrenamientos', 14, 22);
    
    const tableData = filteredWorkouts.map(workout => {
      const exercisesList = workout.exercises.map(ex => {
        const exercise = getExerciseById(ex.exerciseId);
        const sets = ex.sets.map(set => `${set.weight}kg x ${set.reps}`).join(', ');
        return `${exercise?.name}: ${sets}`;
      }).join('\n');

      return [
        workout.date,
        `Mesociclo ${workout.mesocycleId}`,
        `Rutina ${workout.routineId}`,
        exercisesList,
        workout.notes || ''
      ];
    });

    autoTable(doc, {
      head: [['Fecha', 'Mesociclo', 'Rutina', 'Ejercicios', 'Notas']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 80 },
        4: { cellWidth: 40 }
      }
    });

    doc.save('historico-entrenamientos.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Histórico de Entrenamientos</h1>
        
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Download size={18} className="mr-2" />
          Exportar PDF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 mr-2" />
            <h2 className="font-medium text-gray-700">Filtros</h2>
          </div>
          {isFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {isFiltersOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesociclo
              </label>
              <select
                value={selectedMesocycle}
                onChange={(e) => setSelectedMesocycle(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Mesociclo {num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ejercicio
              </label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                {/* Add exercise options here */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredWorkouts.map(workout => (
          <div 
            key={workout.id}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Mesociclo {workout.mesocycleId} - Rutina {workout.routineId}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(workout.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {workout.exercises.map(exercise => {
                const exerciseData = getExerciseById(exercise.exerciseId);
                if (!exerciseData) return null;

                return (
                  <div key={exercise.exerciseId} className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-gray-800">{exerciseData.name}</h4>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {exercise.sets.map((set, index) => (
                        <div 
                          key={index}
                          className="text-sm bg-gray-50 rounded p-2 flex justify-between"
                        >
                          <span className="text-gray-500">Serie {set.setNumber}:</span>
                          <span className="font-medium">{set.weight}kg × {set.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {workout.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notas:</span> {workout.notes}
                </p>
              </div>
            )}
          </div>
        ))}

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No se encontraron entrenamientos con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalData;