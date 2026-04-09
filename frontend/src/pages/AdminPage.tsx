/**
 * @module AdminPage
 * Top-level container for the Administrator and Teacher dashboard.
 * Conditionally renders sub-views (lists, forms, test managers) based on the hook's state.
 */

import React from 'react';
import { useAdminLogic } from '../hooks/admin/useAdminLogic';

import AdminTabs from '../components/admin/AdminTabs';
import ExerciseList from '../components/admin/ExerciseList';
import ExerciseForm from '../components/admin/ExerciseForm';
import TestManager from '../components/admin/TestManager';
import UserManager from '../components/admin/UserManager';
import UserForm from '../components/admin/UserForm';

const AdminPage: React.FC = () => {
  const {
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
  } = useAdminLogic();

  return (
    <div className="h-full w-full bg-gray-950 text-white flex flex-col items-center overflow-y-auto [scrollbar-gutter:stable]">
      
      <AdminTabs 
        view={view} 
        onSelectExercises={navigateToExercises} 
        onSelectUsers={navigateToUsers} 
      />

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
            key={selectedExercise ? selectedExercise.id : 'new-form'}
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