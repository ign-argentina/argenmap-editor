import { createSlice } from '@reduxjs/toolkit';

const initialState = {};


const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updatePreferences(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetConfig: (state, action) => {
      return { ...action.payload };   
    },
  },
});

export const { updateConfig, resetConfig } = configSlice.actions;
export default configSlice.reducer;
