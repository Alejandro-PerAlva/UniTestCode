import React from 'react';
import PropTypes from 'prop-types';

// AÑADIMOS 'id' AQUÍ PARA QUE SALGA EN EL PERFIL
const DEV_USERS = [
  { name: 'Super Admin', email: 'admin@mips.com', role: 'admin', avatar: '🛡️', id: 'DEV-ADMIN-001' },
  { name: 'Professor', email: 'profe@mips.com', role: 'teacher', avatar: '👨‍🏫', id: 'DEV-PROF-002' },
  { name: 'Student', email: 'student@mips.com', role: 'student', avatar: '👨‍💻', id: 'DEV-STUD-003' }
];

const DevQuickLogin = ({ onQuickLogin }) => {
  return (
    <div className="dev-access-section fade-in-up">
      <p className="dev-title">⚡ QUICK ACCESS (DEV MODE)</p>
      <div className="dev-users-grid">
        {DEV_USERS.map((item, idx) => (
          <div 
            key={idx} 
            className={`dev-user-card role-${item.role}`} 
            onClick={() => onQuickLogin(item)} // Pasará el objeto completo con ID
            role="button"
            tabIndex={0}
          >
            <span className="dev-avatar">{item.avatar}</span>
            <div className="dev-details">
              <span className="dev-name">{item.name}</span>
              <span className="dev-role">Enter as {item.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

DevQuickLogin.propTypes = {
  onQuickLogin: PropTypes.func.isRequired,
};

export default DevQuickLogin;