import { useNavigate } from 'react-router-dom';
import { getUser } from '../../services/auth';

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