/**
 * @module useExerciseListLogic
 * Encapsulates the operations available on the exercise datatable.
 */

import { useRef } from 'react';
import { updateExercise, deleteExercise, importExercisesData } from '../../services/api';
import type { Exercise } from '../../types';

/**
 * Custom hook for managing list-level exercise operations like deletion, visibility toggling, and I/O.
 * @param exercises - The current array of exercises displayed in the list.
 * @param onRefresh - Callback to trigger a data reload after a successful operation.
 * @returns Handlers for table actions and a reference for the hidden file input.
 */
export const useExerciseListLogic = (exercises: Exercise[], onRefresh: () => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteExercise = async (id: number) => {
    if (!window.confirm("¿Estás seguro de borrar este ejercicio y todos sus tests?")) return;
    try {
      await deleteExercise(id);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleVisibility = async (exercise: Exercise) => {
    try {
      await updateExercise(exercise.id, { isVisible: !(exercise.isVisible ?? true) });
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(exercises, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_ejercicios_${new Date().toISOString().split('T')[0]}.json`;
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
        const result = await importExercisesData(importedData);
        onRefresh();
        alert(`Importación completada: ${result.imported} añadidos, ${result.skipped} omitidos (ya existían).`);
      } catch {
        alert('Error al importar el archivo JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    fileInputRef,
    handleDeleteExercise,
    handleToggleVisibility,
    handleExport,
    handleImport
  };
};