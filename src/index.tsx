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

// context
import { GlobalProvider } from 'context/GlobalContext';

// stores
import store from 'stores';

// i18n
import 'locales/i18n';

// services
import initRequest from 'services/initRequest';

// components
import App from './App';

// styles
import './index.css';
import reportWebVitals from './reportWebVitals';

initRequest(store);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
