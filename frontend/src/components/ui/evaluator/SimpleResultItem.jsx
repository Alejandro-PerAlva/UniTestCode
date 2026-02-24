import React from 'react';
import PropTypes from 'prop-types';

const SimpleResultItem = ({ name, status }) => {
  const configMap = {
    passed: { label: 'PASSED', icon: '✅', className: 'passed' },
    failed: { label: 'FAILED', icon: '❌', className: 'failed' },
    warning: { label: 'INTEGRITY', icon: '⚠️', className: 'warning' }
  };

  const config = configMap[status] || configMap.failed;

  return (
    <div className={`simple-result-item ${config.className}`}>
      <span className="exercise-name-label">{name}</span>
      <div className="status-badge">
        <span>{config.label}</span>
        <span className="status-icon">{config.icon}</span>
      </div>
    </div>
  );
};

SimpleResultItem.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['passed', 'failed', 'warning']).isRequired,
};

export default SimpleResultItem;