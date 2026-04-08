import { Navigate } from 'react-router-dom';
import { isAuthenticated, isTeacher } from '../../services/auth';
import type { JSX } from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

export const TeacherRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isTeacher()) return <Navigate to="/home" replace />;
  return children;
};