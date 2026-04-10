/**
 * @module RunHandlerTests
 * @description Unit tests for real-time MIPS execution sessions via Socket.IO.
 */

import { Socket } from 'socket.io';
import { spawn } from 'child_process';
import fs from 'fs';
import { setupRunHandler } from '../../src/sockets/runHandler.js';

jest.mock('child_process');
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    unlink: jest.fn().mockResolvedValue(undefined)
  }
}));

jest.mock('../../src/services/parser.js', () => ({
  normalizeSpimToMars: (code: string) => code.toUpperCase() 
}));

describe('Run Handler', () => {
  let mockSocket: Partial<Socket>;
  let socketEvents: Record<string, Function>;
  let mockProcess: any;

  beforeEach(() => {
    socketEvents = {};
    mockSocket = {
      id: 'test-socket-id',
      on: jest.fn().mockImplementation((event: string, cb: Function) => {
        socketEvents[event] = cb;
        return mockSocket;
      }),
      emit: jest.fn()
    };

    mockProcess = {
      kill: jest.fn(),
      stdin: { write: jest.fn() },
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: jest.fn()
    };

    (spawn as jest.Mock).mockReset();
    (spawn as jest.Mock).mockReturnValue(mockProcess);
    jest.clearAllMocks();
  });

  it('should create temp directory if it does not exist on module load', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    jest.isolateModules(() => {
      require('../../src/sockets/runHandler.js');
    });
    expect(fs.mkdirSync).toHaveBeenCalled();
  });

  it('should compile, execute, and stream outputs to the socket on start_run', async () => {
    setupRunHandler(mockSocket as Socket);
    
    await socketEvents['start_run']('raw code');
    
    expect(fs.promises.writeFile).toHaveBeenCalledWith(expect.any(String), 'RAW CODE');
    expect(spawn).toHaveBeenCalledWith('java', expect.any(Array), expect.any(Object));

    const stdoutCb = mockProcess.stdout.on.mock.calls.find((call: any[]) => call[0] === 'data')[1];
    stdoutCb(Buffer.from('hello'));
    expect(mockSocket.emit).toHaveBeenCalledWith('output', 'hello');

    const stderrCb = mockProcess.stderr.on.mock.calls.find((call: any[]) => call[0] === 'data')[1];
    stderrCb(Buffer.from('warning'));
    expect(mockSocket.emit).toHaveBeenCalledWith('output', expect.stringContaining('warning'));

    const errorCb = mockProcess.on.mock.calls.find((call: any[]) => call[0] === 'error')[1];
    errorCb(new Error('crash'));
    expect(mockSocket.emit).toHaveBeenCalledWith('output', expect.stringContaining('crash'));

    const closeCb = mockProcess.on.mock.calls.find((call: any[]) => call[0] === 'close')[1];
    await closeCb(0);
    expect(mockSocket.emit).toHaveBeenCalledWith('execution_finished', 0);
  });

  it('should kill existing process if a new run is started', async () => {
    setupRunHandler(mockSocket as Socket);
    
    await socketEvents['start_run']('code 1');
    expect(spawn).toHaveBeenCalledTimes(1);

    await socketEvents['start_run']('code 2');
    expect(mockProcess.kill).toHaveBeenCalledWith('SIGKILL');
    expect(spawn).toHaveBeenCalledTimes(2);
  });

  it('should route input events to the active process stdin', async () => {
    setupRunHandler(mockSocket as Socket);
    
    socketEvents['input']('user text');
    expect(mockProcess.stdin.write).not.toHaveBeenCalled(); 

    await socketEvents['start_run']('code');
    socketEvents['input']('user text');
    expect(mockProcess.stdin.write).toHaveBeenCalledWith('user text');
  });

  it('should kill process and cleanup files on disconnect', async () => {
    setupRunHandler(mockSocket as Socket);
    await socketEvents['start_run']('code');
    
    await socketEvents['disconnect']();
    expect(mockProcess.kill).toHaveBeenCalledWith('SIGKILL');
  });

  it('should handle disconnect when no process is running', async () => {
    setupRunHandler(mockSocket as Socket);
    await socketEvents['disconnect']();
    expect(mockProcess.kill).not.toHaveBeenCalled();
  });
});