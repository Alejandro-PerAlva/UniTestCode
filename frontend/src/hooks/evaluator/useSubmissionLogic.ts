/**
 * @module useSubmissionLogic
 * Handles the logic for student code submissions and batch test evaluations.
 */

import { useState, useEffect, type ChangeEvent } from 'react';
import { fetchExercises } from '../../services/api';
import type { Exercise, SubmissionResponse } from '../../types';

/**
 * Custom hook to manage the file upload and evaluation flow for a specific exercise.
 * @returns State variables, selected entities, and the file evaluation handler.
 */
export const useSubmissionLogic = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalData, setEvalData] = useState<SubmissionResponse | null>(null);
  
  const [viewedTestIndex, setViewedTestIndex] = useState<number | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchExercises();
        setExercises(data);
      } catch (error) {
        console.error("Error cargando ejercicios:", error);
      }
    };
    loadExercises();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setEvalData(null);
    }
  };

  const handleExerciseChange = (id: number) => {
    setSelectedExerciseId(id);
    setEvalData(null);
  };

  const handleEvaluate = () => {
    if (!selectedExerciseId || !file) return;
    
    setIsEvaluating(true);
    setEvalData(null);
    setViewedTestIndex(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const studentCode = event.target?.result as string;

      try {
        const response = await fetch(`http://localhost:5000/api/exercises/${selectedExerciseId}/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentCode }) 
        });
        
        const data = await response.json();
        setEvalData(data);
      } catch (error) {
        console.error("Error evaluando:", error);
      } finally {
        setIsEvaluating(false);
      }
    };

    reader.onerror = () => {
      setIsEvaluating(false);
    };

    reader.readAsText(file);
  };

  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId) || null;

  return {
    exercises,
    selectedExerciseId,
    selectedExercise,
    file,
    isEvaluating,
    evalData,
    viewedTestIndex,
    setViewedTestIndex,
    showDescription,
    setShowDescription,
    handleFileChange,
    handleExerciseChange,
    handleEvaluate
  };
};