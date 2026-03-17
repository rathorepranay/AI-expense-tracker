import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUser, saveUser, clearUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call backend API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const newUser: User = {
            id: Math.random().toString(36).substring(7),
            email,
          };
          setUser(newUser);
          saveUser(newUser);
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const signup = async (email: string, password: string) => {
    // Mock signup - in real app, this would call backend API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const newUser: User = {
            id: Math.random().toString(36).substring(7),
            email,
          };
          setUser(newUser);
          saveUser(newUser);
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    clearUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
