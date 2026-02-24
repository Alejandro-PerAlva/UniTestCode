import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import API_URL from '../../../config/api';

/**
 * UserForm - Formulario para crear o editar usuarios (Alumnos/Profesores).
 * Se integra dentro de AdminUsersPage.
 */
const UserForm = ({ onBack, editData }) => {
  const isEditing = !!editData;
  
  // --- ESTADO ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Siempre vacía inicialmente por seguridad
    role: 'student'
  });
  
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [loading, setLoading] = useState(false);

  // --- EFECTO: Cargar datos al editar ---
  useEffect(() => {
    if (isEditing && editData) {
      setFormData({
        name: editData.name || '',
        email: editData.email || '',
        password: '', // No rellenamos la contraseña
        role: editData.role || 'student'
      });
    }
  }, [isEditing, editData]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ msg: '', type: '' });

    // Obtención segura del token
    let token = null;
    try {
      const session = JSON.parse(localStorage.getItem('mips_session'));
      token = session?.token;
    } catch (err) {
      console.error("Error de sesión", err);
    }

    const url = isEditing 
      ? `${API_URL}/admin/users/${editData.id || editData._id}` 
      : `${API_URL}/admin/users`;
      
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (res.ok) {
        setStatus({ 
          msg: isEditing ? '✅ Usuario actualizado correctamente' : '✅ Usuario creado con éxito', 
          type: 'success' 
        });
        // Volver atrás y refrescar lista
        setTimeout(() => onBack(true), 1500); 
      } else {
        setStatus({ msg: `❌ ${data.message || 'Error en la solicitud'}`, type: 'error' });
      }
    } catch (error) {
      setStatus({ msg: '❌ Error de conexión con el servidor', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card fade-in-up">
      {/* Cabecera integrada en el card (opcional, ya que el padre tiene cabecera, 
          pero útil si queremos título específico del formulario) */}
      <div className="admin-header" style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
        <div>
          <h2>{isEditing ? '✏️ Editar Usuario' : '👤 Nuevo Usuario'}</h2>
          <p className="subtitle">Complete los datos de acceso y perfil.</p>
        </div>
        <button className="cancel-btn" onClick={() => onBack(false)}>Cancelar</button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        
        {/* Fila 1: Nombre y Rol */}
        <div className="grid-2-col">
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input 
              id="name"
              name="name"
              type="text" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="Ej: Ana García"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol del Sistema</label>
            <select 
              id="role"
              name="role"
              value={formData.role} 
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            >
              <option value="student">👨‍🎓 Estudiante</option>
              <option value="teacher">🎓 Profesor</option>
            </select>
          </div>
        </div>

        {/* Fila 2: Email y Password */}
        <div className="grid-2-col">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              id="email"
              name="email"
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="usuario@universidad.edu"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña {isEditing && <span className="text-muted" style={{fontSize:'0.75em'}}>(Dejar vacía para mantener)</span>}
            </label>
            <input 
              id="password"
              name="password"
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              required={!isEditing} 
              placeholder={isEditing ? "••••••••" : "Mín. 6 caracteres"}
            />
          </div>
        </div>

        {/* Mensajes de Estado */}
        {status.msg && (
          <div className={`status-msg ${status.type}`}>
            {status.msg}
          </div>
        )}

        {/* Botón de Acción */}
        <button type="submit" className="primary-btn submit-btn" disabled={loading}>
          {loading ? 'Guardando...' : (isEditing ? '💾 ACTUALIZAR DATOS' : '💾 CREAR CUENTA')}
        </button>
      </form>
    </div>
  );
};

UserForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  })
};

export default UserForm;