import React, { createContext, useContext, useState, useEffect } from 'react';
import { config, sampleCredentials } from '@/config/environment';
import { authAPI } from '@/services/api';

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, still use sample credentials but simulate API call
      const credentials = sampleCredentials[config.environment];
      
      if (email === credentials.email && password === credentials.password) {
        // Simulate API response with token
        const mockResponse = {
          token: `mock_token_${Date.now()}`,
          user: {
            email,
            name: 'Admin User',
            role: 'Administrator'
          }
        };
        
        // Save token and user data
        setToken(mockResponse.token);
        setUser(mockResponse.user);
        localStorage.setItem('auth_token', mockResponse.token);
        localStorage.setItem('auth_user', JSON.stringify(mockResponse.user));
        
        return true;
      }
      
      // For real API integration, uncomment this:
      // const response = await authAPI.login(email, password);
      // setToken(response.token);
      // setUser(response.user);
      // localStorage.setItem('auth_token', response.token);
      // localStorage.setItem('auth_user', JSON.stringify(response.user));
      // return true;
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // For real API integration, uncomment this:
      // await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};