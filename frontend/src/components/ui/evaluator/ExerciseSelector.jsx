import React from 'react';
import PropTypes from 'prop-types';

/**
 * ExerciseSelector - Componente para la selección múltiple de ejercicios mediante tarjetas.
 * * @param {Object} props
 * @param {Array} props.exercises - Lista de ejercicios disponibles.
 * @param {Array} props.selectedIds - Array de IDs de los ejercicios seleccionados actualmente.
 * @param {Function} props.onToggle - Función para manejar el clic en un ejercicio.
 * @returns {JSX.Element}
 */
const ExerciseSelector = ({ exercises, selectedIds, onToggle }) => {
  
  /**
   * Verifica si un ejercicio específico está seleccionado.
   * @param {number|string} id - ID del ejercicio.
   * @returns {boolean}
   */
  const isSelected = (id) => selectedIds.includes(id);

  return (
    <div className="exercise-grid-selection">
      {exercises.map((exercise) => (
        <div 
          key={exercise.id} 
          className={`exercise-checkbox-card ${isSelected(exercise.id) ? 'active' : ''}`}
          onClick={() => onToggle(exercise.id)}
          role="button"
          aria-pressed={isSelected(exercise.id)}
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter') onToggle(exercise.id);
          }}
        >
          <span className="exercise-title-sm">
            {exercise.title || exercise.titulo}
          </span>
          <span className="exercise-id-tag">
            ID: {exercise.id}
          </span>
        </div>
      ))}
    </div>
  );
};

ExerciseSelector.propTypes = {
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      titulo: PropTypes.string,
    })
  ).isRequired,
  selectedIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ExerciseSelector;