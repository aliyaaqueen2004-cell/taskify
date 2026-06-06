import { createSlice } from '@reduxjs/toolkit';

// Theme slice to manage dark/light mode
const initialState = {
  mode: 'light', // 'light' | 'dark'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setLight: (state) => {
      state.mode = 'light';
    },
    setDark: (state) => {
      state.mode = 'dark';
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setLight, setDark, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
