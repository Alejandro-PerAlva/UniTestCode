import axios from 'axios';
import { getToken, clearAuthData } from './auth';
import type { 
  Exercise, 
  SubmissionResponse, 
  TestCase, 
  User, 
  LoginCredentials, 
  RegisterData, 
  ImportResult 
} from '../types';

const API_URL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = '/'; 
    }
    if (!error.response) {
      console.error('Error de red crítico o servidor inaccesible:', error);
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials: LoginCredentials): Promise<{ token: string, user: User }> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (data: RegisterData): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

export const fetchExercises = async (): Promise<Exercise[]> => {
  const response = await axios.get(`${API_URL}/exercises`);
  return response.data;
};

export const submitCode = async (id: number, code: string, targetFunction?: string): Promise<SubmissionResponse> => {
  try {
    const response = await axios.post(`${API_URL}/exercises/${id}/evaluate`, { 
      studentCode: code, 
      targetFunction 
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const createExercise = async (title: string, description: string, teacherCode: string, isVisible: boolean = true): Promise<Exercise> => {
  const response = await axios.post(`${API_URL}/exercises`, { title, description, teacherCode, isVisible });
  return response.data;
};

export const updateExercise = async (id: number, data: Partial<Exercise>): Promise<Exercise> => {
  const response = await axios.put(`${API_URL}/exercises/${id}`, data);
  return response.data;
};

export const deleteExercise = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/exercises/${id}`);
};

export const createTestCase = async (exerciseId: number, inputs: string, expected: string): Promise<TestCase> => {
  const response = await axios.post(`${API_URL}/exercises/${exerciseId}/tests`, { inputs, expected });
  return response.data;
};

export const deleteTestCase = async (exerciseId: number, testId: number): Promise<void> => {
  await axios.delete(`${API_URL}/exercises/${exerciseId}/tests/${testId}`);
};

export const importExercisesData = async (exercisesData: Partial<Exercise>[]): Promise<ImportResult> => {
  const response = await axios.post(`${API_URL}/exercises/import`, exercisesData);
  return response.data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const createUser = async (userData: RegisterData): Promise<User> => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const updateUser = async (id: number | string, userData: Partial<RegisterData>): Promise<User> => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number | string): Promise<void> => {
  await axios.delete(`${API_URL}/users/${id}`);
};

export const importUsersData = async (usersData: Partial<User>[]): Promise<ImportResult> => {
  const response = await axios.post(`${API_URL}/users/import`, usersData);
  return response.data;
};