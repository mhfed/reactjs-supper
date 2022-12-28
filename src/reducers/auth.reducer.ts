import { IAuthActionTypes, IAuthActionCreator, IAuthState, IAuthStep } from 'models/IAuthState';

const initialState: IAuthState = {
  refreshToken: null,
  accessToken: null,
  deviceID: null,
  userType: null,
  email: null,
  isLoading: false,
  error: '',
  baseUrl: '',
  step: IAuthStep.LOGIN,
  roles: [],
};

const reducer = (state = initialState, { type, payload }: IAuthActionCreator) => {
  switch (type) {
    case IAuthActionTypes.LOGIN_REQUEST:
    case IAuthActionTypes.CHANGE_PASSWORD:
    case IAuthActionTypes.PIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case IAuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        email: payload.email,
        refreshToken: payload.refreshToken,
        deviceID: payload.deviceID,
        userType: payload.userType,
        accessToken: payload.accessToken,
        step: payload.step,
        error: '',
        isLoading: false,
      };
    case IAuthActionTypes.PIN_SUCCESS:
      return {
        ...state,
        refreshToken: payload.refreshToken,
        accessToken: payload.accessToken,
        baseUrl: payload.baseUrl,
        error: '',
        isLoading: false,
      };
    case IAuthActionTypes.LOGIN_FAILURE:
    case IAuthActionTypes.PIN_FAILURE:
      return {
        ...state,
        error: payload.error,
        isLoading: false,
      };
    case IAuthActionTypes.LOGOUT:
      return {
        ...state,
        ...initialState,
      };
    case IAuthActionTypes.FORCE_SET_PIN:
      return {
        ...state,
        step: IAuthStep.FORCE_SET_PIN,
      };
    case IAuthActionTypes.SILENT_LOGIN:
      return {
        ...state,
        refreshToken: payload.refreshToken,
        deviceID: payload.deviceID,
        step: IAuthStep.ENTER_PIN,
      };
    default:
      return state;
  }
};

export default reducer;
