/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { CheckCircle, XCircle, X, CornerDownLeft } from 'lucide-react';
import type { TestCase } from '../../types';

interface TestDetailModalProps {
  result: any;
  originalTest: TestCase | undefined;
  testIndex: number;
  onClose: () => void;
}

const TestDetailModal: React.FC<TestDetailModalProps> = ({ result, originalTest, testIndex, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-5xl flex flex-col max-h-[85vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
        
        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#0a0a0a] rounded-b-lg flex flex-col gap-6">
          
          {/* Sección Inputs */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Inputs Compartidos (Simulados)
            </span>
            <div className="bg-black border border-zinc-800 rounded-md p-4 flex flex-wrap gap-2 items-center min-h-[60px]">
              {originalTest?.inputs ? (
                originalTest.inputs.split('\n').filter(Boolean).map((inp, i) => (
                  <span key={i} className="text-green-400 font-mono text-sm font-bold flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">
                    {inp}
                    <CornerDownLeft size={14} className="text-green-600" />
                  </span>
                ))
              ) : (
                <span className="text-zinc-600 italic text-sm">Este test no requirió inputs por consola.</span>
              )}
            </div>
          </div>

          {/* Sección Outputs (Side by Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            
            {/* Salida Esperada */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Salida Esperada (Profesor)
              </span>
              <div className="bg-black border border-zinc-800 rounded-md shadow-inner flex-1 overflow-hidden flex flex-col">
                <pre className="p-5 text-zinc-300 font-mono text-sm overflow-auto whitespace-pre leading-relaxed custom-scrollbar flex-1 max-h-[400px]">
                  {result.expected}
                </pre>
              </div>
            </div>

            {/* Salida Actual */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Tu Salida (MARS)
              </span>
              <div className={`bg-black border rounded-md shadow-inner flex-1 overflow-hidden flex flex-col ${result.passed ? 'border-green-900/50' : 'border-red-900/50'}`}>
                <pre className={`p-5 font-mono text-sm overflow-auto whitespace-pre leading-relaxed custom-scrollbar flex-1 max-h-[400px] ${result.passed ? 'text-zinc-300' : 'text-red-300'}`}>
                  {result.output || 'El programa no produjo ninguna salida.'}
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