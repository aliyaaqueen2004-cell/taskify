// Socket.IO is disabled on Vercel serverless
// Use this empty implementation instead

export const socket = null;

export const connectSocket = () => {
  console.log('⚠️ Socket.IO is disabled - running on Vercel serverless');
  return null;
};

export const disconnectSocket = () => {
  return null;
};

// For components that expect socket to exist
export const getSocket = () => null;