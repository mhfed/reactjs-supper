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
      width: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
      flexShrink: 0,
    },
    drawerPaper: {
      width: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
      paddingBottom: 50,
      background: theme.palette.background.default,
      // '& .MuiList-root': {
      //   background: theme.palette.background.default,
      // },
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.mixins.toolbar,
      fontSize: 20,
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
    },
    button: {
      color: theme.palette.text.secondary,
      padding: '10px 8px',
      justifyContent: 'flex-start',
      textTransform: 'none',
      letterSpacing: 0,
      width: '100%',
    },
    buttonLeaf: {
      display: 'flex',
      color: theme.palette.text.secondary,
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
    active: {
      color: theme.palette.secondary.main,
      '& $title': {
        fontWeight: theme.typography.fontWeightMedium,
      },
      '& $icon': {
        color: theme.palette.secondary.main,
      },
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
    version: {
      fontSize: 12,
    },
  }),
);

export default useStyles;
