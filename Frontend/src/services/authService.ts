import apiClient from './api';
import { type AuthResponse } from '../types/auth'; // here was "type User" but i dont neet it now
import { type LoginCredentials, type RegisterCredentials } from '../types/credentials'; 

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data; 
    }
    throw error;
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};