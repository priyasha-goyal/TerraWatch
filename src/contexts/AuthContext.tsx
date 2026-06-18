import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: (role?: 'USER' | 'MUNICIPALITY' | 'ADMIN') => Promise<void>;
  logout: () => Promise<void>;
  updateEcoCoins: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for session simulation
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

  const loginWithGoogle = async (role: 'USER' | 'MUNICIPALITY' | 'ADMIN' = 'USER') => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: 'usr-google-101',
      email: role === 'ADMIN' ? 'admin@terrawatch.gov' : role === 'MUNICIPALITY' ? 'officer@city.gov' : 'volunteer.green@gmail.com',
      name: role === 'ADMIN' ? 'Admin Controller' : role === 'MUNICIPALITY' ? 'Municipal Waste Inspector' : 'Eco Volunteer',
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format&q=80',
      ecoCoinBalance: 250,
    };
    
    setUser(mockUser);
    localStorage.setItem('tw_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser(null);
    localStorage.removeItem('tw_user');
    setIsLoading(false);
  };

  const updateEcoCoins = (amount: number) => {
    if (user) {
      const updated = { ...user, ecoCoinBalance: user.ecoCoinBalance + amount };
      setUser(updated);
      localStorage.setItem('tw_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout, updateEcoCoins }}>
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
