/*
 * Created on Mon Jan 30 2023
 *
 * Expired dialog when have expired error from backend with any request
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import ConfirmModal from '../ConfirmModal';
import { useSelector } from 'react-redux';
import { isExpiredSelector } from 'selectors/app.selector';

const ExpiredDialog = () => {
  const isExpired = useSelector(isExpiredSelector);

  /**
   * Clear local storage and reload web when user confirm expired
   */
  const onExpired = () => {
    window.location.reload();
  };

  return <ConfirmModal open={isExpired} alertContent="lang_creating_pin_request_has_expired" onSubmit={onExpired} />;
};

export default ExpiredDialog;
