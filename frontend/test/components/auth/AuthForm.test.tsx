/**
 * @module AuthFormTests
 * @description Unit tests for AuthForm achieving 100% V8 coverage with strict typing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import AuthForm from '../../../src/components/auth/AuthForm';
import type { AuthFormProps } from '../../../src/components/auth/AuthForm';

describe('AuthForm Component', () => {
  const mockSetEmail = vi.fn();
  const mockSetPassword = vi.fn();
  const mockSetRole = vi.fn();
  const mockSetSecretCode = vi.fn();
  const mockOnSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
  const mockOnToggleMode = vi.fn();

  const baseProps: AuthFormProps = {
    isLogin: true,
    email: 'test@test.com',
    setEmail: mockSetEmail,
    password: 'password123',
    setPassword: mockSetPassword,
    role: 'student',
    setRole: mockSetRole,
    secretCode: 'secret',
    setSecretCode: mockSetSecretCode,
    error: '',
    isLoading: false,
    onSubmit: mockOnSubmit,
    onToggleMode: mockOnToggleMode
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login mode and trigger inputs and submit', () => {
    const { container } = render(<AuthForm {...baseProps} />);

    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument();
    expect(screen.getByText('¿No tienes cuenta? Regístrate aquí')).toBeInTheDocument();
    
    const emailInput = screen.getByPlaceholderText('tu@correo.com') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'new@test.com' } });
    expect(mockSetEmail).toHaveBeenCalledWith('new@test.com');

    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'newpass' } });
    expect(mockSetPassword).toHaveBeenCalledWith('newpass');

    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalled();

    const toggleBtn = screen.getByText('¿No tienes cuenta? Regístrate aquí');
    fireEvent.click(toggleBtn);
    expect(mockOnToggleMode).toHaveBeenCalledTimes(1);
  });

  it('should render registration mode and trigger specific inputs', () => {
    render(<AuthForm {...baseProps} isLogin={false} />);

    expect(screen.getByText('Crea una cuenta nueva')).toBeInTheDocument();
    expect(screen.getByText('¿Ya tienes cuenta? Inicia sesión')).toBeInTheDocument();

    const secretInput = screen.getByPlaceholderText('Código secreto del profesor') as HTMLInputElement;
    fireEvent.change(secretInput, { target: { value: 'newcode' } });
    expect(mockSetSecretCode).toHaveBeenCalledWith('newcode');

    const roleSelect = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(roleSelect, { target: { value: 'teacher' } });
    expect(mockSetRole).toHaveBeenCalledWith('teacher');
  });

  it('should render error and loading states correctly', () => {
    render(
      <AuthForm 
        {...baseProps} 
        error="Invalid credentials" 
        isLoading={true} 
      />
    );

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cargando/i })).toBeDisabled();
  });

  it('should explicitly cover all disabled button short-circuit branches', () => {
    const branches = [
      { isLogin: true, loading: true, e: 'a', p: 'b', code: '', disabled: true },
      { isLogin: true, loading: false, e: '', p: 'b', code: '', disabled: true },
      { isLogin: true, loading: false, e: 'a', p: '', code: '', disabled: true },
      { isLogin: true, loading: false, e: 'a', p: 'b', code: '', disabled: false },
      { isLogin: false, loading: false, e: 'a', p: 'b', code: '', disabled: true },
      { isLogin: false, loading: false, e: 'a', p: 'b', code: 'c', disabled: false }
    ];

    branches.forEach(({ isLogin, loading, e, p, code, disabled }) => {
      const { unmount } = render(
        <AuthForm 
          {...baseProps} 
          isLogin={isLogin} 
          isLoading={loading} 
          email={e} 
          password={p} 
          secretCode={code} 
        />
      );
      
      const btn = screen.getByRole('button', { name: /(Entrar|Registrarse|Cargando)/i });
      
      if (disabled) {
        expect(btn).toBeDisabled();
      } else {
        expect(btn).not.toBeDisabled();
      }
      
      unmount();
    });
  });
});