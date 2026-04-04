import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Upload, HelpCircle, Terminal, PlayCircle } from 'lucide-react';
import { getUser } from '../services/auth';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  
  const userRoleText = user?.role === 'teacher' ? 'Profesor' : 'Alumno';

  return (
    <div className="h-full w-full bg-gray-950 text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        <div className="flex flex-col items-center text-center gap-6 mt-8">
          <div className="bg-blue-900/30 p-4 rounded-full border border-blue-800/50">
            <Code2 size={48} className="text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Bienvenido a <span className="text-blue-500">UnitTestCode</span>, {userRoleText}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            La plataforma definitiva para escribir, depurar y evaluar tu código ensamblador MIPS en tiempo real. 
            Elige una herramienta a continuación para empezar a trabajar.
          </p>
        </div>

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
              onClick={() => navigate('/ide')}
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
              onClick={() => navigate('/submit')}
              className="w-full bg-gray-800 hover:bg-purple-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors border border-gray-700 hover:border-purple-500"
            >
              <Upload size={20} /> Ir al Evaluador
            </button>
          </div>
        </div>

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

      </div>
    </div>
  );
};

export default HomePage;