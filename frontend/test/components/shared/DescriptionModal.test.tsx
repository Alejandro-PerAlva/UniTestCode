/**
 * @module DescriptionModalTests
 * @description Unit tests for the DescriptionModal component, ensuring conditional rendering and event propagation.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import DescriptionModal from '../../../src/components/shared/DescriptionModal';
import type { Exercise } from '../../../src/types';

describe('DescriptionModal Component', () => {
  const mockOnClose = vi.fn();

  const baseExercise: Exercise = {
    id: 1,
    title: 'Exercise Title',
    description: 'Detailed instructions here.',
    teacherCode: '',
    tests: []
  };

  it('should render the modal with the provided exercise description', () => {
    render(<DescriptionModal exercise={baseExercise} onClose={mockOnClose} />);
    
    expect(screen.getByText('Exercise Title')).toBeInTheDocument();
    expect(screen.getByText('Detailed instructions here.')).toBeInTheDocument();
  });

  it('should render fallback text when the exercise has no description', () => {
    const emptyExercise: Exercise = { ...baseExercise, description: '' };
    render(<DescriptionModal exercise={emptyExercise} onClose={mockOnClose} />);
    
    expect(screen.getByText('Este ejercicio no tiene descripción adicional.')).toBeInTheDocument();
  });

  it('should trigger onClose when the close button or backdrop is clicked', () => {
    const { container } = render(<DescriptionModal exercise={baseExercise} onClose={mockOnClose} />);
    
    // Click the X button
    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Click the backdrop (first child of container usually)
    fireEvent.click(container.firstElementChild!);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('should stop event propagation when clicking inside the modal content', () => {
    render(<DescriptionModal exercise={baseExercise} onClose={mockOnClose} />);
    
    const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation');
    const modalContent = screen.getByText('Exercise Title').closest('div')?.parentElement;
    
    fireEvent.click(modalContent!);
    
    expect(stopPropagationSpy).toHaveBeenCalled();
    stopPropagationSpy.mockRestore();
  });
});