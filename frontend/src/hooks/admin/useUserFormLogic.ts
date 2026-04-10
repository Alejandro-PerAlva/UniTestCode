/**
 * @module useUserFormLogic
 * Manages the state and submission logic for the User creation and editing forms.
 */

import { useState } from 'react';
import { createUser, updateUser } from '../../services/api';
import type { User } from '../../types';

/**
 * Custom hook to encapsulate the form handling for user administration.
 * @param user - The user to edit, or null if creating a new account.
 * @param onSaved - Callback triggered after a successful API submission.
 * @returns Form state variables and their respective change handlers.
 */
export const useUserFormLogic = (user: User | null, onSaved: () => void) => {
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'student');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!email) return;
    setError('');
    
    try {
      if (user) {
        await updateUser(user.id, { email, role, password });
      } else {
        if (!password) {
          setError('La contraseña es obligatoria para nuevos usuarios.');
          return;
        }
        await createUser({ email, password, role });
      }
      onSaved();
    } catch (_error) {
      const err = _error as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || "Error al guardar el usuario");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    error,
    handleSave
  };
};