import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('Server Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Network error - please check your connection' });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { 
        username: username,
        password: password 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  verifyOTP: async (username, otp_code) => {
    try {
      const response = await api.post('/auth/verify-otp/', { 
        username: username,
        otp_code: otp_code 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;