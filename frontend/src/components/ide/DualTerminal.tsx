/**
 * @module DualTerminal
 * Container rendering two parallel XTerm.js terminal instances for the Duel Mode.
 * One interactive terminal for the student, and one read-only terminal for the teacher's output.
 */

import React from 'react';
import Terminal from './Terminal';

/**
 * Props for the DualTerminal component.
 */
export interface DualTerminalProps {
  /** * A numeric counter used to force a complete re-mount and reset of the terminal 
   * instances when a new execution starts.
   */
  executionId: number;
}

const DualTerminal: React.FC<DualTerminalProps> = ({ executionId }) => {
  return (
    <div className="w-2/3 flex flex-col h-full gap-4 min-h-0">
      
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <div className="flex justify-between items-end shrink-0">
          <label className="font-bold text-green-400">Tu Consola (Interactiva)</label>
          <span className="text-xs text-gray-500">Haz clic dentro para introducir datos</span>
        </div>
        
        <div className="flex-1 min-h-0 overflow-hidden rounded-md">
          <Terminal 
            key={`student-${executionId}`}
            inputEvent="duel_input"
            outputEvent="duel_student_output"
            finishEvent="duel_student_finished"
            readOnly={false}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <div className="flex justify-between items-end shrink-0">
          <label className="font-bold text-purple-400">Consola del Profesor (Salida Esperada)</label>
          <span className="text-xs text-gray-500">Solo lectura - Refleja los mismos inputs</span>
        </div>
        
        <div className="flex-1 min-h-0 overflow-hidden rounded-md">
          <Terminal 
            key={`teacher-${executionId}`}
            outputEvent="duel_teacher_output"
            finishEvent="duel_teacher_finished"
            readOnly={true}
          />
        </div>
      </div>

    </div>
  );
};

export default DualTerminal;