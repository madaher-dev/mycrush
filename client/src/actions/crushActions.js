import {
  ADD_CRUSH,
  DELETE_CRUSH,
  CRUSH_ERROR,
  GET_CRUSHES,
  CLEAR_CRUSHES,
  CLEAR_ERRORS,
  SET_CRUSH_LOADING,
  MATCH_FOUND,
  SET_ADD,
  CLOSE_ADD
} from './Types';
import axios from 'axios';
const factory = require('./actionsFactory');

// Get Crushes
export const getCrushes = () => async dispatch => {
  try {
    const res = await axios.get('/api/v1/crushes/all');
    dispatch({ type: GET_CRUSHES, payload: res.data.crushes });
  } catch (err) {
    dispatch({ type: CRUSH_ERROR, payload: err.response.data.message });
  }
};

// Add crush
export const addCrush = crush => async dispatch => {
  //Removing @ from twitter
  if (crush.twitter) {
    if (crush.twitter.substring(0, 1) === '@') {
      crush.twitter = crush.twitter.substring(1);
    }
  }

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/v1/crushes', crush, config);

    if (!res.data.data.match)
      dispatch({ type: ADD_CRUSH, payload: res.data.data });
    else dispatch({ type: MATCH_FOUND, payload: res.data.data });
  } catch (err) {
    dispatch({ type: CRUSH_ERROR, payload: err.response.data.message });
  }
};
//Delete Crush
export const deleteCrush = id => async dispatch => {
  try {
    await axios.delete(`/api/v1/crushes/${id}`);
    dispatch({ type: DELETE_CRUSH, payload: id });
  } catch (err) {
    dispatch({ type: CRUSH_ERROR, payload: err.response.data.message });
  }
};

// Clear Errors
export const clearErrors = () => ({ type: CLEAR_ERRORS });

// Clear Crushes
export const clearCrushes = () => ({ type: CLEAR_CRUSHES });

// Set Crush Loading
export const setLoading = () => ({ type: SET_CRUSH_LOADING });

// Open Add Crush Form
export const setAddCrush = () => ({ type: SET_ADD });

// Open Add Crush Form
export const closeAddCrush = () => ({ type: CLOSE_ADD });

// Set Current Contact
// export const setCurrent = contact => dispatch => {
//   dispatch({
//     type: SET_CURRENT,
//     payload: contact
//   });
//   window.scrollTo(0, 0);
// };
// Clear Current Contact
// export const clearCurrent = () => ({ type: CLEAR_CURRENT });
// // Update Contact
// export const updateContact = contact => async dispatch => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
//   try {
//     const res = await axios.put(
//       `/api/contacts/${contact._id}`,
//       contact,
//       config
//     );
//     dispatch({ type: UPDATE_CONTACT, payload: res.data });
//   } catch (err) {
//     dispatch({ type: CONTACT_ERROR, payload: err.response.msg });
//   }
// };

// // Filter Contacts
// export const filterContacts = text => ({
//   type: FILTER_CONTACTS,
//   payload: text
// });
// // Clear Filter
// export const clearFilter = () => ({ type: CLEAR_FILTER });
