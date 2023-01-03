import React, { memo } from 'react';
import clsx from 'clsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Account from './components/Account';
import Language from './components/Language';
import DarkMode from './components/DarkMode';
import useStyles from './styles';

type IProps = {
  handleToogleDrawer: () => void;
  isDrawer: boolean;
};

function TopBar({ isDrawer, handleToogleDrawer }: IProps) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={clsx(classes.appBar, isDrawer && classes.appBarShift)}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleToogleDrawer}
          edge="start"
          className={clsx(classes.menuButton)}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <div className={classes.grow} />
        <div className={classes.topBar_setting}>
          <Language {...classes} />
          <DarkMode />
          <Account {...classes} />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default memo(TopBar);
