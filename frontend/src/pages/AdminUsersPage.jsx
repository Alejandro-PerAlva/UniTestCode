import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';

// Subcomponentes
import UserTable from '../components/admin/users/UserTable';
import UserForm from '../components/admin/users/UserForm';

// Estilos
import '../styles/pages/AdminUsers.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [filter, setFilter] = useState('student'); // 'student' | 'teacher'
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // --- Helpers de Sesión ---
  const getValidToken = () => {
    try {
      const sessionStr = localStorage.getItem('mips_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      return session?.token || session?.userData?.token || localStorage.getItem('token');
    } catch (e) {
      console.error("Error leyendo sesión:", e);
      return null;
    }
  };

  // --- Operaciones de Datos (DEBUG MODE) ---
  const fetchUsers = async () => {
    const token = getValidToken();
    if (!token) {
      console.warn("⚠️ No hay token disponible.");
      return;
    }

    setLoading(true);
    try {
      console.log(`📡 Pidiendo usuarios a: ${API_URL}/admin/users`);
      
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const responseData = await res.json();
      console.log("📦 Respuesta del Backend:", responseData);

      // ESTRATEGIA DEFENSIVA DE EXTRACCIÓN DE DATOS
      let usersArray = [];

      if (Array.isArray(responseData)) {
        // Caso 1: El backend devuelve directamente [ ... ]
        usersArray = responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        // Caso 2: El backend devuelve { success: true, data: [ ... ] }
        usersArray = responseData.data;
      } else if (responseData.users && Array.isArray(responseData.users)) {
        // Caso 3: El backend devuelve { users: [ ... ] }
        usersArray = responseData.users;
      } else {
        console.warn("⚠️ Estructura de datos desconocida. Revisa la consola.");
      }

      console.log("✅ Usuarios procesados en frontend:", usersArray);
      setUsers(usersArray);

    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    const targetId = user.id || user._id;
    if (!window.confirm(`¿Seguro que quieres eliminar a ${user.name}?`)) return;

    const token = getValidToken();
    try {
      const res = await fetch(`${API_URL}/admin/users/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => (u.id !== targetId && u._id !== targetId)));
      } else {
        alert("Error al eliminar usuario.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- Navegación ---
  const handleEdit = (user) => {
    setEditingUser(user);
    setView('form');
  };

  const handleCreate = () => {
    setEditingUser(null);
    setView('form');
  };

  const handleBack = (shouldRefresh = false) => {
    setView('list');
    setEditingUser(null);
    if (shouldRefresh === true) {
      fetchUsers();
    }
  };

  // --- FILTRADO ROBUSTO ---
  // Convertimos a minúsculas ambos lados para evitar errores de casing (Student vs student)
  const filteredUsers = users.filter(u => {
    const userRole = (u.role || '').toLowerCase();
    return userRole === filter.toLowerCase();
  });

  // --- Renderizado ---

  if (view === 'form') {
    return (
      <div className="mgmt-container">
        <UserForm editData={editingUser} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="mgmt-container fade-in-up">
      <div className="mgmt-card">
        <div className="mgmt-header">
          <div>
            <h2>👥 Gestión de Usuarios</h2>
            <p className="subtitle">
              Total {filter === 'student' ? 'Alumnos' : 'Profesores'}: {filteredUsers.length} 
              <span style={{fontSize:'0.8em', marginLeft:'10px', opacity: 0.7}}>
                (De {users.length} totales)
              </span>
            </p>
          </div>
          <button className="primary-btn" onClick={handleCreate}>
            + Nuevo Usuario
          </button>
        </div>

        <div className="tabs-container">
          <button 
            className={`tab ${filter === 'student' ? 'active' : ''}`} 
            onClick={() => setFilter('student')}
          >
            Alumnos
          </button>
          <button 
            className={`tab ${filter === 'teacher' ? 'active' : ''}`} 
            onClick={() => setFilter('teacher')}
          >
            Profesores
          </button>
        </div>

        {loading ? (
          <div className="empty-state-container" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{color: 'var(--text-muted)'}}>Cargando usuarios...</p>
          </div>
        ) : (
          <UserTable 
            users={filteredUsers}
            filterRole={filter}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;