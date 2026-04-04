/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getToken } from './auth';
import type { Exercise, SubmissionResponse, TestCase } from '../types';

const API_URL = 'http://localhost:5000/api';

// --- INTERCEPTOR DE AUTENTICACIÓN ---
// Esto inyecta el token en cada petición automáticamente
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH ENDPOINTS ---
export const loginUser = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

// --- EXERCISE ENDPOINTS ---
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

export const importExercisesData = async (exercisesData: any[]): Promise<{imported: number, skipped: number}> => {
  const response = await axios.post(`${API_URL}/exercises/import`, exercisesData);
  return response.data;
};

// --- USER ENDPOINTS ---
export const fetchUsers = async (): Promise<any[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

// NUEVA FUNCIÓN
export const createUser = async (userData: any): Promise<any> => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

// ACTUALIZADA para enviar todos los datos (email, rol y password)
export const updateUser = async (id: number, userData: any): Promise<any> => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/users/${id}`);
};

export const importUsersData = async (usersData: any[]): Promise<{imported: number, skipped: number}> => {
  const response = await axios.post(`${API_URL}/users/import`, usersData);
  return response.data;
};