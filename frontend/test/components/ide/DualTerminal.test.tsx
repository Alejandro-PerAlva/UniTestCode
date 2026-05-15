/**
 * @module DualTerminalTests
 * @description Unit tests for the DualTerminal container component.
 */

import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import DualTerminal from '../../../src/components/ide/DualTerminal';

interface MockTerminalProps {
  inputEvent?: string;
  outputEvent?: string;
  readOnly?: boolean;
}

// Mock the Terminal component to verify props are passed correctly
vi.mock('../../../src/components/ide/Terminal', () => ({
  default: (props: MockTerminalProps) => (
    <div data-testid="mock-terminal">
      <span>Event In: {props.inputEvent || 'none'}</span>
      <span>Event Out: {props.outputEvent || 'none'}</span>
      <span>Read Only: {props.readOnly ? 'true' : 'false'}</span>
    </div>
  )
}));

describe('DualTerminal Component', () => {
  it('should render both interactive and read-only terminal instances with correct props', () => {
    render(<DualTerminal executionId={42} />);
    
    expect(screen.getByText('Tu Consola (Interactiva)')).toBeInTheDocument();
    expect(screen.getByText('Consola del Profesor (Salida Esperada)')).toBeInTheDocument();

    const terminals = screen.getAllByTestId('mock-terminal');
    expect(terminals).toHaveLength(2);

    // Verify Student Terminal (Index 0)
    expect(terminals[0]).toHaveTextContent('Event In: duel_input');
    expect(terminals[0]).toHaveTextContent('Event Out: duel_student_output');
    expect(terminals[0]).toHaveTextContent('Read Only: false');

    // Verify Teacher Terminal (Index 1)
    expect(terminals[1]).toHaveTextContent('Event In: none'); // It shouldn't have an input event
    expect(terminals[1]).toHaveTextContent('Event Out: duel_teacher_output');
    expect(terminals[1]).toHaveTextContent('Read Only: true');
  });
});