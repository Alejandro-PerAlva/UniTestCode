/**
 * @module RouteGuardsTests
 * @description Unit tests for RouteGuards (ProtectedRoute and TeacherRoute), ensuring correct structural redirections.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProtectedRoute, TeacherRoute } from '../../../src/components/layout/RouteGuards';
import { isAuthenticated, isTeacher } from '../../../src/services/auth';

// Mock react-router-dom Navigate component to avoid context errors and track routing intent
vi.mock('react-router-dom', () => ({
  Navigate: ({ to, replace }: { to: string; replace?: boolean }) => (
    <div data-testid="navigate" data-to={to} data-replace={replace ? 'true' : 'false'}>
      Redirected to {to}
    </div>
  )
}));

// Mock the auth service queries
vi.mock('../../../src/services/auth', () => ({
  isAuthenticated: vi.fn(),
  isTeacher: vi.fn()
}));

describe('RouteGuards Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProtectedRoute', () => {
    it('should redirect to /login if the user is not authenticated', () => {
      vi.mocked(isAuthenticated).mockReturnValue(false);

      render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render the children components if the user is authenticated', () => {
      vi.mocked(isAuthenticated).mockReturnValue(true);

      render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('TeacherRoute', () => {
    it('should redirect to /login if the user is not authenticated, bypassing teacher check', () => {
      vi.mocked(isAuthenticated).mockReturnValue(false);

      render(
        <TeacherRoute>
          <div data-testid="teacher-content">Teacher Content</div>
        </TeacherRoute>
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.queryByTestId('teacher-content')).not.toBeInTheDocument();
    });

    it('should redirect to /home if the user is authenticated but is not a teacher', () => {
      vi.mocked(isAuthenticated).mockReturnValue(true);
      vi.mocked(isTeacher).mockReturnValue(false);

      render(
        <TeacherRoute>
          <div data-testid="teacher-content">Teacher Content</div>
        </TeacherRoute>
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/home');
      expect(screen.queryByTestId('teacher-content')).not.toBeInTheDocument();
    });

    it('should render the children components if the user is authenticated and is a teacher', () => {
      vi.mocked(isAuthenticated).mockReturnValue(true);
      vi.mocked(isTeacher).mockReturnValue(true);

      render(
        <TeacherRoute>
          <div data-testid="teacher-content">Teacher Content</div>
        </TeacherRoute>
      );

      expect(screen.getByTestId('teacher-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });
});