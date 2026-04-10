/**
 * @module AppErrorTests
 * @description Unit tests for the global application error class and the asynchronous error catching middleware.
 */

import { appError, catchAsync } from '../../src/utils/appError.js';

describe('Global Utilities: appError', () => {
  it('should create an error with custom message and code', () => {
    const error = new appError('Not found', 404);
    expect(error.statusCode).toBe(404);
  });

  it('should assign 500 default status', () => {
    const error = new appError('Server error');
    expect(error.statusCode).toBe(500);
  });
});

describe('Global Utilities: catchAsync', () => {
  it('should execute successfully without next()', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const next = jest.fn();
    const wrappedFn = catchAsync(mockFn);
    
    await wrappedFn({}, {}, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('should catch exceptions and pass to next()', async () => {
    const testError = new Error('DB fail');
    const mockFn = jest.fn().mockRejectedValue(testError);
    const next = jest.fn();
    const wrappedFn = catchAsync(mockFn);
    
    await wrappedFn({}, {}, next);
    expect(next).toHaveBeenCalledWith(testError);
  });
});