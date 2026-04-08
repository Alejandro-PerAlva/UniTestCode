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
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});