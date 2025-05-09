import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Library, 
  History, 
  Settings,
  Trophy,
  Menu,
  X
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentMesocycle } = useWorkout();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed z-50 bottom-5 right-5 p-4 rounded-full bg-emerald-600 text-white shadow-2xl md:hidden transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        style={{ minWidth: 60, minHeight: 60 }}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      
      {/* Sidebar backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden animate-fade-in"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed md:relative z-50 md:translate-x-0 transition-transform duration-300 ease-in-out
          w-72 max-w-full min-h-screen bg-slate-800 text-white flex flex-col shadow-2xl rounded-r-3xl md:rounded-none
          pb-safe-area
        `}
        style={{ top: 0, left: 0, bottom: 0 }}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="text-amber-500 mr-2" size={32} />
            <h1 className="text-2xl font-extrabold leading-none tracking-tight">The Natural Way</h1>
          </div>
          <div className="text-center text-base text-slate-400 font-medium">
            Nivel 2 <span className="text-emerald-400">(Hoplita)</span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-center text-slate-400 mb-1">
              Mesociclo actual: <span className="font-semibold text-white">{currentMesocycle}</span> de 8
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(currentMesocycle / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm rounded-md transition-colors
                  ${isActive 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/training-diary" 
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm rounded-md transition-colors
                  ${isActive 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <Dumbbell size={18} className="mr-3" />
                Diario de Entrenamiento
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/exercise-library" 
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm rounded-md transition-colors
                  ${isActive 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <Library size={18} className="mr-3" />
                Biblioteca de Ejercicios
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/historical-data" 
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm rounded-md transition-colors
                  ${isActive 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <History size={18} className="mr-3" />
                Histórico
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/settings" 
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm rounded-md transition-colors
                  ${isActive 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} className="mr-3" />
                Configuración
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-700 text-xs text-slate-400 text-center">
          The Natural Way &copy; 2025
        </div>
      </aside>
    </>
  );
};

export default Sidebar;