export interface User {
  id: string;
  email: string;
  username?: string;
  createdAt?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean; 
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export interface AuthResponse {
  token: string;
  user: User;
}