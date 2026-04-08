import type { User } from '../types';

export const setAuthData = (token: string, user: User) => {
  sessionStorage.setItem('mips_token', token);
  sessionStorage.setItem('mips_user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth_change'));
};

export const clearAuthData = () => {
  sessionStorage.removeItem('mips_token');
  sessionStorage.removeItem('mips_user');
  
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('mips_code_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));

  window.dispatchEvent(new Event('auth_change'));
};

export const getToken = (): string | null => {
  return sessionStorage.getItem('mips_token');
};

export const getUser = (): User | null => {
  const userStr = sessionStorage.getItem('mips_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isTeacher = (): boolean => {
  const user = getUser();
  return user?.role === 'teacher';
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};