import React from 'react';
import { SnackbarProvider } from 'notistack';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  contentRoot: {
    backgroundColor: `${theme.palette.info.main} !important`,
  },
  variantSuccess: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  variantError: {
    backgroundColor: `${theme.palette.error.main} !important`,
  },
  variantInfo: {
    backgroundColor: `${theme.palette.info.main} !important`,
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
