// Represents the user data you expect from your backend (e.g., after login/register)
export interface User {
  id: string;
  email: string;
  username?: string;
  createdAt?: string;
}

// Represents the structure of your auth context
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean; // To handle initial auth check (e.g., from localStorage)
  login: (userData: User, token: string) => void;
  logout: () => void;
  // setUser: (user: User | null) => void; // Might not be needed if login/logout handle it
  // setToken: (token: string | null) => void; // Might not be needed
}

// Optional: Define the shape of the login/register API response from your backend
export interface AuthResponse {
  token: string;
  user: User;
  // any other fields your backend sends on auth success
}