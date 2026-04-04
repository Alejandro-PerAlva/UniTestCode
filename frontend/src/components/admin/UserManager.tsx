import React, { useRef } from 'react';
import { Trash2, Edit, Download, Upload, PlusCircle } from 'lucide-react';
import { deleteUser, importUsersData } from '../../services/api';

interface UserManagerProps {
  users: any[];
  onRefresh: () => void;
  currentUserId: number | undefined;
  onEdit: (user: any) => void;
  onCreateNew: () => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, onRefresh, currentUserId, onEdit, onCreateNew }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (id: number) => {
    if (id === currentUserId) return alert("No puedes borrar tu propia cuenta.");
    if (!window.confirm("¿Estás seguro de expulsar a este usuario de la plataforma?")) return;
    
    try {
      await deleteUser(id);
      onRefresh();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al borrar usuario');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_usuarios_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (importedData.length > 0 && !importedData[0].email) {
          return alert('El archivo no parece ser un backup de usuarios válido.');
        }
        const result = await importUsersData(importedData);
        onRefresh();
        alert(`Importación completada: ${result.imported} añadidos, ${result.skipped} omitidos.`);
      } catch (error) {
        alert('Error al importar el archivo JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-gray-900 p-6 rounded-lg border border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">Gestor de Usuarios</h1>
          <p className="text-sm text-gray-400 mt-1">Total: {users.length} registrados</p>
        </div>
        <div className="flex gap-3">
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
          <button onClick={() => fileInputRef.current?.click()} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded font-bold flex items-center gap-2">
            <Upload size={18} /> Importar
          </button>
          <button onClick={handleExport} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded font-bold flex items-center gap-2">
            <Download size={18} /> Exportar
          </button>
          <button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold flex items-center gap-2 ml-2">
            <PlusCircle size={18} /> Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {users.map(user => (
          <div key={user.id} className="p-4 rounded-lg border border-gray-800 bg-gray-900 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${user.role === 'teacher' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 'bg-gray-800 text-gray-400'}`}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white">{user.email}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border mt-1 inline-block ${user.role === 'teacher' ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                  {user.role}
                </span>
                {user.id === currentUserId && <span className="ml-2 text-xs text-green-500 font-bold">(Tú)</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón Editar Unificado */}
              <button 
                onClick={() => onEdit(user)}
                className="p-2 rounded hover:bg-gray-800 text-blue-400 hover:text-blue-300"
              >
                <Edit size={20} />
              </button>
              <div className="w-px h-6 bg-gray-800 mx-1"></div>
              <button 
                onClick={() => handleDelete(user.id)}
                disabled={user.id === currentUserId}
                className="p-2 rounded hover:bg-red-900/50 text-red-400 hover:text-red-300 disabled:opacity-25"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManager;