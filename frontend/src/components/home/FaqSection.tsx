import React from 'react';
import { HelpCircle } from 'lucide-react';

const FaqSection: React.FC = () => {
  return (
    <div className="mt-12 mb-8 bg-gray-900/50 border border-gray-800 rounded-xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle size={28} className="text-gray-400" />
        <h2 className="text-2xl font-bold">Preguntas Frecuentes</h2>
      </div>
      
      <div className="grid gap-6">
        <div>
          <h3 className="font-bold text-lg text-blue-400 mb-2">¿Cómo funciona el autoguardado del IDE?</h3>
          <p className="text-gray-400 text-sm">Tu código se guarda automáticamente en la memoria temporal de tu navegador mientras mantengas la sesión iniciada. Si cierras la sesión o cambias de ordenador, el editor se vaciará por seguridad.</p>
        </div>
        <div className="h-px bg-gray-800 w-full"></div>
        <div>
          <h3 className="font-bold text-lg text-blue-400 mb-2">¿Qué pasa si mi código contiene un bucle infinito?</h3>
          <p className="text-gray-400 text-sm">El Evaluador y el IDE cuentan con un sistema de tiempo límite (Timeout). Si tu programa tarda más de lo normal en finalizar, el servidor lo detendrá automáticamente y te devolverá un error de ejecución.</p>
        </div>
        <div className="h-px bg-gray-800 w-full"></div>
        <div>
          <h3 className="font-bold text-lg text-blue-400 mb-2">¿Por qué fallan los tests si mi código funciona en MARS?</h3>
          <p className="text-gray-400 text-sm">Asegúrate de que estás leyendo las entradas y formateando las salidas exactamente como lo pide el enunciado. El evaluador compara textos exactos; espacios adicionales o saltos de línea extra pueden hacer que un test falle.</p>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;