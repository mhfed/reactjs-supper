import { createTheme } from '@mui/material';

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
    MuiChip: {
      styleOverrides: {
        root: {
          height: 24,
        },
      },
    },
  },
  palette: {
    mode: 'light',
    common: {
      black: '#000',
      white: '#fff',
    },
    background: {
      default: '#758695',
      paper: '#C5CBCE',
    },
    primary: {
      light: '#fff',
      main: '#00C77F',
      dark: '#F2F8FF',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fff',
      main: '#1976d2',
      contrastText: '#fff',
    },
    success: {
      main: '#00C77F',
      light: '#E1FFF4',
      contrastText: '#fff',
    },
    warning: {
      main: '#D89C01',
      light: '#FFFCD4',
      contrastText: '#fff',
    },
    error: {
      main: '#FF435F',
      light: '#FFDCE2',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
});

export default lightTheme;
