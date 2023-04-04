/*
 * Created on Fri Jan 06 2023
 *
 * Models for app (redux action, common type)
 *
 * Copyright (c) 2023 - Novus Fintech
 */

export const IAppActionTypes = {
  SET_CONNECTING: 'APP/SET_CONNECTING',
  SET_LOADING: 'APP/SET_LOADING',
  SET_DIALOG: 'APP/SET_DIALOG',
  ENQUEUE_SNACKBAR: 'APP/ENQUEUE_SNACKBAR',
  REMOVE_SNACKBAR: 'APP/REMOVE_SNACKBAR',
  SET_EXPIRED: 'APP/SET_EXPIRED',
  SET_BEFORE_EXPIRED: 'APP/SET_BEFORE_EXPIRED',
};

type IDialog = {
  type: string;
  isShow: boolean;
  content?: React.ReactNode | string;
};

export type IAppState = {
  isConnecting: boolean;
  isLoading: boolean;
  dialog: IDialog;
  notifications: any;
  expiredNoti: string;
  isAboutToExpired: boolean;
};

export type IAppActionCreator = {
  type: string;
  payload: any;
};

export type INotifer = {
  key: number | string;
  message?: string | React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
};
