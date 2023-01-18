/*
 * Created on Fri Jan 06 2023
 *
 * Light theme config
 *
 * Copyright (c) 2023 - Novus Fintech
 */

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
          boxShadow: '0px 0px 6px 2px rgba(62, 201, 128, 0.3)',
          border: '1px solid #00C77F;',
          backgroundColor: '#FFFFFF',
          color: '#272B3B',
        },
      }),
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 24,
          '&.MuiChip-colorSecondary': {
            border: 'none',
            backgroundColor: '#E3EFFD',
          },
          '&.Mui-disabled': {
            opacity: 1,
          },
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
          overflow: 'hidden',
          '& input': {
            backgroundColor: '#ffffff',
          },
          '&.Mui-error': {
            '& input, & textarea': {
              color: '#FF435F',
              '&:-webkit-autofill': {
                WebkitTextFillColor: '#FF435F',
              },
            },
          },
          '&.Mui-disabled': {
            '&::before': {
              borderBottomStyle: 'solid !important',
            },
          },
          '&:hover fieldset': {
            '&.MuiOutlinedInput-notchedOutline': {
              borderColor: '#08D98D ',
            },
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '.MuiFormLabel-asterisk': {
              color: 'rgba(0, 0, 0, 0.38)',
            },
          },
        },
        asterisk: {
          color: '#FF435F !important',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled:not(.MuiRadio-root)': {
            backgroundColor: '#758695 !important',
            pointerEvents: 'unset',
            cursor: 'not-allowed',
            '&.MuiIconButton-root': {
              backgroundColor: 'unset !important',
            },
          },
          '&.MuiButton-text': {
            textTransform: 'capitalize',
          },
          '&.MuiButton-outlined': {
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        container: {
          height: 'fit-content',
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
      default: '#FFFFFF',
      paper: '#FFFFFF',
      main: '#E8ECEF',
      menu: '#13161F',
      headerCell: '#3A425E',
      oddRow: '#FFFFFF',
      evenRow: '#F2F8FF',
      headerModal: '#E8ECEF',
      iconButton: '#E8ECEF',
      attachment: '#F2F8FF',
      attachmentBorder: '#262B3E',
      closeIcon: '#758695',
      closeIconBg: '#FFFFFF',
      disabled: '#758695',
      option: '#FFFFFF',
    },
    primary: {
      main: '#00C77F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#27A6E7',
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
});

export default lightTheme;
