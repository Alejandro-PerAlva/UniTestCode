/**
 * @module useAdminLogic
 * Orchestrates the primary state and navigation for the Admin/Teacher dashboard.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchExercises, fetchUsers } from '../../services/api';
import { getUser } from '../../services/auth';
import type { Exercise, User } from '../../types';

/**
 * Defines the possible UI states for the admin dashboard renderer.
 */
export type ViewState = 'list' | 'create' | 'edit' | 'test' | 'users' | 'user-create' | 'user-edit';

/**
 * Custom hook to manage the top-level state of the admin dashboard.
 * Handles data fetching, view switching, and item selection.
 * @returns An object containing the current view state, data arrays, selection states, and navigation handlers.
 */
export const useAdminLogic = () => {
  const [view, setView] = useState<ViewState>('list');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const currentUser = getUser();

  const loadData = useCallback(async () => {
    try {
      if (view.startsWith('user')) {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } else {
        const data = await fetchExercises();
        setExercises(data);
        
        setSelectedExercise(prevSelected => {
          if (prevSelected) {
            const updatedSelected = data.find(ex => ex.id === prevSelected.id);
            return updatedSelected || prevSelected;
          }
          return prevSelected;
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [view]);

  useEffect(() => {
    let isMounted = true;
    
    const initFetch = async () => {
      if (isMounted) {
        await loadData();
      }
    };
    
    initFetch();

    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const navigateToExercises = () => {
    setSelectedExercise(null);
    setView('list');
  };

  const navigateToUsers = () => {
    setSelectedUser(null);
    setView('users');
  };

  return {
    view,
    setView,
    exercises,
    users,
    selectedExercise,
    setSelectedExercise,
    selectedUser,
    setSelectedUser,
    currentUser,
    loadData,
    navigateToExercises,
    navigateToUsers
  };
};