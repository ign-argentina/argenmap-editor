import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from './preferencesSlice';

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
  },
});

export default store;
