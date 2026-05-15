/**
 * @module UnitTestPanel
 * Sidebar component listing the unit tests for the currently active exercise.
 * Allows initiating single-test evaluations or full batch evaluations.
 */

import React from 'react';
import { Play, Loader2, ListChecks } from 'lucide-react';
import type { Exercise } from '../../types';

/**
 * Props for the UnitTestPanel component.
 */
export interface UnitTestPanelProps {
  /** The currently selected exercise containing the test cases. */
  selectedExercise: Exercise | null;
  /** The active code from the editor to ensure it's not empty before evaluating. */
  code: string;
  /** The index of the test case currently being evaluated (null if idle). */
  evaluatingTestIndex: number | null;
  /** Flag indicating if a batch evaluation of all tests is in progress. */
  isEvaluatingBatch: boolean;
  /** Callback triggered when a specific test case is selected for execution. */
  onRunSingleTest: (testIndex: number) => void;
  /** Callback triggered to run all tests in batch. */
  onRunAllTests: () => void;
}

const UnitTestPanel: React.FC<UnitTestPanelProps> = ({ 
  selectedExercise, 
  code, 
  evaluatingTestIndex, 
  isEvaluatingBatch,
  onRunSingleTest,
  onRunAllTests
}) => {
  const hasTests = selectedExercise?.tests && selectedExercise.tests.length > 0;

  return (
    <div className="w-80 shrink-0 flex flex-col gap-2 min-h-0 h-full">
      <div className="flex items-end shrink-0">
        <label className="font-bold text-blue-400">Pruebas Unitarias</label>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-sm custom-scrollbar min-h-0 flex flex-col">
        {!selectedExercise ? (
          <span className="text-sm text-gray-500 italic block text-center mt-6">
            Selecciona un ejercicio arriba para cargar sus pruebas unitarias.
          </span>
        ) : (!hasTests) ? (
          <span className="text-sm text-gray-500 italic block text-center mt-6">
            Este ejercicio no tiene pruebas configuradas.
          </span>
        ) : (
          <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {selectedExercise.tests!.map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  if (evaluatingTestIndex === null && !isEvaluatingBatch && code.length > 0) {
                    onRunSingleTest(index);
                  }
                }}
                className={`p-4 bg-black border border-gray-800 rounded-md transition-all group shrink-0 ${
                  evaluatingTestIndex === null && !isEvaluatingBatch && code.length > 0
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
            ))}
          </div>
        )}

        {/* Run All button (Sticky at the bottom if tests exist) */}
        {hasTests && (
          <div className="pt-4 mt-2 border-t border-gray-800 shrink-0">
            <button
              onClick={onRunAllTests}
              disabled={evaluatingTestIndex !== null || isEvaluatingBatch || code.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEvaluatingBatch ? (
                <><Loader2 size={18} className="animate-spin" /> Ejecutando...</>
              ) : (
                <><ListChecks size={18} /> Ejecutar Todos</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitTestPanel;