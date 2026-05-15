/**
 * @module TestManagerTests
 * @description Unit tests for TestManager achieving full 100% V8 coverage with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TestManager from '../../../src/components/admin/TestManager';
import { useTestManagerLogic } from '../../../src/hooks/admin/useTestManagerLogic';
import type { Exercise } from '../../../src/types';

vi.mock('../../../src/hooks/admin/useTestManagerLogic', () => ({
  useTestManagerLogic: vi.fn()
}));

interface TerminalProps {
  onInput: (data: string) => void;
  onOutput: (data: string) => void;
  onFinish: () => void;
}

vi.mock('../../../src/components/ide/Terminal', () => ({
  default: ({ onInput, onOutput, onFinish }: TerminalProps) => (
    <div>
      <button onClick={() => onInput('in')}>Terminal Input</button>
      <button onClick={() => onOutput('out')}>Terminal Output</button>
      <button onClick={onFinish}>Finish Terminal</button>
    </div>
  )
}));

interface ModalProps {
  onClose: () => void;
}

vi.mock('../../../src/components/shared/TestPlaybackModal', () => ({
  default: ({ onClose }: ModalProps) => (
    <div data-testid="modal">
      <button onClick={onClose}>Close Modal</button>
    </div>
  )
}));

describe('TestManager Component', () => {
  const mockSetRecordedInput = vi.fn();
  const mockSetRecordedOutput = vi.fn();
  const mockOnBack = vi.fn();

  const baseHook = {
    isRunning: false,
    setIsRunning: vi.fn(),
    setRecordedInput: mockSetRecordedInput,
    recordedOutput: '',
    setRecordedOutput: mockSetRecordedOutput,
    viewedTest: null,
    setViewedTest: vi.fn(),
    startRecording: vi.fn(),
    handleSaveTest: vi.fn(),
    handleDeleteTest: vi.fn()
  } as unknown as ReturnType<typeof useTestManagerLogic>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty tests array gracefully and trigger onBack', () => {
    vi.mocked(useTestManagerLogic).mockReturnValue(baseHook);
    
    const exerciseWithoutTests: Exercise = { 
      id: 1, 
      title: 'No Tests', 
      description: '', 
      teacherCode: '',
      tests: []
    };

    render(
      <TestManager 
        exercise={exerciseWithoutTests} 
        onBack={mockOnBack} 
        onRefresh={vi.fn()} 
      />
    );
    
    expect(screen.getByText('Tests (0)')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Volver al gestor'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should execute inline arrow functions and evaluate functional state updaters', () => {
    vi.mocked(useTestManagerLogic).mockReturnValue(baseHook);
    
    const baseExercise: Exercise = { 
      id: 1, 
      title: 'T', 
      description: '', 
      teacherCode: '',
      tests: []
    };

    render(
      <TestManager 
        exercise={baseExercise} 
        onBack={vi.fn()} 
        onRefresh={vi.fn()} 
      />
    );
    
    fireEvent.click(screen.getByText('Terminal Input'));
    const inputUpdater = mockSetRecordedInput.mock.calls[0][0] as (prev: string) => string;
    expect(inputUpdater('prev-')).toBe('prev-in');

    fireEvent.click(screen.getByText('Terminal Output'));
    const outputUpdater = mockSetRecordedOutput.mock.calls[0][0] as (prev: string) => string;
    expect(outputUpdater('prev-')).toBe('prev-out');

    fireEvent.click(screen.getByText('Finish Terminal'));
    expect(baseHook.setIsRunning).toHaveBeenCalledWith(false);
  });

  it('should render mapped tests and test string manipulation branches', () => {
    const exerciseWithTests: Exercise = {
      id: 1, 
      title: 'Title',
      description: '',
      teacherCode: '',
      tests: [
        { id: 1, inputs: '', expected: 'Short' },
        { id: 2, inputs: 'a\nb', expected: 'A'.repeat(50) }
      ]
    };
    
    vi.mocked(useTestManagerLogic).mockReturnValue(baseHook);
    render(
      <TestManager 
        exercise={exerciseWithTests} 
        onBack={vi.fn()} 
        onRefresh={vi.fn()} 
      />
    );

    expect(screen.getByText('Ninguno')).toBeInTheDocument();
    expect(screen.getByText('a, b')).toBeInTheDocument();
    expect(screen.getByText(`${'A'.repeat(40)}...`)).toBeInTheDocument();

    fireEvent.click(screen.getByText('TEST #1'));
    expect(baseHook.setViewedTest).toHaveBeenCalled();
  });

  it('should stop propagation on delete button click', () => {
    const exerciseWithTests: Exercise = { 
      id: 1, 
      title: 'T', 
      description: '', 
      teacherCode: '',
      tests: [{ id: 101, inputs: '', expected: '' }] 
    };

    vi.mocked(useTestManagerLogic).mockReturnValue(baseHook);
    render(
      <TestManager 
        exercise={exerciseWithTests} 
        onBack={vi.fn()} 
        onRefresh={vi.fn()} 
      />
    );

    const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation');
    const deleteBtn = screen.getAllByRole('button').find(b => b.innerHTML.includes('lucide-trash'))!;
    
    fireEvent.click(deleteBtn);
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(baseHook.handleDeleteTest).toHaveBeenCalledWith(101);
    
    stopPropagationSpy.mockRestore();
  });

  it('should trigger startRecording, handleSaveTest, and test isRunning disabled branches', () => {
    const branches = [
      { running: true, out: 'Data', disabled: true },
      { running: false, out: '', disabled: true },
      { running: false, out: 'Data', disabled: false }
    ];

    const baseExercise: Exercise = { 
      id: 1, 
      title: 'T', 
      description: '', 
      teacherCode: '',
      tests: []
    };

    branches.forEach(({ running, out, disabled }) => {
      vi.mocked(useTestManagerLogic).mockReturnValue({ 
        ...baseHook, 
        isRunning: running, 
        recordedOutput: out 
      } as unknown as ReturnType<typeof useTestManagerLogic>);

      const { unmount } = render(
        <TestManager 
          exercise={baseExercise} 
          onBack={vi.fn()} 
          onRefresh={vi.fn()} 
        />
      );
      
      const saveBtn = screen.getByText('Guardar Test');
      if (disabled) {
        expect(saveBtn).toBeDisabled();
      } else {
        expect(saveBtn).not.toBeDisabled();
        fireEvent.click(saveBtn);
        expect(baseHook.handleSaveTest).toHaveBeenCalled();
      }

      const playBtn = screen.getByText('Iniciar Ejecución');
      if (!running) {
        fireEvent.click(playBtn);
        expect(baseHook.startRecording).toHaveBeenCalled();
      }
      
      unmount();
    });
  });

  it('should trigger modal render and onClose callback', () => {
    const activeTestState = { test: { id: 1, inputs: '', expected: '' }, index: 0 };
    vi.mocked(useTestManagerLogic).mockReturnValue({ 
      ...baseHook, 
      viewedTest: activeTestState 
    } as unknown as ReturnType<typeof useTestManagerLogic>);

    const baseExercise: Exercise = { 
      id: 1, 
      title: 'T', 
      description: '', 
      teacherCode: '',
      tests: []
    };

    render(
      <TestManager 
        exercise={baseExercise} 
        onBack={vi.fn()} 
        onRefresh={vi.fn()} 
      />
    );
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Close Modal'));
    expect(baseHook.setViewedTest).toHaveBeenCalledWith(null);
  });
});