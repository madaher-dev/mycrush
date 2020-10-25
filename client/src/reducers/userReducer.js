import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  ADD_CRUSH,
  SET_USER_LOADING,
  LINK_SENT,
  RESET_PASS_SUCCESSS,
  TOKEN_CONFIRMED
} from '../actions/Types';

const initialState = {
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
  points: 0,
  linkSent: false,
  email_token: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case RESET_PASS_SUCCESSS:
      return {
        ...state,
        user: action.payload.data.user,
        isAuthenticated: true,
        loading: false,
        points: action.payload.data.user.points
      };
    case TOKEN_CONFIRMED:
      return {
        ...state,
        email_token: true,
        user: action.payload
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
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
        points: 0,
        linkSent: false
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        linkSent: false
      };
    case ADD_CRUSH:
      return {
        ...state,
        points: state.points - 1
      };
    case SET_USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case LINK_SENT:
      return {
        ...state,
        linkSent: true,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};
