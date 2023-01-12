/*
 * Created on Fri Jan 06 2023
 *
 * Init and config axios, handle request, response, error
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { enqueueSnackbarAction, setLoading, showExpiredPopup } from 'actions/app.action';
import { logout } from 'actions/auth.action';

export type IConfig = AxiosRequestConfig & {
  showSpinner?: boolean;
  tokenApp?: string | null;
};

type IError = {
  response: {
    data: {
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

// function getAccessToken() {
//   const accessToken = window.localStorage.getItem('accessToken');
//   return accessToken;
// }

const requestConfig: IConfig = {
  baseURL: process.env.REACT_APP_ENDPOINT_URL,
  timeout: 5000,
  showSpinner: false,
};

export const axiosInstance = axios.create(requestConfig);

const { CancelToken } = axios;
let cancel: any = null;

export default function initRequest(store: any) {
  let requestCount = 0;

  function decreaseRequestCount() {
    requestCount -= 1;
    if (requestCount === 0) {
      store.dispatch(setLoading(false));
    }
  }

  axiosInstance.interceptors.request.use(
    (config: IConfig) => {
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

      return config;
    },
    (error: IAxiosResponse) => {
      if (error.config?.showSpinner) {
        decreaseRequestCount();
      }
      return Promise.reject(error);
    },
  );

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

      // access token expired
      // if(error.response.status === 401 && error.config._retry) {
      //   error.config._retry = true;
      //   try {
      //     const result = await instance.post("/auth/refreshtoken", {
      //       refreshToken: 'xxx'
      //     });
      //     window.localStorage.setItem("accessToken", result.data.accessToken);
      //     axiosInstance.defaults.headers.common["x-access-token"] =  result.data.accessToken; (option 1)
      //     axiosInstance.defaults.headers.common.Authorization = `Bearer ${result.data.accessToken}`; (option 2)

      //     return instance(error.config);
      //   } catch (err) {
      //     if (err.response && err.response.data) {
      //       return Promise.reject(err.response.data);
      //     }
      //     return Promise.reject(err);
      //   }
      // }

      // handle errors
      let errorCode = error.response?.data?.errorCode || error.response?.data?.error_code || error.code || '';
      switch (error.response?.status) {
        case 400: {
          break;
        }
        case 401: {
          window.localStorage.clear();
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
        store.dispatch(showExpiredPopup());
      }

      const finalError: any = { ...(error.response?.data || {}), errorCode: +errorCode, errorCodeLang: error_lang_key };
      return Promise.reject(finalError);
    },
  );
}
