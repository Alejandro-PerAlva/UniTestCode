export interface TestCase {
  id: number;
  inputs: string;
  expected: string;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  teacherCode?: string;
  teacherCodeMars?: string;
  isVisible?: boolean;
  tests: TestCase[];
}

export interface TestResult {
  testId: number;
  passed: boolean;
  output: string;
  expected: string;
}

export interface SubmissionResponse {
  exerciseId: string;
  totalTests: number;
  passedCount: number;
  results?: TestResult[];
  error?: string;
  details?: string;
  success?: boolean;   // <-- AÑADIDO
  allPassed?: boolean; // <-- AÑADIDO
}

export interface TestResultPayload {
  passed: boolean;
  expected: string;
  output?: string;
  error?: string;
  testIndex: number;
  originalTest?: TestCase | null;
}

export interface User {
  id: number | string;
  email: string;
  role?: string;
  // Añade aquí otros campos que devuelva tu API para los usuarios
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  role?: string;
  secretCode?: string;
}

export interface ImportResult {
  imported: number;
  skipped: number;
}