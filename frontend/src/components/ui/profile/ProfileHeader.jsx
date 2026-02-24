import React from 'react';
import PropTypes from 'prop-types';

const ProfileHeader = ({ user }) => {
  // Obtener inicial o usar 'U' por defecto
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const roleName = user?.role === 'teacher' ? 'Profesor' : (user?.role === 'admin' ? 'Administrador' : 'Estudiante');

  return (
    <div className="profile-header">
      <div className="profile-avatar">
        {initial}
      </div>
      <div className="profile-intro">
        <h1>{user?.name || 'Usuario Invitado'}</h1>
        <span className={`badge role-${user?.role || 'guest'}`}>
          {roleName}
        </span>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default ProfileHeader;