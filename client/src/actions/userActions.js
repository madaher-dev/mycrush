import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  SET_USER_LOADING,
  LINK_SENT,
  RESET_PASS_SUCCESSS,
  TOKEN_CONFIRMED,
  EMAIL_CONFIRMED,
  EMAIL_RESEND
} from './Types';
import axios from 'axios';

// Register User

export const registerUser = user => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post('/api/v1/users/signup', user, config);
    console.log(res);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data //User
    });
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.message
    });

    dispatch(logout());
  }
};

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
// Load User

export const loadUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/v1/users/me');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data.message
    });
  }
};

// Resend Confirm Email

export const resendEmail = email => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(
      '/api/v1/users/resendEmail',
      { email },
      config
    );
    dispatch({
      type: EMAIL_RESEND,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data.message
    });
  }
};

// Confirm Email

export const confirmEmail = token => async dispatch => {
  try {
    const res = await axios.patch(`/api/v1/users/confirm/${token}`);
    dispatch({
      type: EMAIL_CONFIRMED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data.message
    });
  }
};

// Forget Password

export const forgotPass = email => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/v1/users/forgotPassword', email, config);
    dispatch({
      type: LINK_SENT,
      payload: res.data.message
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data.message
    });
  }
};

// Reset Password

export const resetPass = (newPass, email_token) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.patch(
      `/api/v1/users/resetPassword/${email_token}`,
      newPass,
      config
    );

    dispatch({
      type: RESET_PASS_SUCCESSS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data.message
    });
  }
};

// Check email token before reset password

export const checkToken = email_token => async dispatch => {
  try {
    const res = await axios.patch(
      `/api/v1/users/checkResetToken/${email_token}`
    );

    dispatch({
      type: TOKEN_CONFIRMED,
      payload: res.data.data.user
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data.message
    });
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
