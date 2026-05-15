/**
 * @module FaqSectionTests
 * @description Unit tests for the FaqSection static component.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FaqSection from '../../../src/components/home/FaqSection';

describe('FaqSection Component', () => {
  it('should render the main heading and all frequently asked questions', () => {
    render(<FaqSection />);
    
    // Main heading
    expect(screen.getByText('Preguntas Frecuentes')).toBeInTheDocument();
    
    // Specific FAQ questions
    expect(screen.getByText('¿Cómo funciona el autoguardado del IDE?')).toBeInTheDocument();
    expect(screen.getByText('¿Qué pasa si mi código contiene un bucle infinito?')).toBeInTheDocument();
    expect(screen.getByText('¿Por qué fallan los tests si mi código funciona en MARS?')).toBeInTheDocument();
  });
});