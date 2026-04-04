/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ResultsBoardProps {
  evalData: any;
  onViewTest: (index: number) => void;
}

const ResultsBoard: React.FC<ResultsBoardProps> = ({ evalData, onViewTest }) => {
  return (
    <div className="w-full max-w-3xl mt-6 bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-bold border-b border-gray-800 pb-4 mb-4 flex items-center justify-between">
        Resultados de la Ejecución
        {evalData.success && (
          <span className={`text-sm py-1 px-3 rounded-full ${evalData.allPassed ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {evalData.results?.filter((r: any) => r.passed).length} / {evalData.results?.length} Tests Superados
          </span>
        )}
      </h3>

      {evalData.error ? (
        <div className="text-red-400 bg-red-950/30 p-4 rounded border border-red-900 font-mono text-sm whitespace-pre-wrap">
          {evalData.error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {evalData.results.map((res: any, index: number) => (
            <div 
              key={index} 
              onClick={() => onViewTest(index)}
              className={`p-4 rounded-lg border cursor-pointer hover:scale-[1.02] transition-transform flex items-center gap-3 ${
                res.passed 
                  ? 'border-green-800/50 bg-green-950/20 hover:border-green-500/50' 
                  : 'border-red-800/50 bg-red-950/20 hover:border-red-500/50'
              }`}
            >
              {res.passed ? <CheckCircle className="text-green-500 shrink-0" size={24} /> : <XCircle className="text-red-500 shrink-0" size={24} />}
              <div className="flex flex-col">
                <span className={`font-bold ${res.passed ? 'text-green-400' : 'text-red-400'}`}>
                  Test {index + 1}
                </span>
                <span className="text-xs text-gray-500">Haz clic para ver detalles</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsBoard;