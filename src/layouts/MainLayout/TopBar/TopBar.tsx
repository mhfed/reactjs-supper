/*
 * Created on Fri Jan 06 2023
 *
 * Topbar
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { memo } from 'react';
import clsx from 'clsx';
import { useLocation } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Account from './components/Account';
import Language from './components/Language';
import DarkMode from './components/DarkMode';
import useStyles from './styles';
import { navBarTitle } from 'routes/navBarCommon';
import { Trans } from 'react-i18next';

type IProps = {
  handleToogleDrawer: () => void;
  isDrawer: boolean;
};

function TopBar({ isDrawer, handleToogleDrawer }: IProps) {
  const classes = useStyles();
  const location = useLocation();

  const title = navBarTitle[location.pathname];
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
        <Typography variant="h5" sx={{ textTransform: 'uppercase' }}>
          <Trans>{title}</Trans>
        </Typography>
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
