/**
 * @module DuelControlsTests
 * @description Unit tests for DuelControls achieving 100% V8 coverage with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import DuelControls from '../../../src/components/ide/DuelControls';
import type { Exercise } from '../../../src/types';

describe('DuelControls Component', () => {
  const mockOnExerciseChange = vi.fn();
  const mockOnShowDescription = vi.fn();
  const mockOnStartDuel = vi.fn();
  const mockOnStopDuel = vi.fn();

  const mockExercises: Exercise[] = [
    { id: 1, title: 'Visible Ex', description: '', teacherCode: '', isVisible: true, tests: [] },
    { id: 2, title: 'Hidden Ex', description: '', teacherCode: '', isVisible: false, tests: [] }
  ];

  const baseProps = {
    exercises: mockExercises,
    selectedExerciseId: '' as number | '',
    onExerciseChange: mockOnExerciseChange,
    onShowDescription: mockOnShowDescription,
    isRunning: false,
    hasCode: true,
    onStartDuel: mockOnStartDuel,
    onStopDuel: mockOnStopDuel
  };

  it('should render only visible exercises and handle selection change', () => {
    render(<DuelControls {...baseProps} />);
    
    expect(screen.getByText('Visible Ex')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Ex')).not.toBeInTheDocument();

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });
    expect(mockOnExerciseChange).toHaveBeenCalledWith(1);
  });

  it('should render Info button only when an exercise is selected', () => {
    const { rerender } = render(<DuelControls {...baseProps} selectedExerciseId={''} />);
    expect(screen.queryByTitle('Ver instrucciones del ejercicio')).not.toBeInTheDocument();

    rerender(<DuelControls {...baseProps} selectedExerciseId={1} />);
    const infoBtn = screen.getByTitle('Ver instrucciones del ejercicio');
    expect(infoBtn).toBeInTheDocument();
    
    fireEvent.click(infoBtn);
    expect(mockOnShowDescription).toHaveBeenCalledTimes(1);
  });

  it('should render Stop button when isRunning is true', () => {
    render(<DuelControls {...baseProps} isRunning={true} />);
    
    const stopBtn = screen.getByRole('button', { name: /Detener Ejecución/i });
    expect(stopBtn).toBeInTheDocument();
    
    fireEvent.click(stopBtn);
    expect(mockOnStopDuel).toHaveBeenCalledTimes(1);
  });

  it('should handle Start button disabled branches correctly', () => {
    interface BranchConfig {
      id: number | '';
      code: boolean;
      disabled: boolean;
    }

    const branches: BranchConfig[] = [
      { id: '', code: false, disabled: true },
      { id: 1, code: false, disabled: true },
      { id: '', code: true, disabled: true },
      { id: 1, code: true, disabled: false }
    ];

    branches.forEach(({ id, code, disabled }) => {
      const { unmount } = render(
        <DuelControls {...baseProps} selectedExerciseId={id} hasCode={code} isRunning={false} />
      );
      
      const startBtn = screen.getByRole('button', { name: /Iniciar Duelo/i });
      if (disabled) {
        expect(startBtn).toBeDisabled();
      } else {
        expect(startBtn).not.toBeDisabled();
        fireEvent.click(startBtn);
        expect(mockOnStartDuel).toHaveBeenCalled();
      }
      unmount();
    });
  });
});