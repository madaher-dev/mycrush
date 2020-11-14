import {
  NETWORKS_MENU,
  CONNECT_EMAIL_DIALOG,
  CONNECT_PHONE_DIALOG
} from '../actions/Types';

const initialState = {
  openMenu: false,
  openEmail: false,
  openPhone: false
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

    default:
      return state;
  }
};
