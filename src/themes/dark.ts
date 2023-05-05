/*
 * Created on Fri Jan 06 2023
 *
 * Dark theme config
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { createTheme, alpha } from '@mui/material';

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
          '&.MuiChip-colorSecondary': {
            border: 'none',
            backgroundColor: '#3A425E',
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
              color: 'rgba(255, 255, 255, 0.5)',
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
          '&.Mui-disabled:not(.MuiRadio-root):not(.MuiChip-root):not(.customBtnDisable)': {
            backgroundColor: '#758695 !important',
            color: '#c5cbce !important',
            pointerEvents: 'unset',
            cursor: 'not-allowed',
            '&.MuiIconButton-root': {
              backgroundColor: 'unset !important',
            },
          },
          '&.MuiButton-text': {
            textTransform: 'capitalize',
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
    mode: 'dark',
    common: {
      black: '#000',
      white: '#fff',
    },
    background: {
      default: '#13161F',
      paper: '#1F2332',
      main: '#272B3B',
      menu: '#13161F',
      headerCell: '#13161F',
      oddRow: '#262B3E',
      evenRow: '#1F2332',
      headerModal: '#1F2332',
      contentModal: '#272B3B',
      iconButton: '#758695',
      attachment: '#3A425E',
      attachmentBorder: '#758695',
      closeIcon: '#ffffff',
      closeIconBg: '#1F2332',
      disabled: '#758695',
      option: '#272B3B',
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
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
});

export default darkTheme;
