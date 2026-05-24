import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import authService from '../../services/authService';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ phoneOrEmail }, { rejectWithValue }) => {
    try {
      return await authService.sendOTP(phoneOrEmail);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phoneOrEmail, otp }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyOTP(phoneOrEmail, otp);
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('user');
  return null;
});

export const loadStoredAuth = createAsyncThunk('auth/loadStored', async () => {
  const token = await SecureStore.getItemAsync('token');
  const userStr = await SecureStore.getItemAsync('user');
  if (token && userStr) {
    return { token, user: JSON.parse(userStr) };
  }
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      SecureStore.setItemAsync('user', JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      });
  }
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
