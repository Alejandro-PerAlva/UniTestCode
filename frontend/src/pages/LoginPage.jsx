import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import API_URL from '../config/api';

// Subcomponentes
import LoginForm from '../components/auth/LoginForm';
import DevQuickLogin from '../components/auth/DevQuickLogin';

// Estilos
import '../styles/pages/LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: false, error: null });

  // Sincronización del tema para asegurar estética correcta en login
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  /**
   * Maneja el login real contra el backend
   */
  const handleLoginSubmit = async (formData) => {
    setStatus({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Credenciales inválidas');

      // Éxito: Guardar sesión y redirigir
      // El objeto data.user debe venir del backend con su _id
      onLogin(data.user);
      navigate('/dashboard');

    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  /**
   * Maneja el login rápido de desarrollo
   * Corrección: Pasamos el objeto 'quickUser' entero, que ahora incluye el ID.
   */
  const handleQuickLogin = (quickUser) => {
    onLogin(quickUser);
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card fade-in-up">
        <h1 className="login-title">MIPS Studio</h1>
        <p className="login-subtitle">Acceso seguro para personal autorizado</p>

        <LoginForm 
          onSubmit={handleLoginSubmit} 
          isLoading={status.loading} 
          error={status.error} 
        />

        <p className="login-footer">
          Si no tienes cuenta, contacta con el administrador del sistema.
        </p>
      </div>

      {/* Sección de Desarrollo (Separada visualmente) */}
      <DevQuickLogin onQuickLogin={handleQuickLogin} />
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;