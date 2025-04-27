import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Session, AuthResponse } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for session on load
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error }: AuthResponse = await supabase.auth.signInWithPassword({
        email, 
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return { success: false, error: error.message };
      }

      console.log('Login successful');
      return { success: true };
    } catch (err) {
      console.error('Unexpected login error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error.message);
        return { success: false, error: error.message };
      }

      console.log('Signup successful');
      return { success: true };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Logout error:', error.message);
      console.log('Logged out');
    } catch (err) {
      console.error('Unexpected logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};