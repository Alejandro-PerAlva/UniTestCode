/**
 * @module GlobalTypes
 * Defines the shared TypeScript interfaces representing the core domain entities 
 * and Data Transfer Objects (DTOs) for the frontend application.
 */

/**
 * Represents a single evaluation test case for an exercise.
 */
export interface TestCase {
  id: number;
  inputs: string;
  expected: string;
}

/**
 * Represents a programming exercise/challenge within the platform.
 */
export interface Exercise {
  id: number;
  title: string;
  description: string;
  teacherCode?: string;
  teacherCodeMars?: string;
  isVisible?: boolean;
  tests: TestCase[];
}

/**
 * Represents the outcome of an individual test case evaluation.
 */
export interface TestResult {
  testId: number;
  passed: boolean;
  output: string;
  expected: string;
}

/**
 * Represents the comprehensive payload returned after evaluating a student's submission.
 */
export interface SubmissionResponse {
  exerciseId: string;
  totalTests: number;
  passedCount: number;
  results?: TestResult[];
  error?: string;
  details?: string;
  success?: boolean;
  allPassed?: boolean;
}

/**
 * Represents the payload returned from a real-time single test execution via WebSockets.
 */
export interface TestResultPayload {
  passed: boolean;
  expected: string;
  output?: string;
  error?: string;
  testIndex: number;
  originalTest?: TestCase | null;
}

/**
 * Represents an authenticated user in the system.
 */
export interface User {
  id: number | string;
  email: string;
  role?: string;
}

/**
 * Represents the credentials required to authenticate.
 */
export interface LoginCredentials {
  email: string;
  password?: string;
}

/**
 * Represents the payload required to register a new account.
 */
export interface RegisterData {
  email: string;
  password?: string;
  role?: string;
  secretCode?: string;
}

/**
 * Represents the result summary of a bulk data import operation.
 */
export interface ImportResult {
  imported: number;
  skipped: number;
}