/**
 * @module DatabaseService
 * Initializes and exports the Prisma Client singleton instance for database operations.
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global namespace extension to store the Prisma instance.
 * This prevents the exhaustion of database connections caused by Node.js hot-reloading 
 * during development environments.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

/**
 * The shared Prisma Client instance used across the application.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}