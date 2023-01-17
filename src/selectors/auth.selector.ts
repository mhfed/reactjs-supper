/*
 * Created on Fri Jan 06 2023
 *
 * Auth store selector
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const iressTokenSelector = createSelector(
  (state: IRootState) => state.auth,
  (app) => app.iressAccessToken,
);

export const iressSitenameSelector = createSelector(
  (state: IRootState) => state.auth,
  (app) => app.sitename,
);

export const isExpiredSelector = createSelector(
  (state: IRootState) => state.auth,
  (app) => {
    const expiredTime = app.iressExpiredTime;
    return expiredTime && expiredTime < Date.now();
  },
);

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.auth,
  (app) => app.isLoading,
);

export const createPasswordTokenSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.createPasswordToken,
);

export const roleSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.roles,
);

export const stepSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.step,
);

export const userLoginSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.email,
);

export const userSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.user,
);

export const errorSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.error,
);

export const failedCountSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.count,
);
