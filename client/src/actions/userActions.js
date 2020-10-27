import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  SET_USER_LOADING,
  EMAIL_CONFIRMED,
  FB_LOADED
} from './Types';
import axios from 'axios';
const factory = require('./actionsFactory');

// Register User

export const registerUser = user =>
  factory.post(
    user,
    '/api/v1/users/signup',
    'REGISTER_SUCCESS',
    'REGISTER_FAIL'
  );
// Load User

export const loadUser = () =>
  factory.get('/api/v1/users/me', 'USER_LOADED', 'AUTH_ERROR');

// Resend Confirm Email

export const resendEmail = email =>
  factory.post(
    email,
    '/api/v1/users/resendEmail',
    'EMAIL_RESEND',
    'AUTH_ERROR'
  );

// Confirm Email

export const confirmEmail = token =>
  factory.get(
    `/api/v1/users/confirm/${token}`,
    'EMAIL_CONFIRMED',
    'AUTH_ERROR'
  );

// Forget Password

export const forgotPass = email =>
  factory.post(
    email,
    '/api/v1/users/forgotPassword',
    'LINK_SENT',
    'AUTH_ERROR'
  );

// Reset Password

export const resetPass = (newPass, email_token) =>
  factory.patch(
    newPass,
    `/api/v1/users/resetPassword/${email_token}`,
    'RESET_PASS_SUCCESSS',
    'AUTH_ERROR'
  );

// Check email token before reset password

export const checkToken = email_token =>
  factory.get(
    `/api/v1/users/checkResetToken/${email_token}`,
    'TOKEN_CONFIRMED',
    'AUTH_ERROR'
  );

// Logout

export const logout = () => async dispatch => {
  try {
    await axios.get('/api/v1/users/deleteCookie');
    dispatch({
      type: LOGOUT
    });
  } catch (err) {
    console.log(err);
  }
};

// Clear Errors
export const clearErrors = () => ({ type: CLEAR_ERRORS });

// Set Loading
export const setLoading = () => ({ type: SET_USER_LOADING });

// Login User

export const loginUser = user => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post('/api/v1/users/login', user, config);
    if (res.data.token) {
      dispatch({
        type: EMAIL_CONFIRMED,
        payload: res.data //Token
      });
    } else {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data //Token
      });
    }
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.message
    });
    dispatch(logout());
  }
};

//Similar to loadUser but does not return error on fail
export const checkUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/v1/users/me');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

//Check FB Status
export const checkFB = response => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post('/api/v1/users/fb', response, config);

    dispatch({
      type: FB_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data.message
    });
  }
};
