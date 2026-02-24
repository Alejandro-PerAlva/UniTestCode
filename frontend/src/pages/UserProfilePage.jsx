import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import API_URL from '../config/api';

// Subcomponentes
import ProfileHeader from '../components/ui/profile/ProfileHeader';
import SystemStatusCard from '../components/ui/profile/SystemStatusCard';

// Estilos
import '../styles/pages/UserProfile.css';

const UserProfilePage = ({ user }) => {
  const [backendStatus, setBackendStatus] = useState('checking');

  // Intentamos todas las variantes posibles de ID
  const userId = user?.id || user?._id || user?.userId || user?.sub || '---';

  useEffect(() => {
    // Debug en consola para que veas qué llega exactamente
    console.log("Datos del usuario en Perfil:", user);

    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/exercises`, { method: 'GET' });
        if (res.status === 200 || res.status === 401) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="profile-container fade-in-up">
      <ProfileHeader user={user} />

      <div className="profile-grid">
        <div className="profile-card info-card">
          <h3>Datos de la Cuenta</h3>
          
          <div className="info-item">
            <label className="data-label">Email Institucional</label>
            <p className="info-value">
              {user?.email || 'No disponible'}
            </p>
          </div>

          <div className="info-item">
            <label className="data-label">ID de Usuario</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <p className="info-value code-font">
                {userId}
              </p>
              {userId === '---' && (
                <small style={{ color: 'orange', fontSize: '0.7rem' }}>
                  ID no encontrado. Revisa la consola (F12) o reloguea.
                </small>
              )}
            </div>
          </div>
        </div>

        <SystemStatusCard status={backendStatus} />
      </div>
    </div>
  );
};

UserProfilePage.propTypes = {
  user: PropTypes.object
};

export default UserProfilePage;