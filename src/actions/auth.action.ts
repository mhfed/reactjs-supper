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

/**
 * Set axios auth config, get user detail, handle auto refresh token after login
 * @param baseUrl base url from backend
 * @param accessToken access token from backend
 * @param pin user pin
 * @param refreshToken refresh token from backend
 */
const updateAxiosAuthConfig = (baseUrl: string, accessToken: string, pin: string, refreshToken?: string) => {
  if (window.staySignedin) window.localStorage.setItem('isStaySignedIn', 'true');
  window.localStorage.setItem('uniqSeries', btoa(pin));
  const lastEmailLogin = window.localStorage.getItem('lastEmailLogin');
  refreshToken && window.localStorage.setItem(`${lastEmailLogin}_refreshToken`, refreshToken);
  axiosInstance.defaults.baseURL = `https://${baseUrl}`;
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  axiosInstance.defaults.headers.common['environment'] = 'iress-wealth-app';
  lastEmailLogin && authService.getUserDetail(lastEmailLogin as string);
  authService.autoRenewToken();
};

const updateAxiosAuthConfig2 = (accessToken: string, refreshToken?: string) => {
  const lastUserId = window.localStorage.getItem('lastUserId');
  refreshToken && window.localStorage.setItem(`${lastUserId}_refreshToken`, refreshToken);
  axiosInstance.defaults.baseURL = process.env.REACT_APP_ENDPOINT_URL;
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  axiosInstance.defaults.headers.common['environment'] = 'iress-wealth-app';
};

/**
 * Clear axios auth config when logout
 */
const clearAxiosAuthConfig = () => {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_ENDPOINT_URL;
  delete axiosInstance.defaults.headers.common['Authorization'];
};

/**
 * Handle set pin when first time login
 * @param pin user pin
 * @param navigate react router action to navigate screen after login success
 */
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
    navigate(PATH_NAME.NOTIFICATION_MANAGEMENT);
  }
};

/**
 * Set pin after user be force change password.
 * @param pin user pin
 * @param password user password
 * @param navigate react router action to navigate screen after login success
 */
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
    navigate(PATH_NAME.NOTIFICATION_MANAGEMENT);
  }
};

/**
 * Verify user pin after login
 * @param pin user pin
 * @param navigate react router action to navigate screen after login success
 */
export const verifyPin = (pin: string, navigate: NavigateFunction) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.PIN_REQUEST });

  const { refreshToken, accessToken, baseUrl, error } = await authService.verifyPin(pin);
  if (error) {
    let count = '0';
    if (error.errorCode === 'INVALID_TOKEN') {
      count = window.localStorage.getItem('failedCount') || '0';
      window.localStorage.setItem('failedCount', +count + 1 + '');
    }
    dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error: error?.errorCodeLang, count: +count + 1 } });
  } else {
    window.localStorage.removeItem('failedCount');
    updateAxiosAuthConfig(baseUrl, accessToken, pin);
    dispatch({
      type: IAuthActionTypes.PIN_SUCCESS,
      payload: { refreshToken, accessToken, baseUrl },
    });
    navigate(PATH_NAME.NOTIFICATION_MANAGEMENT);
  }
};

/**
 * Switch to set pin screen
 */
export const setPinAfterChangePass = () => ({
  type: IAuthActionTypes.FORCE_SET_PIN,
});

/**
 * Clear auth error
 */
export const clearError = () => ({
  type: IAuthActionTypes.CLEAR_ERROR,
});

/**
 * Set current user info
 * @param userInfo user data
 */
export const updateUserInfo = (userInfo: any) => ({
  type: IAuthActionTypes.UPDATE_USER_INFO,
  payload: userInfo,
});

/**
 * Update token after renew token
 * @param data new auth data include access token, device id...
 * @returns
 */
export const updateToken = (data: any) => ({
  type: IAuthActionTypes.UPDATE_TOKEN,
  payload: data,
});

/**
 * Handle login with email and password
 * @param email user email login
 * @param password user password
 */
export const login = (email: string, password: string) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.LOGIN_REQUEST });

  const {
    refreshToken,
    deviceID,
    user_type: userType,
    error,
    accessToken,
  } = await authService.loginWithEmailAndPassword(email, password);
  window.localStorage.setItem('lastEmailLogin', email);
  if (error) {
    const { errorCode, errorCodeLang, token } = error;
    if (errorCode === 2059 || (errorCode === 2057 && token)) {
      dispatch({ type: IAuthActionTypes.SET_PASSWORD, payload: { createPasswordToken: token, email } });
    } else {
      dispatch({ type: IAuthActionTypes.LOGIN_FAILURE, payload: { error: errorCodeLang, token } });
    }
  } else {
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

/**
 * Handle logout
 * @param dispatch redux dispatch action
 */
export const logout = (dispatch: Dispatch<any>) => {
  authService.logOut();
  clearAxiosAuthConfig();
  dispatch({ type: IAuthActionTypes.LOGOUT });
};

/**
 * Handle auto login when user tick on stayed login
 * @param saveRefreshToken saved refresh token
 * @param deviceID last device id saved
 * @param pin user pin
 * @param navigate react router action to navigate screen after login success
 */
export const autoLogin =
  (saveRefreshToken: string, deviceID: string, pin: string, navigate: NavigateFunction, successCb: () => void) =>
  async (dispatch: Dispatch<any>) => {
    dispatch({
      type: IAuthActionTypes.SILENT_LOGIN,
      payload: { refreshToken: saveRefreshToken, deviceID },
    });
    const { refreshToken, accessToken, baseUrl, error } = await authService.verifyPin(pin);
    if (error) {
      dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error: error?.errorCodeLang } });
    } else {
      successCb?.();
      updateAxiosAuthConfig(baseUrl, accessToken, pin);
      dispatch({
        type: IAuthActionTypes.PIN_SUCCESS,
        payload: { refreshToken, accessToken, baseUrl },
      });
      navigate(PATH_NAME.NOTIFICATION_MANAGEMENT);
    }
  };

export const autoLoginNew =
  (saveAccessToken: string, saveRefreshToken: string, navigate: NavigateFunction, successCb: () => void) =>
  async (dispatch: Dispatch<any>) => {
    successCb?.();
    updateAxiosAuthConfig2(saveAccessToken, saveRefreshToken);
    navigate(PATH_NAME.NOTIFICATION_MANAGEMENT);
  };

/**
 * Handle iress logout
 */
export const iressLogout = () => ({
  type: IAuthActionTypes.IRESS_LOGOUT,
});

/**
 * Save iress auth data to redux to fetch report or search security code to create new articles
 * @param iressAccessToken access token
 * @param iressExpiredTime expire time
 */
export const iressLogin = (iressAccessToken: string | null, iressExpiredTime: number | null) => ({
  type: IAuthActionTypes.IRESS_LOGIN,
  payload: { iressAccessToken, iressExpiredTime },
});

/*
* Created on Wed Mar 29 2023

 * Handle login with code

 * @param code
 * @param redirect_uri
 * @param site_name
 * @returns
 */
export const loginIress =
  (code: string, redirectUrL: string, sitename: string, navigate: NavigateFunction) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: IAuthActionTypes.LOGIN_REQUEST });
    const { user_id, expires_in, capability, refreshToken, accessToken, error } = await authService.loginWithCodeFromIress(
      code,
      redirectUrL,
      sitename,
    );
    window.localStorage.setItem('lastUserId', user_id);

    updateAxiosAuthConfig2(accessToken, refreshToken);

    if (error) {
      const { errorCodeLang } = error;
      dispatch({ type: IAuthActionTypes.LOGIN_FAILURE, payload: { error: errorCodeLang } });
      console.log('loginIress error', error);
    } else {
      if (authService.checkPermissionLogin(capability)) {
        refreshToken && window.localStorage.setItem(`${user_id}_refreshToken`, refreshToken);
        accessToken && window.localStorage.setItem(`${user_id}_accessToken`, accessToken);

        // login successfully
        dispatch({
          type: IAuthActionTypes.LOGIN_SUCCESS,
          payload: {
            refreshToken,
            accessToken,
            sitename,
          },
        });

        // Show pop up renew token before token expired
        authService.showPopupRenewToken(expires_in);

        // Show pop up renew token before token expired
        authService.showPopupExpired(expires_in);

        // Remove localStorage
        refreshToken && window.localStorage.removeItem(`${user_id}_refreshToken`);
        accessToken && window.localStorage.removeItem(`${user_id}_accessToken`);

        window.localStorage.removeItem(`${user_id}`);
        window.localStorage.removeItem(`oldUrl`);
        navigate(PATH_NAME.NOTIFICATION_MANAGEMENT);
      } else {
        dispatch({ type: IAuthActionTypes.LOGIN_FAILURE, payload: { error: 'error_dont_have_permission' } });
      }
    }
  };
