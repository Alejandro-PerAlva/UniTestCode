/**
 * @module UserFormTests
 * @description Unit tests for UserForm achieving 100% V8 coverage with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UserForm from '../../../src/components/admin/UserForm';
import { useUserFormLogic } from '../../../src/hooks/admin/useUserFormLogic';
import type { User } from '../../../src/types';

vi.mock('../../../src/hooks/admin/useUserFormLogic', () => ({
  useUserFormLogic: vi.fn()
}));

describe('UserForm Component', () => {
  const mockSetEmail = vi.fn();
  const mockSetPassword = vi.fn();
  const mockSetRole = vi.fn();

  const baseHook = {
    email: 'test@test.com',
    setEmail: mockSetEmail,
    password: '123',
    setPassword: mockSetPassword,
    role: 'student',
    setRole: mockSetRole,
    error: null,
    handleSave: vi.fn()
  } as unknown as ReturnType<typeof useUserFormLogic>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create mode, test events, and handle error display', () => {
    vi.mocked(useUserFormLogic).mockReturnValue({ 
      ...baseHook, 
      error: 'Bad Email' 
    } as unknown as ReturnType<typeof useUserFormLogic>);
    
    render(<UserForm user={null} onBack={vi.fn()} onSaved={vi.fn()} />);

    expect(screen.getByText('Bad Email')).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'a@a.com' } });
    expect(mockSetEmail).toHaveBeenCalledWith('a@a.com');

    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    expect(mockSetPassword).toHaveBeenCalledWith('pass');

    const roleSelect = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(roleSelect, { target: { value: 'teacher' } });
    expect(mockSetRole).toHaveBeenCalledWith('teacher');
  });

  it('should render edit mode and cover conditional placeholder branches', () => {
    const existingUser: User = { id: 1, email: 'a@a.com', role: 'student' };
    vi.mocked(useUserFormLogic).mockReturnValue(baseHook);
    
    render(<UserForm user={existingUser} onBack={vi.fn()} onSaved={vi.fn()} />);

    const passwordInput = screen.getByPlaceholderText('Escribe solo si deseas cambiarla') as HTMLInputElement;
    expect(passwordInput).toBeInTheDocument();
    
    fireEvent.change(passwordInput, { target: { value: 'newpass' } });
    expect(mockSetPassword).toHaveBeenCalledWith('newpass');
  });

  it('should explicitly cover all disabled button branches', () => {
    const existingUser: User = { id: 1, email: 'a@a.com', role: 'student' };
    
    const branches = [
      { u: null, e: '', p: '123', disabled: true },
      { u: null, e: 'a', p: '', disabled: true },
      { u: null, e: 'a', p: '123', disabled: false },
      { u: existingUser, e: '', p: '', disabled: true },
      { u: existingUser, e: 'a', p: '', disabled: false }
    ];

    branches.forEach(({ u, e, p, disabled }) => {
      vi.mocked(useUserFormLogic).mockReturnValue({ 
        ...baseHook, 
        email: e, 
        password: p 
      } as unknown as ReturnType<typeof useUserFormLogic>);

      const { unmount } = render(
        <UserForm user={u} onBack={vi.fn()} onSaved={vi.fn()} />
      );
      
      const btn = screen.getByRole('button', { name: u ? /Actualizar Datos/i : /Crear Usuario/i });
      
      if (disabled) {
        expect(btn).toBeDisabled();
      } else {
        expect(btn).not.toBeDisabled();
      }
      
      unmount();
    });
  });
});