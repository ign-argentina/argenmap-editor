import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from './preferencesSlice';
import dataReducer from './dataSlice'; // Importa el nuevo reducer

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    data: dataReducer, // Agrega el nuevo reducer aquí
  },
});

export default store;
