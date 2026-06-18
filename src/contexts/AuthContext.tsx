import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('tw_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('tw_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async () => {
    const defaultUser: User = {
      id: 'usr-google-101',
      email: 'admin@terrawatch.org',
      name: 'TerraWatch Administrator',
      role: 'ADMIN',
      ecoCoinBalance: 250,
    };
    setUser(defaultUser);
    localStorage.setItem('tw_user', JSON.stringify(defaultUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('tw_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
