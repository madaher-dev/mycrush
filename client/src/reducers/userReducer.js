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
  TOKEN_CONFIRMED,
  EMAIL_CONFIRMED,
  EMAIL_RESEND,
  FB_LOADED,
  CONNECT_EMAIL_SUCCESSS,
  CONNECT_EMAIL_FAIL,
  EMAIL_DISCONNECTED,
  EMAIL_DISCONNECT_FAIL
} from '../actions/Types';

const initialState = {
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
  points: 0,
  linkSent: false,
  email_token: false,
  email_confirmed: false,
  emailSent: false,
  email_added: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EMAIL_CONFIRMED:
    case RESET_PASS_SUCCESSS: //check if not email confirmed
      return {
        ...state,
        user: action.payload.data.user,
        isAuthenticated: true,
        loading: false,
        points: action.payload.data.user.points
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.data.user,
        loading: false
      };
    case FB_LOADED:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        points: action.payload.user.points
      };
    case TOKEN_CONFIRMED:
      return {
        ...state,
        email_token: true,
        user: action.payload.data.user,
        loading: false
      };
    case CONNECT_EMAIL_SUCCESSS:
      return {
        ...state,
        email_added: true,
        loading: false,
        user: action.payload.data.user,
        error: null
      };
    case CONNECT_EMAIL_FAIL:
      return {
        ...state,
        email_added: false,
        loading: false,
        error: action.payload
      };
    case EMAIL_DISCONNECTED:
      return {
        ...state,
        loading: false,
        user: action.payload.data.user,
        error: null
      };
    case EMAIL_DISCONNECT_FAIL:
      return {
        ...state,
        email_added: false,
        loading: false,
        error: action.payload
      };

    case EMAIL_RESEND:
      return {
        ...state,
        emailSent: true,
        loading: false
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.data.doc,
        points: action.payload.data.doc.points,
        email_added: false
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
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
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
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
        points: state.points - 1,
        loading: false
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
        error: action.payload.message
      };
    default:
      return state;
  }
};
