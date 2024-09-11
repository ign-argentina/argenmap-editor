import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  config: {},
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateConfig: (state, action) => {
      const { key, value } = action.payload;
      state.config = {
        ...state.config,
        [key]: value,
      };
    },
    setConfig: (state, action) => {
      state.config = action.payload; // Inicializa el estado con la configuración completa
    },
  },
});

export const { updateConfig, setConfig } = configSlice.actions;
export default configSlice.reducer;
