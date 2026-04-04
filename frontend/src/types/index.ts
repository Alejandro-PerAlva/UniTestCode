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
}