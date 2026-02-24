import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Editor, { loader } from '@monaco-editor/react';

// Configuración del tema oscuro personalizado para MIPS
const defineMipsTheme = (monaco) => {
  monaco.editor.defineTheme('mips-dark-contrast', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'variable.predefined', foreground: '9CDCFE' },
      { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: 'DCDCAA' },
      { token: 'number', foreground: 'B5CEA8' }
    ],
    colors: { 
      'editor.background': '#1e293b', 
      'editor.lineHighlightBackground': '#334155',
      'editor.selectionBackground': '#475569',
      'editorCursor.foreground': '#38bdf8',
      'editorIndentGuide.background': '#334155'
    }
  });
};

// Inicializamos el loader una sola vez fuera del ciclo de renderizado
loader.init().then((monaco) => {
  defineMipsTheme(monaco);
});

const CodeEditor = ({ 
  code, 
  onChange, 
  onExecute, 
  onDownload, 
  onPreview, 
  isLoading, 
  hasSelection 
}) => {
  const [editorTheme, setEditorTheme] = useState('mips-dark-contrast');

  // Detectar tema del sistema/navegador (Light/Dark)
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      // Si usas modo claro globalmente, cambia a 'vs', si no usa nuestro tema oscuro
      setEditorTheme(currentTheme === 'light' ? 'vs' : 'mips-dark-contrast');
    };

    // Observer para cambios dinámicos de tema
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['data-theme'] 
    });

    // Set inicial
    updateTheme();

    return () => observer.disconnect();
  }, []);

  // Registro del lenguaje MIPS en Monaco
  const handleEditorWillMount = (monaco) => {
    if (!monaco.languages.getLanguages().some(l => l.id === 'mips')) {
      monaco.languages.register({ id: 'mips' });
      monaco.languages.setMonarchTokensProvider('mips', {
        tokenizer: {
          root: [
            [/#.*/, "comment"],
            [/\$[a-z0-9]+/, "variable.predefined"],
            [/[a-zA-Z_]\w*:/, "type.identifier"],
            [/\b(add|addu|addi|addiu|sub|subu|and|andi|or|ori|xor|xori|nor|sll|srl|sra|sllv|srlv|srav|slt|slti|sltu|sltiu|beq|bne|blez|bgtz|bltz|bgez|j|jal|jr|jalr|lb|lbu|lh|lhu|lw|sb|sh|sw|mfhi|mflo|mthi|mtlo|move|li|la|syscall|mul|div)\b/, "keyword"],
            [/\b\d+\b/, "number"],
          ]
        }
      });
    }
  };

  return (
    <div className="editor-panel">
      <div className="card-header">
        <span className="card-dot red"></span>
        <span className="card-dot yellow"></span>
        <span className="card-dot green"></span>
        <span className="card-title">editor.s</span>
      </div>
      
      <div className="editor-wrapper">
        <Editor
          key={editorTheme}
          height="100%" 
          language="mips" 
          theme={editorTheme}
          value={code}
          onChange={onChange}
          onMount={(editor, monaco) => handleEditorWillMount(monaco)}
          options={{ 
            minimap: { enabled: false }, 
            fontSize: 15, 
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontFamily: "'JetBrains Mono', monospace"
          }}
        />
      </div>

      <div className="editor-actions">
        <div className="btn-group">
          <button 
            onClick={onExecute} 
            className="primary-btn" 
            disabled={isLoading || !hasSelection}
          >
            {isLoading ? '⚙️ EVALUANDO...' : '▶️ EJECUTAR TEST'}
          </button>
          
          <button 
            onClick={onPreview} 
            className="btn-preview" 
            disabled={!hasSelection}
          >
            👁️ PREVIEW
          </button>
        </div>
        
        <button 
          onClick={onDownload} 
          className="btn-download" 
          disabled={!hasSelection}
        >
          📥 DOWNLOAD .S
        </button>
      </div>
    </div>
  );
};

CodeEditor.propTypes = {
  code: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onExecute: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasSelection: PropTypes.bool.isRequired, // Para deshabilitar botones si no hay ejercicio
};

export default CodeEditor;