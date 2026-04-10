/**
 * @module DatabaseServiceTests
 * @description Unit tests for the Prisma database client initialization and singleton pattern.
 */

import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn()
}));

describe('Database Service', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    delete (global as any).prisma;
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should initialize a new PrismaClient and attach it to the global scope in development mode', () => {
    process.env.NODE_ENV = 'development';
    let db: any;
    
    // Forces Jest to load the module fresh, ignoring the Node.js require cache
    jest.isolateModules(() => {
      db = require('../../src/services/db.js');
    });
    
    expect(PrismaClient).toHaveBeenCalledTimes(1);
    expect((global as any).prisma).toBe(db.prisma);
  });

  it('should not attach PrismaClient to the global scope in production mode', () => {
    process.env.NODE_ENV = 'production';
    let db: any;
    
    jest.isolateModules(() => {
      db = require('../../src/services/db.js');
    });
    
    expect(PrismaClient).toHaveBeenCalledTimes(1);
    expect(db.prisma).toBeDefined();
    expect((global as any).prisma).toBeUndefined();
  });

  it('should reuse the existing global Prisma instance if it is already defined', () => {
    process.env.NODE_ENV = 'development';
    const fakePrismaInstance = { isMock: true };
    (global as any).prisma = fakePrismaInstance;
    
    let db: any;
    jest.isolateModules(() => {
      db = require('../../src/services/db.js');
    });
    
    expect(PrismaClient).not.toHaveBeenCalled(); 
    expect(db.prisma).toBe(fakePrismaInstance);
  });
});