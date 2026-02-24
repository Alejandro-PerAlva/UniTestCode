import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import API_URL from '../../../config/api'; 
import TestInputList from './TestInputList'; 

/**
 * ExerciseForm - Formulario para crear o editar ejercicios MIPS.
 * Maneja la construcción del objeto de configuración y el envío de FormData.
 */
const ExerciseForm = ({ onBack, editData, onSuccess }) => {
  const isEditing = !!editData;
  
  // --- ESTADO INICIAL ---
  const [form, setForm] = useState({
    title: '',
    description: '',
    functionName: '', 
    expectedOutput: ''
  });
  
  const [testInputs, setTestInputs] = useState([]); 
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, message: null });

  // --- EFECTOS ---
  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditing) {
      setForm({
        title: editData.title || '',
        description: editData.description || '',
        functionName: editData.config?.functionName || '',
        expectedOutput: editData.config?.expectedOutput || ''
      });
      setTestInputs(editData.config?.inputs || []);
    }
  }, [editData, isEditing]);

  // --- MANEJADORES ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: null });

    const session = JSON.parse(localStorage.getItem('mips_session') || '{}');
    const token = session?.token;

    // 1. Construcción del objeto de configuración JSON
    const configObject = {
      functionName: form.functionName.trim(),
      endLabel: `${form.functionName.trim()}_fin`, 
      timeout: 3000,
      inputs: testInputs,
      expectedOutput: form.expectedOutput.trim()
    };

    // 2. Construcción del FormData
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('config', JSON.stringify(configObject));
    
    if (file) {
      data.append('masterFile', file);
    }

    // 3. Envío a la API
    try {
      const targetId = editData?._id || editData?.id;
      const url = isEditing 
        ? `${API_URL}/exercises/${targetId}` 
        : `${API_URL}/exercises`;
      
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, { 
        method: method, 
        headers: { 'Authorization': `Bearer ${token}` },
        body: data 
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ 
          loading: false, 
          message: { type: 'success', text: isEditing ? "✅ Guardado correctamente" : "✅ Creado con éxito" } 
        });
        
        if (onSuccess) onSuccess();
        
        // Volver atrás automáticamente tras éxito
        setTimeout(() => onBack(), 1500);
      } else {
        throw new Error(result.message || "Error al guardar");
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        message: { type: 'error', text: `❌ ${err.message}` } 
      });
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="admin-card fade-in-up">
      {/* Cabecera del Formulario */}
      <div className="admin-header">
        <div>
          <h2>{isEditing ? '✏️ Edit Exercise' : '👨‍🏫 New MIPS Exercise'}</h2>
          <p className="subtitle">Configure los parámetros de trasplante y evaluación.</p>
        </div>
        <button onClick={onBack} className="cancel-btn">Cancelar</button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        
        {/* Sección: Información Básica */}
        <div className="form-group">
          <label htmlFor="title">Título del Ejercicio</label>
          <input 
            id="title"
            name="title" 
            type="text" 
            value={form.title} 
            onChange={handleInputChange} 
            placeholder="Ej: Suma de dos números"
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción / Enunciado</label>
          <textarea 
            id="description"
            name="description" 
            rows="3" 
            value={form.description} 
            onChange={handleInputChange} 
            placeholder="Instrucciones para el alumno..."
          />
        </div>

        {/* Sección: Configuración Técnica (2 Columnas) */}
        <div className="grid-2-col">
          <div className="form-group">
            <label htmlFor="functionName">Nombre de la función (Etiqueta)</label>
            <input 
              id="functionName"
              name="functionName" 
              type="text" 
              className="input-code"
              value={form.functionName} 
              onChange={handleInputChange} 
              placeholder="ej: multiplicar_por_dos"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expectedOutput">Salida esperada (Consola)</label>
            <input 
              id="expectedOutput"
              name="expectedOutput" 
              type="text" 
              className="input-code"
              value={form.expectedOutput} 
              onChange={handleInputChange} 
              placeholder="Valor que imprimirá el Maestro"
              required 
            />
          </div>
        </div>

        {/* Sección: Inputs Dinámicos */}
        <div className="form-group">
          <label>Argumentos de Prueba ($a0 - $a3)</label>
          <div className="test-input-list-container">
            <TestInputList inputs={testInputs} setInputs={setTestInputs} />
          </div>
        </div>

        {/* Sección: Archivo Maestro */}
        <div className="form-group file-section">
          <label>Archivo Maestro (.s) {isEditing && <span className="text-muted">(Opcional)</span>}</label>
          <input 
            type="file" 
            accept=".s,.asm" 
            onChange={e => setFile(e.target.files[0])} 
            id="admin-file" 
            style={{ display: 'none' }}
          />
          <label htmlFor="admin-file" className="file-upload-wrapper">
            {file ? (
              <span className="text-primary">📄 {file.name}</span>
            ) : (
              <span>📁 {isEditing ? 'Sustituir archivo maestro' : 'Seleccionar archivo .s'}</span>
            )}
          </label>
        </div>

        {/* Mensajes de Feedback */}
        {status.message && (
          <div className={`status-msg ${status.message.type}`}>
            {status.message.text}
          </div>
        )}

        {/* Botón de Acción */}
        <button type="submit" className="primary-btn submit-btn" disabled={status.loading}>
          {status.loading ? 'Procesando...' : '💾 GUARDAR CONFIGURACIÓN'}
        </button>
      </form>
    </div>
  );
};

ExerciseForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.shape({
      functionName: PropTypes.string,
      expectedOutput: PropTypes.string,
      inputs: PropTypes.array
    })
  }),
  onSuccess: PropTypes.func,
};

export default ExerciseForm;