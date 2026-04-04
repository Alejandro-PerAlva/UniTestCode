import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, User as UserIcon } from 'lucide-react';
import { createUser, updateUser } from '../../services/api';

interface UserFormProps {
  user: any | null;
  onBack: () => void;
  onSaved: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onBack, onSaved }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
      setPassword(''); // La contraseña siempre aparece en blanco por seguridad
    } else {
      setEmail('');
      setRole('student');
      setPassword('');
    }
  }, [user]);

  const handleSave = async () => {
    if (!email) return;
    setError('');
    
    try {
      if (user) {
        // En edición, si la contraseña está vacía, el backend la ignorará y mantendrá la antigua
        await updateUser(user.id, { email, role, password });
      } else {
        if (!password) return setError('La contraseña es obligatoria para nuevos usuarios.');
        await createUser({ email, password, role });
      }
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al guardar el usuario");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 self-start">
        <ArrowLeft size={20} /> Volver al gestor
      </button>
      
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
          <UserIcon size={24} /> {user ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
        </h2>
        
        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none" 
              placeholder="correo@ejemplo.com" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none" 
              placeholder={user ? "Escribe solo si deseas cambiarla" : "••••••••"} 
            />
            {user && <p className="text-xs text-gray-500 mt-1">Déjalo en blanco para mantener la contraseña actual.</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Rol del Sistema</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none"
            >
              <option value="student">Alumno</option>
              <option value="teacher">Profesor</option>
            </select>
          </div>

          <button 
            onClick={handleSave} 
            disabled={!email || (!user && !password)} 
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save size={20} /> {user ? 'Actualizar Datos' : 'Crear Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;