import React from 'react';
import PropTypes from 'prop-types';

/**
 * PreviewModal - Ventana emergente para visualizar el código MIPS procesado antes del envío.
 * * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal.
 * @param {string} props.code - Código MIPS final a mostrar.
 * @param {boolean} props.copied - Estado de feedback para el botón de copiado.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Function} props.onCopy - Función para copiar el código al portapapeles.
 */
const PreviewModal = ({ isOpen, code, copied, onClose, onCopy }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-container">
            <span className="modal-icon" role="img" aria-label="file">📄</span>
            <h3>Vista Previa de Inyección</h3>
          </div>
          <button className="close-x-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <pre className="code-preview-block">{code || 'No hay código procesado.'}</pre>
        </div>

        <div className="modal-footer">
          <button 
            onClick={onCopy} 
            className={`btn-copy-modal ${copied ? 'copied' : ''}`}
          >
            {copied ? '¡Copiado! ✅' : '📋 Copiar Código'}
          </button>
        </div>
      </div>
    </div>
  );
};

PreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  code: PropTypes.string,
  copied: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default PreviewModal;