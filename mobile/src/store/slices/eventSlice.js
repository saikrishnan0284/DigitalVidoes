import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '../../services/eventService';

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

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
      });
  }
});

export const { clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
