/**
 * @module BatchResultsModal
 * Modal component wrapping the ResultsBoard to display full suite execution results within the IDE.
 */

import React from 'react';
import { X } from 'lucide-react';
import ResultsBoard from '../evaluator/ResultsBoard';
import type { SubmissionResponse } from '../../types';

export interface BatchResultsModalProps {
  /** The comprehensive evaluation payload returned by the batch execution. */
  evalData: SubmissionResponse;
  /** Callback to trigger modal closure. */
  onClose: () => void;
  /** Callback triggered when a user clicks on a specific test tile inside the board. */
  onViewTest: (index: number) => void;
}

const BatchResultsModal: React.FC<BatchResultsModalProps> = ({ evalData, onClose, onViewTest }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl flex flex-col max-h-[90vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-800 shrink-0 bg-gray-900 rounded-t-lg">
          <h3 className="text-xl font-bold text-purple-400">Resultados de la Batería de Tests</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
          <ResultsBoard evalData={evalData} onViewTest={onViewTest} />
        </div>
      </div>
    </div>
  );
};

export default BatchResultsModal;