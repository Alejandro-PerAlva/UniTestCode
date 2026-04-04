import React, { useState, useEffect } from 'react';
import { fetchExercises } from '../services/api';
import { socket } from '../services/socket';
import type { Exercise } from '../types';

import DuelControls from '../components/ide/DuelControls';
import CodeEditor from '../components/ide/CodeEditor';
import DualTerminal from '../components/ide/DualTerminal';
import DescriptionModal from '../components/shared/DescriptionModal';

const IdePage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | ''>('');
  const [code, setCode] = useState('');
  const [executionId, setExecutionId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

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
    socket.on('duel_student_finished', handleFinish);
    socket.on('duel_teacher_finished', handleFinish);

    return () => {
      socket.off('duel_student_finished', handleFinish);
      socket.off('duel_teacher_finished', handleFinish);
    };
  }, []);

  useEffect(() => {
    if (selectedExerciseId) {
      const savedCode = localStorage.getItem(`mips_code_${selectedExerciseId}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

      <div className="flex-1 flex gap-6 min-h-0">
        <CodeEditor 
          code={code}
          onChange={handleCodeChange}
          selectedExercise={selectedExercise}
        />
        
        <DualTerminal executionId={executionId} />
      </div>

      {showDescription && selectedExercise && (
        <DescriptionModal 
          exercise={selectedExercise} 
          onClose={() => setShowDescription(false)} 
        />
      )}
      
    </div>
  );
};

export default IdePage;