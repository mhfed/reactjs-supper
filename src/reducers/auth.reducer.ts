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
  createPasswordToken: null,
  step: IAuthStep.LOGIN,
  roles: [],
  user: {},
};

const reducer = (state = initialState, { type, payload }: IAuthActionCreator) => {
  switch (type) {
    case IAuthActionTypes.UPDATE_TOKEN:
      return {
        ...state,
        deviceID: payload.deviceID,
        accessToken: payload.accessToken,
      };
    case IAuthActionTypes.UPDATE_USER_INFO:
      return {
        ...state,
        user: { ...state.user, ...payload },
      };
    case IAuthActionTypes.LOGIN_REQUEST:
    case IAuthActionTypes.PIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case IAuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: '',
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
    case IAuthActionTypes.SET_PASSWORD:
      return {
        ...state,
        email: payload.email,
        isLoading: false,
        createPasswordToken: payload.createPasswordToken,
        step: IAuthStep.SET_PASSWORD,
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
