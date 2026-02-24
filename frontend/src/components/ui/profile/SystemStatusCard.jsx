import React from 'react';
import PropTypes from 'prop-types';

const SystemStatusCard = ({ status }) => {
  
  const getStatusInfo = () => {
    switch (status) {
      case 'online':
        return { text: 'Operacional - En línea', colorClass: 'online' };
      case 'offline':
        return { text: 'Servidor fuera de servicio', colorClass: 'offline' };
      default:
        return { text: 'Verificando servicio...', colorClass: 'checking' };
    }
  };

  const info = getStatusInfo();

  return (
    <div className="profile-card stats-card">
      <h3>Estado del Sistema</h3>
      <div className="info-item">
        <label className="data-label">Conectividad Backend</label>
        <div className="status-indicator-box">
          <span className={`status-dot ${info.colorClass}`}></span>
          <p className={`status-text ${info.colorClass}`}>
            {info.text}
          </p>
        </div>
      </div>
    </div>
  );
};

SystemStatusCard.propTypes = {
  status: PropTypes.oneOf(['online', 'offline', 'checking']).isRequired,
};

export default SystemStatusCard;