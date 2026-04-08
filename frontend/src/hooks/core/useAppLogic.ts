import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../services/auth';
import { socket } from '../../services/socket';

export const useAppLogic = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => setIsAuth(isAuthenticated());
    window.addEventListener('auth_change', handleAuthChange);

    socket.connect();

    return () => {
      window.removeEventListener('auth_change', handleAuthChange);
      socket.disconnect();
    };
  }, []);

  return { isAuth };
};