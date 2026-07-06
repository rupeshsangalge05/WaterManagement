import axios from 'axios';

// Set VITE_API_URL in a .env file (and .env.production for deploy).
// Fallback exists only so local dev doesn't break on first checkout.
// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const baseURL = process.env.VITE_API_URL;

const api = axios.create({ baseURL });

// Attach token automatically — no more repeating
// `localStorage.getItem('token')` in every component.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Central 401 handling. Without this, an expired token just produces
// silent failed requests and the user sits on a blank/broken page
// with no idea why.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      // Don't hard-redirect if we're already on a public auth page —
      // avoids redirect loops.
      const publicPaths = ['/login', '/register', '/newConnection', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;