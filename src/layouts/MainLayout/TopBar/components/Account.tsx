/*
 * Created on Fri Jan 06 2023
 *
 * Account info at topbar
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { PATH_NAME } from 'configs';
import { logout } from 'actions/auth.action';
import ConfirmModal from 'components/molecules/ConfirmModal';

function Account({ ...classes }) {
  const { t: translate } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);

  /**
   * Open menu
   * @param event click event
   */
  const _handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * close menu
   */
  const _handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle logout
   */
  const _handleLogout = () => {
    dispatch(logout as any);
    navigate(PATH_NAME.LOGIN);
    setAnchorEl(null);
  };

  /**
   * close logout confirm popup
   */
  const onCloseLogout = () => {
    setOpen(false);
  };

  /**
   * open logout confirm popup
   */
  const onShowLogoutConfirm = () => {
    setOpen(true);
  };

  /**
   * Confirm logout handle
   */
  const onConfirmLogout = () => {
    _handleLogout();
  };

  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={_handleMenu}
        size="large"
      >
        <AccountCircle color={anchorEl ? 'primary' : 'inherit'} />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={_handleClose}
      >
        {/* <div className={classes.textRole}>{user.group_name}</div>
        <Divider /> */}
        {/* <MenuItem>My account</MenuItem> */}
        <MenuItem className={classes.menuProfile} onClick={onShowLogoutConfirm}>
          {translate('lang_sign_out')}
        </MenuItem>
      </Menu>
      <ConfirmModal
        open={open}
        alertTitle="lang_sign_out"
        alertContent="lang_confirm_logout"
        onClose={onCloseLogout}
        onSubmit={onConfirmLogout}
      />
    </>
  );
}

export default memo(Account);
