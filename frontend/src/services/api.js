import axios from 'axios';

// Use dynamic API URL based on host environment
const API_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api/v1'
        : `${window.location.origin}/api/v1`)
    : 'http://localhost:5000/api/v1'
);

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - ALWAYS add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const isAuthCheck = error.config?.url?.includes('/auth/me');
      if (!isAuthCheck && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;