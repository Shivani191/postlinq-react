import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  linkedInStatus: 'connected' | 'disconnected' | 'checking';
    setLinkedInStatus: (status: 'connected' | 'disconnected' | 'checking') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize token from sessionStorage if it exists
  const [token, setInternalToken] = useState<string | null>(() => {
    return sessionStorage.getItem('jwt_token'); // <--- CHANGE IS HERE
  });

  const [linkedInStatus, setLinkedInStatus] = useState<'connected' | 'disconnected' | 'checking'>('disconnected');

  // Effect to update sessionStorage whenever token changes
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('jwt_token', token); // <--- CHANGE IS HERE
    } else {
      sessionStorage.removeItem('jwt_token'); // 
    }
  }, [token]);

  const setToken = (newToken: string | null) => {
    setInternalToken(newToken);
  };

  const logout = () => {
    setInternalToken(null);
    setLinkedInStatus('disconnected'); 
  };

  const isAuthenticated = !!token; // Simple check if token exists

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated, logout, linkedInStatus, setLinkedInStatus }}>
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