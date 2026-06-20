import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { supabase } from '../services/supabase/client';

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
  const loadUser = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        name:
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          'TerraWatch User',
        role: 'USER',
        ecoCoinBalance: 0
      });
    }

    setIsLoading(false);
  };

  loadUser();

  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        name:
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          'TerraWatch User',
        role: 'USER',
        ecoCoinBalance: 0
      });
    } else {
      setUser(null);
    }
  });

  return () => subscription.unsubscribe();
}, []);

  const login = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
};

  const logout = async () => {
  await supabase.auth.signOut();
  setUser(null);
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
