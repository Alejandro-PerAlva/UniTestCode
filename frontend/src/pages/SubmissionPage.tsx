/**
 * @module SubmissionPage
 * Container for the student code evaluation workflow.
 * Manages file uploads, batch test evaluations, and the results rendering board.
 */

import React from 'react';
import { useSubmissionLogic } from '../hooks/evaluator/useSubmissionLogic';

import EvaluatorForm from '../components/evaluator/EvaluatorForm';
import ResultsBoard from '../components/evaluator/ResultsBoard';
import TestDetailModal from '../components/shared/TestDetailModal';
import DescriptionModal from '../components/shared/DescriptionModal';

const SubmissionPage: React.FC = () => {
  const {
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
  } = useSubmissionLogic();

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

      {viewedTestIndex !== null && evalData && evalData.results && selectedExercise && (
        <TestDetailModal 
          result={{
            ...evalData.results[viewedTestIndex],
            testIndex: viewedTestIndex
          }}
          originalTest={selectedExercise.tests?.find(t => t.id === evalData.results![viewedTestIndex].testId)}
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