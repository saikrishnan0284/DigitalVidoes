import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '@services/eventService';

const initialState = {
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null
};

export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.getEvents();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'event/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventService.getEventById(eventId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      return await eventService.createEvent(eventData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'event/updateEvent',
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      return await eventService.updateEvent(eventId, eventData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'event/deleteEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Event By ID
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })
      // Update Event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent = action.payload;
        }
      })
      // Delete Event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e._id !== action.payload);
      });
  }
});

export const { clearCurrentEvent, clearError } = eventSlice.actions;
export default eventSlice.reducer;
