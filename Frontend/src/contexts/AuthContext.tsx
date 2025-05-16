import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type AuthContextType } from '../types/auth';

// Create the context with a default undefined value initially to ensure consumers are within a Provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading until we check localStorage

  useEffect(() => {
    // On initial app load, try to load token and user from localStorage
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUserString = localStorage.getItem('authUser');

      if (storedToken && storedUserString) {
        setToken(storedToken);
        setUser(JSON.parse(storedUserString) as User);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, receivedToken: string) => {
    localStorage.setItem('authToken', receivedToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
    setToken(receivedToken);
    setIsLoading(false); // Ensure loading is false after login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setToken(null);
    setIsLoading(false); // Ensure loading is false after logout
    // Optionally, redirect to login page or home page here using useNavigate if needed
    // navigate('/login');
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};