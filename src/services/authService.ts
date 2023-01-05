import httpRequest from 'services/httpRequest';
import {
  getSessionUrl,
  getAuthUrl,
  getDecodeUrl,
  getRefreshUrl,
  getPinUrl,
  getUserDetailByEmailUrl,
  getUserGroupUrl,
} from 'apis/request.url';
import CryptoJS from 'react-native-crypto-js';
import store from 'stores';
import { IAuthType } from 'models/IAuthState';
import { updateUserInfo, updateToken } from 'actions/auth.action';
import { axiosInstance } from 'services/initRequest';

class AuthService {
  intervalId = 0;

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

  loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const sessionId = +new Date();
      const { data: session } = await httpRequest.post(getSessionUrl(sessionId), {}, { showSpinner: true });
      const loginResponse: any = await httpRequest.post(
        getAuthUrl(),
        {
          data: {
            username: email,
            password: CryptoJS.AES.encrypt(password, session.key).toString(),
            provider: 'paritech',
            storage_token: true,
            session_id: `${sessionId}`,
          },
        },
        { showSpinner: true },
      );
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

  verifyPin = async (pin: string) => {
    try {
      const refreshToken = store.getState().auth.refreshToken || '';
      const deviceID = store.getState().auth.deviceID || '';
      const sessionId = +new Date();
      const { data: session } = await httpRequest.post(getSessionUrl(sessionId), {}, { showSpinner: true });
      const decodeResponse: any = await httpRequest.post(
        getDecodeUrl(),
        {
          data: {
            token: refreshToken,
            pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
            session_id: `${sessionId}`,
          },
        },
        { showSpinner: true },
      );
      const response: any = await httpRequest.post(
        getRefreshUrl(),
        {
          data: {
            refreshToken: decodeResponse.token,
            deviceID,
          },
        },
        { showSpinner: true },
      );
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

  setPinFirstTime = async (pin: string) => {
    try {
      const accessTokenLogin = store.getState().auth.accessToken || '';
      const sessionId = +new Date();
      const { data: session } = await httpRequest.post(getSessionUrl(sessionId), {}, { showSpinner: true });
      const pinResponse: any = await httpRequest.post(
        getPinUrl(),
        {
          data: {
            pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
            accessToken: accessTokenLogin,
            env: IAuthType.WEB_POST_PIN,
            session_id: `${sessionId}`,
          },
        },
        { showSpinner: true },
      );
      const { refreshToken, accessToken, baseUrl } = pinResponse;
      const response: any = await httpRequest.post(
        getDecodeUrl(),
        {
          data: {
            token: refreshToken,
            pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
            session_id: `${sessionId}`,
          },
        },
        { showSpinner: true },
      );
      return {
        refreshToken: response.token,
        accessToken,
        baseUrl,
      };
    } catch (error) {
      return { error };
    }
  };

  forceSetPin = async (pin: string, password: string) => {
    try {
      const email = store.getState().auth.email || '';
      const sessionId = +new Date();
      const { data: session } = await httpRequest.post(getSessionUrl(sessionId), {}, { showSpinner: true });
      const authResponse: any = await httpRequest.post(
        getAuthUrl(),
        {
          data: {
            username: (email + '').toLowerCase(),
            password: CryptoJS.AES.encrypt(password, session.key).toString(),
            provider: 'paritech',
            storage_token: true,
            session_id: `${sessionId}`,
          },
        },
        { showSpinner: true },
      );
      const pinResponse: any = await httpRequest.post(
        getPinUrl(),
        {
          data: {
            pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
            accessToken: authResponse.accessToken,
            env: IAuthType.WEB_POST_PIN,
            session_id: `${sessionId}`,
          },
        },
        { showSpinner: true },
      );
      const { refreshToken, accessToken, baseUrl } = pinResponse;
      const response: any = await httpRequest.post(
        getDecodeUrl(),
        {
          data: {
            token: refreshToken,
            pin: CryptoJS.AES.encrypt(pin, session.key).toString(),
            session_id: `${sessionId}`,
          },
        },
        { showSpinner: true },
      );
      return {
        refreshToken: response.token,
        accessToken,
        baseUrl,
      };
    } catch (error) {
      return { error };
    }
  };

  logOut = () => {
    localStorage.clear();
  };

  getAccessToken = () => store.getState().auth.accessToken;

  isAuthenticated = () => !!this.getAccessToken();
}

const authService = new AuthService();

export default authService;
