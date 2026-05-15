/**
 * @module NavbarTests
 * @description Unit tests for the Navbar component, verifying user rendering, routing links, and logout functionality.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../src/components/layout/Navbar';
import { useNavbarLogic } from '../../../src/hooks/layout/useNavbarLogic';

vi.mock('../../../src/hooks/layout/useNavbarLogic', () => ({
  useNavbarLogic: vi.fn()
}));

describe('Navbar Component', () => {
  const mockHandleLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render standard navigation and student user details', () => {
    vi.mocked(useNavbarLogic).mockReturnValue({
      user: { id: 1, email: 'student@test.com', role: 'student' },
      userIsTeacher: false,
      handleLogout: mockHandleLogout
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('UnitTestCode')).toBeInTheDocument();
    expect(screen.getByText('student@test.com')).toBeInTheDocument();
    expect(screen.getByText('student')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument(); // Avatar letter fallback
    expect(screen.queryByText('Teacher Panel')).not.toBeInTheDocument();
  });

  it('should render the Teacher Panel link when the user is a teacher', () => {
    vi.mocked(useNavbarLogic).mockReturnValue({
      user: { id: 2, email: 'admin@test.com', role: 'teacher' },
      userIsTeacher: true,
      handleLogout: mockHandleLogout
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Teacher Panel')).toBeInTheDocument();
  });

  it('should gracefully handle a null user state', () => {
    vi.mocked(useNavbarLogic).mockReturnValue({
      user: null,
      userIsTeacher: false,
      handleLogout: mockHandleLogout
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByText('student@test.com')).not.toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument(); // Default Avatar letter 'U'
  });

  it('should trigger the logout function when the logout button is clicked', () => {
    vi.mocked(useNavbarLogic).mockReturnValue({
      user: { id: 1, email: 'student@test.com', role: 'student' },
      userIsTeacher: false,
      handleLogout: mockHandleLogout
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByTitle('Cerrar sesión');
    fireEvent.click(logoutBtn);
    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  it('should apply active and inactive styles correctly to all NavLinks based on current route', () => {
    vi.mocked(useNavbarLogic).mockReturnValue({
      user: { id: 2, email: 'admin@test.com', role: 'teacher' },
      userIsTeacher: true,
      handleLogout: mockHandleLogout
    });

    const routes = [
      { path: '/ide', name: 'Web IDE' },
      { path: '/submit', name: 'Evaluador' },
      { path: '/admin', name: 'Teacher Panel' }
    ];

    // Iterate through all paths to cover both true/false branches of the isActive NavLink prop
    routes.forEach(({ path, name }) => {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <Navbar />
        </MemoryRouter>
      );

      // The currently active link should have the specific blue background class
      const activeLink = screen.getByText(name).closest('a');
      expect(activeLink).toHaveClass('bg-blue-600/20');
      
      // Verify that the other links are inactive and fallback to default styles
      routes.filter(r => r.path !== path).forEach(inactiveRoute => {
         const inactiveLink = screen.getByText(inactiveRoute.name).closest('a');
         expect(inactiveLink).toHaveClass('text-gray-400');
         expect(inactiveLink).not.toHaveClass('bg-blue-600/20');
      });
      
      unmount();
    });
  });
});