/**
 * @module ResultsBoardTests
 * @description Unit tests for the ResultsBoard component, achieving 100% V8 coverage with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ResultsBoard from '../../../src/components/evaluator/ResultsBoard';
import type { SubmissionResponse, TestResult } from '../../../src/types';

describe('ResultsBoard Component', () => {
  const mockOnViewTest = vi.fn();

  it('should display the error message block when evalData contains an error', () => {
    const errorData: SubmissionResponse = {
      success: false,
      error: 'Compilation Error: syntax error at line 5',
      allPassed: false,
      exerciseId: '1',
      totalTests: 0,
      passedCount: 0
    };

    render(<ResultsBoard evalData={errorData} onViewTest={mockOnViewTest} />);

    expect(screen.getByText('Compilation Error: syntax error at line 5')).toBeInTheDocument();
    expect(screen.queryByText(/Test 1/i)).not.toBeInTheDocument();
  });

  it('should render the badge and mixed test results correctly', () => {
    const mixedData: SubmissionResponse = {
      success: true,
      allPassed: false,
      exerciseId: '1',
      totalTests: 2,
      passedCount: 1,
      results: [
        { testId: 101, passed: true } as TestResult,
        { testId: 102, passed: false } as TestResult
      ]
    };

    render(<ResultsBoard evalData={mixedData} onViewTest={mockOnViewTest} />);

    expect(screen.getByText('1 / 2 Tests Superados')).toBeInTheDocument();
    
    const badge = screen.getByText('1 / 2 Tests Superados');
    expect(badge).toHaveClass('bg-red-900');

    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('should render the success badge color branch when all tests pass', () => {
    const allPassedData: SubmissionResponse = {
      success: true,
      allPassed: true,
      exerciseId: '1',
      totalTests: 1,
      passedCount: 1,
      results: [
        { testId: 101, passed: true } as TestResult
      ]
    };

    render(<ResultsBoard evalData={allPassedData} onViewTest={mockOnViewTest} />);

    const badge = screen.getByText('1 / 1 Tests Superados');
    expect(badge).toHaveClass('bg-green-900');
  });

  it('should trigger onViewTest with the correct index when a test tile is clicked', () => {
    const data: SubmissionResponse = {
      success: true,
      allPassed: true,
      exerciseId: '1',
      totalTests: 1,
      passedCount: 1,
      results: [
        { testId: 101, passed: true } as TestResult
      ]
    };

    render(<ResultsBoard evalData={data} onViewTest={mockOnViewTest} />);

    const tile = screen.getByText('Test 1').closest('div')?.parentElement;
    fireEvent.click(tile!);

    expect(mockOnViewTest).toHaveBeenCalledWith(0);
  });

  it('should safely handle optional chaining when results array is missing', () => {
    const dataWithoutResults: SubmissionResponse = {
      success: true,
      allPassed: false,
      exerciseId: '1',
      totalTests: 0,
      passedCount: 0
    };

    render(<ResultsBoard evalData={dataWithoutResults} onViewTest={mockOnViewTest} />);
    
    expect(screen.getByText('Resultados de la Ejecución')).toBeInTheDocument();
  });
});