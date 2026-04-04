import React, { useState, useEffect } from 'react';
import { fetchExercises, fetchUsers } from '../services/api';
import { getUser } from '../services/auth';
import type { Exercise } from '../types';

import ExerciseList from '../components/admin/ExerciseList';
import ExerciseForm from '../components/admin/ExerciseForm';
import TestManager from '../components/admin/TestManager';
import UserManager from '../components/admin/UserManager';
import UserForm from '../components/admin/UserForm';

type ViewState = 'list' | 'create' | 'edit' | 'test' | 'users' | 'user-create' | 'user-edit';

const AdminPage: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const currentUser = getUser();

  const loadData = async () => {
    try {
      if (view.startsWith('user')) {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } else {
        const data = await fetchExercises();
        setExercises(data);
        if (selectedExercise) {
          const updatedSelected = data.find(ex => ex.id === selectedExercise.id);
          if (updatedSelected) setSelectedExercise(updatedSelected);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, [view]);

  return (
    <div className="h-full w-full bg-gray-950 text-white flex flex-col items-center overflow-y-auto [scrollbar-gutter:stable]">
      
      <div className="w-full max-w-6xl px-8 pt-8 shrink-0">
        <div className="flex border-b border-gray-800 gap-6">
          <button 
            onClick={() => { setSelectedExercise(null); setView('list'); }}
            className={`pb-3 font-bold text-sm transition-colors relative ${['list', 'create', 'edit', 'test'].includes(view) ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Gestor de Ejercicios
            {['list', 'create', 'edit', 'test'].includes(view) && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>}
          </button>
          
          <button 
            onClick={() => { setSelectedUser(null); setView('users'); }}
            className={`pb-3 font-bold text-sm transition-colors relative ${['users', 'user-create', 'user-edit'].includes(view) ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Gestor de Usuarios
            {['users', 'user-create', 'user-edit'].includes(view) && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>}
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full p-8 relative flex-1">
        
        {view === 'users' && (
          <UserManager 
            users={users} 
            onRefresh={loadData} 
            currentUserId={currentUser?.id}
            onEdit={(u) => { setSelectedUser(u); setView('user-edit'); }}
            onCreateNew={() => { setSelectedUser(null); setView('user-create'); }}
          />
        )}

        {(view === 'user-create' || view === 'user-edit') && (
          <UserForm 
            user={view === 'user-edit' ? selectedUser : null}
            onBack={() => setView('users')}
            onSaved={() => { loadData(); setView('users'); }}
          />
        )}

        {view === 'list' && (
          <ExerciseList 
            exercises={exercises}
            onRefresh={loadData}
            onCreateNew={() => { setSelectedExercise(null); setView('create'); }}
            onEdit={(ex) => { setSelectedExercise(ex); setView('edit'); }}
            onManageTests={(ex) => { setSelectedExercise(ex); setView('test'); }}
          />
        )}

        {(view === 'create' || view === 'edit') && (
          <ExerciseForm 
            exercise={view === 'edit' ? selectedExercise : null}
            onBack={() => setView('list')}
            onSaved={() => { loadData(); setView('list'); }}
          />
        )}

        {view === 'test' && selectedExercise && (
          <TestManager 
            exercise={selectedExercise}
            onBack={() => setView('list')}
            onRefresh={loadData}
          />
        )}

      </div>
    </div>
  );
};

export default AdminPage;