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
import { alpha } from '@mui/material/styles';

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
        color: theme.palette.common.white,
      },
      width: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
      flexShrink: 0,
    },
    drawerPaper: {
      background: theme.palette.background.menu,
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
      '& > button': {
        borderRadius: 0,
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
      },
    },
    itemLeaf: {
      display: 'flex',
      paddingTop: 0,
      paddingBottom: 0,
    },
    menuContainer: {
      '& ul li:last-child': {
        '& button': {
          borderRadius: 0,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
        },
      },
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
