import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, LogIn, UserPlus, KeyRound } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import { setAuthData } from '../services/auth';

const LoginPage: React.FC = () => {
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
        const data = await loginUser({ email, password });
        setAuthData(data.token, data.user);
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-2xl flex flex-col gap-6">
        
        <div className="flex flex-col items-center gap-3 border-b border-gray-800 pb-6">
          <Code2 size={48} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-white">UnitTestCode</h1>
          <p className="text-gray-400 text-sm text-center">
            {isLogin ? 'Inicia sesión para continuar' : 'Crea una cuenta nueva'}
          </p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 p-3 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-400">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border border-gray-700 rounded p-3 text-white outline-none focus:border-blue-500 transition-colors"
              placeholder="tu@correo.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-400">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-gray-700 rounded p-3 text-white outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-400 flex items-center gap-1">
                  <KeyRound size={14} className="text-yellow-500"/> Código de Invitación
                </label>
                <input 
                  type="password" 
                  required
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="bg-black border border-gray-700 rounded p-3 text-yellow-500 outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Código secreto del profesor"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-400">Rol</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-black border border-gray-700 rounded p-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="student">Alumno</option>
                  <option value="teacher">Profesor</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit"
            disabled={isLoading || !email || !password || (!isLogin && !secretCode)}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold flex justify-center items-center gap-2 disabled:opacity-50 transition-colors text-white"
          >
            {isLoading ? 'Cargando...' : isLogin ? <><LogIn size={18} /> Entrar</> : <><UserPlus size={18} /> Registrarse</>}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-800">
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); setSecretCode(''); }}
            className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;