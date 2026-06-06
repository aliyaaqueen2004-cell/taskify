// import { io } from 'socket.io-client';

// const getBackendUrl = () => {
//   const apiUrl = import.meta.env.VITE_API_URL;
//   if (!apiUrl) return 'http://localhost:5000';
//   if (apiUrl.startsWith('http')) {
//     const parts = apiUrl.split('/');
//     return `${parts[0]}//${parts[2]}`;
//   }
//   return window.location.origin;
// };

// const SOCKET_URL = getBackendUrl();

// export const socket = io(SOCKET_URL, {
//   autoConnect: false, // Wait until user is authenticated
//   withCredentials: true
// });

// // Helper to connect when logged in
// export const connectSocket = (workspaceId) => {
//   socket.connect();
//   if (workspaceId) {
//     socket.emit('join-workspace', workspaceId);
//   }
// };

// export const disconnectSocket = () => {
//   socket.disconnect();
// };


import { io } from 'socket.io-client';

// Use environment variable, fallback to localhost for development
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['polling'],
});

socket.on('connect', () => {
  console.log('✅ Socket connected to:', SOCKET_URL);
});