/**
 * @module TestDetailModal
 * Modal component for deeply inspecting the execution results of a specific test case.
 * Displays a side-by-side comparison of expected vs. actual MARS simulator output.
 */

import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useTestFormatter } from '../../hooks/shared/useTestFormatter';
import type { TestCase, TestResultPayload } from '../../types';

/**
 * Props for the TestDetailModal component.
 */
export interface TestDetailModalProps {
  /** The structured evaluation payload for the specific test case. */
  result: TestResultPayload;
  /** The original test case definition containing inputs and expected output. */
  originalTest: TestCase | undefined;
  /** The zero-based index of the test within the suite. */
  testIndex: number;
  /** Callback to trigger modal closure. */
  onClose: () => void;
}

const TestDetailModal: React.FC<TestDetailModalProps> = ({ result, originalTest, testIndex, onClose }) => {
  const { renderWithInputs } = useTestFormatter();
  const sharedInputs = originalTest?.inputs ? originalTest.inputs.split('\n').filter(Boolean) : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[60] p-4" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-5xl flex flex-col max-h-[85vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-zinc-800 shrink-0 bg-zinc-900/50 rounded-t-lg">
          <h3 className="text-xl font-bold flex items-center gap-3">
            {result.passed ? <CheckCircle className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
            <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
              Detalles del Test #{testIndex + 1} {result.passed ? '(Superado)' : '(Fallido)'}
            </span>
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto bg-[#0a0a0a] rounded-b-lg flex flex-col gap-5">
          
          {sharedInputs.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-900/40 border border-zinc-800/60 rounded-md p-2.5 shrink-0">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider shrink-0">
                Valores de Entrada:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sharedInputs.map((inp, i) => (
                  <span key={i} className="text-green-400 font-mono text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    {inp}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Salida Esperada (Profesor)
              </span>
              <div className="bg-black border border-zinc-800 rounded-md shadow-inner flex-1 overflow-hidden flex flex-col">
                <pre className="p-5 text-zinc-300 font-mono text-sm overflow-auto whitespace-pre leading-relaxed custom-scrollbar flex-1 max-h-[500px]">
                  {renderWithInputs(result.expected, originalTest?.inputs || '')}
                </pre>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Tu Salida (MARS)
              </span>
              <div className={`bg-black border rounded-md shadow-inner flex-1 overflow-hidden flex flex-col ${result.passed ? 'border-green-900/50' : 'border-red-900/50'}`}>
                <pre className={`p-5 font-mono text-sm overflow-auto whitespace-pre leading-relaxed custom-scrollbar flex-1 max-h-[500px] ${result.passed ? 'text-zinc-300' : 'text-red-300'}`}>
                  {renderWithInputs(result.output || 'El programa no produjo ninguna salida.', originalTest?.inputs || '')}
                </pre>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailModal;