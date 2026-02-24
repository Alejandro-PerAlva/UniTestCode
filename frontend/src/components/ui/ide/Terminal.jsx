import React from 'react';
import PropTypes from 'prop-types';

/**
 * Terminal - Muestra resultados de ejecución.
 * ACTUALIZADO: Mensajes detallados, estados de integridad y visualización de líneas de error.
 */
const Terminal = ({ loading, result, selectedExerciseId }) => {
  
  if (loading) {
    return (
      <div className="terminal-panel">
        <div className="terminal-label">SALIDA DE LA TERMINAL</div>
        <div className="terminal-content">
          <div className="loading-terminal">
            <div className="spinner"></div>
            <p>Evaluando código...</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper para determinar el estilo visual de la cabecera del resultado
  const getStatusInfo = (res) => {
    if (res.isIntegrityError) {
        return { 
            className: 'warning', 
            text: '⚠️ ERROR DE INTEGRIDAD', 
            msg: 'La arquitectura del procesador ha sido comprometida.' 
        };
    }
    if (res.passed) {
        return { 
            className: 'passed', 
            text: '✅ TEST PASADO', 
            msg: 'Tu solución es lógica y arquitecturalmente correcta.' 
        };
    }
    return { 
        className: 'failed', 
        text: '❌ TEST FALLIDO', 
        msg: 'El resultado obtenido no coincide con el esperado.' 
    };
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-label">SALIDA DE LA TERMINAL</div>
      <div className="terminal-content">
        {result ? (
          <div className="terminal-result-wrapper">
            
            {/* 1. RESUMEN DEL ESTADO */}
            <div className={`result-summary ${getStatusInfo(result).className}`}>
              <h4>{getStatusInfo(result).text}</h4>
              <p className="summary-detail">{getStatusInfo(result).msg}</p>
            </div>

            <div className="result-data">
              
              {/* 2. MENSAJE ESPECÍFICO DE INTEGRIDAD (PILA O REGISTROS) */}
              {result.isIntegrityError && (
                <div className="integrity-banner">
                    <p>{result.integrityMessage}</p>
                </div>
              )}

              {/* 3. COMPARATIVA DE SALIDA (Solo si no es error de integridad catastrófico) */}
              <div className="comparison-box">
                <p><strong>Salida obtenida:</strong> 
                    <span className={result.passed ? "green-text" : "red-text"}>
                        {` ${result.output}`}
                    </span>
                </p>
                
                {!result.passed && !result.isIntegrityError && result.expected && (
                    <p><strong>Salida esperada:</strong> <span className="green-text">{result.expected}</span></p>
                )}
              </div>

              {/* 4. SECCIÓN DETALLADA DE ERRORES / LÍNEAS CULPABLES */}
              {(result.guiltyInstructions?.length > 0) && (
                <div className="guilty-list-container">
                  <p className="guilty-title">Instrucciones que han provocado el fallo:</p>
                  
                  {result.guiltyInstructions.map((item, idx) => (
                    <div key={idx} className="guilty-instruction-card">
                      <div className="guilty-header">
                        <span className="guilty-label">LÍNEA {item.line || '??'}</span>
                        <span className="guilty-type">Violación de Integridad</span>
                      </div>
                      <div className="guilty-body">
                        <code>{item.instruction}</code>
                        {item.msg && <p className="guilty-error-msg">{item.msg}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <hr className="terminal-divider" />
              
              {/* 5. LOGS DEL SISTEMA */}
              <p className="logs-label">Registro de ejecución (Logs):</p>
              <pre className="terminal-logs">{result.logs || "No hay registros adicionales."}</pre>
            </div>
          </div>
        ) : (
          <div className="empty-terminal">
            {!selectedExerciseId 
              ? 'Esperando selección de ejercicio...' 
              : 'Escribe tu código y pulsa "EJECUTAR TEST" para ver los resultados.'}
          </div>
        )}
      </div>
    </div>
  );
};

Terminal.propTypes = {
  loading: PropTypes.bool.isRequired,
  result: PropTypes.object,
  selectedExerciseId: PropTypes.string,
};

export default Terminal;