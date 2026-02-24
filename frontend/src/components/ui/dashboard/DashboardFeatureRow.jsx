import React from 'react';
import PropTypes from 'prop-types';

const DashboardFeatureRow = ({ 
  title, 
  icon, 
  label, 
  guideTitle, 
  guideItems, 
  onNavigate, 
  reverse = false 
}) => {
  return (
    <div className={`zigzag-row ${reverse ? 'reverse' : ''}`}>
      {/* Lado del Botón (Acción) */}
      <div 
        className="side-button-container"
        onClick={onNavigate}
        role="button"
        tabIndex={0}
      >
        <div className="access-card">
          <div className="access-icon">{icon}</div>
          <h3>{title}</h3>
          <span className="access-label">{label}</span>
        </div>
      </div>

      {/* Lado de la Guía (Información) */}
      <div className="side-guide-container">
        <div className="guide-box">
          <h4>{guideTitle}</h4>
          <ul className={reverse ? "guide-list-right" : "guide-list-left"}>
            {guideItems.map((item, idx) => (
              <li key={idx}>
                <strong>{item.strong}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

DashboardFeatureRow.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  guideTitle: PropTypes.string.isRequired,
  guideItems: PropTypes.arrayOf(PropTypes.shape({
    strong: PropTypes.string,
    text: PropTypes.node // node permite JSX (como <code>)
  })).isRequired,
  onNavigate: PropTypes.func.isRequired,
  reverse: PropTypes.bool
};

export default DashboardFeatureRow;