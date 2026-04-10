/**
 * @module useExerciseFormLogic
 * Manages the state and submission logic for the Exercise creation and editing forms.
 */

import { useState } from 'react';
import { createExercise, updateExercise } from '../../services/api';
import type { Exercise } from '../../types';

/**
 * Custom hook to encapsulate the form handling for exercises.
 * @param exercise - The exercise to edit, or null if creating a new one.
 * @param onSaved - Callback triggered after a successful API submission.
 * @returns Form state variables and their respective change handlers.
 */
export const useExerciseFormLogic = (exercise: Exercise | null, onSaved: () => void) => {
  const [title, setTitle] = useState(exercise?.title || '');
  const [description, setDescription] = useState(exercise?.description || '');
  const [teacherCode, setTeacherCode] = useState(exercise?.teacherCode || '');
  const [fileName, setFileName] = useState(exercise ? 'Código actual cargado' : '');
  const [isVisible, setIsVisible] = useState(exercise?.isVisible ?? true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => setTeacherCode(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!title || !description || !teacherCode) return;
    try {
      if (exercise) {
        await updateExercise(exercise.id, { title, description, teacherCode, isVisible });
      } else {
        await createExercise(title, description, teacherCode, isVisible);
      }
      onSaved();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    teacherCode,
    fileName,
    isVisible,
    setIsVisible,
    handleFileChange,
    handleCreateOrUpdate
  };
};