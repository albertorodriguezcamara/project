import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import MesocycleProgress from '../components/dashboard/MesocycleProgress';
import NextWorkoutCard from '../components/dashboard/NextWorkoutCard';
import StrengthMetrics from '../components/dashboard/StrengthMetrics';
import WorkoutSummary from '../components/dashboard/WorkoutSummary';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getCurrentMesocycleData, workouts, currentMesocycle } = useWorkout();
  const { userProfile } = useAuth();
  
  const currentMesocycleData = getCurrentMesocycleData();
  const lastWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);
  
  // Calculate some metrics for display
  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((exTotal, ex) => {
      return exTotal + ex.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  }, 0);
  
  // Get today's formatted date
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="flex flex-col gap-5 py-2 px-2 sm:px-4 max-w-2xl mx-auto">
  {/* Header with greeting and date */}
  <div className="flex flex-col gap-1 pt-2 pb-2">
    <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
      ¡Hola, {userProfile?.name || 'Usuario'}!
    </h1>
    <p className="text-base text-gray-500 font-medium">{capitalizedToday}</p>
    <button 
      onClick={() => navigate('/training-diary')}
      className="mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 text-white text-base font-semibold rounded-2xl shadow-lg active:scale-98 hover:bg-emerald-700 transition-all"
      style={{ minHeight: 48 }}
    >
      Registrar Entrenamiento
      <ChevronRight size={18} />
    </button>
  </div>

  {/* Stats Overview Cards */}
  <div className="flex flex-col gap-3">
    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-xl"><Calendar size={24} className="text-blue-500" /></div>
        <div>
          <p className="text-xs text-gray-500">Entrenamientos</p>
          <p className="text-2xl font-bold">{totalWorkouts}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-amber-50 rounded-xl"><BarChart3 size={24} className="text-amber-500" /></div>
        <div>
          <p className="text-xs text-gray-500">Volumen Total (kg)</p>
          <p className="text-2xl font-bold">{Math.round(totalVolume).toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-emerald-50 rounded-xl"><CheckCircle size={24} className="text-emerald-500" /></div>
        <div>
          <p className="text-xs text-gray-500">Mesociclo Actual</p>
          <p className="text-2xl font-bold">{currentMesocycle}/8</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-xl"><Clock size={24} className="text-indigo-500" /></div>
        <div>
          <p className="text-xs text-gray-500">Tiempo de Descanso</p>
          <p className="text-2xl font-bold">{userProfile?.defaultRestTime || 90}s</p>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content Grid */}
  <div className="flex flex-col gap-5">
    <MesocycleProgress 
      currentMesocycle={currentMesocycle} 
      mesocycleData={currentMesocycleData} 
    />
    <StrengthMetrics workouts={workouts} />
    <NextWorkoutCard 
      mesocycleData={currentMesocycleData} 
      lastWorkoutDate={workouts.length > 0 ? workouts[workouts.length - 1].date : null}
    />
    <WorkoutSummary workouts={lastWorkouts} />
  </div>
</div>
  );
};

export default Dashboard;