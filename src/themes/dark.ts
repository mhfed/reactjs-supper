import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            '& input': {
              color: '#FF435F',
            },
          },
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    common: {
      black: '#000',
      white: '#fff',
    },
    background: {
      default: '#1F2332',
      paper: '#272B3B',
    },
    primary: {
      light: '#333',
      main: '#00C77F',
      dark: '#303f9f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff4081',
      main: '#27A6E7',
      dark: '#c51162',
      contrastText: '#fff',
    },
    error: {
      main: '#FF435F',
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
});

export default darkTheme;
