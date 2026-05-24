import api from './api';

const vendorService = {
  getVendors: async (filters = {}) => {
    const response = await api.get('/vendors', { params: filters });
    return response.data.data;
  },

  getVendorById: async (vendorId) => {
    const response = await api.get(`/vendors/${vendorId}`);
    return response.data.data;
  },

  searchVendors: async (query) => {
    const response = await api.get('/vendors/search', { params: { q: query } });
    return response.data.data;
  },

  getCategories: async () => {
    const response = await api.get('/vendors/categories');
    return response.data.data;
  },

  createBooking: async (vendorId, bookingData) => {
    const response = await api.post(`/vendors/${vendorId}/bookings`, bookingData);
    return response.data.data;
  },

  addReview: async (vendorId, reviewData) => {
    const response = await api.post(`/vendors/${vendorId}/reviews`, reviewData);
    return response.data.data;
  }
};

export default vendorService;
