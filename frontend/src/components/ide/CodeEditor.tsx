import React from 'react';
import { Download } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type { Exercise } from '../../types';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  selectedExercise: Exercise | null;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, selectedExercise }) => {
  const handleDownloadCode = () => {
    if (!code || !selectedExercise) return;
    const safeFilename = selectedExercise.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilename}.s`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-1/3 flex flex-col gap-2 min-h-0">
      <div className="flex justify-between items-end">
        <label className="font-bold text-blue-400 flex items-center justify-between">
          Tu Código MIPS
        </label>
        <button 
          onClick={handleDownloadCode}
          disabled={!selectedExercise || !code}
          title="Descargar código como archivo .s"
          className="text-xs flex items-center gap-1.5 bg-blue-900/50 hover:bg-blue-600 border border-blue-800 text-blue-300 hover:text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          <Download size={14} /> Descargar Solución
        </button>
      </div>
      <div className="flex-1 rounded-lg overflow-hidden border border-gray-800 shadow-inner">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            lineNumbersMinChars: 3,
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;