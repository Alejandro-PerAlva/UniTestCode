import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';

// Subcomponentes UI refactorizados
import CodeEditor from '../components/ui/ide/CodeEditor';
import Terminal from '../components/ui/ide/Terminal';
import PreviewModal from '../components/ui/ide/PreviewModal';

// Estilos específicos de la página
import '../styles/pages/IDE.css';

/**
 * IDEPage - Vista principal del entorno de desarrollo MIPS.
 * ACTUALIZADO: Detecta errores de integridad (-1, -2) y captura instrucciones culpables.
 */
const IDEPage = () => {
  // --- ESTADOS ---
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [code, setCode] = useState("\n# Escribe aquí solo la lógica de tu función.\n# No es necesario añadir la etiqueta del nombre ni la etiqueta de fin.\n\n\t");
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados del Modal
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false); 

  // --- CARGA INICIAL ---
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const session = JSON.parse(localStorage.getItem('mips_session') || '{}');
    const token = session?.token;
    try {
      const res = await fetch(`${API_URL}/exercises`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const rawList = data.data || data;
      // Solo mostramos ejercicios visibles
      const visibleExercises = (Array.isArray(rawList) ? rawList : []).filter(ex => 
        ex.visible !== false && ex.visible !== "false"
      );
      setExercises(visibleExercises);
    } catch (err) {
      console.error("Failed to load exercises:", err);
    }
  };

  // --- LÓGICA DE NEGOCIO ---

  /**
   * Genera el código final concatenando etiquetas del ejercicio.
   */
  const getProcessedCode = () => {
    if (!selectedExerciseId) return null;
    const exercise = exercises.find(e => String(e.id) === String(selectedExerciseId));
    if (!exercise) return null;
    
    const funcName = exercise.config?.functionName || 'my_func';
    const endLabel = exercise.config?.endLabel || `${funcName}_fin`;
    
    // Limpiamos etiquetas duplicadas que el alumno pueda haber escrito
    const cleanCode = code.split('\n')
      .filter(line => !line.trim().toLowerCase().startsWith(`${funcName.toLowerCase()}:`))
      .filter(line => !line.trim().toLowerCase().startsWith(`${endLabel.toLowerCase()}:`))
      .join('\n');
      
    return `${funcName}:\n${cleanCode}\n\n${endLabel}:\n`;
  };

  /**
   * Copia el código procesado al portapapeles.
   */
  const handleCopyCode = () => {
    const fullCode = getProcessedCode();
    if (!fullCode) return;
    navigator.clipboard.writeText(fullCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /**
   * Procesa la respuesta para enriquecerla con información de integridad.
   */
  const processResult = (data) => {
    const output = String(data.output || '').trim();
    
    // Objeto base enriquecido
    let enhancedData = { ...data };

    // 1. Detección de Integridad por Código de Salida (-1, -2)
    if (output === "-1") {
        enhancedData.passed = false;
        enhancedData.isIntegrityError = true;
        enhancedData.integrityMessage = "⚠️ Error de Integridad: Registros Preservados ($s0-$s7) modificados sin restaurar.";
        // Si el backend no envió "guiltyInstructions" explícitas, podemos intentar inferirlas o dejar el mensaje genérico
    } else if (output === "-2") {
        enhancedData.passed = false;
        enhancedData.isIntegrityError = true;
        enhancedData.integrityMessage = "⚠️ Error de Pila: Memory Leak detectado (Stack Pointer $sp desbalanceada).";
    }

    // 2. Si el backend ya envía guiltyInstructions (aunque sea output normal), nos aseguramos de marcarlas
    // Esto es útil si tu backend evoluciona y envía alertas sin usar códigos -1/-2
    if (data.guiltyInstructions && data.guiltyInstructions.length > 0) {
        enhancedData.isIntegrityError = true;
        if (!enhancedData.integrityMessage) {
             enhancedData.integrityMessage = "⚠️ Se han detectado instrucciones no permitidas o peligrosas.";
        }
    }

    return enhancedData;
  };

  /**
   * Envía el código al backend para su ejecución.
   */
  const handleRunExecution = async () => {
    const finalCode = getProcessedCode();
    if (!finalCode) return;
    
    setLoading(true);
    setResult(null);
    
    const session = JSON.parse(localStorage.getItem('mips_session') || '{}');
    const token = session?.token;
    
    try {
      const blob = new Blob([finalCode], { type: 'text/plain' });
      const file = new File([blob], `ide_solution.s`, { type: "text/plain" });
      const formData = new FormData();
      formData.append('code', file); 
      formData.append('exerciseId', String(selectedExerciseId));

      const res = await fetch(`${API_URL}/evaluador/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      
      // PROCESAMOS EL RESULTADO ANTES DE GUARDARLO
      const processedData = processResult(data);
      setResult(processedData);

    } catch (err) {
      setResult({ passed: false, output: "Error de conexión", logs: err.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Descarga el código procesado como archivo .s
   */
  const handleDownload = () => {
    const finalCode = getProcessedCode();
    if (!finalCode) return;
    const blob = new Blob([finalCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solution_${selectedExerciseId}.s`;
    link.click();
  };

  // --- RENDERIZADO ---

  return (
    <div className="ide-container fade-in-up">
      {/* Modal de Vista Previa */}
      <PreviewModal 
        isOpen={showPreview}
        code={getProcessedCode()}
        copied={copied}
        onClose={() => setShowPreview(false)}
        onCopy={handleCopyCode}
      />

      {/* Cabecera y Selector */}
      <div className="ide-header">
        <div>
          <h2>💻 Web IDE</h2>
          <p className="subtitle">Escribe tu lógica MIPS y pruébala en tiempo real.</p>
        </div>
        <select 
          className="select-exercise" 
          value={selectedExerciseId} 
          onChange={e => setSelectedExerciseId(e.target.value)}
        >
          <option value="">-- Selecciona ejercicio --</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.title || ex.titulo}</option>
          ))}
        </select>
      </div>

      <div className="ide-grid">
        {/* Panel Izquierdo: Editor */}
        <CodeEditor 
          code={code}
          onChange={setCode}
          onExecute={handleRunExecution}
          onDownload={handleDownload}
          onPreview={() => setShowPreview(true)}
          isLoading={loading}
          hasSelection={!!selectedExerciseId}
        />

        {/* Panel Derecho: Terminal */}
        <Terminal 
          loading={loading}
          result={result} // Pasamos el resultado procesado
          selectedExerciseId={selectedExerciseId}
        />
      </div>
    </div>
  );
};

export default IDEPage;