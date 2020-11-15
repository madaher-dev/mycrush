import {
  NETWORKS_MENU,
  CONNECT_EMAIL_DIALOG,
  CONNECT_PHONE_DIALOG,
  SET_NAV_LOADING
} from '../actions/Types';

const initialState = {
  openMenu: false,
  openEmail: false,
  openPhone: false,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NETWORKS_MENU:
      return {
        ...state,
        openMenu: action.payload.open
      };

    case CONNECT_EMAIL_DIALOG:
      return {
        ...state,
        openEmail: action.payload.open
      };

    case CONNECT_PHONE_DIALOG:
      return {
        ...state,
        openPhone: action.payload.open
      };
    case SET_NAV_LOADING:
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
};
