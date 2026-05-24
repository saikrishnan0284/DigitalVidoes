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
  }
};

export default authService;
