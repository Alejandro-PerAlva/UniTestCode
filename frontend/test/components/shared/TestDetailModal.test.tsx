/**
 * @module TestDetailModalTests
 * @description Unit tests for the TestDetailModal component, testing rendering branches and output formatting.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import TestDetailModal from '../../../src/components/shared/TestDetailModal';
import type { TestCase, TestResultPayload } from '../../../src/types';

vi.mock('../../../src/hooks/shared/useTestFormatter', () => ({
  useTestFormatter: () => ({
    renderWithInputs: (text: string) => `FORMATTED: ${text}`
  })
}));

describe('TestDetailModal Component', () => {
  const mockOnClose = vi.fn();

  const originalTest: TestCase = {
    id: 1,
    inputs: 'input1\ninput2',
    expected: 'Expected output'
  };

  const passedResult: TestResultPayload = {
    testIndex: 0,
    passed: true,
    expected: 'Expected output',
    output: 'Actual output'
  };

  const failedResult: TestResultPayload = {
    testIndex: 1,
    passed: false,
    expected: 'Expected output',
    output: ''
  };

  it('should render a passed test with inputs and actual output', () => {
    render(
      <TestDetailModal 
        result={passedResult} 
        originalTest={originalTest} 
        testIndex={0} 
        onClose={mockOnClose} 
      />
    );

    expect(screen.getByText('Detalles del Test #1 (Superado)')).toBeInTheDocument();
    expect(screen.getByText('input1')).toBeInTheDocument();
    expect(screen.getByText('input2')).toBeInTheDocument();
    expect(screen.getByText('FORMATTED: Expected output')).toBeInTheDocument();
    expect(screen.getByText('FORMATTED: Actual output')).toBeInTheDocument();
  });

  it('should render a failed test with fallback output and no inputs', () => {
    render(
      <TestDetailModal 
        result={failedResult} 
        originalTest={undefined} 
        testIndex={1} 
        onClose={mockOnClose} 
      />
    );

    expect(screen.getByText('Detalles del Test #2 (Fallido)')).toBeInTheDocument();
    expect(screen.queryByText('Valores de Entrada:')).not.toBeInTheDocument();
    expect(screen.getByText('FORMATTED: El programa no produjo ninguna salida.')).toBeInTheDocument();
  });

  it('should trigger onClose when the close button or backdrop is clicked', () => {
    const { container } = render(
      <TestDetailModal result={passedResult} originalTest={originalTest} testIndex={0} onClose={mockOnClose} />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    fireEvent.click(container.firstElementChild!);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('should stop event propagation when clicking inside the modal content', () => {
    render(
      <TestDetailModal result={passedResult} originalTest={originalTest} testIndex={0} onClose={mockOnClose} />
    );
    
    const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation');
    const modalContent = screen.getByText('Detalles del Test #1 (Superado)').closest('.bg-zinc-900');
    
    fireEvent.click(modalContent!);
    
    expect(stopPropagationSpy).toHaveBeenCalled();
    stopPropagationSpy.mockRestore();
  });
});