/**
 * @module SocketService
 * Initializes and configures the singleton Socket.IO client instance for real-time communication.
 */

import { io } from 'socket.io-client';

/**
 * The global Socket.IO instance.
 * Auto-connect is disabled to allow the application's root component to govern
 * the connection lifecycle strictly when mounted.
 */
export const socket = io('http://localhost:5000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

socket.on('connect_error', (err) => {
  console.error('Socket.IO connection error:', err.message);
});

socket.on('disconnect', (reason) => {
  // Automatically attempt to reconnect if the server severed the connection abnormally
  if (reason === 'io server disconnect') {
    socket.connect();
  }
});