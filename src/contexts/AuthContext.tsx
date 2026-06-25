import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { supabase } from '../services/supabase/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const createProfileIfNeeded = async (authUser: any) => {

    const role =
  authUser.email === 'priyashahgoyal@gmail.com'
    ? 'ADMIN'
    : 'USER';

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', authUser.id)
    .maybeSingle();

  // if (existingProfile) return;
  if (existingProfile) {
  await supabase
    .from('profiles')
    .update({ role })
    .eq('id', authUser.id);

  return;
}

  const { error } = await supabase
    .from('profiles')
    .insert({
      id: authUser.id,
      full_name:
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        'TerraWatch User',
      email: authUser.email,
      role,
      eco_coins: 0
    });

  if (error) {
    console.error('Profile creation failed:', error);
  }
};

  useEffect(() => {
  const loadUser = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session?.user) {
      await createProfileIfNeeded(session.user);
      const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  setUser({
    id: session.user.id,
    email: session.user.email || '',
    name: profile?.full_name || 'TerraWatch User',
    role: profile?.role || 'USER',
    ecoCoinBalance: profile?.eco_coins || 0
      });
    }

    setIsLoading(false);
  };

  loadUser();

  const {
  data: { subscription }
} = supabase.auth.onAuthStateChange(async (_event, session) => {

  if (session?.user) {

    await createProfileIfNeeded(session.user);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    setUser({
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.full_name || 'TerraWatch User',
      role: profile?.role || 'USER',
      ecoCoinBalance: profile?.eco_coins || 0
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
      redirectTo: window.location.origin,
      queryParams: {
        prompt: 'select_account'
      }
    }
  });
};

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: profile.full_name || prev.name,
              role: profile.role || prev.role,
              ecoCoinBalance: profile.eco_coins ?? 0,
            }
          : null
      );
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, refreshUser }}>
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
