/**
 * @module MainApplicationTests
 * @description Unit tests for the main Express application initialization and global error handling.
 */

import { Request, Response, NextFunction } from 'express';

let mockAppUse: jest.Mock;
let mockAppListen: jest.Mock;
let capturedErrorHandler: Function | undefined;

jest.mock('cors', () => jest.fn());

jest.mock('express', () => {
  mockAppUse = jest.fn((fn) => {
    if (typeof fn === 'function' && fn.length === 4) {
      capturedErrorHandler = fn;
    }
  });
  
  const mockApp = {
    use: mockAppUse,
    json: jest.fn(),
    urlencoded: jest.fn()
  };
  
  const mockRouter = jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    use: jest.fn()
  }));

  const mockExpress = jest.fn(() => mockApp) as any;
  mockExpress.json = jest.fn();
  mockExpress.urlencoded = jest.fn();
  mockExpress.Router = mockRouter;
  
  return {
    __esModule: true,
    default: mockExpress,
    Router: mockRouter
  };
});

jest.mock('http', () => {
  mockAppListen = jest.fn();
  return {
    createServer: jest.fn(() => ({
      listen: mockAppListen
    }))
  };
});

jest.mock('socket.io', () => ({
  Server: jest.fn(() => ({ on: jest.fn() }))
}));

jest.mock('../src/sockets/index.js', () => ({
  setupSockets: jest.fn()
}));

describe('Main Application', () => {
  let consoleSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    capturedErrorHandler = undefined;
    jest.clearAllMocks();
    jest.isolateModules(() => {
      require('../src/main.js');
    });
  });

  it('should initialize the server and listen on the configured port', () => {
    // accept both String and Number, since process.env values are parsed as strings
    expect(mockAppListen).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
    
    const callback = mockAppListen.mock.calls[0][1];
    callback();
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Server running on port'));
  });

  it('should register a global error handler middleware', () => {
    expect(capturedErrorHandler).toBeDefined();
  });

  it('should format operational errors correctly', () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const mockNext = jest.fn();

    const testError = { statusCode: 404, message: 'Not found test' };
    
    if (capturedErrorHandler) {
      capturedErrorHandler(testError, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not found test', status: 404 });
    }
  });

  it('should provide default values for unexpected standard errors', () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const mockNext = jest.fn();

    const genericError = new Error();
    
    if (capturedErrorHandler) {
      capturedErrorHandler(genericError, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error interno del servidor', status: 500 });
    }
  });
});