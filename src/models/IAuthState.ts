/*
 * Created on Fri Jan 06 2023
 *
 * Auth models (redux action type, common type)
 *
 * Copyright (c) 2023 - Novus Fintech
 */

export enum IAuthActionTypes {
  LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'AUTH/LOGIN_SUCESS',
  LOGIN_FAILURE = 'AUTH/LOGIN_FAILURE',
  SILENT_LOGIN = 'AUTH/SILENT_LOGIN',
  PIN_REQUEST = 'AUTH/PIN_REQUEST',
  PIN_SUCCESS = 'AUTH/PIN_SUCCESS',
  PIN_FAILURE = 'AUTH/PIN_FAILURE',
  FORCE_SET_PIN = 'AUTH/FORCE_SET_PIN',
  SET_PASSWORD = 'AUTH/SET_PASSWORD',
  LOGOUT = 'AUTH/LOGOUT',
  REGISTER = 'AUTH/REGISTER',
  UPDATE_USER_INFO = 'AUTH/UPDATE_USER_INFO',
  UPDATE_TOKEN = 'AUTH/UPDATE_TOKEN',
  CLEAR_ERROR = 'AUTH/CLEAR_ERROR',
  SET_PASSWORD_FAILURE = 'AUTH/SET_PASSWORD_FAILURE',
  IRESS_LOGIN = 'AUTH/IRESS_LOGIN',
  IRESS_LOGOUT = 'AUTH/IRESS_LOGOUT',
}

export enum IAuthStep {
  LOGIN = 1,
  SET_PIN = 2,
  ENTER_PIN = 3,
  FORCE_SET_PIN = 4,
  SET_PASSWORD = 5,
}

export enum IAuthType {
  FORGOT_PASSWORD = 'forgot_password',
  WEB_FORGOT_PIN = 'WEB_FORGOT_PIN',
  WEB_POST_PIN = 'WEB_POST_PIN',
}

export type IAuthState = {
  refreshToken: string | null;
  accessToken: string | null;
  deviceID: string | null;
  email: string | null;
  isLoading: boolean | null;
  userType: string | null;
  baseUrl: string | null;
  error: string | null;
  createPasswordToken: string | null;
  step: number;
  roles: string[] | null;
  user: any;
  sitename: string | null;
  iressAccessToken: string | null;
  iressExpiredTime: number | null;
  count: number | null;
};

export type IAuthActionCreator = {
  type: string;
  payload: IAuthState;
};
