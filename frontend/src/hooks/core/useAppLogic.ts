/**
 * @module useAppLogic
 * Orchestrates application-wide state initialization, such as global auth listeners 
 * and singleton Socket.IO connections.
 */

import { useState, useEffect } from 'react';
import { getToken } from '../../services/auth';
import { socket } from '../../services/socket';

/**
 * Root-level custom hook for lifecycle management.
 * Connects to the WebSocket server on mount and cleans up on unmount.
 * @returns The current global authentication status.
 */
export const useAppLogic = () => {
  const [isAuth, setIsAuth] = useState(!!getToken());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuth(!!getToken());
    };

    window.addEventListener('auth_change', handleAuthChange);

    if (isAuth) {
      socket.connect();
    }

    return () => {
      window.removeEventListener('auth_change', handleAuthChange);
      socket.disconnect();
    };
  }, [isAuth]);

  return { isAuth };
};