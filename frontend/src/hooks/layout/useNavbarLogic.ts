import { getUser, clearAuthData, isTeacher } from '../../services/auth';

export const useNavbarLogic = () => {
  const user = getUser();
  const userIsTeacher = isTeacher();

  const handleLogout = () => {
    clearAuthData();
    // Usar window.location.href en lugar de navigate('/login') es una excelente
    // best practice aquí, ya que fuerza la limpieza de toda la memoria y estados de React.
    window.location.href = '/login'; 
  };

  return {
    user,
    userIsTeacher,
    handleLogout
  };
};