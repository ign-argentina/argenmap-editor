import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    updatePreferences(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetPreferences(state, action) {
      return { ...action.payload };
    },
  },
});

export const { updatePreferences, resetPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;
