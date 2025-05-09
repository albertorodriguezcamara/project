import React, { useState } from 'react';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import WorkoutForm from '../components/workout/WorkoutForm';
import EmptyState from '../components/common/EmptyState';

const TrainingDiary = () => {
  const { getCurrentMesocycleData, workouts } = useWorkout();
  const { userProfile } = useAuth();
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const currentMesocycle = getCurrentMesocycleData();
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
  };
  
  // Navigate between months
  const nextMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    ));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    ));
  };
  
  // Get days in month
  const getDaysInMonth = (date: Date): number => {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();
  };
  
  // Filter workouts for the current month
  const getWorkoutsForMonth = () => {
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate.getMonth() === currentMonth.getMonth() &&
        workoutDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };
  
  // Check if a specific day has a workout
  const getWorkoutForDay = (day: number) => {
    const targetDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toISOString().split('T')[0];
    
    return workouts.find(workout => workout.date === targetDate);
  };
  
  // Calendar days setup
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Add leading empty days for calendar alignment
  const leadingEmptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  const calendarDays = [...leadingEmptyDays, ...daysArray];
  
  // Is today in the current month view?
  const today = new Date();
  const isCurrentMonth = 
    today.getMonth() === currentMonth.getMonth() && 
    today.getFullYear() === currentMonth.getFullYear();
  const currentDate = today.getDate();
  
  return (
    <div className="space-y-6">
      {isCreatingWorkout ? (
        <div>
          <button
            onClick={() => setIsCreatingWorkout(false)}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft size={16} className="mr-1" />
            Volver al calendario
          </button>
          
          <WorkoutForm 
            onComplete={() => setIsCreatingWorkout(false)}
            defaultRestTime={userProfile?.defaultRestTime || 90}
          />
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Diario de Entrenamiento</h1>
            
            <button
              onClick={() => setIsCreatingWorkout(true)}
              className="mt-4 md:mt-0 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center"
            >
              <CalendarPlus size={18} className="mr-2" />
              Registrar Entrenamiento
            </button>
          </div>
          
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevMonth}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {formatDate(currentMonth)}
              </h2>
              
              <button
                onClick={nextMonth}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            {/* Calendar header */}
            <div className="grid grid-cols-7 text-center mb-2">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                <div key={index} className="py-2 text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded-md" />;
                }
                
                const workout = getWorkoutForDay(day);
                const isToday = isCurrentMonth && day === currentDate;
                
                return (
                  <div 
                    key={`day-${day}`}
                    className={`
                      h-24 rounded-md border p-2 relative overflow-hidden transition-colors
                      ${isToday 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 hover:border-emerald-300 bg-white'}
                      ${workout ? 'cursor-pointer' : ''}
                    `}
                    onClick={() => {
                      if (workout) {
                        // TODO: Show workout details
                        console.log('View workout:', workout);
                      }
                    }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className={`
                        text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
                        ${isToday ? 'bg-emerald-500 text-white' : 'text-gray-700'}
                      `}>
                        {day}
                      </span>
                      
                      {workout && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Rutina {workout.routineId}
                        </span>
                      )}
                    </div>
                    
                    {workout && (
                      <div className="text-xs text-gray-600">
                        <div className="line-clamp-1">
                          {workout.exercises.length} ejercicios
                        </div>
                        {workout.notes && (
                          <div className="line-clamp-2 mt-1 text-gray-500">
                            {workout.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {getWorkoutsForMonth().length === 0 && (
              <div className="mt-6 text-center py-6 text-gray-500">
                <p>No hay entrenamientos registrados este mes.</p>
              </div>
            )}
          </div>
          
          {/* Summary of recent workouts */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Entrenamientos Recientes
            </h2>
            
            {workouts.length === 0 ? (
              <EmptyState 
                title="No hay entrenamientos registrados"
                description="Comienza a registrar tus entrenamientos para ver tu progreso."
                icon={<CalendarPlus size={40} className="text-gray-400" />}
                action={{
                  label: "Registrar entrenamiento",
                  onClick: () => setIsCreatingWorkout(true)
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workouts.slice(0, 3).map(workout => (
                  <div 
                    key={workout.id}
                    className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:border-emerald-300 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Rutina {workout.routineId}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Mesociclo {workout.mesocycleId}
                        </p>
                      </div>
                      <div className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {new Date(workout.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-gray-600">
                        {workout.exercises.length} ejercicios, {' '}
                        {workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)} series
                      </p>
                      {workout.notes && (
                        <p className="text-gray-500 mt-2 line-clamp-2">
                          {workout.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDiary;