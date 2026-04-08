import { useState, useEffect } from 'react';
import { createUser, updateUser } from '../../services/api';
import type { User } from '../../types';

export const useUserFormLogic = (user: User | null, onSaved: () => void) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role || 'student');
      setPassword('');
    } else {
      setEmail('');
      setRole('student');
      setPassword('');
    }
  }, [user]);

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
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
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