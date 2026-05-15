/**
 * @module HeroSectionTests
 * @description Unit tests for the HeroSection component, ensuring props are dynamically rendered.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroSection from '../../../src/components/home/HeroSection';

describe('HeroSection Component', () => {
  it('should render the welcome message incorporating the provided teacher role text', () => {
    render(<HeroSection userRoleText="Profesor" />);

    // Verify static text parts
    expect(screen.getByText(/Bienvenido a/i)).toBeInTheDocument();
    expect(screen.getByText('UnitTestCode')).toBeInTheDocument();
    
    // Verify dynamic prop injection
    expect(screen.getByText(/, Profesor/i)).toBeInTheDocument();
  });

  it('should correctly render the welcome message when a student role text is provided', () => {
    render(<HeroSection userRoleText="Alumno" />);
    
    // Verify dynamic prop injection updates correctly
    expect(screen.getByText(/, Alumno/i)).toBeInTheDocument();
  });
});