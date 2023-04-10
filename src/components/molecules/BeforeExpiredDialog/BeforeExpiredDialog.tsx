/*
 * Created on Mon Jan 30 2023
 *
 * Expired dialog when have expired error from backend with any request
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { setStayin, showPopupBeforeExpired } from 'actions/app.action';
import React from 'react';
import { useSelector } from 'react-redux';
import { dataStayinPopupSelector } from 'selectors/app.selector';
import authService from 'services/authService';
import store from 'stores';
import ConfirmModal from '../ConfirmModal';

const BeforeExpiredDialog = () => {
  const { isAboutToExpired, timeRemaining } = useSelector(dataStayinPopupSelector);

  /**
   * Close modal confirm expired
   */
  const handleClose = () => {
    store.dispatch(showPopupBeforeExpired(false));
    store.dispatch(setStayin(false));
  };

  const handleRenewToken = () => {
    authService.processRenewToken();
    store.dispatch(showPopupBeforeExpired(false));
  };

  return (
    <ConfirmModal
      open={!!isAboutToExpired}
      alertContent="lang_session_is_about_to_expired"
      timeRemaining={timeRemaining}
      onClose={handleClose}
      onSubmit={handleRenewToken}
      textSubmit="lang_yes"
      textCancel="lang_no"
    />
  );
};

export default BeforeExpiredDialog;
