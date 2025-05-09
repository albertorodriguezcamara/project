import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TrainingDiary from './pages/TrainingDiary';
import ExerciseLibrary from './pages/ExerciseLibrary';
import HistoricalData from './pages/HistoricalData';
import Settings from './pages/Settings';
import ActiveWorkout from './pages/ActiveWorkout';
import { WorkoutProvider } from './context/WorkoutContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="training-diary" element={<TrainingDiary />} />
              <Route path="exercise-library" element={<ExerciseLibrary />} />
              <Route path="historical-data" element={<HistoricalData />} />
              <Route path="settings" element={<Settings />} />
            <Route path="active-workout" element={<ActiveWorkout />} />
            </Route>
          </Routes>
        </Router>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;