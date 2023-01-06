/*
 * Created on Fri Jan 06 2023
 *
 * Style for side menu
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemActive: {
      background: theme.palette.primary.main,
    },
    navBarItemActive: {
      '& span': {
        color: theme.palette.primary.main,
      },
    },
    drawer: {
      '& *': {
        color: theme.palette.text.primary,
      },
      width: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
      flexShrink: 0,
    },
    drawerPaper: {
      background: theme.palette.background.default,
      width: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
      paddingBottom: 50,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.mixins.toolbar,
      '& img': {
        width: '100%',
        height: '100%',
      },
    },
    item: {
      display: 'block',
      paddingTop: 0,
      paddingBottom: 0,
    },
    itemLeaf: {
      display: 'flex',
      paddingTop: 0,
      paddingBottom: 0,
      '&:hover': {},
    },
    button: {
      padding: '10px 8px',
      justifyContent: 'flex-start',
      textTransform: 'none',
      letterSpacing: 0,
      width: '100%',
    },
    buttonLeaf: {
      display: 'flex',
      padding: '10px 8px',
      justifyContent: 'flex-start',
      textTransform: 'none',
      letterSpacing: 0,
      width: '100%',
      fontWeight: 400,
      '&.depth-0': {
        '& $title': {
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
      '&:hover': {
        textDecoration: 'none',
      },
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(1),
    },
    title: {
      marginRight: 'auto',
      fontSize: '1rem',
    },
    navBar_link: {
      color: 'inherit',
      display: 'flex',
      justifyContent: 'center',
      textDecoration: 'none',
      flex: 1,
      height: '100%',
      width: '100%',
    },
  }),
);

export default useStyles;
