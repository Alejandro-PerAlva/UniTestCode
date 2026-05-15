/**
 * @module ExerciseFormTests
 * @description Unit tests for ExerciseForm achieving 100% V8 branch coverage with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ExerciseForm from '../../../src/components/admin/ExerciseForm';
import { useExerciseFormLogic } from '../../../src/hooks/admin/useExerciseFormLogic';
import type { Exercise } from '../../../src/types';

vi.mock('../../../src/hooks/admin/useExerciseFormLogic', () => ({
  useExerciseFormLogic: vi.fn()
}));

describe('ExerciseForm Component', () => {
  const mockSetTitle = vi.fn();
  const mockSetDescription = vi.fn();
  const mockSetIsVisible = vi.fn();
  const mockHandleFileChange = vi.fn();
  const mockHandleCreateOrUpdate = vi.fn();

  const baseHook = {
    title: 'Valid',
    setTitle: mockSetTitle,
    description: 'Valid',
    setDescription: mockSetDescription,
    teacherCode: 'Valid',
    fileName: 'file.s',
    isVisible: true,
    setIsVisible: mockSetIsVisible,
    handleFileChange: mockHandleFileChange,
    handleCreateOrUpdate: mockHandleCreateOrUpdate
  } as unknown as ReturnType<typeof useExerciseFormLogic>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render edit mode, display filename, and fire all input events', () => {
    vi.mocked(useExerciseFormLogic).mockReturnValue(baseHook);
    
    const existingExercise: Exercise = { 
      id: 1, 
      title: 'Old', 
      description: 'Old', 
      teacherCode: 'Old',
      isVisible: true,
      tests: []
    };
    
    const { container } = render(
      <ExerciseForm exercise={existingExercise} onBack={vi.fn()} onSaved={vi.fn()} />
    );

    expect(screen.getByText('Editar Ejercicio')).toBeInTheDocument();
    expect(screen.getByText('file.s')).toBeInTheDocument();

    const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(textInput, { target: { value: 'T' } });
    expect(mockSetTitle).toHaveBeenCalledWith('T');

    const textArea = container.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(textArea, { target: { value: 'D' } });
    expect(mockSetDescription).toHaveBeenCalledWith('D');

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput);
    expect(mockHandleFileChange).toHaveBeenCalled();
  });

  it('should render create mode, fallback filename, and test all disabled short-circuits', () => {
    const branches = [
      { t: '', d: 'V', c: 'V', disabled: true },
      { t: 'V', d: '', c: 'V', disabled: true },
      { t: 'V', d: 'V', c: '', disabled: true },
      { t: 'V', d: 'V', c: 'V', disabled: false }
    ];

    branches.forEach(({ t, d, c, disabled }) => {
      vi.mocked(useExerciseFormLogic).mockReturnValue({
        ...baseHook, 
        title: t, 
        description: d, 
        teacherCode: c, 
        fileName: '' 
      } as unknown as ReturnType<typeof useExerciseFormLogic>);

      const { unmount } = render(
        <ExerciseForm exercise={null} onBack={vi.fn()} onSaved={vi.fn()} />
      );
      
      expect(screen.getByText('Seleccionar archivo')).toBeInTheDocument();
      
      const btn = screen.getByRole('button', { name: /Guardar Ejercicio/i });
      if (disabled) {
        expect(btn).toBeDisabled();
      } else {
        expect(btn).not.toBeDisabled();
      }
      
      unmount();
    });
  });
});