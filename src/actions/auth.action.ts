/*
 * Created on Fri Jan 06 2023
 *
 * Redux action for auth
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { Dispatch } from 'redux';
import { IAuthActionTypes, IAuthStep } from 'models/IAuthState';
import authService from 'services/authService';
import { axiosInstance } from 'services/initRequest';
import { PATH_NAME } from 'configs';
import { NavigateFunction } from 'react-router-dom';

const updateAxiosAuthConfig = (baseUrl: string, accessToken: string, pin: string, refreshToken?: string) => {
  window.localStorage.setItem('isAutoLoging', 'false');
  window.localStorage.setItem('uniqSeries', btoa(pin));
  const lastEmailLogin = window.localStorage.getItem('lastEmailLogin');
  refreshToken && window.localStorage.setItem(`${lastEmailLogin}_refreshToken`, refreshToken);
  axiosInstance.defaults.baseURL = `https://${baseUrl}`;
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  axiosInstance.defaults.headers.common['environment'] = 'iress-wealth-app';
  authService.getUserDetail(lastEmailLogin as string);
  authService.autoRenewToken();
};

const clearAxiosAuthConfig = () => {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_ENDPOINT_URL;
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const setPinFirstTime = (pin: string, navigate: NavigateFunction) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.PIN_REQUEST });

  const { refreshToken, accessToken, baseUrl, error } = await authService.setPinFirstTime(pin);
  if (error) {
    dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error: error?.errorCodeLang } });
  } else {
    updateAxiosAuthConfig(baseUrl, accessToken, pin, refreshToken);
    dispatch({
      type: IAuthActionTypes.PIN_SUCCESS,
      payload: { refreshToken, accessToken, baseUrl },
    });
    navigate(PATH_NAME.USER_MANAGEMENT);
  }
};

export const forceSetPin = (pin: string, password: string, navigate: NavigateFunction) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.PIN_REQUEST });

  const { refreshToken, accessToken, baseUrl, error } = await authService.forceSetPin(pin, password);
  if (error) {
    dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error: error?.errorCodeLang } });
  } else {
    updateAxiosAuthConfig(baseUrl, accessToken, pin, refreshToken);
    dispatch({
      type: IAuthActionTypes.PIN_SUCCESS,
      payload: { refreshToken, accessToken, baseUrl },
    });
    navigate(PATH_NAME.USER_MANAGEMENT);
  }
};

export const verifyPin = (pin: string, navigate: NavigateFunction) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.PIN_REQUEST });

  const { refreshToken, accessToken, baseUrl, error } = await authService.verifyPin(pin);
  if (error) {
    dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error: error?.errorCodeLang } });
  } else {
    updateAxiosAuthConfig(baseUrl, accessToken, pin);
    dispatch({
      type: IAuthActionTypes.PIN_SUCCESS,
      payload: { refreshToken, accessToken, baseUrl },
    });
    navigate(PATH_NAME.USER_MANAGEMENT);
  }
};

export const setPinAfterChangePass = () => ({
  type: IAuthActionTypes.FORCE_SET_PIN,
});

export const clearError = () => ({
  type: IAuthActionTypes.CLEAR_ERROR,
});

export const updateUserInfo = (userInfo: any) => ({
  type: IAuthActionTypes.UPDATE_USER_INFO,
  payload: userInfo,
});

export const updateToken = (data: any) => ({
  type: IAuthActionTypes.UPDATE_TOKEN,
  payload: data,
});

export const login = (email: string, password: string) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.LOGIN_REQUEST });

  const {
    refreshToken,
    deviceID,
    user_type: userType,
    error,
    accessToken,
  } = await authService.loginWithEmailAndPassword(email, password);
  if (error) {
    const { errorCode, errorCodeLang, token } = error;
    if (errorCode === 2059 || (errorCode === 2057 && token)) {
      dispatch({ type: IAuthActionTypes.SET_PASSWORD, payload: { createPasswordToken: token, email } });
    } else {
      dispatch({ type: IAuthActionTypes.LOGIN_FAILURE, payload: { error: errorCodeLang, token } });
    }
  } else {
    window.localStorage.setItem('lastEmailLogin', email);
    window.localStorage.setItem('lastDeviceId', deviceID);
    refreshToken && window.localStorage.setItem(`${email}_refreshToken`, refreshToken);
    dispatch({
      type: IAuthActionTypes.LOGIN_SUCCESS,
      payload: {
        email,
        refreshToken,
        deviceID,
        userType,
        accessToken,
        step: accessToken ? IAuthStep.SET_PIN : IAuthStep.ENTER_PIN,
      },
    });
  }
};

export const logout = () => (dispatch: Dispatch<any>) => {
  authService.logOut();
  clearAxiosAuthConfig();
  dispatch({ type: IAuthActionTypes.LOGOUT });
};

export const autoLogin =
  (saveRefreshToken: string, deviceID: string, pin: string, navigate: NavigateFunction) => async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IAuthActionTypes.SILENT_LOGIN,
      payload: { refreshToken: saveRefreshToken, deviceID },
    });
    const { refreshToken, accessToken, baseUrl, error } = await authService.verifyPin(pin);
    if (error) {
      dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error: error?.errorCodeLang } });
    } else {
      updateAxiosAuthConfig(baseUrl, accessToken, pin);
      dispatch({
        type: IAuthActionTypes.PIN_SUCCESS,
        payload: { refreshToken, accessToken, baseUrl },
      });
      navigate(PATH_NAME.USER_MANAGEMENT);
    }
  };
