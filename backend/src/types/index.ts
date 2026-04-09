/**
 * @module GlobalTypes
 * Defines shared TypeScript interfaces and types for the application.
 */

/**
 * Represents the credentials required for a user to log in.
 */
export interface LoginCredentials {
  /** The user's registered email address. */
  email: string;
  /** The user's plaintext password. */
  password?: string;
}

/**
 * Represents the data payload required to register a new user account.
 */
export interface RegisterData {
  /** The desired email address for the new account. */
  email: string;
  /** The desired plaintext password. */
  password?: string;
  /** The requested access role (e.g., 'student' or 'teacher'). */
  role?: string;
  /** The secret invitation code required for registration authorization. */
  secretCode?: string;
}