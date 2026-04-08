import React from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';
import { useTestFormatter } from '../../hooks/shared/useTestFormatter';
import type { TestCase } from '../../types';

interface TestPlaybackModalProps {
  test: TestCase;
  index: number;
  onClose: () => void;
}

const TestPlaybackModal: React.FC<TestPlaybackModalProps> = ({ test, index, onClose }) => {
  const { renderWithInputs } = useTestFormatter();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-4xl flex flex-col max-h-[85vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-zinc-800 shrink-0 bg-zinc-900/50 rounded-t-lg">
          <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <TerminalIcon size={20} /> Reproducción del Test #{index + 1}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto bg-[#0a0a0a] rounded-b-lg flex flex-col gap-5">
          {test.inputs && test.inputs.trim() !== '' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-900/40 border border-zinc-800/60 rounded-md p-2.5 shrink-0">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider shrink-0">
                Valores de Entrada:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {test.inputs.split('\n').filter(Boolean).map((inp, i) => (
                  <span key={i} className="text-green-400 font-mono text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    {inp}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 flex-1 min-h-0">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Salida Esperada (Profesor)
            </span>
            <div className="bg-black border border-zinc-800 rounded-md shadow-inner flex-1 overflow-hidden flex flex-col">
              <pre className="p-5 text-zinc-300 font-mono text-sm overflow-auto whitespace-pre leading-relaxed custom-scrollbar flex-1">
                {renderWithInputs(test.expected, test.inputs)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPlaybackModal;