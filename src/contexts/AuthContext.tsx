// AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) setToken(savedToken);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      setToken(response.data.token);

      // Save both tokens if needed
      localStorage.setItem('auth_token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }

      return true;
    } catch {
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  };

  const value: AuthContextType = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
