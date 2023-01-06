/*
 * Created on Fri Jan 06 2023
 *
 * Redux store
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// rootReducers;
import rootReducers from './rootReducers';

const store = createStore(rootReducers, composeWithDevTools(applyMiddleware(thunk)));

export default store;
