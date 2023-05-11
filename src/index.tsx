/*
 * Created on Fri Jan 06 2023
 *
 * Main file project
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { GlobalProvider } from 'context/GlobalContext';
import store from 'stores';
import 'locales/i18n';
import initRequest from 'services/initRequest';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import CryptoJS from 'crypto-js';

const initWebsite = () => {
  initRequest(store);
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <Provider store={store}>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </Provider>,
  );
};

const initConfig = () => {
  fetch(`https://web-config.equix.app/${window.location.host}/web.txt`)
    .then((response) => response.text())
    .then((config) => {
      const bytes = CryptoJS.AES.decrypt(config, window.location.host);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      window.env = {};
      window.env['REACT_APP_ENDPOINT_URL'] = decryptedData?.endpointUrl;
      window.env['REACT_APP_REDIRECT_URL'] = decryptedData?.redirectUrl;
      window.env['REACT_APP_BASE_URL'] = decryptedData?.baseUrl;
      initWebsite();
    })
    .catch((error) => {
      console.error('Cannot get web config: ', error);
      initWebsite();
    });
};

initConfig();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
