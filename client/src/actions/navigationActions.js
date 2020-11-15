import {
  NETWORKS_MENU,
  CONNECT_EMAIL_DIALOG,
  CONNECT_PHONE_DIALOG,
  SET_NAV_LOADING
} from '../actions/Types';

// Open/Close Networks Menu
export const setMenuOpen = open => dispatch => {
  dispatch({
    type: NETWORKS_MENU,
    payload: { open }
  });
};

// Open/Close connect email
export const OpenConnectEmail = open => dispatch => {
  dispatch({
    type: CONNECT_EMAIL_DIALOG,
    payload: { open }
  });
};

// Open/Close connect phpne
export const OpenConnectPhone = open => dispatch => {
  dispatch({
    type: CONNECT_PHONE_DIALOG,
    payload: { open }
  });
};

// Set Loading
export const setLoading = () => ({ type: SET_NAV_LOADING });
