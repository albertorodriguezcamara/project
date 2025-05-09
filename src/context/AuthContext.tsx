import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  id: string;
  name: string;
  weight: number;
  experience: string;
  goals: string;
  defaultRestTime: number;
  notificationsEnabled: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  login: (name: string) => void;
  logout: () => void;
}

const defaultUserProfile: UserProfile = {
  id: '1',
  name: 'Usuario',
  weight: 75,
  experience: 'Intermedio',
  goals: 'Hipertrofia y fuerza',
  defaultRestTime: 90,
  notificationsEnabled: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultUserProfile;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...profile } : null);
  };
  
  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserProfile(prev => prev ? { ...prev, name } : { ...defaultUserProfile, name });
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    // Don't clear the profile on logout for this app
  };

  const value = {
    isAuthenticated,
    userProfile,
    updateUserProfile,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}