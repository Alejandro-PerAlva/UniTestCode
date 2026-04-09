/**
 * @module useHomeLogic
 * Provides business logic and navigation handlers for the Home dashboard.
 */

import { useNavigate } from 'react-router-dom';
import { getUser } from '../../services/auth';

/**
 * Extrapolates localized user role text and common navigation paths.
 * * @returns Handlers for primary dashboard actions.
 */
export const useHomeLogic = () => {
  const navigate = useNavigate();
  const user = getUser();
  
  const userRoleText = user?.role === 'teacher' ? 'Profesor' : 'Alumno';

  const navigateToIde = () => navigate('/ide');
  const navigateToSubmit = () => navigate('/submit');

  return {
    userRoleText,
    navigateToIde,
    navigateToSubmit
  };
};