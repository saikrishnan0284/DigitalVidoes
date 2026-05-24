import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendors: [],
  currentVendor: null,
  categories: [],
  isLoading: false,
  error: null
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendors: (state, action) => {
      state.vendors = action.payload;
    },
    setCurrentVendor: (state, action) => {
      state.currentVendor = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    }
  }
});

export const { setVendors, setCurrentVendor, setCategories } = vendorSlice.actions;
export default vendorSlice.reducer;
