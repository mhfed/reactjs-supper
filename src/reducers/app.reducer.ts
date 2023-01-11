/*
 * Created on Fri Jan 06 2023
 *
 * App reducer redux
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { IAppActionTypes, IAppActionCreator, IAppState } from 'models/IAppState';

const initialState: IAppState = {
  isLoading: false,
  isConnecting: false,
  dialog: {
    type: 'error',
    isShow: false,
    content: '',
  },
  notifications: {},
  isExpired: false,
  isIressLogin: false,
};

const reducer = (state = initialState, { type, payload }: IAppActionCreator) => {
  switch (type) {
    case IAppActionTypes.SET_EXPIRED:
      return {
        ...state,
        isExpired: true,
      };
    case IAppActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case IAppActionTypes.IRESS_LOGOUT:
      return {
        ...state,
        isIressLogin: false,
      };
    case IAppActionTypes.SET_CONNECTING:
      return {
        ...state,
        isConnecting: payload,
      };
    case IAppActionTypes.SET_IRESS_LOGIN:
      return {
        ...state,
        isIressLogin: payload,
      };
    case IAppActionTypes.SET_DIALOG:
      return {
        ...state,
        dialog: {
          type: payload.dialog.type,
          isShow: payload.dialog.isShow,
          content: payload.dialog.content,
        },
      };
    case IAppActionTypes.ENQUEUE_SNACKBAR: {
      const { key, message, variant } = payload;
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [key]: {
            key,
            message,
            variant,
          },
        },
      };
    }
    case IAppActionTypes.REMOVE_SNACKBAR: {
      const newNotfi = { ...state.notifications };
      delete newNotfi[payload];
      return {
        ...state,
        notifications: newNotfi,
      };
    }
    default:
      return state;
  }
};

export default reducer;
