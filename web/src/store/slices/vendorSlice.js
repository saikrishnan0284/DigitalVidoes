import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vendorService from '@services/vendorService';

const initialState = {
  vendors: [],
  currentVendor: null,
  categories: [],
  isLoading: false,
  error: null
};

export const fetchVendors = createAsyncThunk(
  'vendor/fetchVendors',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await vendorService.getVendors(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendor/fetchVendorById',
  async (vendorId, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorById(vendorId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor');
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearCurrentVendor: (state) => {
      state.currentVendor = null;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchVendorById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentVendor, setCategories } = vendorSlice.actions;
export default vendorSlice.reducer;
