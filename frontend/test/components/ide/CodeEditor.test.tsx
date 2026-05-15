/**
 * @module CodeEditorTests
 * @description Unit tests for CodeEditor achieving 100% V8 coverage with strict typing and no explicit any.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, type MockInstance } from 'vitest';
import CodeEditor from '../../../src/components/ide/CodeEditor';
import type { Exercise } from '../../../src/types';

interface MockMonacoProps {
  value: string;
  onChange: (val: string | undefined) => void;
}

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: MockMonacoProps) => (
    <div data-testid="monaco-mock">
      <span>{value}</span>
      <button onClick={() => onChange('new code')}>Simulate Typed Code</button>
      <button onClick={() => onChange(undefined)}>Simulate Empty Clear</button>
    </div>
  )
}));

describe('CodeEditor Component', () => {
  const mockOnChange = vi.fn();
  let clickSpy: MockInstance;
  
  const mockExercise: Exercise = {
    id: 1, title: 'Test Exercise! 2', description: '', teacherCode: '', isVisible: true, tests: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    global.URL.createObjectURL = vi.fn(() => 'blob:url');
    global.URL.revokeObjectURL = vi.fn();
    
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it('should render the editor and trigger onChange events', () => {
    render(<CodeEditor code="initial" onChange={mockOnChange} selectedExercise={mockExercise} />);
    
    expect(screen.getByText('Tu Código MIPS')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Simulate Typed Code'));
    expect(mockOnChange).toHaveBeenCalledWith('new code');

    fireEvent.click(screen.getByText('Simulate Empty Clear'));
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should format filename and trigger download process when button is clicked', () => {
    render(<CodeEditor code="my code" onChange={mockOnChange} selectedExercise={mockExercise} />);
    
    const downloadBtn = screen.getByRole('button', { name: /Descargar Solución/i });
    expect(downloadBtn).not.toBeDisabled();
    
    fireEvent.click(downloadBtn);
    
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
  });

  it('should cover disabled branches and explicitly test the early return', () => {
    interface BranchConfig {
      code: string;
      ex: Exercise | null;
      disabled: boolean;
    }

    const branches: BranchConfig[] = [
      { code: '', ex: mockExercise, disabled: true },
      { code: 'code', ex: null, disabled: true },
      { code: 'code', ex: mockExercise, disabled: false }
    ];

    branches.forEach(({ code, ex, disabled }) => {
      const { unmount } = render(<CodeEditor code={code} onChange={mockOnChange} selectedExercise={ex} />);
      const btn = screen.getByRole('button', { name: /Descargar Solución/i });
      
      if (disabled) {
        expect(btn).toBeDisabled();
        
        // Bypassing React's disabled event suppression to explicitly cover the internal early return (Line 26)
        const reactPropsKey = Object.keys(btn).find(key => key.startsWith('__reactProps$'));
        if (reactPropsKey) {
          const btnWithProps = btn as unknown as Record<string, { onClick: () => void }>;
          btnWithProps[reactPropsKey].onClick();
        }
        
        expect(global.URL.createObjectURL).not.toHaveBeenCalled();
      } else {
        expect(btn).not.toBeDisabled();
      }
      
      unmount();
    });
  });
});