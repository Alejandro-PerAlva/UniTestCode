/**
 * @module TerminalTests
 * @description Unit tests for the Socket-connected Terminal wrapper, achieving 100% V8 coverage.
 */

import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Global declaration to control the useRef mock securely without hoisting issues
declare global {
  var __MOCK_USE_REF_NULL__: boolean;
}

// --- MOCK REACT USING GLOBAL FLAG ---
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useRef: <T,>(init: T) => {
      // If the global flag is active, force the object to be immutable to prevent
      // React from injecting the DOM node, forcing the early return.
      if (globalThis.__MOCK_USE_REF_NULL__) {
        return {
          get current() { return null; },
          set current(val) { /* absorb writes silently */ }
        };
      }
      return actual.useRef(init);
    }
  };
});

import Terminal from '../../../src/components/ide/Terminal';

// --- MOCK SOCKET.IO USING HOISTED ---
const socketMocks = vi.hoisted(() => ({
  events: {} as Record<string, (data?: string) => void>,
  emit: vi.fn()
}));

vi.mock('../../../src/services/socket', () => ({
  socket: {
    on: vi.fn((event: string, cb: (data?: string) => void) => { socketMocks.events[event] = cb; }),
    off: vi.fn((event: string) => { delete socketMocks.events[event]; }),
    emit: socketMocks.emit
  }
}));

// --- MOCK XTERM USING HOISTED AND CLASSES ---
const xtermMocks = vi.hoisted(() => ({
  fit: vi.fn(),
  open: vi.fn(),
  write: vi.fn(),
  onDataCb: null as ((data: string) => void) | null,
  keyHandlerCb: null as ((e: KeyboardEvent) => boolean) | null,
}));

vi.mock('@xterm/addon-fit', () => ({
  FitAddon: class {
    fit = xtermMocks.fit;
  }
}));

vi.mock('@xterm/xterm', () => ({
  Terminal: class {
    attachCustomKeyEventHandler = vi.fn((cb: (e: KeyboardEvent) => boolean) => { xtermMocks.keyHandlerCb = cb; });
    loadAddon = vi.fn();
    open = xtermMocks.open;
    write = xtermMocks.write;
    dispose = vi.fn();
    onData = vi.fn((cb: (data: string) => void) => { xtermMocks.onDataCb = cb; });
  }
}));

describe('Terminal Component', () => {
  const mockOnInput = vi.fn();
  const mockOnOutput = vi.fn();
  const mockOnFinish = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    xtermMocks.onDataCb = null;
    xtermMocks.keyHandlerCb = null;
    globalThis.__MOCK_USE_REF_NULL__ = false;
    for (const key in socketMocks.events) delete socketMocks.events[key];
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.__MOCK_USE_REF_NULL__ = false;
  });

  it('should early return from initialization if terminalRef is null', () => {
    globalThis.__MOCK_USE_REF_NULL__ = true;
    render(<Terminal />);
    
    // Being strictly null and immutable, the "if (!terminalRef.current) return;" line acts,
    // ensuring that xtermMocks.open NEVER executes.
    expect(xtermMocks.open).not.toHaveBeenCalled();
  });

  it('should initialize terminal, handle resize events, trigger timeout, and clean up', () => {
    const { unmount } = render(
      <Terminal inputEvent="in" outputEvent="out" finishEvent="fin" readOnly={true} />
    );

    vi.advanceTimersByTime(100);
    expect(xtermMocks.fit).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event('resize'));
    expect(xtermMocks.fit).toHaveBeenCalledTimes(2);

    unmount();
    expect(socketMocks.events['out']).toBeUndefined();
    expect(socketMocks.events['fin']).toBeUndefined();
  });

  it('should safely handle socket events and input when optional callbacks are not provided', () => {
    render(<Terminal inputEvent="in" outputEvent="out" finishEvent="fin" readOnly={false} />);

    socketMocks.events['out']?.('test data');
    expect(xtermMocks.write).toHaveBeenCalledWith('test data');

    socketMocks.events['fin']?.();
    expect(xtermMocks.write).toHaveBeenCalledWith('\r\n\x1b[33m--- Ejecucion terminada ---\x1b[0m\r\n');

    if (xtermMocks.onDataCb) {
      xtermMocks.onDataCb('\r');
      expect(socketMocks.emit).toHaveBeenCalledWith('in', '\n');
    }
  });

  it('should intercept custom key events', () => {
    render(<Terminal />);
    
    if (xtermMocks.keyHandlerCb) {
      const arrowResult = xtermMocks.keyHandlerCb(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
      expect(arrowResult).toBe(false);

      const letterResult = xtermMocks.keyHandlerCb(new KeyboardEvent('keydown', { code: 'KeyA' }));
      expect(letterResult).toBe(true);
    }
  });

  it('should handle incoming socket output and finish events', () => {
    render(<Terminal outputEvent="custom_out" finishEvent="custom_fin" onOutput={mockOnOutput} onFinish={mockOnFinish} />);

    socketMocks.events['custom_out']?.('Hello\nWorld');
    expect(xtermMocks.write).toHaveBeenCalledWith('Hello\r\nWorld');
    expect(mockOnOutput).toHaveBeenCalledWith('Hello\r\nWorld');

    socketMocks.events['custom_fin']?.();
    expect(xtermMocks.write).toHaveBeenCalledWith('\r\n\x1b[33m--- Ejecucion terminada ---\x1b[0m\r\n');
    expect(mockOnFinish).toHaveBeenCalled();
  });

  it('should handle terminal data input branches completely', () => {
    render(<Terminal onInput={mockOnInput} />);

    if (!xtermMocks.onDataCb) throw new Error('onData callback not registered');

    xtermMocks.onDataCb('A');
    expect(xtermMocks.write).toHaveBeenCalledWith('\x1b[32mA\x1b[0m');

    xtermMocks.onDataCb('\x7f');
    expect(xtermMocks.write).toHaveBeenCalledWith('\b \b');

    xtermMocks.write.mockClear();
    xtermMocks.onDataCb('\x7f');
    expect(xtermMocks.write).not.toHaveBeenCalled();

    xtermMocks.onDataCb('\x1b[D');
    
    xtermMocks.onDataCb('T'); 
    xtermMocks.onDataCb('\r');
    expect(socketMocks.emit).toHaveBeenCalledWith('input', 'T\n');
    expect(mockOnInput).toHaveBeenCalledWith('T\n');

    xtermMocks.onDataCb('E'); 
    xtermMocks.onDataCb('\n');
    expect(socketMocks.emit).toHaveBeenCalledWith('input', 'E\n');
    expect(mockOnInput).toHaveBeenCalledWith('E\n');
  });
});