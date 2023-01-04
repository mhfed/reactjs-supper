import { createTheme } from '@mui/material';

const darkTheme = createTheme({
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
          border: 'solid 1px #363c4e',
          backgroundColor: '#272B3B',
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
    mode: 'dark',
    common: {
      black: '#000',
      white: '#fff',
    },
    background: {
      default: '#13161F',
      paper: '#272B3B',
    },
    primary: {
      dark: '#262B3E',
      main: '#00C77F',
      light: '#1F2332',
      contrastText: '#fff',
    },
    secondary: {
      light: '#1F2332',
      main: '#27A6E7',
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
      main: '#08D98D',
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  typography: {
    fontFamily: ['Roboto'].join(','),
  },
});

export default darkTheme;
