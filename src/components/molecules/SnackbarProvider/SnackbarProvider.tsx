/*
 * Created on Fri Jan 06 2023
 *
 * Snackbar provider with theme config
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { SnackbarProvider } from 'notistack';
import makeStyles from '@mui/styles/makeStyles';
import CheckMarkedCircleOutline from 'assets/icons/CheckMarkedCircleOutline';
import AlertCircleOutline from 'assets/icons/AlertCircleOutline';
import AlertOutline from 'assets/icons/AlertOutline';

const useStyles = makeStyles((theme) => ({
  variantSuccess: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  variantError: {
    backgroundColor: `${theme.palette.error.main} !important`,
  },
  variantInfo: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
  },
  variantWarning: {
    backgroundColor: `${theme.palette.warning.main} !important`,
  },
}));

type MyStackbarProviderProps = {
  children: React.ReactNode;
};

const MyStackbarProvider: React.FC<MyStackbarProviderProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <SnackbarProvider
      iconVariant={{
        success: <CheckMarkedCircleOutline />,
        error: <AlertCircleOutline />,
        warning: <AlertOutline />,
      }}
      autoHideDuration={process.env.REACT_APP_AUTO_HIDE_SNACKBAR || 3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      maxSnack={process.env.REACT_APP_MAX_SNACKBAR || 3}
      classes={classes}
      children={children}
    />
  );
};

export default MyStackbarProvider;
