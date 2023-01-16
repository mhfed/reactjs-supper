/*
 * Created on Fri Jan 06 2023
 *
 * Error banner with slide down transition
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import * as React from 'react';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    zIndex: 999,
    position: 'absolute',
    boxSizing: 'border-box',
    top: -10,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5, 2),
    background: theme.palette.error.main,
    width: '100%',
    overflow: 'hidden',
    transition: 'all 0.5s ease-in-out',
    transformOrigin: 'left top',
    transform: 'scaleY(0)',
  },
  show: {
    transform: 'scaleY(1)',
  },
}));

type ErrorCollapseProps = {
  error?: string | null;
};

const ErrorCollapse: React.FC<ErrorCollapseProps> = ({ error = '' }) => {
  const classes = useStyles();
  const errorRef = React.useRef<HTMLDivElement>(null);
  const timeoutId = React.useRef<number>(0);

  React.useEffect(() => {
    if (error) {
      timeoutId.current && window.clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        errorRef?.current?.classList?.remove(classes.show);
      }, process.env.REACT_APP_AUTO_HIDE_SNACKBAR);
      errorRef?.current?.classList?.add(classes.show);
    } else {
      errorRef?.current?.classList?.remove(classes.show);
    }
  }, [error]);

  const errorText = error?.split('|')[0];
  return (
    <Typography ref={errorRef} align="center" className={classes.errorContainer}>
      <Trans>{errorText}</Trans>
    </Typography>
  );
};

export default ErrorCollapse;
