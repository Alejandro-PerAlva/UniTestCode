/**
 * @module EvaluatorForm
 * Presentation component for selecting an exercise and uploading a MIPS source file for evaluation.
 */

import React, { type ChangeEvent } from 'react';
import { Play, FileCode, Info } from 'lucide-react';
import type { Exercise } from '../../types';

/**
 * Props for the EvaluatorForm component.
 */
export interface EvaluatorFormProps {
  /** Array of exercises available for evaluation. */
  exercises: Exercise[];
  /** ID of the currently selected exercise. */
  selectedExerciseId: number | '';
  /** Handler for changing the selected exercise. */
  onExerciseChange: (id: number) => void;
  /** Callback to trigger the display of the exercise instructions modal. */
  onShowDescription: () => void;
  /** The currently selected MIPS assembly file. */
  file: File | null;
  /** Handler for file input changes. */
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Flag to disable inputs and show loading state during network evaluation. */
  isEvaluating: boolean;
  /** Callback to trigger the batch evaluation process. */
  onEvaluate: () => void;
}

const EvaluatorForm: React.FC<EvaluatorFormProps> = ({
  exercises,
  selectedExerciseId,
  onExerciseChange,
  onShowDescription,
  file,
  onFileChange,
  isEvaluating,
  onEvaluate
}) => {
  const visibleExercises = exercises.filter(ex => ex.isVisible !== false);
  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

  return (
    <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col gap-6 shadow-xl relative">
      <h2 className="text-2xl font-bold text-blue-400">Evaluador de Ejercicios</h2>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Selecciona el Ejercicio</label>
        <div className="flex gap-3">
          <select 
            value={selectedExerciseId}
            onChange={(e) => onExerciseChange(Number(e.target.value))}
            className="bg-black border border-gray-700 rounded p-3 text-white outline-none focus:border-blue-500 flex-1"
          >
            <option value="" disabled>Elige un ejercicio de la lista...</option>
            {visibleExercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.title}</option>
            ))}
          </select>
          
          {selectedExercise && (
            <button 
              onClick={onShowDescription}
              title="Ver instrucciones del ejercicio"
              className="w-12 flex-shrink-0 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 text-blue-400 rounded flex items-center justify-center transition-colors"
            >
              <Info size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Sube tu Solución (.s)</label>
        <div className="relative border-2 border-dashed border-gray-700 rounded-lg bg-black hover:border-blue-500 transition-colors flex flex-col items-center justify-center p-8 cursor-pointer group">
          <input 
            type="file" 
            accept=".s" 
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FileCode size={40} className={`mb-3 ${file ? 'text-blue-400' : 'text-gray-600 group-hover:text-blue-400'}`} />
          {file ? (
            <span className="font-bold text-blue-400">{file.name}</span>
          ) : (
            <span className="text-gray-500 font-medium">Haz clic o arrastra tu archivo MIPS aquí</span>
          )}
        </div>
      </div>

      <button 
        onClick={onEvaluate}
        disabled={!selectedExerciseId || !file || isEvaluating}
        className="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Play size={20} /> 
        {isEvaluating ? 'Evaluando código en MARS...' : 'Ejecutar Tests Automáticos'}
      </button>
    </div>
  );
};

export default EvaluatorForm;