/**
 * @module ErrorHandling
 * Provides global error handling utilities for the Express application.
 */

/**
 * Custom error class for operational errors.
 * Allows attaching HTTP status codes to errors thrown within the application.
 */
export class appError extends Error {
  /**
   * @param message - The error message (in Spanish for user-facing errors).
   * @param statusCode - The HTTP status code associated with the error (defaults to 500).
   */
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    Object.setPrototypeOf(this, appError.prototype);
  }
}

/**
 * Wraps an asynchronous Express middleware or route handler to catch unhandled promise rejections.
 * Forwards any caught errors to the global Express error handling middleware.
 * @param fn - The asynchronous Express handler function to wrap.
 * @returns A new Express middleware function that safely catches errors.
 */
export const catchAsync = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};