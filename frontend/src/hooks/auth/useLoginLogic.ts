import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../services/api';
import { setAuthData } from '../../services/auth';

export const useLoginLogic = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser({ email, password });
        setAuthData(data.token, data.user);
        navigate('/home');
      } else {
        await registerUser({ email, password, role, secretCode });
        // Si el registro es exitoso, hacemos login automático
        const data = await loginUser({ email, password });
        setAuthData(data.token, data.user);
        navigate('/home');
      }
    } catch (error) {
      // Tipamos el error esperado de Axios para evitar el uso de 'any'
      const err = error as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSecretCode('');
  };

  return {
    isLogin,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    secretCode,
    setSecretCode,
    error,
    isLoading,
    handleSubmit,
    toggleAuthMode
  };
};