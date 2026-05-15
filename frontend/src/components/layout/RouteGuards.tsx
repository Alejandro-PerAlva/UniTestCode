/**
 * @module RouteGuards
 * Provides higher-order components (HOCs) for route-level access control.
 * Deflects unauthorized users to the login screen or generic dashboards.
 */

import { Navigate } from 'react-router-dom';
import { isAuthenticated, isTeacher } from '../../services/auth';
import type { JSX } from 'react';

/**
 * Restricts route access to authenticated users.
 * @param children - The component to render if authentication passes.
 * @returns The children component, or a redirect to the login page.
 */
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    const loginPath = import.meta.env.MODE === 'production' ? '/tfgapa/login' : '/login';
    return <Navigate to={loginPath} replace />;
  }
  return children;
};

/**
 * Restricts route access strictly to authenticated users with the 'teacher' role.
 * @param children - The component to render if authorization passes.
 * @returns The children component, or a redirect to the home or login page.
 */
export const TeacherRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    const loginPath = import.meta.env.MODE === 'production' ? '/tfgapa/login' : '/login';
    return <Navigate to={loginPath} replace />;
  }
  if (!isTeacher()) return <Navigate to="/home" replace />;
  return children;
};