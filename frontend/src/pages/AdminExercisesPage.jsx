import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';

// Subcomponentes
import ExerciseTable from '../components/admin/exercises/ExerciseTable';
import ExerciseForm from '../components/admin/exercises/ExerciseForm';

// Estilos
import '../styles/pages/AdminExercises.css';

/**
 * AdminExercisesPage - Controlador principal para la gestión de ejercicios.
 * Maneja el estado de la vista (lista vs formulario) y las operaciones CRUD principales.
 */
const AdminExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Helpers de Sesión (CORREGIDO) ---
  const getValidToken = () => {
    try {
      const sessionStr = localStorage.getItem('mips_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      // Buscamos el token en todas las ubicaciones posibles según tu código original
      return session?.token || session?.userData?.token || localStorage.getItem('token');
    } catch (e) {
      console.error("Error al leer la sesión:", e);
      return null;
    }
  };

  // --- Operaciones de Datos ---
  const fetchExercises = async () => {
    const token = getValidToken();
    
    if (!token) {
      console.warn("AdminExercises: No se encontró token de autenticación.");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Cargando ejercicios desde:", `${API_URL}/exercises`);
      
      const res = await fetch(`${API_URL}/exercises`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
      }

      const rawResponse = await res.json();
      // Soporte para respuestas { data: [...] } o directamente [...]
      const data = rawResponse.data || rawResponse;

      if (Array.isArray(data)) {
        console.log(`Ejercicios cargados: ${data.length}`);
        setExercises(data);
      } else {
        console.error("Formato de respuesta inesperado (se esperaba un array):", data);
        setExercises([]);
      }
    } catch (error) { 
      console.error("Error fetching exercises:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleToggleVisibility = async (ex) => {
    const token = getValidToken();
    const targetId = ex._id || ex.id; 
    const isVisible = ex.visible === true || ex.visible === "true";
    
    // Actualización optimista (UI primero para sensación de rapidez)
    const originalExercises = [...exercises];
    setExercises(prev => prev.map(item => 
      (item._id === targetId || item.id === targetId) ? { ...item, visible: !isVisible } : item
    ));

    try {
      const res = await fetch(`${API_URL}/exercises/${targetId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ visible: !isVisible })
      });
      
      if (!res.ok) throw new Error("Fallo al actualizar visibilidad");
      
      // Opcional: Recargar para asegurar consistencia
      // fetchExercises(); 
    } catch (err) { 
      console.error(err);
      setExercises(originalExercises); // Revertir cambios si falla
      alert("Error al cambiar la visibilidad. Revisa tu conexión.");
    }
  };

  const handleDelete = async (ex) => {
    const targetId = ex._id || ex.id;
    if (!window.confirm(`¿Seguro que quieres eliminar "${ex.title}"? Esta acción no se puede deshacer.`)) return;
    
    const token = getValidToken();
    try {
      const res = await fetch(`${API_URL}/exercises/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        // Eliminar del estado local para no hacer otra petición fetch
        setExercises(prev => prev.filter(item => item.id !== targetId && item._id !== targetId));
      } else {
        const errorData = await res.json();
        alert(errorData.message || "No se pudo eliminar el ejercicio.");
      }
    } catch (error) { console.error(error); }
  };

  // --- Navegación ---
  const handleEdit = (exercise) => {
    setEditingItem(exercise);
    setView('form');
  };

  const handleCreate = () => {
    setEditingItem(null);
    setView('form');
  };

  const handleBackToList = () => {
    setView('list');
    setEditingItem(null);
  };

  const handleSuccess = () => {
    fetchExercises(); // Recargar datos frescos del servidor
  };

  // --- Renderizado ---

  // Vista de Formulario (Crear/Editar)
  if (view === 'form') {
    return (
      <div className="mgmt-container">
        <ExerciseForm 
          onBack={handleBackToList} 
          editData={editingItem} 
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  // Vista de Lista (Tabla)
  return (
    <div className="mgmt-container fade-in-up">
      <div className="mgmt-card">
        <div className="mgmt-header">
          <div>
            <h2>🎯 Repositorio de Ejercicios</h2>
            <p className="subtitle">Gestión de retos MIPS disponibles ({exercises.length})</p>
          </div>
          <button className="primary-btn" onClick={handleCreate}>
            + Nuevo Ejercicio
          </button>
        </div>

        {loading ? (
          <div className="empty-state-container" style={{ padding: '40px' }}>
            <div className="spinner-small" style={{ margin: '0 auto 10px' }}></div>
            <p>Cargando lista de ejercicios...</p>
          </div>
        ) : (
          <ExerciseTable 
            exercises={exercises}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
          />
        )}
      </div>
    </div>
  );
};

export default AdminExercisesPage;