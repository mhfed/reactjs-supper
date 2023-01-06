/*
 * Created on Fri Jan 06 2023
 *
 * Switch theme component at topbar
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { THEMES } from 'configs';
import { useGlobalContext } from 'context/GlobalContext';

function DarkMode() {
  const { modeTheme, setModeTheme } = useGlobalContext();

  const _handleChangeTheme = () => {
    const type = modeTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setModeTheme(type);
  };

  return (
    <IconButton
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      color="inherit"
      title="Change Theme"
      onClick={_handleChangeTheme}
      size="large"
    >
      {modeTheme === THEMES.LIGHT ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
}

export default memo(DarkMode);
