import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    updateData(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetData(state, action) {
      return { ...action.payload };
    },
  },
});

export const { updateData, resetData } = dataSlice.actions;

export default dataSlice.reducer;
