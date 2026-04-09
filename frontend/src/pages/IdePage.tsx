/**
 * @module IdePage
 * The interactive Web IDE interface container.
 * Combines the code editor, dual terminal outputs, and unit test execution panels.
 */

import React from 'react';
import { useIdeLogic } from '../hooks/ide/useIdeLogic';

import DuelControls from '../components/ide/DuelControls';
import CodeEditor from '../components/ide/CodeEditor';
import DualTerminal from '../components/ide/DualTerminal';
import UnitTestPanel from '../components/ide/UnitTestPanel';
import DescriptionModal from '../components/shared/DescriptionModal';
import TestDetailModal from '../components/shared/TestDetailModal';

const IdePage: React.FC = () => {
  const {
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
  } = useIdeLogic();

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
        
        <div className="flex-1 flex gap-6 min-h-0 min-w-0 [&>*:nth-child(1)]:!w-1/3 [&>*:nth-child(1)]:!flex-none [&>*:nth-child(2)]:!w-auto [&>*:nth-child(2)]:!flex-1 [&>*:nth-child(2)]:!min-w-0">
          <CodeEditor 
            code={code}
            onChange={handleCodeChange}
            selectedExercise={selectedExercise}
          />
          <DualTerminal executionId={executionId} />
        </div>

        <UnitTestPanel 
          selectedExercise={selectedExercise}
          code={code}
          evaluatingTestIndex={evaluatingTestIndex}
          onRunSingleTest={handleRunSingleTest}
        />

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
          originalTest={singleTestResult.originalTest || undefined} 
          testIndex={singleTestResult.testIndex} 
          onClose={() => setSingleTestResult(null)} 
        />
      )}
      
    </div>
  );
};

export default IdePage;