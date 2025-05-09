import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [title, setTitle] = useState('Dashboard');
  const location = useLocation();
  const { userProfile } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') setTitle('Dashboard');
    else if (path === '/training-diary') setTitle('Diario de Entrenamiento');
    else if (path === '/exercise-library') setTitle('Biblioteca de Ejercicios');
    else if (path === '/historical-data') setTitle('Histórico');
    else if (path === '/settings') setTitle('Configuración');
  }, [location]);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-14 flex items-center px-3 md:px-6 sticky top-0 left-0 right-0 z-30" style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}>
      <div className="flex-1">
        <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight truncate" style={{ letterSpacing: '-0.01em' }}>{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-200" aria-label="Notificaciones" style={{ minWidth: 44, minHeight: 44 }}>
          <Bell size={20} />
        </button>
        
        <div className="relative">
          <button 
            className="flex items-center space-x-2 p-2 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-200"
            style={{ minWidth: 44, minHeight: 44 }}
            aria-label="Perfil"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
              {userProfile?.name.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              {userProfile?.name || 'Usuario'}
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          
          {profileOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 animate-fade-in"
              onMouseLeave={() => setProfileOpen(false)}
              style={{ minWidth: 180 }}
            >
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{userProfile?.name}</p>
                <p className="text-xs text-gray-500">Nivel: {userProfile?.experience}</p>
              </div>
              <a 
                href="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Configuración
              </a>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;