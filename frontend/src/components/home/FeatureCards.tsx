/**
 * @module FeatureCards
 * Presentation component displaying primary navigation action cards on the home dashboard.
 */

import React from 'react';
import { Terminal, Upload, PlayCircle } from 'lucide-react';

/**
 * Props for the FeatureCards component.
 */
export interface FeatureCardsProps {
  /** Callback triggered when the user opts to navigate to the Web IDE view. */
  onNavigateIde: () => void;
  /** Callback triggered when the user opts to navigate to the Multi-Evaluator view. */
  onNavigateSubmit: () => void;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ onNavigateIde, onNavigateSubmit }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-colors group flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-900/50 p-3 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
            <Terminal size={28} />
          </div>
          <h2 className="text-2xl font-bold">Web IDE & Duelo</h2>
        </div>
        <p className="text-gray-400 mb-6 flex-1">
          Escribe tu código ensamblador con autoguardado en el navegador. Utiliza la consola interactiva para introducir datos y ver resultados línea a línea. 
          <br/><br/>
          ¿Te atreves? Activa el <strong className="text-blue-400">Modo Duelo</strong> para ejecutar tu código simultáneamente contra la solución del profesor y comparar las salidas en tiempo real.
        </p>
        <button 
          onClick={onNavigateIde}
          className="w-full bg-gray-800 hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors border border-gray-700 hover:border-blue-500"
        >
          <PlayCircle size={20} /> Abrir Web IDE
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-purple-500/50 transition-colors group flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-900/50 p-3 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
            <Upload size={28} />
          </div>
          <h2 className="text-2xl font-bold">Multi-Evaluador</h2>
        </div>
        <p className="text-gray-400 mb-6 flex-1">
          ¿Has terminado tu ejercicio y quieres comprobar tu nota? Sube tu archivo <code className="bg-black px-1 py-0.5 rounded text-gray-300">.s</code> directamente al evaluador automático.
          <br/><br/>
          El sistema someterá tu código a una batería de tests ocultos y te mostrará un panel detallado con los resultados, casos superados y posibles errores de ejecución.
        </p>
        <button 
          onClick={onNavigateSubmit}
          className="w-full bg-gray-800 hover:bg-purple-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors border border-gray-700 hover:border-purple-500"
        >
          <Upload size={20} /> Ir al Evaluador
        </button>
      </div>
    </div>
  );
};

export default FeatureCards;