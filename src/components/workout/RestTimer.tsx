import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

interface RestTimerProps {
  duration: number;
  onComplete: () => void;
  onCancel: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ 
  duration, 
  onComplete,
  onCancel
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Set up the timer
  useEffect(() => {
    // Only run the timer if not paused
    if (!isPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer finished
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioRef.current) audioRef.current.play();
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, onComplete]);
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const resetTimer = () => {
    setTimeLeft(duration);
    setIsPaused(false);
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = (timeLeft / duration) * 100;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="bg-white rounded-t-lg shadow-lg border border-gray-200 mx-auto max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">Temporizador de Descanso</h3>
          <button 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-gray-900">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div 
              className="absolute top-0 left-0 h-full bg-emerald-500 timer-progress"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={togglePause}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            
            <button
              onClick={resetTimer}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestTimer;