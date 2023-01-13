/*
 * Created on Fri Jan 06 2023
 *
 * Stack bar for success, warning, error notification
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { notificationsSelector } from 'selectors/app.selector';
import { removeSnackbar } from 'actions/app.action';

let displayed: any[] = [];

const Notifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(notificationsSelector);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const storeDisplayed = (id: string | number) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: string | number) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    Object.values(notifications).forEach((ele: any) => {
      // do nothing if snackbar is already displayed
      if (displayed.includes(ele.key)) return;

      // display snackbar using notistack
      enqueueSnackbar(t(ele.message), {
        autoHideDuration: process.env.REACT_APP_AUTO_HIDE_SNACKBAR,
        key: ele.key,
        variant: ele.variant,
        disableWindowBlurListener: true,
        onExited: (_, keySnackBar) => {
          dispatch(removeSnackbar(keySnackBar));
          removeDisplayed(keySnackBar);
        },
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(ele.key);
    });
  }, [notifications, enqueueSnackbar, dispatch]);

  return null;
};

export default Notifier;
