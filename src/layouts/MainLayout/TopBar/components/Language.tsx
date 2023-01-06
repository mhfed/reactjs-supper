/*
 * Created on Fri Jan 06 2023
 *
 * Change language component at topbar
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useState, memo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LANGUAGE } from 'configs';
import { useGlobalContext } from 'context/GlobalContext';

function Language({ ...classes }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setLanguage, language } = useGlobalContext();

  const _handleOpenLanguage = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const _handleChooseLanguage = (lang: string) => () => {
    setLanguage(lang);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderTextLanguage = () => {
    switch (language) {
      case LANGUAGE.ENGLISH: {
        return 'ENGLISH';
      }
      case LANGUAGE.VIETNAMESE: {
        return 'VIETNAMESE';
      }
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        color="inherit"
        className={classes.menuLanguage}
        aria-controls="simple-menu"
        title="Change Language"
        aria-haspopup="true"
        onClick={_handleOpenLanguage}
      >
        {renderTextLanguage()} <ExpandMoreIcon />
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem selected={language === LANGUAGE.ENGLISH} onClick={_handleChooseLanguage(LANGUAGE.ENGLISH)}>
          English
        </MenuItem>
        <MenuItem selected={language === LANGUAGE.VIETNAMESE} onClick={_handleChooseLanguage(LANGUAGE.VIETNAMESE)}>
          Vietnamese
        </MenuItem>
      </Menu>
    </>
  );
}

export default memo(Language);
