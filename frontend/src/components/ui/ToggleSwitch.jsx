import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/ToggleSwitch.css';

const ToggleSwitch = ({ label, subtitle, checked, onChange, disabled = false, className = '' }) => {
  return (
    <div className={`switch-wrapper ${disabled ? 'disabled' : ''} ${className}`}>
      {/* Solo renderizamos el texto si hay etiqueta */}
      {label && (
        <div className="switch-info">
          <span className="switch-title">{label}</span>
          {subtitle && <span className="switch-subtitle">{subtitle}</span>}
        </div>
      )}
      
      <label className="switch-control">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange} 
          disabled={disabled}
        />
        <span className="switch-slider"></span>
      </label>
    </div>
  );
};

ToggleSwitch.propTypes = {
  label: PropTypes.string, // Ya no es required pq a veces queremos solo el botón
  subtitle: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default ToggleSwitch;