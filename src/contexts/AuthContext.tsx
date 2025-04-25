import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => Promise<boolean>; // Made async for future API calls
  logout: () => void;
}

// Hardcoded credentials (replace with backend call later)
const HARDCODED_EMAIL = "doctor@example.com";
const HARDCODED_PASSWORD = "password123";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or default to false
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
      return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = async (email?: string, password?: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, you'd make an API call here
    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true'); // Persist login state
      console.log("Login successful");
      return true;
    }
    console.log("Login failed");
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Clear persisted state
    console.log("Logged out");
    // In a real app, you might also call a backend logout endpoint
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
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