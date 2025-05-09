import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { userProfile } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {userProfile ? <Outlet /> : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido a la plataforma de entrenamiento</h2>
                  <p className="text-gray-600 mb-6">Por favor, completa tu perfil en la sección de configuración para comenzar.</p>
                  <button 
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    onClick={() => window.location.href = '/settings'}
                  >
                    Ir a Configuración
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;