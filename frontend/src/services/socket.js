// Comment out everything - Socket.IO doesn't work on Vercel
export const socket = null;
export const connectSocket = () => {
  console.log('Socket.IO disabled on Vercel serverless');
  return null;
};