import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

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
