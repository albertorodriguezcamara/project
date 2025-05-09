import React from 'react';
import { useNavigate } from 'react-router-dom';

// Aquí puedes importar los tipos y componentes necesarios
// import { Workout, ExerciseLog } from '../types';

const ActiveWorkout: React.FC = () => {
  // Aquí irá la lógica para cargar la rutina activa y su estado
  // const { activeWorkout } = useWorkout();
  // const navigate = useNavigate();

  return (
    <div className="active-workout-container">
      {/* Temporizador global aquí */}
      <div className="timer-bar">
        {/* TODO: Temporizador de entrenamiento */}
        <span>00:00</span>
      </div>

      {/* Lista de ejercicios y series */}
      <div className="exercises-list">
        {/* TODO: Renderizar todos los ejercicios y series de la rutina activa */}
        <p>Aquí se mostrarán los ejercicios y series del entrenamiento actual.</p>
      </div>

      {/* Botón para terminar entrenamiento */}
      <button className="finish-btn" onClick={() => {/* TODO: lógica para finalizar */}}>
        Terminar Entrenamiento
      </button>
    </div>
  );
};

export default ActiveWorkout;
