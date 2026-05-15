/**
 * @module MainApplication
 * Entry point for the Node.js/Express server.
 * Initializes middlewares, REST API routes, Socket.IO connections, and global error handling.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import exerciseRoutes from './routes/exercise.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { setupSockets } from './sockets/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

/**
 * Configures the Socket.IO server with CORS restrictions.
 */
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/exercises', exerciseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

setupSockets(io);

const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

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

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});