import { Theme, alpha } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    background: theme.palette.background.default,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '& svg': {
      fill: theme.palette.text.primary,
    },
    '& > *': {
      color: theme.palette.text.primary,
    },
  },
  appBarShift: {
    width: `calc(100% - ${process.env.REACT_APP_DRAWER_WIDTH}px)`,
    marginLeft: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  menuLanguage: {
    // color: theme.palette.text.primary,
  },
  menuProfile: {
    minWidth: 115,
  },
  topBar_setting: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  textRole: {
    padding: '6px 16px',
    marginBottom: 6,
    fontSize: '1rem',
  },
}));

export default useStyles;
