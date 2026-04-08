import React from 'react';
import { Save, FileCode, ArrowLeft } from 'lucide-react';
import { useExerciseFormLogic } from '../../hooks/admin/useExerciseFormLogic';
import type { Exercise } from '../../types';

interface ExerciseFormProps {
  exercise: Exercise | null;
  onBack: () => void;
  onSaved: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise, onBack, onSaved }) => {
  const { title, setTitle, description, setDescription, teacherCode, fileName, isVisible, setIsVisible, handleFileChange, handleCreateOrUpdate } = useExerciseFormLogic(exercise, onSaved);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 self-start">
        <ArrowLeft size={20} /> Volver al gestor
      </button>
      
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">
          {exercise ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black border border-gray-700 rounded p-3 text-white h-32 focus:border-blue-500 outline-none" />
          </div>
          <div className="flex items-center gap-3 bg-black p-4 rounded border border-gray-800">
            <input type="checkbox" id="visibilityToggle" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="w-5 h-5 accent-blue-600" />
            <label htmlFor="visibilityToggle" className="text-sm font-bold text-gray-300 cursor-pointer">Visible para los alumnos</label>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Código MIPS (.s)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-md cursor-pointer hover:bg-gray-800 transition-colors bg-black">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileCode className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">{fileName ? <span className="text-blue-400 font-bold">{fileName}</span> : "Seleccionar archivo"}</p>
              </div>
              <input type="file" className="hidden" accept=".s,.asm,.txt" onChange={handleFileChange} />
            </label>
          </div>
          <button onClick={handleCreateOrUpdate} disabled={!title || !description || !teacherCode} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold flex justify-center items-center gap-2 disabled:opacity-50">
            <Save size={20} /> {exercise ? 'Actualizar Ejercicio' : 'Guardar Ejercicio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseForm;