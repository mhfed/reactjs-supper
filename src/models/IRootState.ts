/*
 * Created on Fri Jan 06 2023
 *
 * Common type for redux root reducer
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { IAppState } from './IAppState';
import { IAuthState } from './IAuthState';

type IRootState = {
  app: IAppState;
  auth: IAuthState;
};

export default IRootState;
