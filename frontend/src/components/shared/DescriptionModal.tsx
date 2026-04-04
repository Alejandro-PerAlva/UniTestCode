import React from 'react';
import { TerminalSquare, X } from 'lucide-react';
import type { Exercise } from '../../types';

interface DescriptionModalProps {
  exercise: Exercise;
  onClose: () => void;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ exercise, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl flex flex-col max-h-[80vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-800 shrink-0 bg-gray-900 rounded-t-lg">
          <h3 className="text-xl font-bold text-blue-400 flex items-center gap-3">
            <TerminalSquare size={24} />
            {exercise.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-4">Instrucciones</span>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {exercise.description || "Este ejercicio no tiene descripción adicional."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;