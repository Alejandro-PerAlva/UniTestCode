/**
 * @module TestPlaybackModalTests
 * @description Unit tests for the TestPlaybackModal component, testing rendering branches and output formatting.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import TestPlaybackModal from '../../../src/components/shared/TestPlaybackModal';
import type { TestCase } from '../../../src/types';

// Mock the formatting hook to return a predictable string
vi.mock('../../../src/hooks/shared/useTestFormatter', () => ({
  useTestFormatter: () => ({
    renderWithInputs: (text: string) => `FORMATTED: ${text}`
  })
}));

describe('TestPlaybackModal Component', () => {
  const mockOnClose = vi.fn();

  const testWithInputs: TestCase = {
    id: 1,
    inputs: 'input1\ninput2',
    expected: 'Expected output'
  };

  const testWithoutInputs: TestCase = {
    id: 2,
    inputs: '   \n  ', // Just whitespace
    expected: 'Expected output without inputs'
  };

  it('should render the test details including the inputs block', () => {
    render(<TestPlaybackModal test={testWithInputs} index={0} onClose={mockOnClose} />);

    expect(screen.getByText('Reproducción del Test #1')).toBeInTheDocument();
    
    // Check inputs
    expect(screen.getByText('input1')).toBeInTheDocument();
    expect(screen.getByText('input2')).toBeInTheDocument();

    // Check output
    expect(screen.getByText('FORMATTED: Expected output')).toBeInTheDocument();
  });

  it('should not render the inputs block if inputs are empty or just whitespace', () => {
    render(<TestPlaybackModal test={testWithoutInputs} index={1} onClose={mockOnClose} />);

    expect(screen.getByText('Reproducción del Test #2')).toBeInTheDocument();
    
    // Inputs block should be missing
    expect(screen.queryByText('Valores de Entrada:')).not.toBeInTheDocument();

    // Check output
    expect(screen.getByText('FORMATTED: Expected output without inputs')).toBeInTheDocument();
  });

  it('should trigger onClose when the close button or backdrop is clicked', () => {
    const { container } = render(<TestPlaybackModal test={testWithInputs} index={0} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    fireEvent.click(container.firstElementChild!);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('should stop event propagation when clicking inside the modal content', () => {
    render(<TestPlaybackModal test={testWithInputs} index={0} onClose={mockOnClose} />);
    
    const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation');
    const modalContent = screen.getByText('Reproducción del Test #1').closest('.bg-zinc-900');
    
    fireEvent.click(modalContent!);
    
    expect(stopPropagationSpy).toHaveBeenCalled();
    stopPropagationSpy.mockRestore();
  });
});