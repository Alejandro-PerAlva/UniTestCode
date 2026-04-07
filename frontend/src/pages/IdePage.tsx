import React, { useState, useEffect } from 'react';
import { fetchExercises } from '../services/api';
import { socket } from '../services/socket';
import type { Exercise } from '../types';
import { Play, Loader2 } from 'lucide-react';

import DuelControls from '../components/ide/DuelControls';
import CodeEditor from '../components/ide/CodeEditor';
import DualTerminal from '../components/ide/DualTerminal';
import DescriptionModal from '../components/shared/DescriptionModal';
import TestDetailModal from '../components/shared/TestDetailModal';

const IdePage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | ''>('');
  const [code, setCode] = useState('');
  
  const [executionId, setExecutionId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const [evaluatingTestIndex, setEvaluatingTestIndex] = useState<number | null>(null);
  const [singleTestResult, setSingleTestResult] = useState<any | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchExercises();
        setExercises(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadExercises();

    const handleFinish = () => setIsRunning(false);
    
    const handleSingleTestResult = (result: any) => {
      setEvaluatingTestIndex(null); 
      setSingleTestResult(result);  
    };

    socket.on('duel_student_finished', handleFinish);
    socket.on('duel_teacher_finished', handleFinish);
    socket.on('single_test_result', handleSingleTestResult);

    return () => {
      socket.off('duel_student_finished', handleFinish);
      socket.off('duel_teacher_finished', handleFinish);
      socket.off('single_test_result', handleSingleTestResult);
    };
  }, []);

  useEffect(() => {
    if (selectedExerciseId) {
      const savedCode = localStorage.getItem(`mips_code_${selectedExerciseId}`);
      setCode(savedCode || '');
    } else {
      setCode('');
    }
  }, [selectedExerciseId]);

  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId) || null;

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (selectedExerciseId) {
      localStorage.setItem(`mips_code_${selectedExerciseId}`, newCode);
    }
  };

  const handleRunDuel = () => {
    if (!selectedExercise || !code) return;
    setIsRunning(true);
    setExecutionId(prev => prev + 1);
    socket.emit('start_duel', { 
      studentCode: code, 
      exerciseId: selectedExercise.id
    });
  };

  const handleStopDuel = () => {
    socket.emit('stop_duel');
    setIsRunning(false);
  };

  const handleRunSingleTest = (testIndex: number) => {
    if (!selectedExercise || !code || evaluatingTestIndex !== null) return;
    setEvaluatingTestIndex(testIndex);
    socket.emit('run_single_test', {
      studentCode: code,
      exerciseId: selectedExercise.id,
      testIndex
    });
  };

  return (
    <div className="h-full w-full bg-gray-950 text-white flex flex-col p-6 gap-4 overflow-hidden">
      
      <DuelControls 
        exercises={exercises}
        selectedExerciseId={selectedExerciseId}
        onExerciseChange={setSelectedExerciseId}
        onShowDescription={() => setShowDescription(true)}
        isRunning={isRunning}
        hasCode={code.length > 0}
        onStartDuel={handleRunDuel}
        onStopDuel={handleStopDuel}
      />

      <div className="flex-1 flex gap-8 min-h-0 min-w-0">
        
        {/* LA SOLUCIÓN DEFINITIVA: 
            1. Forzamos al Editor (primer hijo) a medir exactamente un tercio (!w-1/3) y le impedimos redimensionarse (!flex-none).
            2. Forzamos a la Terminal (segundo hijo) a rellenar el resto del hueco (!flex-1) anulando cualquier w- que tenga internamente. 
        */}
        <div className="flex-1 flex gap-6 min-h-0 min-w-0 [&>*:nth-child(1)]:!w-1/3 [&>*:nth-child(1)]:!flex-none [&>*:nth-child(2)]:!w-auto [&>*:nth-child(2)]:!flex-1 [&>*:nth-child(2)]:!min-w-0">
          <CodeEditor 
            code={code}
            onChange={handleCodeChange}
            selectedExercise={selectedExercise}
          />
          <DualTerminal executionId={executionId} />
        </div>

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
              selectedExercise.tests.map((test, index) => (
                <div
                  key={index}
                  onClick={() => handleRunSingleTest(index)}
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

      </div>

      {showDescription && selectedExercise && (
        <DescriptionModal 
          exercise={selectedExercise} 
          onClose={() => setShowDescription(false)} 
        />
      )}

      {singleTestResult && (
        <TestDetailModal 
          result={singleTestResult} 
          originalTest={singleTestResult.originalTest} 
          testIndex={singleTestResult.testIndex} 
          onClose={() => setSingleTestResult(null)} 
        />
      )}
      
    </div>
  );
};

export default IdePage;