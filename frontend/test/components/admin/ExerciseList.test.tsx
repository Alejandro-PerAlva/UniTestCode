/**
 * @module ExerciseListTests
 * @description Unit tests for the ExerciseList component list interactions with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import ExerciseList from '../../../src/components/admin/ExerciseList';
import { useExerciseListLogic } from '../../../src/hooks/admin/useExerciseListLogic';
import type { Exercise } from '../../../src/types';

vi.mock('../../../src/hooks/admin/useExerciseListLogic', () => ({
  useExerciseListLogic: vi.fn()
}));

describe('ExerciseList Component', () => {
  const mockOnRefresh = vi.fn();
  const mockOnCreateNew = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnManageTests = vi.fn();
  const mockHandleDeleteExercise = vi.fn();
  const mockHandleToggleVisibility = vi.fn();
  const mockHandleImport = vi.fn();

  const mockExercises: Exercise[] = [
    { id: 1, title: 'Factorial', description: 'Calc factorial', teacherCode: 'code', isVisible: true, tests: [] },
    { id: 2, title: 'Fibonacci', description: 'Calc fibonacci', teacherCode: 'code', isVisible: false, tests: [] }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useExerciseListLogic).mockReturnValue({
      fileInputRef: { current: null } as unknown as React.RefObject<HTMLInputElement>,
      handleDeleteExercise: mockHandleDeleteExercise,
      handleToggleVisibility: mockHandleToggleVisibility,
      handleExport: vi.fn(),
      handleImport: mockHandleImport
    });
  });

  it('should trigger handleImport when a JSON file is selected', () => {
    const { container } = render(
      <ExerciseList 
        exercises={[]} 
        onRefresh={mockOnRefresh} 
        onCreateNew={mockOnCreateNew} 
        onEdit={mockOnEdit} 
        onManageTests={mockOnManageTests} 
      />
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['[]'], 'exercises.json')] } });
    
    expect(mockHandleImport).toHaveBeenCalled();
  });

  it('should call fileInputRef.current.click if the ref is defined', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    vi.mocked(useExerciseListLogic).mockReturnValue({
      fileInputRef: { current: null } as unknown as React.RefObject<HTMLInputElement>,
      handleDeleteExercise: vi.fn(), 
      handleToggleVisibility: vi.fn(), 
      handleExport: vi.fn(), 
      handleImport: vi.fn()
    });

    render(
      <ExerciseList 
        exercises={[]} 
        onRefresh={vi.fn()} 
        onCreateNew={vi.fn()} 
        onEdit={vi.fn()} 
        onManageTests={vi.fn()} 
      />
    );
    
    fireEvent.click(screen.getByText('Importar'));
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('should trigger handlers when list item action buttons are clicked', () => {
    render(
      <ExerciseList 
        exercises={mockExercises} 
        onRefresh={mockOnRefresh} 
        onCreateNew={mockOnCreateNew} 
        onEdit={mockOnEdit} 
        onManageTests={mockOnManageTests} 
      />
    );

    const buttons = screen.getAllByRole('button');
    const visibilityBtn = buttons[3];
    const editBtn = buttons[4];
    const deleteBtn = buttons[5];
    const manageTestsBtn = screen.getAllByText('Gestionar Tests')[0];

    fireEvent.click(visibilityBtn);
    expect(mockHandleToggleVisibility).toHaveBeenCalledWith(mockExercises[0]);

    fireEvent.click(editBtn);
    expect(mockOnEdit).toHaveBeenCalledWith(mockExercises[0]);

    fireEvent.click(deleteBtn);
    expect(mockHandleDeleteExercise).toHaveBeenCalledWith(1);

    fireEvent.click(manageTestsBtn);
    expect(mockOnManageTests).toHaveBeenCalledWith(mockExercises[0]);
  });

  it('should click the hidden file input when the Import button is clicked', () => {
    render(
      <ExerciseList 
        exercises={[]} 
        onRefresh={mockOnRefresh} 
        onCreateNew={mockOnCreateNew} 
        onEdit={mockOnEdit} 
        onManageTests={mockOnManageTests} 
      />
    );
    fireEvent.click(screen.getByText('Importar'));
  });

  it('should render correctly when exercise has missing optional properties', () => {
    const minimalExercise: Exercise[] = [
      { id: 3, title: 'Minimal', description: 'Min', teacherCode: 'code', tests: [] }
    ];
    
    render(
      <ExerciseList 
        exercises={minimalExercise} 
        onRefresh={mockOnRefresh} 
        onCreateNew={mockOnCreateNew} 
        onEdit={mockOnEdit} 
        onManageTests={mockOnManageTests} 
      />
    );
    
    expect(screen.getByText('Tests configurados: 0')).toBeInTheDocument();
  });
});