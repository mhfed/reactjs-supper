/*
 * Created on Fri Jan 06 2023
 *
 * Redux actions for app
 *
 * Copyright (c) 2023 - Novus Fintech
 */
import { IAppActionTypes, INotifer } from 'models/IAppState';

export const iressLogout = () => ({
  type: IAppActionTypes.IRESS_LOGOUT,
});

export const showExpiredPopup = () => ({
  type: IAppActionTypes.SET_EXPIRED,
});

export const setIressLogin = (isIressLogin: boolean) => ({
  type: IAppActionTypes.SET_IRESS_LOGIN,
  payload: isIressLogin,
});

export const setLoading = (isLoading: boolean) => ({
  type: IAppActionTypes.SET_LOADING,
  payload: isLoading,
});

export const setConnecting = (isConnecting: boolean) => ({
  type: IAppActionTypes.SET_CONNECTING,
  payload: isConnecting,
});

export const setDialog = (isShow: boolean, type: string = 'error', content: React.ReactNode = '') => ({
  type: IAppActionTypes.SET_DIALOG,
  payload: {
    dialog: {
      type,
      isShow,
      content,
    },
  },
});

export const enqueueSnackbarAction = (notification: INotifer) => {
  return {
    type: IAppActionTypes.ENQUEUE_SNACKBAR,
    payload: {
      key: notification.key || new Date().getTime() + Math.random(),
      message: notification.message,
      variant: notification.variant || 'success',
    },
  };
};

export const removeSnackbar = (key: string | number | undefined) => ({
  type: IAppActionTypes.REMOVE_SNACKBAR,
  payload: key,
});
