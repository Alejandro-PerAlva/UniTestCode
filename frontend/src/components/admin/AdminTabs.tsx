/**
 * @module AdminTabs
 * Navigation component for the Administrator dashboard to toggle between management contexts.
 */

import React from 'react';
import type { ViewState } from '../../hooks/admin/useAdminLogic';

/**
 * Props for the AdminTabs component.
 */
export interface AdminTabsProps {
  /** The currently active view state to determine tab highlighting. */
  view: ViewState;
  /** Callback triggered when the 'Exercises' tab is clicked. */
  onSelectExercises: () => void;
  /** Callback triggered when the 'Users' tab is clicked. */
  onSelectUsers: () => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ view, onSelectExercises, onSelectUsers }) => {
  const isExercisesView = ['list', 'create', 'edit', 'test'].includes(view);
  const isUsersView = ['users', 'user-create', 'user-edit'].includes(view);

  return (
    <div className="w-full max-w-6xl px-8 pt-8 shrink-0">
      <div className="flex border-b border-gray-800 gap-6">
        <button 
          onClick={onSelectExercises}
          className={`pb-3 font-bold text-sm transition-colors relative ${isExercisesView ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Gestor de Ejercicios
          {isExercisesView && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>}
        </button>
        
        <button 
          onClick={onSelectUsers}
          className={`pb-3 font-bold text-sm transition-colors relative ${isUsersView ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Gestor de Usuarios
          {isUsersView && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>}
        </button>
      </div>
    </div>
  );
};

export default AdminTabs;