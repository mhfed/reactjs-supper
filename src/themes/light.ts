import { createTheme, alpha } from '@mui/material';

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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#00C77F', 0.08),
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            '& input': {
              color: '#FF435F',
              '&:-webkit-autofill': {
                WebkitTextFillColor: '#FF435F',
              },
            },
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
      default: '#F2F8FF',
      paper: '#FFFFFF',
      other1: '#E8ECEF',
      other2: '#C5CBCE',
      other3: '#FFFFFF',
    },
    primary: {
      main: '#00C77F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1976d2',
      contrastText: '#fff',
    },
    hover: {
      main: '#00C77F',
      success: alpha('#00C77F', 0.08),
      warning: alpha('#D89C01', 0.08),
      error: alpha('#FF435F', 0.08),
      info: alpha('#27A6E7', 0.08),
      contrastText: '#fff',
    },
    success: {
      main: '#00C77F',
      contrastText: '#fff',
    },
    warning: {
      main: '#D89C01',
      contrastText: '#fff',
    },
    error: {
      main: '#FF435F',
      contrastText: '#fff',
    },
    info: {
      main: '#27A6E7',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: ['Roboto'].join(','),
  },
});

export default lightTheme;
