import React from 'react';
import PropTypes from 'prop-types';

/**
 * ExerciseTable - Componente de presentación para listar los ejercicios en el panel de administración.
 * Gestiona la visualización de la tabla, los interruptores de visibilidad y los botones de acción.
 * * @param {Object} props
 * @param {Array} props.exercises - Lista de ejercicios a mostrar.
 * @param {Function} props.onEdit - Función a ejecutar al pulsar editar (recibe el objeto ejercicio).
 * @param {Function} props.onDelete - Función a ejecutar al pulsar eliminar (recibe el objeto ejercicio).
 * @param {Function} props.onToggleVisibility - Función para cambiar la visibilidad (recibe el objeto ejercicio).
 */
const ExerciseTable = ({ exercises, onEdit, onDelete, onToggleVisibility }) => {
  return (
    <div className="table-responsive">
      <table className="mgmt-table">
        <thead>
          <tr>
            <th>Challenge Title</th>
            <th>Visibility</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exercises.length > 0 ? (
            exercises.map((ex) => (
              <tr key={ex._id || ex.id}>
                {/* Columna: Información Principal */}
                <td>
                  <div className="exercise-info">
                    <strong>{ex.title || ex.titulo}</strong>
                    <span className="exercise-id-sub">ID: {ex.id}</span>
                  </div>
                </td>

                {/* Columna: Switch de Visibilidad */}
                <td>
                  <div 
                    className="switch-container" 
                    onClick={() => onToggleVisibility(ex)}
                    role="button"
                    tabIndex={0}
                    title="Toggle visibility"
                  >
                    <div className={`switch-track ${ex.visible ? 'active' : ''}`}>
                      <div className="switch-knob"></div>
                    </div>
                    <span className="switch-label">
                      {ex.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </td>

                {/* Columna: Acciones */}
                <td>
                  <div className="action-group-btns">
                    <button 
                      onClick={() => onEdit(ex)} 
                      className="action-icon-btn edit"
                      title="Edit exercise"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => onDelete(ex)} 
                      className="action-icon-btn delete"
                      title="Delete exercise"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="empty-row">
                No exercises found in repository.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

ExerciseTable.propTypes = {
  exercises: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.string,
    title: PropTypes.string,
    titulo: PropTypes.string,
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
};

export default ExerciseTable;