// src/hooks/useIdeLogic.ts
import { useState, useEffect } from 'react';
import { fetchExercises } from '../../services/api';
import { socket } from '../../services/socket';
import type { Exercise, TestResultPayload } from '../../types';

export const useIdeLogic = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | ''>('');
  const [code, setCode] = useState('');
  
  const [executionId, setExecutionId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const [evaluatingTestIndex, setEvaluatingTestIndex] = useState<number | null>(null);
  const [singleTestResult, setSingleTestResult] = useState<TestResultPayload | null>(null);

  // 1. Cargar ejercicios y configurar listeners de sockets
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
    
    const handleSingleTestResult = (result: TestResultPayload) => {
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

  // 2. Cargar código guardado al cambiar de ejercicio
  // Creamos un estado para trackear el ejercicio anterior
  const [prevExerciseId, setPrevExerciseId] = useState<number | ''>('');

  // Si el ID cambia, actualizamos el código DIRECTAMENTE sin useEffect
  if (selectedExerciseId !== prevExerciseId) {
    setPrevExerciseId(selectedExerciseId); // Guardamos el nuevo ID
    
    if (selectedExerciseId) {
      const savedCode = localStorage.getItem(`mips_code_${selectedExerciseId}`);
      setCode(savedCode || "");
    } else {
      setCode("");
    }
  }

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

  // Devolvemos todo lo que la interfaz necesita para pintarse
  return {
    exercises,
    selectedExerciseId,
    setSelectedExerciseId,
    selectedExercise,
    code,
    handleCodeChange,
    executionId,
    isRunning,
    showDescription,
    setShowDescription,
    evaluatingTestIndex,
    singleTestResult,
    setSingleTestResult,
    handleRunDuel,
    handleStopDuel,
    handleRunSingleTest
  };
};