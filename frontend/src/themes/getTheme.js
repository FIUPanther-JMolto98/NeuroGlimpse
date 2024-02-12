// GETTHEME.JS DEFINES THE THEME USING THE MUI MATERIAL STYLES LIBRARY
import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode, // 'light' or 'dark'
    ...(mode === 'light'
      ? {
          // Palette for light mode
          primary: {
            main: '#556dd6ff',
          },
          secondary: {
            main: '#19857B',
          },
          background: {
            default: '#F7F7F7', // Example light mode background
            paper: '#FFFFFF',
          },
        }
      : {
          // Palette for dark mode
          primary: {
            main: '#556CD6',
          },
          secondary: {
            main: '#19857B',
          },
          background: {
            default: '#0B0F19', // Example dark mode background
            paper: '#121212',
          },
        }),
  },
  typography: {
    fontFamily: '"Georgia", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    // Add more typography settings as needed
  },
  // Include other theme customizations as needed
});

export default getTheme;