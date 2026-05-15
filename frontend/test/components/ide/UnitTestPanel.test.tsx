/**
 * @module UnitTestPanelTests
 * @description Unit tests for UnitTestPanel achieving 100% V8 coverage with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import UnitTestPanel from '../../../src/components/ide/UnitTestPanel';
import type { Exercise } from '../../../src/types';

describe('UnitTestPanel Component', () => {
  const mockOnRunSingleTest = vi.fn();
  const mockOnRunAllTests = vi.fn();

  const baseProps = {
    selectedExercise: null as Exercise | null,
    code: 'valid code',
    evaluatingTestIndex: null as number | null,
    isEvaluatingBatch: false,
    onRunSingleTest: mockOnRunSingleTest,
    onRunAllTests: mockOnRunAllTests
  };

  it('should render empty state when no exercise is selected', () => {
    render(<UnitTestPanel {...baseProps} />);
    expect(screen.getByText('Selecciona un ejercicio arriba para cargar sus pruebas unitarias.')).toBeInTheDocument();
  });

  it('should render empty state when exercise has no tests', () => {
    const emptyEx: Exercise = { id: 1, title: 'No Tests', description: '', teacherCode: '', tests: [] };
    render(<UnitTestPanel {...baseProps} selectedExercise={emptyEx} />);
    expect(screen.getByText('Este ejercicio no tiene pruebas configuradas.')).toBeInTheDocument();
  });

  it('should render tests, handle evaluation states, and trigger batch run', () => {
    const exWithTests: Exercise = {
      id: 1, title: 'T', description: '', teacherCode: '',
      tests: [
        { id: 1, inputs: '', expected: '1' },
        { id: 2, inputs: '', expected: '2' }
      ]
    };

    const { rerender } = render(
      <UnitTestPanel {...baseProps} selectedExercise={exWithTests} code="code" evaluatingTestIndex={0} />
    );
    
    expect(screen.getByText('TEST #1')).toBeInTheDocument();
    expect(screen.getByText('Evaluando...')).toBeInTheDocument();

    const batchBtn = screen.getByRole('button', { name: /Ejecutar Todos/i });
    expect(batchBtn).toBeDisabled();

    rerender(<UnitTestPanel {...baseProps} selectedExercise={exWithTests} code="code" evaluatingTestIndex={null} />);
    expect(batchBtn).not.toBeDisabled();
    
    fireEvent.click(batchBtn);
    expect(mockOnRunAllTests).toHaveBeenCalledTimes(1);

    rerender(<UnitTestPanel {...baseProps} selectedExercise={exWithTests} code="code" evaluatingTestIndex={null} isEvaluatingBatch={true} />);
    expect(screen.getByText('Ejecutando...')).toBeInTheDocument();
    expect(batchBtn).toBeDisabled();
  });

  it('should trigger onRunSingleTest when a test block is clicked and is idle', () => {
    const exWithTests: Exercise = {
      id: 1, title: 'T', description: '', teacherCode: '',
      tests: [{ id: 1, inputs: '', expected: '1' }]
    };

    render(<UnitTestPanel {...baseProps} selectedExercise={exWithTests} code="code" evaluatingTestIndex={null} />);
    
    const testBlock = screen.getByText('TEST #1').parentElement;
    fireEvent.click(testBlock!);
    
    expect(mockOnRunSingleTest).toHaveBeenCalledWith(0);
  });
});