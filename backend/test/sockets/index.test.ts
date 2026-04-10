/**
 * @module SocketIndexTests
 * @description Unit tests for the central Socket.IO registry.
 */

import { Server, Socket } from 'socket.io';
import { setupSockets } from '../../src/sockets/index.js';
import { setupRunHandler } from '../../src/sockets/runHandler.js';
import { setupDuelHandler } from '../../src/sockets/duelHandler.js';

jest.mock('../../src/sockets/runHandler.js', () => ({
  setupRunHandler: jest.fn()
}));

jest.mock('../../src/sockets/duelHandler.js', () => ({
  setupDuelHandler: jest.fn()
}));

describe('Socket Index', () => {
  let mockIo: Partial<Server>;
  let connectionCallback: Function;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIo = {
      on: jest.fn().mockImplementation((event: string, cb: Function) => {
        if (event === 'connection') {
          connectionCallback = cb;
        }
        return mockIo;
      })
    };
  });

  it('should register connection event and apply all handlers to connecting sockets', () => {
    setupSockets(mockIo as Server);
    
    expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));

    const mockSocket = {} as Socket;
    connectionCallback(mockSocket);

    expect(setupRunHandler).toHaveBeenCalledWith(mockSocket);
    expect(setupDuelHandler).toHaveBeenCalledWith(mockSocket);
  });
});