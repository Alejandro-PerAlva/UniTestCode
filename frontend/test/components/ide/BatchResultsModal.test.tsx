/**
 * @module BatchResultsModalTests
 * @description Unit tests for the BatchResultsModal component ensuring correct event propagation and rendering.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import BatchResultsModal from '../../../src/components/ide/BatchResultsModal';
import type { SubmissionResponse, TestResult } from '../../../src/types';

describe('BatchResultsModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnViewTest = vi.fn();

  const mockEvalData: SubmissionResponse = {
    success: true,
    allPassed: true,
    exerciseId: '1',
    totalTests: 1,
    passedCount: 1,
    results: [
      { passed: true } as TestResult
    ]
  };

  it('should render the modal and the internal ResultsBoard', () => {
    render(<BatchResultsModal evalData={mockEvalData} onClose={mockOnClose} onViewTest={mockOnViewTest} />);
    
    expect(screen.getByText('Resultados de la Batería de Tests')).toBeInTheDocument();
    expect(screen.getByText('Resultados de la Ejecución')).toBeInTheDocument(); 
  });

  it('should trigger onClose when the close button or backdrop is clicked', () => {
    const { container } = render(
      <BatchResultsModal evalData={mockEvalData} onClose={mockOnClose} onViewTest={mockOnViewTest} />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    fireEvent.click(container.firstElementChild!);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('should stop event propagation on modal content click', () => {
    render(<BatchResultsModal evalData={mockEvalData} onClose={mockOnClose} onViewTest={mockOnViewTest} />);
    
    const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation');
    const modalContent = screen.getByText('Resultados de la Batería de Tests').closest('.bg-gray-900');
    
    fireEvent.click(modalContent!);
    
    expect(stopPropagationSpy).toHaveBeenCalled();
    stopPropagationSpy.mockRestore();
  });
});