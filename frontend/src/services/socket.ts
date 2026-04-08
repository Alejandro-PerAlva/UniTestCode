import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

socket.on('connect_error', (err) => {
  console.error('Error de conexión con Socket.IO:', err.message);
});

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    socket.connect();
  }
});