import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.auth,
  (app) => app.isLoading,
);

// export const userSelector = createSelector(
//   (state: IRootState) => state.auth,
//   (auth) => auth.user,
// );

export const roleSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.roles,
);

export const stepSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.step,
);

export const userSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.user,
);

export const errorSelector = createSelector(
  (state: IRootState) => state.auth,
  (auth) => auth.error,
);
