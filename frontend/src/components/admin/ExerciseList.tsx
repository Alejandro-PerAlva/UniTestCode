import React, { useRef, type ChangeEvent } from 'react';
import { PlusCircle, Edit, Trash2, Eye, EyeOff, Terminal as TerminalIcon, Download, Upload } from 'lucide-react';
import { updateExercise, deleteExercise, importExercisesData } from '../../services/api';
import type { Exercise } from '../../types';

interface ExerciseListProps {
  exercises: Exercise[];
  onRefresh: () => void;
  onCreateNew: () => void;
  onEdit: (ex: Exercise) => void;
  onManageTests: (ex: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onRefresh, onCreateNew, onEdit, onManageTests }) => {
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

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        const result = await importExercisesData(importedData);
        onRefresh();
        alert(`Importación completada: ${result.imported} añadidos, ${result.skipped} omitidos (ya existían).`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          <h1 className="text-2xl font-bold text-blue-400">Gestor de Ejercicios</h1>
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
            <PlusCircle size={18} /> Nuevo Ejercicio
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {exercises.map(ex => (
          <div key={ex.id} className={`p-6 rounded-lg border flex justify-between items-center transition-colors ${ex.isVisible !== false ? 'bg-gray-900 border-gray-800' : 'bg-gray-900/50 border-gray-800/50 opacity-75'}`}>
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">{ex.title}</h3>
                {ex.isVisible === false && (
                  <span className="bg-yellow-900/50 text-yellow-500 text-xs px-2 py-0.5 rounded font-bold border border-yellow-700/50">Oculto</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{ex.description}</p>
              <span className="inline-block mt-3 bg-gray-800 text-xs px-2 py-1 rounded text-gray-300 border border-gray-700">
                Tests configurados: {ex.tests?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleToggleVisibility(ex)} className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white">
                {ex.isVisible === false ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button onClick={() => onEdit(ex)} className="p-2 rounded hover:bg-gray-800 text-blue-400 hover:text-blue-300">
                <Edit size={20} />
              </button>
              <button onClick={() => handleDeleteExercise(ex.id)} className="p-2 rounded hover:bg-red-900/50 text-red-400 hover:text-red-300">
                <Trash2 size={20} />
              </button>
              <div className="w-px h-8 bg-gray-800 mx-2"></div>
              <button onClick={() => onManageTests(ex)} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold flex items-center gap-2">
                <TerminalIcon size={18} /> Gestionar Tests
              </button>
            </div>
          </div>
        ))}
        {exercises.length === 0 && (
          <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-lg">
            No hay ejercicios creados.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;