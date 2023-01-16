/*
 * Created on Fri Jan 06 2023
 *
 * Styles for main layout
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    minHeight: '100vh',
    padding: theme.spacing(3, 3, 0, 3),
    background: theme.palette.background.main,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${process.env.REACT_APP_DRAWER_WIDTH}px`,
    width: '100vw',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    width: `calc(100vw - ${process.env.REACT_APP_DRAWER_WIDTH}px)`,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export default useStyles;
