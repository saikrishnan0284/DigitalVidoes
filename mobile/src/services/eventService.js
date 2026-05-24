import api from './api';

const eventService = {
  getEvents: async (filters = {}) => {
    const response = await api.get('/events', { params: filters });
    return response.data.data;
  },

  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data.data;
  }
};

export default eventService;
