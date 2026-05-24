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
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  uploadMedia: async (eventId, formData) => {
    const response = await api.post(`/events/${eventId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  rsvp: async (eventId, status) => {
    const response = await api.post(`/events/${eventId}/rsvp`, { status });
    return response.data.data;
  }
};

export default eventService;
