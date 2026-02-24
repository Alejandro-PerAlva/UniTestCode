import React from 'react';
import PropTypes from 'prop-types';

/**
 * SolutionUploader - Componente que gestiona la selección del archivo .s y el botón de envío.
 * * @param {Object} props
 * @param {File|null} props.file - El archivo seleccionado actualmente.
 * @param {number} props.selectedCount - Cantidad de ejercicios seleccionados.
 * @param {boolean} props.loading - Estado de carga de la petición.
 * @param {Function} props.onFileChange - Manejador para el cambio de archivo.
 * @param {Function} props.onSubmit - Función para disparar la evaluación.
 * @returns {JSX.Element}
 */
const SolutionUploader = ({ 
  file, 
  selectedCount, 
  loading, 
  onFileChange, 
  onSubmit 
}) => {
  
  const isDisabled = selectedCount === 0;

  return (
    <div className="upload-section-refined">
      <div className="form-group">
        <label className="data-label">Archivo de Solución (.s)</label>
        
        <div className="file-upload-wrapper-ide">
          <input 
            type="file" 
            accept=".s,.asm" 
            onChange={onFileChange} 
            style={{ display: 'none' }} 
            id="file-upload" 
            disabled={isDisabled}
          />
          
          <label 
            htmlFor="file-upload" 
            className={`custom-file-label ${isDisabled ? 'label-disabled' : ''}`}
          >
            {isDisabled 
              ? '⚠️ Selecciona ejercicios arriba' 
              : (file ? `📄 ${file.name}` : '📁 Seleccionar archivo de solución')
            }
          </label>
        </div>
      </div>

      {/* El botón solo aparece si hay archivo y al menos un ejercicio seleccionado */}
      {file && !isDisabled && (
        <button 
          className="run-btn-full" 
          onClick={onSubmit} 
          disabled={loading}
        >
          {loading ? '⚙️ EVALUANDO...' : `🚀 COMPROBAR ${selectedCount} RETOS`}
        </button>
      )}
    </div>
  );
};

SolutionUploader.propTypes = {
  file: PropTypes.instanceOf(File),
  selectedCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SolutionUploader;