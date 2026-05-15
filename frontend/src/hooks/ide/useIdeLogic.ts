/**
 * @module useIdeLogic
 * Drives the state and real-time Socket.IO interactions for the Web IDE.
 * Orchestrates Duel Mode, Single Test evaluations, and Batch evaluations.
 */

import { useState, useEffect } from 'react';
import { fetchExercises } from '../../services/api';
import { socket } from '../../services/socket';
import type { Exercise, TestResultPayload, SubmissionResponse } from '../../types';

/**
 * Comprehensive custom hook for the interactive IDE environment.
 * Handles code persistence via LocalStorage and real-time execution via WebSockets.
 * @returns IDE state flags, current source code, and real-time execution handlers.
 */
export const useIdeLogic = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | ''>('');
  const [code, setCode] = useState('');
  
  const [executionId, setExecutionId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const [evaluatingTestIndex, setEvaluatingTestIndex] = useState<number | null>(null);
  const [singleTestResult, setSingleTestResult] = useState<TestResultPayload | null>(null);

  // State management for batch test execution
  const [isEvaluatingBatch, setIsEvaluatingBatch] = useState(false);
  const [batchTestResults, setBatchTestResults] = useState<SubmissionResponse | null>(null);

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

    // Handler to receive comprehensive results from batch execution
    const handleBatchTestResult = (result: SubmissionResponse) => {
      setIsEvaluatingBatch(false);
      setBatchTestResults(result);
    };

    socket.on('duel_student_finished', handleFinish);
    socket.on('duel_teacher_finished', handleFinish);
    socket.on('single_test_result', handleSingleTestResult);
    socket.on('all_tests_result', handleBatchTestResult);

    return () => {
      socket.off('duel_student_finished', handleFinish);
      socket.off('duel_teacher_finished', handleFinish);
      socket.off('single_test_result', handleSingleTestResult);
      socket.off('all_tests_result', handleBatchTestResult);
    };
  }, []);

  const [prevExerciseId, setPrevExerciseId] = useState<number | ''>('');

  if (selectedExerciseId !== prevExerciseId) {
    setPrevExerciseId(selectedExerciseId);
    
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
    if (!selectedExercise || !code || evaluatingTestIndex !== null || isEvaluatingBatch) return;
    setEvaluatingTestIndex(testIndex);
    socket.emit('run_single_test', {
      studentCode: code,
      exerciseId: selectedExercise.id,
      testIndex
    });
  };

  // Function to trigger a batch evaluation of all available tests
  const handleRunAllTests = () => {
    if (!selectedExercise || !code || evaluatingTestIndex !== null || isEvaluatingBatch) return;
    setIsEvaluatingBatch(true);
    socket.emit('run_all_tests', {
      studentCode: code,
      exerciseId: selectedExercise.id
    });
  };

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
    isEvaluatingBatch,
    batchTestResults,
    setBatchTestResults,
    handleRunDuel,
    handleStopDuel,
    handleRunSingleTest,
    handleRunAllTests
  };
};