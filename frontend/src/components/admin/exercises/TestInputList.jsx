import React from 'react';
import PropTypes from 'prop-types';

/**
 * TestInputList - Componente para gestionar una lista dinámica de argumentos de entrada ($a0, $a1...).
 * Permite añadir, editar y eliminar valores que se inyectarán en los registros MIPS.
 * * @param {Object} props
 * @param {string[]} props.inputs - Array de strings con los valores actuales.
 * @param {Function} props.setInputs - Función para actualizar el estado del array.
 */
const TestInputList = ({ inputs, setInputs }) => {
  
  const handleAdd = () => {
    // Limitamos a 4 argumentos ($a0 - $a3) por convención estándar MIPS
    if (inputs.length < 4) {
      setInputs([...inputs, ""]);
    }
  };
  
  const handleRemove = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  return (
    <div className="test-input-list-container">      
      <div className="args-container">
        {inputs.length === 0 && (
          <p className="empty-args-msg">No hay argumentos definidos (se ejecutarán con 0).</p>
        )}

        {inputs.map((input, index) => (
          <div key={index} className="dynamic-input-row">
            {/* Badge visual ($a0, $a1...) */}
            <div className="input-index-badge" title={`Registro $a${index}`}>
              $a{index}
            </div>
            
            <input 
              type="text" 
              value={input} 
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Valor entero para $a${index}`}
              className="code-input"
            />
            
            <button 
              type="button" 
              onClick={() => handleRemove(index)} 
              className="icon-btn-danger"
              title="Eliminar argumento"
              aria-label={`Eliminar argumento $a${index}`}
            >
              &times;
            </button>
          </div>
        ))}

        {inputs.length < 4 && (
          <button type="button" onClick={handleAdd} className="secondary-btn btn-sm">
            + Añadir Argumento ($a{inputs.length})
          </button>
        )}
      </div>
    </div>
  );
};

TestInputList.propTypes = {
  inputs: PropTypes.arrayOf(PropTypes.string).isRequired,
  setInputs: PropTypes.func.isRequired,
};

export default TestInputList;