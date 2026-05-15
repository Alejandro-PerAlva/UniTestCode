/**
 * @module ApiService
 * Configures the Axios HTTP client and provides strictly typed wrapper functions 
 * for all REST API endpoints. Includes automatic JWT injection and unauthorized handling.
 */

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

const API_URL = import.meta.env.MODE === 'production' ? '/tfgapa/api' : 'http://localhost:5000/api';

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
      window.location.href = import.meta.env.MODE === 'production' ? '/tfgapa/login' : '/login';
    }
    if (!error.response) {
      console.error('Critical network error or unreachable server:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Authenticates a user and retrieves a session token.
 * @param credentials - User's email and password.
 * @returns The JWT and user object.
 */
export const loginUser = async (credentials: LoginCredentials): Promise<{ token: string, user: User }> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

/**
 * Registers a new user account.
 * @param data - Registration payload including the secret invitation code.
 * @returns A success message.
 */
export const registerUser = async (data: RegisterData): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

/**
 * Retrieves all available exercises from the server.
 * @returns Array of exercises with their test cases.
 */
export const fetchExercises = async (): Promise<Exercise[]> => {
  const response = await axios.get(`${API_URL}/exercises`);
  return response.data;
};

/**
 * Submits student code for batch evaluation against all exercise test cases.
 * @param id - The exercise ID.
 * @param code - The student's MIPS code.
 * @param targetFunction - Optional specific label to extract.
 * @returns The comprehensive submission results.
 */
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

/**
 * Creates a new exercise.
 * @returns The newly created exercise.
 */
export const createExercise = async (title: string, description: string, teacherCode: string, isVisible: boolean = true): Promise<Exercise> => {
  const response = await axios.post(`${API_URL}/exercises`, { title, description, teacherCode, isVisible });
  return response.data;
};

/**
 * Updates an existing exercise.
 * @returns The updated exercise.
 */
export const updateExercise = async (id: number, data: Partial<Exercise>): Promise<Exercise> => {
  const response = await axios.put(`${API_URL}/exercises/${id}`, data);
  return response.data;
};

/**
 * Deletes a specific exercise.
 */
export const deleteExercise = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/exercises/${id}`);
};

/**
 * Appends a new test case to an exercise.
 * @returns The created test case.
 */
export const createTestCase = async (exerciseId: number, inputs: string, expected: string): Promise<TestCase> => {
  const response = await axios.post(`${API_URL}/exercises/${exerciseId}/tests`, { inputs, expected });
  return response.data;
};

/**
 * Removes a specific test case from an exercise.
 */
export const deleteTestCase = async (exerciseId: number, testId: number): Promise<void> => {
  await axios.delete(`${API_URL}/exercises/${exerciseId}/tests/${testId}`);
};

/**
 * Bulk imports an array of exercises.
 * @returns Import statistics (imported vs skipped).
 */
export const importExercisesData = async (exercisesData: Partial<Exercise>[]): Promise<ImportResult> => {
  const response = await axios.post(`${API_URL}/exercises/import`, exercisesData);
  return response.data;
};

/**
 * Retrieves all registered users.
 */
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

/**
 * Manually creates a user account via admin dashboard.
 */
export const createUser = async (userData: RegisterData): Promise<User> => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

/**
 * Updates user metadata and access roles.
 */
export const updateUser = async (id: number | string, userData: Partial<RegisterData>): Promise<User> => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData);
  return response.data;
};

/**
 * Deletes a specific user account.
 */
export const deleteUser = async (id: number | string): Promise<void> => {
  await axios.delete(`${API_URL}/users/${id}`);
};

/**
 * Bulk imports an array of users.
 */
export const importUsersData = async (usersData: Partial<User>[]): Promise<ImportResult> => {
  const response = await axios.post(`${API_URL}/users/import`, usersData);
  return response.data;
};