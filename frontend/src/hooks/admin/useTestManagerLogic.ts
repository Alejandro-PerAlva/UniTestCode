/**
 * @module useTestManagerLogic
 * Manages the interactive recording and deletion of test cases via Socket.IO.
 */

import { useState } from 'react';
import { socket } from '../../services/socket';
import { createTestCase, deleteTestCase } from '../../services/api';
import type { Exercise, TestCase } from '../../types';

/**
 * Custom hook to handle real-time execution flows for test case generation.
 * * @param exercise - The target exercise for which tests are being managed.
 * @param onRefresh - Callback to reload the exercise data after saving or deleting a test.
 * @returns State variables and handlers for the test case manager UI.
 */
export const useTestManagerLogic = (exercise: Exercise, onRefresh: () => void) => {
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

  return {
    isRunning,
    setIsRunning,
    recordedInput,
    setRecordedInput,
    recordedOutput,
    setRecordedOutput,
    viewedTest,
    setViewedTest,
    startRecording,
    handleSaveTest,
    handleDeleteTest
  };
};