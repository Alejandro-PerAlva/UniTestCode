/**
 * @module FeatureCardsTests
 * @description Unit tests for the FeatureCards component, verifying rendering and interaction callbacks.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import FeatureCards from '../../../src/components/home/FeatureCards';

describe('FeatureCards Component', () => {
  it('should render the action cards and trigger navigation callbacks when buttons are clicked', () => {
    const mockOnNavigateIde = vi.fn();
    const mockOnNavigateSubmit = vi.fn();

    render(
      <FeatureCards 
        onNavigateIde={mockOnNavigateIde} 
        onNavigateSubmit={mockOnNavigateSubmit} 
      />
    );

    // Verify card titles are present
    expect(screen.getByText('Web IDE & Duelo')).toBeInTheDocument();
    expect(screen.getByText('Multi-Evaluador')).toBeInTheDocument();

    // Verify and interact with the IDE navigation button
    const ideButton = screen.getByRole('button', { name: /Abrir Web IDE/i });
    expect(ideButton).toBeInTheDocument();
    fireEvent.click(ideButton);
    expect(mockOnNavigateIde).toHaveBeenCalledTimes(1);

    // Verify and interact with the Evaluator navigation button
    const submitButton = screen.getByRole('button', { name: /Ir al Evaluador/i });
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);
    expect(mockOnNavigateSubmit).toHaveBeenCalledTimes(1);
  });
});