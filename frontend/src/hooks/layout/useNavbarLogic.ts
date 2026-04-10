/**
 * @module useNavbarLogic
 * Controls the navigation bar state and session termination.
 */

import { getUser, clearAuthData, isTeacher } from '../../services/auth';

/**
 * Custom hook providing user data and secure logout functionality.
 * @returns The current user context, role flags, and the logout handler.
 */
export const useNavbarLogic = () => {
  const user = getUser();
  const userIsTeacher = isTeacher();

  /**
   * Clears local authentication storage and forces a hard browser redirect.
   * A hard redirect (`window.location.href`) is strictly used over client-side routing
   * to guarantee the complete purging of React's memory state and closures.
   */
  const handleLogout = () => {
    clearAuthData();
    window.location.href = '/login'; 
  };

  return {
    user,
    userIsTeacher,
    handleLogout
  };
};