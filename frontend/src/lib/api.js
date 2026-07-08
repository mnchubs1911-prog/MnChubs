import axios from 'axios';
import toast from 'react-hot-toast';

const rawBaseURL = import.meta.env.VITE_API_URL || '/api/v1';
const normalizedBaseURL = rawBaseURL.endsWith('/api/v1')
  ? rawBaseURL
  : rawBaseURL.replace(/\/+$|$/, '').replace(/\/api\/v1$/, '') + '/api/v1';

const api = axios.create({
  baseURL: normalizedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('mnchub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      localStorage.removeItem('mnchub_token');
      localStorage.removeItem('token');
      localStorage.removeItem('mnchub_user');
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
