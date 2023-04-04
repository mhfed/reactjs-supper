/*
 * Created on Fri Jan 06 2023
 *
 * Redux actions for app
 *
 * Copyright (c) 2023 - Novus Fintech
 */
import { IAppActionTypes, INotifer } from 'models/IAppState';

/**
 * Show expired popup when receivered expired error from backend
 */
export const showExpiredPopup = (text: string) => ({
  type: IAppActionTypes.SET_EXPIRED,
  payload: text,
});

/**
 * Show expired popup when before expired 15 minutes
 */
export const showPopupBeforeExpired = (isAboutToExpiredSelector: boolean) => ({
  type: IAppActionTypes.SET_BEFORE_EXPIRED,
  payload: isAboutToExpiredSelector,
});

/**
 * Set app loading
 * @param isLoading loading status
 */
export const setLoading = (isLoading: boolean) => ({
  type: IAppActionTypes.SET_LOADING,
  payload: isLoading,
});

/**
 * Set connect status when network connect, disconnect
 * @param isConnecting connect status
 * @returns
 */
export const setConnecting = (isConnecting: boolean) => ({
  type: IAppActionTypes.SET_CONNECTING,
  payload: isConnecting,
});

/**
 * Show notification on screen
 * @param notification notification data
 */
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

/**
 * Remove notification from screen
 * @param key notification id
 */
export const removeSnackbar = (key: string | number | undefined) => ({
  type: IAppActionTypes.REMOVE_SNACKBAR,
  payload: key,
});
