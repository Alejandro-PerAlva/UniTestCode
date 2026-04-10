/**
 * @module useUserManagerLogic
 * Encapsulates the operations available on the user datatable.
 */

import { useRef } from 'react';
import { deleteUser, importUsersData } from '../../services/api';
import type { User } from '../../types';

/**
 * Custom hook for managing list-level user operations like deletion and I/O backups.
 * @param currentUserId - The ID of the currently logged-in admin (to prevent self-deletion).
 * @param onRefresh - Callback to trigger a data reload after a successful operation.
 * @returns Handlers for table actions and a reference for the hidden file input.
 */
export const useUserManagerLogic = (currentUserId: number | string | undefined, onRefresh: () => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (id: number | string) => {
    if (id === currentUserId) {
      alert("No puedes borrar tu propia cuenta.");
      return;
    }
    if (!window.confirm("¿Estás seguro de expulsar a este usuario de la plataforma?")) return;
    
    try {
      await deleteUser(id);
      onRefresh();
    } catch (_error) {
      const err = _error as { response?: { data?: { error?: string } } };
      alert(err.response?.data?.error || 'Error al borrar usuario');
    }
  };

  const handleExport = (users: User[]) => {
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
          alert('El archivo no parece ser un backup de usuarios válido.');
          return;
        }
        const result = await importUsersData(importedData);
        onRefresh();
        alert(`Importación completada: ${result.imported} añadidos, ${result.skipped} omitidos.`);
      } catch {
        alert('Error al importar el archivo JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    fileInputRef,
    handleDelete,
    handleExport,
    handleImport
  };
};