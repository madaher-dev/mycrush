import {
  SEND_CONTACT_SUCCESS,
  SEND_CONTACT_FAIL,
  SET_LOADING,
  CLEAR_ERRORS,
} from '../actions/Types';
import axios from 'axios';

// Contact Form

export const sendMessage = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    await axios.post('/api/v1/mail/contact', formData, config);

    dispatch({
      type: SEND_CONTACT_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: SEND_CONTACT_FAIL,
      payload: err.response.data,
    });
  }
};

// Set Loading
export const setLoading = () => ({ type: SET_LOADING });
// Clear Errors
export const clearErrors = () => ({ type: CLEAR_ERRORS });
