/**
 * @module MainApplication
 * Entry point for the Node.js/Express server.
 * Initializes middlewares, REST API routes, Socket.IO connections, and global error handling.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import exerciseRoutes from './routes/exercise.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { setupSockets } from './sockets/index.js';

const app = express();
const httpServer = createServer(app);

/**
 * Configures the Socket.IO server with CORS restrictions.
 * Adjusted for the university deployment environment (IAAS ULL).
 */
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware configuration
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// REST API Routes
app.use('/api/exercises', exerciseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Initialize Socket.IO communication
setupSockets(io);

/**
 * Global error handling middleware.
 * Intercepts instances of appError or generic errors and formats the HTTP response.
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    error: message,
    status: status
  });
});

// Server listener configuration
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});