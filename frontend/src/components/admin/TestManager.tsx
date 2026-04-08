import React from 'react';
import { Play, Save, Square, ArrowLeft, Trash2 } from 'lucide-react';
import Terminal from '../ide/Terminal';
import { useTestManagerLogic } from '../../hooks/admin/useTestManagerLogic';
import TestPlaybackModal from '../shared/TestPlaybackModal';
import type { Exercise } from '../../types';

interface TestManagerProps {
  exercise: Exercise;
  onBack: () => void;
  onRefresh: () => void;
}

const TestManager: React.FC<TestManagerProps> = ({ exercise, onBack, onRefresh }) => {
  const {
    isRunning,
    setIsRunning,
    setRecordedInput,
    recordedOutput,
    setRecordedOutput,
    viewedTest,
    setViewedTest,
    startRecording,
    handleSaveTest,
    handleDeleteTest
  } = useTestManagerLogic(exercise, onRefresh);

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 overflow-hidden text-zinc-100 antialiased">
      <button onClick={onBack} className="text-zinc-400 hover:text-white flex items-center gap-2 shrink-0 self-start w-fit transition-colors">
        <ArrowLeft size={20} /> Volver al gestor
      </button>

      <div className="flex gap-6 flex-1 min-h-0 min-w-0">
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 shrink-0 border-b border-zinc-800 pb-4 gap-4">
            <h1 className="text-xl font-bold text-green-400 flex-1 min-w-0 break-words">
              Nuevo Test: {exercise.title}
            </h1>
            
            <div className="flex gap-3 shrink-0"> 
              <button onClick={startRecording} disabled={isRunning} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold flex items-center gap-2 disabled:opacity-50 text-sm transition-colors text-white">
                <Play size={16} /> Iniciar Ejecución
              </button>
              <button onClick={handleSaveTest} disabled={isRunning || !recordedOutput} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold flex items-center gap-2 disabled:opacity-50 text-sm transition-colors text-white">
                <Save size={16} /> Guardar Test
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-black border border-zinc-800 rounded relative overflow-hidden">
            <Terminal onInput={(d) => setRecordedInput(p => p + d)} onOutput={(d) => setRecordedOutput(p => p + d)} onFinish={() => setIsRunning(false)} />
            {isRunning && (
              <div className="absolute top-2 right-2 flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse bg-black px-2 py-1 rounded border border-red-900 shadow-md">
                <Square size={10} fill="currentColor" /> Grabando
              </div>
            )}
          </div>
        </div>

        <div className="w-80 shrink-0 flex flex-col min-h-0 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-300 border-b border-zinc-800 pb-4 mb-4 shrink-0">Tests ({exercise.tests?.length || 0})</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-0">
            {exercise.tests?.map((test, index) => (
              <div key={test.id} onClick={() => setViewedTest({ test, index })} className="bg-black border border-zinc-800 rounded p-3 relative group cursor-pointer hover:border-blue-500 transition-colors shadow-sm">
                <button onClick={(e) => { e.stopPropagation(); handleDeleteTest(test.id); }} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                <span className="text-xs font-bold text-blue-500 mb-2 block tracking-tight">TEST #{index + 1}</span>
                <div className="text-xs text-zinc-400 max-h-24 overflow-y-hidden">
                  <span className="text-zinc-500 font-semibold">Inputs:</span> {test.inputs.replace(/\n/g, ', ') || 'Ninguno'}<br/>
                  <span className="text-zinc-500 font-semibold mt-1 inline-block">Output:</span> <span className="truncate block text-zinc-300">{test.expected.substring(0, 40)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {viewedTest && (
        <TestPlaybackModal 
          test={viewedTest.test}
          index={viewedTest.index}
          onClose={() => setViewedTest(null)}
        />
      )}
    </div>
  );
};

export default TestManager;