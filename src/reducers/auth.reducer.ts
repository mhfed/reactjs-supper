/*
 * Created on Fri Jan 06 2023
 *
 * Auth redux reducer
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { IAuthActionTypes, IAuthActionCreator, IAuthState, IAuthStep } from 'models/IAuthState';

const initialState: IAuthState = {
  refreshToken: null,
  accessToken: null,
  deviceID: null,
  userType: null,
  email: null,
  isLoading: false,
  error: '',
  baseUrl: '',
  createPasswordToken: null,
  step: IAuthStep.LOGIN,
  roles: [],
  user: {},
  sitename: '',
  iressAccessToken: null,
  iressExpiredTime: null,
  count: null,
  userId: null,
};

const reducer = (state = initialState, { type, payload }: IAuthActionCreator) => {
  switch (type) {
    case IAuthActionTypes.IRESS_LOGIN: {
      return {
        ...state,
        sitename: payload.sitename,
        iressAccessToken: payload.iressAccessToken,
        iressExpiredTime: payload.iressExpiredTime,
      };
    }
    case IAuthActionTypes.IRESS_LOGOUT: {
      return {
        ...state,
        sitename: null,
        iressAccessToken: null,
        iressExpiredTime: null,
      };
    }
    case IAuthActionTypes.UPDATE_TOKEN:
      return {
        ...state,
        accessToken: payload,
      };
    case IAuthActionTypes.UPDATE_USER_INFO:
      return {
        ...state,
        user: { ...state.user, ...payload },
      };
    case IAuthActionTypes.LOGIN_REQUEST:
    case IAuthActionTypes.PIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case IAuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: '',
      };
    case IAuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        refreshToken: payload.refreshToken,
        accessToken: payload.accessToken,
        sitename: payload.sitename,
        userId: payload.userId,
        error: '',
        isLoading: false,
      };
    case IAuthActionTypes.PIN_SUCCESS:
      return {
        ...state,
        refreshToken: payload.refreshToken,
        accessToken: payload.accessToken,
        baseUrl: payload.baseUrl,
        error: '',
        isLoading: false,
      };
    case IAuthActionTypes.PIN_FAILURE:
      return {
        ...state,
        error: payload.error + '|' + Date.now(),
        isLoading: false,
        count: payload.count || 0,
      };
    case IAuthActionTypes.LOGIN_FAILURE:
    case IAuthActionTypes.SET_PASSWORD_FAILURE:
      return {
        ...state,
        error: payload.error + '|' + Date.now(),
        isLoading: false,
      };
    case IAuthActionTypes.LOGOUT:
      return {
        ...state,
        ...initialState,
      };
    case IAuthActionTypes.FORCE_SET_PIN:
      return {
        ...state,
        error: '',
        step: IAuthStep.FORCE_SET_PIN,
      };
    case IAuthActionTypes.SET_PASSWORD:
      return {
        ...state,
        email: payload.email,
        isLoading: false,
        createPasswordToken: payload.createPasswordToken,
        error: '',
        step: IAuthStep.SET_PASSWORD,
      };
    case IAuthActionTypes.SILENT_LOGIN:
      return {
        ...state,
        refreshToken: payload.refreshToken,
        deviceID: payload.deviceID,
      };
    default:
      return state;
  }
};

export default reducer;
