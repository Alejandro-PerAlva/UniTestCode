import React from 'react';
import Terminal from './Terminal';

interface DualTerminalProps {
  executionId: number;
}

const DualTerminal: React.FC<DualTerminalProps> = ({ executionId }) => {
  return (
    // 1. h-full obliga a la columna a tener la altura exacta del editor de la izquierda
    <div className="w-2/3 flex flex-col h-full gap-4 min-h-0">
      
      {/* --- MITAD SUPERIOR (Terminal Interactiva) --- */}
      {/* 2. flex-1 le da exactamente el 50% del espacio disponible */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        
        {/* Cabecera: shrink-0 evita que se aplaste si falta espacio */}
        <div className="flex justify-between items-end shrink-0">
          <label className="font-bold text-green-400">Tu Consola (Interactiva)</label>
          <span className="text-xs text-gray-500">Haz clic dentro para introducir datos</span>
        </div>
        
        {/* 3. Contenedor del componente: flex-1 ocupa el resto del 50%, y overflow-hidden corta lo que sobre */}
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

      {/* --- MITAD INFERIOR (Terminal Profesor) --- */}
      {/* 2. flex-1 le da exactamente el otro 50% del espacio */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        
        {/* Cabecera */}
        <div className="flex justify-between items-end shrink-0">
          <label className="font-bold text-purple-400">Consola del Profesor (Salida Esperada)</label>
          <span className="text-xs text-gray-500">Solo lectura - Refleja los mismos inputs</span>
        </div>
        
        {/* 3. Contenedor del componente */}
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