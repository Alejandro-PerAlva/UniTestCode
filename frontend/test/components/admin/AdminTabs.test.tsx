/**
 * @module AdminTabsTests
 * @description Unit tests for the AdminTabs navigation component.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminTabs from '../../../src/components/admin/AdminTabs';

describe('AdminTabs Component', () => {
  const mockOnSelectExercises = vi.fn();
  const mockOnSelectUsers = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render both navigation tabs correctly', () => {
    render(
      <AdminTabs 
        view="list" 
        onSelectExercises={mockOnSelectExercises} 
        onSelectUsers={mockOnSelectUsers} 
      />
    );

    expect(screen.getByText('Gestor de Ejercicios')).toBeInTheDocument();
    expect(screen.getByText('Gestor de Usuarios')).toBeInTheDocument();
  });

  it('should highlight the Exercises tab when an exercise-related view is active', () => {
    render(
      <AdminTabs 
        view="create" 
        onSelectExercises={mockOnSelectExercises} 
        onSelectUsers={mockOnSelectUsers} 
      />
    );

    const exercisesTab = screen.getByText('Gestor de Ejercicios');
    expect(exercisesTab).toHaveClass('text-blue-400');
  });

  it('should highlight the Users tab when a user-related view is active', () => {
    render(
      <AdminTabs 
        view="users" 
        onSelectExercises={mockOnSelectExercises} 
        onSelectUsers={mockOnSelectUsers} 
      />
    );

    const usersTab = screen.getByText('Gestor de Usuarios');
    expect(usersTab).toHaveClass('text-blue-400');
  });

  it('should trigger onSelectExercises callback when the Exercises tab is clicked', () => {
    render(
      <AdminTabs 
        view="users" 
        onSelectExercises={mockOnSelectExercises} 
        onSelectUsers={mockOnSelectUsers} 
      />
    );

    fireEvent.click(screen.getByText('Gestor de Ejercicios'));
    expect(mockOnSelectExercises).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSelectUsers callback when the Users tab is clicked', () => {
    render(
      <AdminTabs 
        view="list" 
        onSelectExercises={mockOnSelectExercises} 
        onSelectUsers={mockOnSelectUsers} 
      />
    );

    fireEvent.click(screen.getByText('Gestor de Usuarios'));
    expect(mockOnSelectUsers).toHaveBeenCalledTimes(1);
  });
});