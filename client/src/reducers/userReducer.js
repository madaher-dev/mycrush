import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  LOADING_FAILED,
  ADD_CRUSH
} from '../actions/Types';

const initialState = {
  token: null,
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
  points: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.data.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        points: action.payload.data.user.points
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.data.data,
        points: action.payload.data.data.points
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
        points: 0
      };
    case LOADING_FAILED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        points: 0
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    case ADD_CRUSH:
      return {
        ...state,
        points: state.points - 1
      };
    default:
      return state;
  }
};
