// src/components/ide/UnitTestPanel.tsx
import React from 'react';
import { Play, Loader2 } from 'lucide-react';
import type { Exercise } from '../../types';

interface UnitTestPanelProps {
  selectedExercise: Exercise | null;
  code: string;
  evaluatingTestIndex: number | null;
  onRunSingleTest: (testIndex: number) => void;
}

const UnitTestPanel: React.FC<UnitTestPanelProps> = ({ 
  selectedExercise, 
  code, 
  evaluatingTestIndex, 
  onRunSingleTest 
}) => {
  return (
    <div className="w-80 shrink-0 flex flex-col gap-2 min-h-0 h-full">
      <div className="flex items-end shrink-0">
        <label className="font-bold text-blue-400">Pruebas Unitarias</label>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-sm custom-scrollbar min-h-0 space-y-3">
        {!selectedExercise ? (
          <span className="text-sm text-gray-500 italic block text-center mt-6">
            Selecciona un ejercicio arriba para cargar sus pruebas unitarias.
          </span>
        ) : (!selectedExercise.tests || selectedExercise.tests.length === 0) ? (
          <span className="text-sm text-gray-500 italic block text-center mt-6">
            Este ejercicio no tiene pruebas configuradas.
          </span>
        ) : (
          selectedExercise.tests.map((_, index) => (
            <div
              key={index}
              onClick={() => onRunSingleTest(index)}
              className={`p-4 bg-black border border-gray-800 rounded-md transition-all group ${
                evaluatingTestIndex === null && code.length > 0
                  ? 'cursor-pointer hover:border-blue-500/50 hover:bg-gray-800' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-xs font-bold text-blue-500 mb-2 block tracking-wider">
                TEST #{index + 1}
              </span>
              <div className="text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors flex items-center gap-2">
                {evaluatingTestIndex === index ? (
                  <><Loader2 size={14} className="animate-spin text-blue-400" /> Evaluando...</>
                ) : (
                  <><Play size={14} className="text-gray-600 group-hover:text-blue-400" /> {code.length > 0 ? 'Ejecutar test' : 'Falta código'}</>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UnitTestPanel;