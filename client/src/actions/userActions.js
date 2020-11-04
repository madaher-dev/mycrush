import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  SET_USER_LOADING,
  EMAIL_CONFIRMED,
  SET_MOBILE_MENU,
  CLOSE_MOBILE_MENU,
  CLEAR_NOTIFICATIONS,
  INSTA_LOADED,
  INSTA_FAILED
} from './Types';
import axios from 'axios';
const factory = require('./actionsFactory');
const querystring = require('querystring');

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
    { email },
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

// Confirm other Emails

export const confirmNetwork = token =>
  factory.get(
    `/api/v1/networks/confirm/${token}`,
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

// Connect Email

export const connectEmail = email =>
  factory.patch(
    { email },
    '/api/v1/networks/connectEmail',
    'CONNECT_EMAIL_SUCCESSS',
    'CONNECT_EMAIL_FAIL'
  );

// Disconnect Email

export const disconnectEmail = emailId =>
  factory.patch(
    { emailId },
    '/api/v1/networks/disconnectEmail',
    'EMAIL_DISCONNECTED',
    'EMAIL_DISCONNECT_FAIL'
  );

// //Disconnect Email
// export const disconnectEmail = emailId => async dispatch => {
//   try {
//     await axios.delete(`/api/v1/crushes/${id}`);
//     dispatch({ type: DELETE_CRUSH, payload: id });
//   } catch (err) {
//     dispatch({ type: CRUSH_ERROR, payload: err.response.data.message });
//   }
// };

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

// Set Mobile Menu Open
export const setMobileMenuOpen = () => ({ type: SET_MOBILE_MENU });

// Set Mobile Menu Open
export const setMobileMenuClose = () => ({ type: CLOSE_MOBILE_MENU });

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

// Confirm other Emails

export const getNotifications = () =>
  factory.get(
    `/api/v1/users/notifications`,
    'GET_NOTIFICATIONS',
    'NOTIFICATIONS_ERROR'
  );

// Clear Notifications
export const clearNotifications = () => ({ type: CLEAR_NOTIFICATIONS });

//Check FB Status
// export const checkFB = response => async dispatch => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
//   try {
//     const res = await axios.post('/api/v1/users/fb', response, config);

//     dispatch({
//       type: FB_LOADED,
//       payload: res.data
//     });
//   } catch (err) {
//     dispatch({
//       type: AUTH_ERROR,
//       payload: err.response.data.message
//     });
//   }
// };

// export const connectFB = (response, id) => async dispatch => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
//   try {
//     const res = await axios.post(`/api/v1/users/fb/${id}`, response, config);

//     dispatch({
//       type: FB_LOADED,
//       payload: res.data
//     });
//   } catch (err) {
//     dispatch({
//       type: FB_FAILED,
//       payload: err.response.data.message
//     });
//   }
// };

// Signup FB

export const checkFB = response =>
  factory.post(response, '/api/v1/users/fb', 'FB_LOADED', 'AUTH_ERROR');

// Connect FB

export const connectFB = (response, id) =>
  factory.post(response, `/api/v1/users/fb/${id}`, 'FB_LOADED', 'FB_FAILED');

// Disconnect FB

export const disconnectFB = id =>
  factory.get(
    `/api/v1/users/fb/${id}`,
    'FB_DISCONNECTED',
    'FB_DISCONNECT_FAIL'
  );

// Connect Instagram

export const connectInstagram = response => async dispatch => {
  let body = {
    code: response,
    client_id: process.env.REACT_APP_INSTA_CLIENT_ID,
    client_secret: process.env.REACT_APP_INSTA_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'https://mycrushapp.herokuapp.com/verify'
  };
  try {
    const instaresToken = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      querystring.stringify(body)
    );
    console.log(instaresToken);
    const instares = await axios.get(
      `https://graph.instagram.com/${instaresToken.data.user_id}?fields={username}&access_token=${instaresToken.data.access_token}`
    );
    console.log(instares);

    const res = await axios.post('/api/v1/users/insta', instares.data);

    dispatch({
      type: INSTA_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: INSTA_FAILED
    });
  }
};
