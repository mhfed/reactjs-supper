import { colors, createTheme } from '@mui/material';

const lightTheme = createTheme({
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
    mode: 'light',
    common: {
      white: '#fff',
    },
    action: {
      active: colors.blueGrey[600],
    },
    background: {
      default: '#d8d8d8',
      paper: '#fff',
    },
    primary: {
      light: '#fff ',
      main: '#00C77F',
      dark: '#fafafa',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff4081',
      main: '#1976d2',
      dark: '#c51162',
      contrastText: '#fff',
    },
    error: {
      main: '#FF435F',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
});

export default lightTheme;
