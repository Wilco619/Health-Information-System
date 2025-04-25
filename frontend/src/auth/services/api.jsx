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
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
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
      // Store username for OTP verification
      localStorage.setItem('pending_username', username);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  verifyOTP: async (username, otp_code) => {
    try {
      const response = await api.post('/auth/verify-otp/', { 
        username, 
        otp_code 
      });

      // Validate response
      if (!response.data?.token) {
        throw new Error('Invalid response from server');
      }

      // Clear pending username
      localStorage.removeItem('pending_username');
      
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'OTP verification failed');
      }
      throw error;
    }
  }
};

export const clientAPI = {
  search: (query) => 
    api.post('/clients/search/', { query }),
    
  enroll: (clientId, programId, notes) => 
    api.post(`/clients/${clientId}/enroll/`, {
      program_id: programId,
      notes: notes
    }),

  getProfile: (clientId) => 
    api.get(`/clients/${clientId}/profile/`),

  getClient: (clientId) =>
    api.get(`/clients/${clientId}/`),
    
  getPrograms: () =>
    api.get('/programs/'),

  updateClient: (clientId, data) =>
    api.put(`/clients/${clientId}/`, data),
    
  deleteClient: (clientId) =>
    api.delete(`/clients/${clientId}/`),

  getDashboardStats: () => 
    api.get('/dashboard/'),

  unenrollClient: (clientId, enrollmentId) =>
    api.delete(`/clients/${clientId}/enrollments/${enrollmentId}/`),
};

export default api;