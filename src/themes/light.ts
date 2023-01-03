import { createTheme } from '@mui/material';

const lightTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        '#tooltip': {
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
          zIndex: 999999,
          fontFamily: 'Roboto',
          fontSize: '0.875rem',
          padding: '5px 8px',
          borderRadius: 4,
          boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
          border: 'solid 1px #dadde0',
          backgroundColor: '#C5CBCE',
        },
      }),
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 24,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          '&:hover': {
            background: '#08D98D !important',
          },
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
    info: {
      main: '#27A6E7',
      light: '#E3EFFD',
      contrastText: '#fff',
    },
    hover: {
      main: '#21F5A8',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: ['Roboto'].join(','),
  },
});

export default lightTheme;
