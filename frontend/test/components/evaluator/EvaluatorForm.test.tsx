/**
 * @module EvaluatorFormTests
 * @description Unit tests for the EvaluatorForm component, achieving 100% V8 coverage with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EvaluatorForm from '../../../src/components/evaluator/EvaluatorForm';
import type { Exercise } from '../../../src/types';

describe('EvaluatorForm Component', () => {
  const mockOnExerciseChange = vi.fn();
  const mockOnShowDescription = vi.fn();
  const mockOnFileChange = vi.fn();
  const mockOnEvaluate = vi.fn();

  const mockExercises: Exercise[] = [
    { id: 1, title: 'Visible Exercise 1', description: 'Desc 1', teacherCode: 'code1', isVisible: true, tests: [] },
    { id: 2, title: 'Hidden Exercise', description: 'Desc 2', teacherCode: 'code2', isVisible: false, tests: [] },
    { id: 3, title: 'Visible Exercise 2', description: 'Desc 3', teacherCode: 'code3', tests: [] }
  ];

  const baseProps = {
    exercises: mockExercises,
    selectedExerciseId: '' as number | '',
    onExerciseChange: mockOnExerciseChange,
    onShowDescription: mockOnShowDescription,
    file: null as File | null,
    onFileChange: mockOnFileChange,
    isEvaluating: false,
    onEvaluate: mockOnEvaluate
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render only visible exercises in the select dropdown', () => {
    render(<EvaluatorForm {...baseProps} />);
    
    expect(screen.getByText('Visible Exercise 1')).toBeInTheDocument();
    expect(screen.getByText('Visible Exercise 2')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Exercise')).not.toBeInTheDocument();
  });

  it('should trigger onExerciseChange when a new exercise is selected', () => {
    render(<EvaluatorForm {...baseProps} />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: '1' } });
    
    expect(mockOnExerciseChange).toHaveBeenCalledWith(1);
  });

  it('should conditionally render the Info button and trigger onShowDescription', () => {
    const { rerender } = render(<EvaluatorForm {...baseProps} selectedExerciseId={''} />);
    
    expect(screen.queryByTitle('Ver instrucciones del ejercicio')).not.toBeInTheDocument();

    rerender(<EvaluatorForm {...baseProps} selectedExerciseId={1} />);
    
    const infoBtn = screen.getByTitle('Ver instrucciones del ejercicio');
    expect(infoBtn).toBeInTheDocument();
    
    fireEvent.click(infoBtn);
    expect(mockOnShowDescription).toHaveBeenCalledTimes(1);
  });

  it('should display file fallback text and trigger onFileChange', () => {
    const { container } = render(<EvaluatorForm {...baseProps} />);
    
    expect(screen.getByText('Haz clic o arrastra tu archivo MIPS aquí')).toBeInTheDocument();

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.s')] } });
    
    expect(mockOnFileChange).toHaveBeenCalled();
  });

  it('should display the file name when a file is provided', () => {
    const mockFile = new File(['content'], 'solution.s', { type: 'text/plain' });
    render(<EvaluatorForm {...baseProps} file={mockFile} />);
    
    expect(screen.getByText('solution.s')).toBeInTheDocument();
  });

  it('should correctly cover all disabled branches for the Evaluate button', () => {
    const mockFile = new File([''], 'solution.s');
    
    type BranchConfig = { id: number | ''; file: File | null; eval: boolean; disabled: boolean };
    
    const branches: BranchConfig[] = [
      { id: '', file: null, eval: false, disabled: true },
      { id: 1, file: null, eval: false, disabled: true },
      { id: '', file: mockFile, eval: false, disabled: true },
      { id: 1, file: mockFile, eval: true, disabled: true },
      { id: 1, file: mockFile, eval: false, disabled: false }
    ];

    branches.forEach(({ id, file, eval: isEval, disabled }) => {
      const { unmount } = render(
        <EvaluatorForm 
          {...baseProps} 
          selectedExerciseId={id} 
          file={file} 
          isEvaluating={isEval} 
        />
      );

      const btn = screen.getByRole('button', { name: /(Ejecutar Tests|Evaluando)/i });
      
      if (disabled) {
        expect(btn).toBeDisabled();
      } else {
        expect(btn).not.toBeDisabled();
        fireEvent.click(btn);
        expect(mockOnEvaluate).toHaveBeenCalled();
      }
      
      unmount();
    });
  });

  it('should toggle evaluate button text based on isEvaluating flag', () => {
    const { rerender } = render(<EvaluatorForm {...baseProps} isEvaluating={false} />);
    expect(screen.getByText('Ejecutar Tests Automáticos')).toBeInTheDocument();

    rerender(<EvaluatorForm {...baseProps} isEvaluating={true} />);
    expect(screen.getByText('Evaluando código en MARS...')).toBeInTheDocument();
  });
});