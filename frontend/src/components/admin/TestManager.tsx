import React, { useState } from 'react';
import { Play, Save, Square, ArrowLeft, Trash2, X, CornerDownLeft, Terminal as TerminalIcon } from 'lucide-react';
import Terminal from '../ide/Terminal';
import { socket } from '../../services/socket';
import { createTestCase, deleteTestCase } from '../../services/api';
import type { Exercise, TestCase } from '../../types';

interface TestManagerProps {
  exercise: Exercise;
  onBack: () => void;
  onRefresh: () => void;
}

const TestManager: React.FC<TestManagerProps> = ({ exercise, onBack, onRefresh }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [recordedInput, setRecordedInput] = useState('');
  const [recordedOutput, setRecordedOutput] = useState('');
  const [viewedTest, setViewedTest] = useState<{test: TestCase, index: number} | null>(null);

  const startRecording = () => {
    if (!exercise?.teacherCode) return;
    setRecordedInput('');
    setRecordedOutput('');
    setIsRunning(true);
    socket.emit('start_run', exercise.teacherCode);
  };

  const handleSaveTest = async () => {
    if (!recordedOutput) return;
    try {
      await createTestCase(exercise.id, recordedInput, recordedOutput);
      setRecordedInput('');
      setRecordedOutput('');
      onRefresh(); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTest = async (testId: number) => {
    try {
      await deleteTestCase(exercise.id, testId);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // ARREGLO 1: Quitamos min-h-[700px] y forzamos overflow-hidden para evitar el "salto" de la barra de scroll.
    <div className="flex flex-col gap-6 h-full min-h-0 overflow-hidden text-zinc-100 antialiased">
      <button onClick={onBack} className="text-zinc-400 hover:text-white flex items-center gap-2 shrink-0 self-start w-fit transition-colors">
        <ArrowLeft size={20} /> Volver al gestor
      </button>

      {/* ARREGLO 2: Añadimos flex-1 min-h-0 min-w-0 para acorazar el contenedor principal */}
      <div className="flex gap-6 flex-1 min-h-0 min-w-0">
        
        {/* Panel Izquierdo: min-w-0 evita que las salidas largas de la terminal ensanchen la pantalla */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-sm">
          
          <div className="flex justify-between items-center mb-6 shrink-0 border-b border-zinc-800 pb-4 gap-4">
            {/* ARREGLO 3: break-words y min-w-0 permiten que el título salte de línea sin empujar los botones */}
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

          {/* ARREGLO 4: Contenedor de la terminal con min-h-0 min-w-0 para que todo el scroll se quede dentro */}
          <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-black border border-zinc-800 rounded relative overflow-hidden">
            <Terminal onInput={(d) => setRecordedInput(p => p + d)} onOutput={(d) => setRecordedOutput(p => p + d)} onFinish={() => setIsRunning(false)} />
            {isRunning && (
              <div className="absolute top-2 right-2 flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse bg-black px-2 py-1 rounded border border-red-900 shadow-md">
                <Square size={10} fill="currentColor" /> Grabando
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: shrink-0 garantiza que esta columna NUNCA se aplaste, siempre medirá w-80 */}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={() => setViewedTest(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-4xl flex flex-col max-h-[85vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center p-5 border-b border-zinc-800 shrink-0 bg-zinc-900/50 rounded-t-lg">
              <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                <TerminalIcon size={20} /> Reproducción del Test #{viewedTest.index + 1}
              </h3>
              <button onClick={() => setViewedTest(null)} className="text-zinc-400 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto bg-[#0a0a0a] rounded-b-lg flex flex-col gap-6">
              
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                  Inputs Simulados
                </span>
                <div className="bg-black border border-zinc-800 rounded-md p-4 flex flex-wrap gap-2 items-center min-h-[60px] shadow-inner">
                  {viewedTest.test.inputs ? (
                    viewedTest.test.inputs.split('\n').filter(Boolean).map((inp, i) => (
                      <span key={i} className="text-green-400 font-mono text-sm font-bold flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">
                        {inp}
                        <CornerDownLeft size={14} className="text-green-600" />
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-600 italic text-sm">Este test no requiere inputs por teclado.</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1 min-h-0">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                  Salida Esperada (Profesor)
                </span>
                <div className="bg-black border border-zinc-800 rounded-md shadow-inner flex-1 overflow-hidden flex flex-col">
                  <pre className="p-5 text-zinc-300 font-mono text-sm overflow-auto whitespace-pre leading-relaxed custom-scrollbar flex-1">
                    {viewedTest.test.expected}
                  </pre>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManager;