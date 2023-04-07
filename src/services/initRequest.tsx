/*
 * Created on Fri Jan 06 2023
 *
 * Init and config axios, handle request, response, error
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { enqueueSnackbarAction, setLoading, showExpiredPopup, showPopupBeforeExpired } from 'actions/app.action';
import { clearStorage } from 'helpers';
import { checkTimeExpired } from 'helpers/common';

export type IConfig = AxiosRequestConfig & {
  showSpinner?: boolean;
  tokenApp?: string | null;
};

type IError = {
  response: {
    data: {
      error?: string | number;
      errorCode?: string | number;
      error_code?: string | number;
    };
  };
};

type IAxiosResponse = AxiosError & {
  config: {
    showSpinner?: boolean;
  };
} & IError;

const requestConfig: IConfig = {
  baseURL: process.env.REACT_APP_ENDPOINT_URL,
  timeout: 500000,
  showSpinner: false,
};

export const axiosInstance = axios.create(requestConfig);

export default function initRequest(store: any) {
  let requestCount = 0;

  function decreaseRequestCount() {
    requestCount -= 1;
    if (requestCount === 0) {
      store.dispatch(setLoading(false));
    }
  }

  // Handle axios request
  axiosInstance.interceptors.request.use(
    (config: any) => {
      // // cancel token
      // if (cancel) {
      //   cancel(); // cancel request
      // }
      // config.cancelToken = new CancelToken(function executor(c) {
      //   cancel = c;
      // });

      // show loading
      if (config?.showSpinner) {
        requestCount += 1;
        store.dispatch(setLoading(true));
      }

      // check case user sleep device
      const timeBeginLogin = store.getState().auth.timeBeginLogin;
      const expiresIn = store.getState().auth.expiresIn * 1000;
      const timeTokenRemaining = checkTimeExpired(timeBeginLogin, expiresIn);
      //time time Token Remaining
      if (expiresIn && !timeTokenRemaining) {
        return store.dispatch(showExpiredPopup('lang_your_session_has_expired'));
      }
      if (timeTokenRemaining > 0 && timeTokenRemaining < 15 * 60 * 1000) {
        store.dispatch(showPopupBeforeExpired(true, timeTokenRemaining));
      }

      return config;
    },
    (error: IAxiosResponse) => {
      if (error.config?.showSpinner) {
        decreaseRequestCount();
      }
      return Promise.reject(error);
    },
  );

  // handle axios response
  axiosInstance.interceptors.response.use(
    (res: any) => {
      if (res.config?.showSpinner) {
        decreaseRequestCount();
      }
      return res.data;
    },
    (error: IAxiosResponse) => {
      if ((error && error.config?.showSpinner) || error.code === 'ECONNABORTED') {
        decreaseRequestCount();
      }

      // handle errors
      let errorCode =
        error.response?.data?.error || error.response?.data?.errorCode || error.response?.data?.error_code || error.code || '';
      switch (error.response?.status) {
        case 400: {
          break;
        }
        case 401: {
          clearStorage();
          window.location.reload();
          break;
        }
        case 429: {
          errorCode = 'rate_limit';
          break;
        }
        case 500: {
          break;
        }
        default:
          break;
      }
      const error_lang_key = `error_code_${errorCode}`;

      if (errorCode === 'ECONNABORTED') {
        // timeout 5000
        store.dispatch(
          enqueueSnackbarAction({
            message: error_lang_key,
            key: new Date().getTime() + Math.random(),
            variant: 'error',
          }),
        );
        return;
      }

      if (errorCode === 2089) {
        // Creating PIN request has expired
        clearStorage();
        store.dispatch(showExpiredPopup(''));
      }

      if ([2013, 2022, 2023, 2032].includes(+errorCode)) {
        // User inactive
        if (store.getState().auth.accessToken) {
          clearStorage();
          store.dispatch(showExpiredPopup('error_code_852008'));
        }
      }

      const finalError: any = {
        ...(error.response?.data || {}),
        errorCode: +errorCode || errorCode,
        errorCodeLang: error_lang_key,
      };
      return Promise.reject(finalError);
    },
  );
}
