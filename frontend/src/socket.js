// src/socket.js
import { io } from 'socket.io-client';
import REACT_APP_API_URL from 'api/api';
let url = REACT_APP_API_URL.replace(/\/api\/$/, '');
// Create a singleton socket connection
let socket;

export const createSocketConnection = () => {
  if (!socket) {
    socket = io(url, {
      transports: ['websocket'], // 💥 Force WebSocket to avoid polling issues
      withCredentials: true,
      autoConnect: false // Optional: control when to connect
    });

    // Add listeners only once
    socket.on('connect', () => {
      // console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      // console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('🚨 Connection error:', err.message);
    });

    socket.connect(); // 🔌 Actually initiate the connection
  }

  return socket;
};
