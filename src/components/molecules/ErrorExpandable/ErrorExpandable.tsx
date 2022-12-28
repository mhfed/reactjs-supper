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

export type ErrortHandle = React.ElementRef<typeof ErrorCollapse>;
type ErrorHandle = {
  setError: (err: string) => void;
};
type ErrorCollapseProps = {
  error?: string | null;
};

const ErrorCollapse: React.ForwardRefRenderFunction<ErrorHandle, ErrorCollapseProps> = ({ error = '' }, ref) => {
  const classes = useStyles();
  const errorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (error) {
      errorRef?.current?.classList?.add(classes.show);
    } else {
      errorRef?.current?.classList?.remove(classes.show);
    }
  }, [error]);

  return (
    <Typography ref={errorRef} align="center" className={classes.errorContainer}>
      {error ? <Trans>{error}</Trans> : ''}
    </Typography>
  );
};

export default ErrorCollapse;
