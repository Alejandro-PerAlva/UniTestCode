/**
 * @module AuthService
 * Manages client-side authentication state, token persistence, and session cleanup.
 */

import type { User } from '../types';

/**
 * Stores the authentication payload in Session Storage and triggers a global event.
 * @param token - The JWT access token.
 * @param user - The authenticated user object.
 */
export const setAuthData = (token: string, user: User) => {
  sessionStorage.setItem('mips_token', token);
  sessionStorage.setItem('mips_user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth_change'));
};

/**
 * Completely purges all session data and localized temporary code drafts.
 * Ensures no cross-contamination between different user sessions on the same machine.
 */
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

/**
 * Retrieves the active JWT from storage.
 * @returns The token string, or null if unauthenticated.
 */
export const getToken = (): string | null => {
  return sessionStorage.getItem('mips_token');
};

/**
 * Retrieves and parses the active user object from storage.
 * @returns The User object, or null if unauthenticated or malformed.
 */
export const getUser = (): User | null => {
  const userStr = sessionStorage.getItem('mips_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Checks if the currently authenticated user possesses teacher-level privileges.
 * @returns True if the user is a teacher.
 */
export const isTeacher = (): boolean => {
  const user = getUser();
  return user?.role === 'teacher';
};

/**
 * Validates the existence of an active session token.
 * @returns True if a token exists in storage.
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};