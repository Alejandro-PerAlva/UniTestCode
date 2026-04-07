/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, type ChangeEvent } from 'react';
import { fetchExercises } from '../services/api';
import type { Exercise } from '../types';

import EvaluatorForm from '../components/evaluator/EvaluatorForm';
import ResultsBoard from '../components/evaluator/ResultsBoard';
import TestDetailModal from '../components/shared/TestDetailModal';
import DescriptionModal from '../components/shared/DescriptionModal';

const SubmissionPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalData, setEvalData] = useState<any>(null);
  
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
      } catch (err) {
        console.error("Error evaluando:", err);
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

  return (
    <div className="h-full w-full bg-gray-950 text-white flex flex-col items-center p-8 overflow-y-auto">
      
      <EvaluatorForm 
        exercises={exercises}
        selectedExerciseId={selectedExerciseId}
        onExerciseChange={handleExerciseChange}
        onShowDescription={() => setShowDescription(true)}
        file={file}
        onFileChange={handleFileChange}
        isEvaluating={isEvaluating}
        onEvaluate={handleEvaluate}
      />

      {evalData && (
        <ResultsBoard 
          evalData={evalData} 
          onViewTest={setViewedTestIndex} 
        />
      )}

      {viewedTestIndex !== null && evalData && selectedExercise && (
        <TestDetailModal 
          result={evalData.results[viewedTestIndex]}
          originalTest={selectedExercise.tests?.find(t => t.id === evalData.results[viewedTestIndex].testId)}
          testIndex={viewedTestIndex}
          onClose={() => setViewedTestIndex(null)}
        />
      )}

      {showDescription && selectedExercise && (
        <DescriptionModal 
          exercise={selectedExercise} 
          onClose={() => setShowDescription(false)} 
        />
      )}

    </div>
  );
};

export default SubmissionPage;