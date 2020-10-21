import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  LOADING_FAILED
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
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data //Token
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.message
    });

    dispatch(deleteCookie());
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
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data //Token
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.message
    });
    dispatch(deleteCookie());
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
      type: LOADING_FAILED
    });
  }
};

// Logout

export const logout = () => async dispatch => {
  dispatch({
    type: LOGOUT
  });
  dispatch(deleteCookie());
};

// Clear Errors
export const clearErrors = () => ({ type: CLEAR_ERRORS });

// Delete Cookie
export const deleteCookie = () => async dispatch => {
  try {
    await axios.get('/api/v1/users/deleteCookie');
  } catch (err) {
    console.log(err);
  }
};
