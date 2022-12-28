import { Dispatch } from 'redux';
import { IAuthActionTypes, IAuthStep } from 'models/IAuthState';
import authService from 'services/authService';
import { axiosInstance } from 'services/initRequest';
import { PATH_NAME } from 'configs';
import { NavigateFunction } from 'react-router-dom';

const updateAxiosAuthConfig = (baseUrl: string, accessToken: string, refreshToken?: string) => {
  const lastEmailLogin = window.localStorage.getItem('lastEmailLogin');
  refreshToken && window.localStorage.setItem(`${lastEmailLogin}_refreshToken`, refreshToken);
  axiosInstance.defaults.baseURL = baseUrl;
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

const clearAxiosAuthConfig = () => {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_ENDPOINT_URL;
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const changePasswordRequest = () => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.CHANGE_PASSWORD });
};

export const setPinFirstTime = (pin: string, navigate: NavigateFunction) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.PIN_REQUEST });

  const { refreshToken, accessToken, baseUrl, error } = await authService.setPinFirstTime(pin);
  if (error) {
    dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error } });
  } else {
    updateAxiosAuthConfig(baseUrl, accessToken, refreshToken);
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
    dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error } });
  } else {
    updateAxiosAuthConfig(baseUrl, accessToken, refreshToken);
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
    dispatch({ type: IAuthActionTypes.PIN_FAILURE, payload: { error } });
  } else {
    updateAxiosAuthConfig(baseUrl, accessToken);
    dispatch({
      type: IAuthActionTypes.PIN_SUCCESS,
      payload: { refreshToken, accessToken, baseUrl },
    });
    navigate(PATH_NAME.USER_MANAGEMENT);
  }
};

export const setPinAfterChangePass = () => async (dispatch: Dispatch<any>) => {
  dispatch({
    type: IAuthActionTypes.FORCE_SET_PIN,
  });
};

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
    dispatch({ type: IAuthActionTypes.LOGIN_FAILURE, payload: { error } });
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

export const autoLogin = (refreshToken: string, deviceID: string) => (dispatch: Dispatch<any>) => {
  dispatch({
    type: IAuthActionTypes.SILENT_LOGIN,
    payload: { refreshToken, deviceID },
  });
};
