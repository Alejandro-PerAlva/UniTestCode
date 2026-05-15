/**
 * @module UserManagerTests
 * @description Unit tests for the UserManager datatable component with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import UserManager from '../../../src/components/admin/UserManager';
import { useUserManagerLogic } from '../../../src/hooks/admin/useUserManagerLogic';
import type { User } from '../../../src/types';

vi.mock('../../../src/hooks/admin/useUserManagerLogic', () => ({
  useUserManagerLogic: vi.fn()
}));

describe('UserManager Component', () => {
  const mockOnRefresh = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnCreateNew = vi.fn();
  const mockHandleDelete = vi.fn();
  const mockHandleExport = vi.fn();
  const mockHandleImport = vi.fn();

  const mockUsers: User[] = [
    { id: 1, email: 'admin@school.com', role: 'teacher' },
    { id: 2, email: 'student@school.com', role: 'student' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUserManagerLogic).mockReturnValue({
      fileInputRef: { current: null } as unknown as React.RefObject<HTMLInputElement>,
      handleDelete: mockHandleDelete,
      handleExport: mockHandleExport,
      handleImport: mockHandleImport
    });
  });

  it('should trigger handleImport when a file is selected', () => {
    const { container } = render(
      <UserManager 
        users={[]} 
        onRefresh={mockOnRefresh} 
        currentUserId={1} 
        onEdit={mockOnEdit} 
        onCreateNew={mockOnCreateNew} 
      />
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['[]'], 'users.json')] } });
    
    expect(mockHandleImport).toHaveBeenCalled();
  });

  it('should trigger onEdit when the edit button of a user is clicked', () => {
    render(
      <UserManager 
        users={mockUsers} 
        onRefresh={mockOnRefresh} 
        currentUserId={1} 
        onEdit={mockOnEdit} 
        onCreateNew={mockOnCreateNew} 
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[5]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[1]);
  });

  it('should trigger handleDelete when the delete button of a non-current user is clicked', () => {
    render(
      <UserManager 
        users={mockUsers} 
        onRefresh={mockOnRefresh} 
        currentUserId={1} 
        onEdit={mockOnEdit} 
        onCreateNew={mockOnCreateNew} 
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[6]);
    
    expect(mockHandleDelete).toHaveBeenCalledWith(2);
  });

  it('should click the hidden file input when the Import button is clicked', () => {
    render(
      <UserManager 
        users={[]} 
        onRefresh={mockOnRefresh} 
        currentUserId={1} 
        onEdit={mockOnEdit} 
        onCreateNew={mockOnCreateNew} 
      />
    );
    fireEvent.click(screen.getByText('Importar'));
  });

  it('should call fileInputRef.current.click if the ref is defined', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    
    vi.mocked(useUserManagerLogic).mockReturnValue({
      fileInputRef: { current: null } as unknown as React.RefObject<HTMLInputElement>,
      handleDelete: vi.fn(), 
      handleExport: vi.fn(), 
      handleImport: vi.fn()
    });

    render(
      <UserManager 
        users={[]} 
        onRefresh={vi.fn()} 
        currentUserId={1} 
        onEdit={vi.fn()} 
        onCreateNew={vi.fn()} 
      />
    );
    
    fireEvent.click(screen.getByText('Importar'));
    expect(clickSpy).toHaveBeenCalled();
    
    clickSpy.mockRestore();
  });

  it('should trigger handleExport when the export button is clicked', () => {
    render(
      <UserManager 
        users={mockUsers} 
        onRefresh={vi.fn()} 
        currentUserId={1} 
        onEdit={vi.fn()} 
        onCreateNew={vi.fn()} 
      />
    );
    
    fireEvent.click(screen.getByText('Exportar'));
    expect(mockHandleExport).toHaveBeenCalledWith(mockUsers);
  });

  it('should trigger onCreateNew when the new user button is clicked', () => {
    const customMockOnCreateNew = vi.fn();
    
    render(
      <UserManager 
        users={[]} 
        onRefresh={vi.fn()} 
        currentUserId={1} 
        onEdit={vi.fn()} 
        onCreateNew={customMockOnCreateNew} 
      />
    );
    
    fireEvent.click(screen.getByText('Nuevo Usuario'));
    expect(customMockOnCreateNew).toHaveBeenCalledTimes(1);
  });
});