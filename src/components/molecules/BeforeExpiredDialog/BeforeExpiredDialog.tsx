/*
 * Created on Mon Jan 30 2023
 *
 * Expired dialog when have expired error from backend with any request
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { showPopupBeforeExpired } from 'actions/app.action';
import React from 'react';
import { useSelector } from 'react-redux';
import { isAboutToExpiredSelector } from 'selectors/app.selector';
import authService from 'services/authService';
import store from 'stores';
import ConfirmModal from '../ConfirmModal';

const BeforeExpiredDialog = () => {
  const isAboutToExpired = useSelector(isAboutToExpiredSelector);

  /**
   * Close modal confirm expired
   */
  const handleClose = () => {
    store.dispatch(showPopupBeforeExpired(false));
  };

  const handleRenewToken = () => {
    authService.processRenewToken();
    showPopupBeforeExpired(false);
  };

  return (
    <ConfirmModal
      open={!!isAboutToExpired}
      alertContent="lang_session_is_about_to_expired"
      onClose={handleClose}
      onSubmit={handleRenewToken}
      textSubmit="lang_yes"
      textCancel="lang_no"
    />
  );
};

export default BeforeExpiredDialog;
