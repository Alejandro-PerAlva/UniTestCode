/**
 * @module ExerciseList
 * Datatable component displaying all available exercises with management actions.
 */

import React from 'react';
import { PlusCircle, Edit, Trash2, Eye, EyeOff, Terminal as TerminalIcon, Download, Upload } from 'lucide-react';
import { useExerciseListLogic } from '../../hooks/admin/useExerciseListLogic';
import type { Exercise } from '../../types';

/**
 * Props for the ExerciseList component.
 */
export interface ExerciseListProps {
  /** Array of exercises to render in the list. */
  exercises: Exercise[];
  /** Callback to trigger a data fetch after a mutating operation. */
  onRefresh: () => void;
  /** Callback to navigate to the exercise creation form. */
  onCreateNew: () => void;
  /** Callback to navigate to the exercise edit form. */
  onEdit: (ex: Exercise) => void;
  /** Callback to navigate to the test suite manager for a specific exercise. */
  onManageTests: (ex: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onRefresh, onCreateNew, onEdit, onManageTests }) => {
  const { fileInputRef, handleDeleteExercise, handleToggleVisibility, handleExport, handleImport } = useExerciseListLogic(exercises, onRefresh);

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
                {ex.isVisible === false && <span className="bg-yellow-900/50 text-yellow-500 text-xs px-2 py-0.5 rounded font-bold border border-yellow-700/50">Oculto</span>}
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