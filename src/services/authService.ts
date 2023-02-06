/*
 * Created on Fri Jan 06 2023
 *
 * Handle auth action
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import httpRequest from 'services/httpRequest';
import {
  getSessionUrl,
  getAuthUrl,
  getDecodeUrl,
  getRefreshUrl,
  getPinUrl,
  getUserDetailByEmailUrl,
  getUserGroupUrl,
  getLogoutUrl,
} from 'apis/request.url';
import CryptoJS from 'react-native-crypto-js';
import store from 'stores';
import { IAuthType } from 'models/IAuthState';
import { updateUserInfo, updateToken } from 'actions/auth.action';
import { axiosInstance } from 'services/initRequest';
import { clearStorage } from 'helpers';

class AuthService {
  intervalId = 0;

  /**
   * Handle renew token request
   */
  autoRenewToken = () => {
    this.intervalId && clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      const refreshToken = store.getState().auth.refreshToken || '';
      const deviceID = store.getState().auth.deviceID || '';
      httpRequest
        .post(getRefreshUrl(), {
          data: {
            refreshToken,
            deviceID,
          },
        })
        .then((res: any) => {
          store.dispatch(updateToken(res));
          res.accessToken && (axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`);
        })
        .catch((error) => {
          console.error('autoRenewToken error: ', error);
        });
    }, process.env.REACT_APP_REFRESH_TOKEN_TIME);
  };

  /**
   * Get user detail, user group and save to redux store
   * @param email user login email
   */
  getUserDetail = async (email: string) => {
    try {
      const userDetailResponse: any = await httpRequest.get(getUserDetailByEmailUrl(email));
      const { data: roleGroupresponse } = await httpRequest.get(getUserGroupUrl(userDetailResponse.role_group));
      userDetailResponse.group_name = roleGroupresponse?.[0]?.group_name;
      store.dispatch(updateUserInfo(userDetailResponse));
    } catch (error) {
      console.error(`getUserDetail for ${email} error: `, error);
    }
  };

  /**
   * Handle login with email and password
   * @param email user login email
   * @param password user login password
   */
  loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const sessionId = +new Date();
      const { data: session } = await httpRequest.post(getSessionUrl(sessionId), {});
      const loginResponse: any = await httpRequest.post(getAuthUrl(), {
        data: {
          username: email,
          password: CryptoJS.AES.encrypt(password, session.key).toString(),
          storage_token: true,
          session_id: `${sessionId}`,
        },
      });
      return {
        refreshToken: loginResponse.refreshToken,
        deviceID: loginResponse.deviceID,
        user_type: loginResponse.user_type,
        accessToken: loginResponse.accessToken,
      };
    } catch (error) {
      return { error };
    }
  };

  /**
   * Handle verify user pin request
   * @param pin user pin
   */
  verifyPin = async (pin: string) => {
    try {
      const refreshToken = store.getState().auth.refreshToken || '';
      const deviceID = store.getState().auth.deviceID || '';
      const sessionId = +new Date();
      const { data: session } = await httpRequest.post(getSessionUrl(sessionId), {});
      const decodeResponse: any = await httpRequest.post(getDecodeUrl(), {
        data: {
          token: refreshToken,
          pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
          session_id: `${sessionId}`,
        },
      });
      const response: any = await httpRequest.post(getRefreshUrl(), {
        data: {
          refreshToken: decodeResponse.token,
          deviceID,
        },
      });
      const { accessToken, baseUrl } = response;
      return {
        accessToken,
        baseUrl,
        refreshToken: decodeResponse.token,
      };
    } catch (error) {
      return { error };
    }
  };

  /**
   * Handle set pin at first time login
   * @param pin user pin
   */
  setPinFirstTime = async (pin: string) => {
    try {
      const accessTokenLogin = store.getState().auth.accessToken || '';
      const sessionId = +new Date();
      const { data: session } = await httpRequest.post(getSessionUrl(sessionId), {});
      const pinResponse: any = await httpRequest.post(getPinUrl(), {
        data: {
          pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
          accessToken: accessTokenLogin,
          env: IAuthType.WEB_POST_PIN,
          session_id: `${sessionId}`,
        },
      });
      const { refreshToken, accessToken, baseUrl } = pinResponse;
      const response: any = await httpRequest.post(getDecodeUrl(), {
        data: {
          token: refreshToken,
          pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
          session_id: `${sessionId}`,
        },
      });
      return {
        refreshToken: response.token,
        accessToken,
        baseUrl,
      };
    } catch (error) {
      return { error };
    }
  };

  /**
   * Set pin after be force change password
   * @param pin user pin
   * @param password user login password
   */
  forceSetPin = async (pin: string, password: string) => {
    try {
      const email = store.getState().auth.email || '';
      const sessionId = +new Date();
      const { data: session } = await httpRequest.post(getSessionUrl(sessionId), {});
      const authResponse: any = await httpRequest.post(getAuthUrl(), {
        data: {
          username: (email + '').toLowerCase(),
          password: CryptoJS.AES.encrypt(password, session.key).toString(),
          storage_token: true,
          session_id: `${sessionId}`,
        },
      });
      const pinResponse: any = await httpRequest.post(getPinUrl(), {
        data: {
          pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
          accessToken: authResponse.accessToken,
          env: IAuthType.WEB_POST_PIN,
          session_id: `${sessionId}`,
        },
      });
      const { refreshToken, accessToken, baseUrl } = pinResponse;
      const response: any = await httpRequest.post(getDecodeUrl(), {
        data: {
          token: refreshToken,
          pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
          session_id: `${sessionId}`,
        },
      });
      return {
        refreshToken: response.token,
        accessToken,
        baseUrl,
      };
    } catch (error) {
      return { error };
    }
  };

  /**
   * Handle logout
   */
  logOut = () => {
    const accessTokenLogin = store.getState().auth.accessToken || '';
    accessTokenLogin && httpRequest.post(getLogoutUrl());
    clearStorage();
  };

  // get access token from store
  getAccessToken = () => store.getState().auth.accessToken;

  // check logined
  isAuthenticated = () => !!this.getAccessToken();

  // check iress session expired
  checkIressSessionLogout = (errorCode: number) => {
    return [100000, 100003].includes(errorCode);
  };
}

const authService = new AuthService();

export default authService;
