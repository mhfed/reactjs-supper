/*
 * Created on Fri Jan 06 2023
 *
 * App store selector
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.app,
  (app) => app.isLoading,
);

export const isExpiredSelector = createSelector(
  (state: IRootState) => state.app,
  (app) => app.isExpired,
);

export const isConnectingSelector = createSelector(
  (state: IRootState) => state.app,
  (app) => app.isConnecting,
);

export const dialogSelector = createSelector(
  (state: IRootState) => state.app,
  (app) => app.dialog,
);

export const notificationsSelector = createSelector(
  (state: IRootState) => state.app,
  (app) => app.notifications,
);
