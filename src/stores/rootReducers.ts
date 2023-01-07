/*
 * Created on Fri Jan 06 2023
 *
 * Redux root reducer
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { combineReducers } from 'redux';

// reducers
import app from 'reducers/app.reducer';
import auth from 'reducers/auth.reducer';

const reducers = combineReducers({
  app,
  auth,
});

export default reducers;
