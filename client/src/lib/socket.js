import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('🔌 [Client Socket.IO] Connected to WebSocket server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('⚠️ [Client Socket.IO] Disconnected from WebSocket server');
});
