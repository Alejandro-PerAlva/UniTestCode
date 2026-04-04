import React from 'react';
import { Play, Info, Square } from 'lucide-react';
import type { Exercise } from '../../types';

interface DuelControlsProps {
  exercises: Exercise[];
  selectedExerciseId: number | '';
  onExerciseChange: (id: number) => void;
  onShowDescription: () => void;
  isRunning: boolean;
  hasCode: boolean;
  onStartDuel: () => void;
  onStopDuel: () => void;
}

const DuelControls: React.FC<DuelControlsProps> = ({
  exercises, selectedExerciseId, onExerciseChange, onShowDescription, isRunning, hasCode, onStartDuel, onStopDuel
}) => {
  const visibleExercises = exercises.filter(ex => ex.isVisible !== false);
  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

  return (
    <div className="flex gap-4 items-center bg-gray-900 p-4 rounded-lg border border-gray-800 shrink-0 shadow-sm">
      <select 
        value={selectedExerciseId}
        onChange={(e) => onExerciseChange(Number(e.target.value))}
        className="bg-black border border-gray-700 rounded p-2 text-white outline-none flex-1 focus:border-blue-500 transition-colors h-10"
      >
        <option value="" disabled>Selecciona un Ejercicio de la lista...</option>
        {visibleExercises.map(ex => (
          <option key={ex.id} value={ex.id}>{ex.title}</option>
        ))}
      </select>

      {selectedExercise && (
        <button 
          onClick={onShowDescription}
          title="Ver instrucciones del ejercicio"
          className="h-10 w-10 flex-shrink-0 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 text-blue-400 rounded flex items-center justify-center transition-colors"
        >
          <Info size={20} />
        </button>
      )}

      <div className="flex gap-2">
        {isRunning ? (
          <button 
            onClick={onStopDuel}
            className="bg-red-600 hover:bg-red-500 h-10 px-6 rounded font-bold flex items-center gap-2 transition-colors"
          >
            <Square size={16} fill="currentColor" /> Detener Ejecución
          </button>
        ) : (
          <button 
            onClick={onStartDuel}
            disabled={!selectedExercise || !hasCode}
            className="bg-green-600 hover:bg-green-500 h-10 px-8 rounded font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Play size={18} fill="currentColor" /> Iniciar Duelo
          </button>
        )}
      </div>
    </div>
  );
};

export default DuelControls;