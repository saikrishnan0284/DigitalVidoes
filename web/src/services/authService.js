import api from './api';

const authService = {
  sendOTP: async (phoneOrEmail) => {
    const response = await api.post('/auth/send-otp', { phoneOrEmail });
    return response.data;
  },

  verifyOTP: async (phoneOrEmail, otp) => {
    const response = await api.post('/auth/verify-otp', { phoneOrEmail, otp });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
