import {
  SEND_CONTACT_SUCCESS,
  SEND_CONTACT_FAIL,
  SET_LOADING,
  CLEAR_ERRORS,
} from '../actions/Types';

const initialState = {
  sent: false,
  error: null,
  formLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_CONTACT_SUCCESS:
      return {
        ...state,
        sent: true,
        formLoading: false,
      };
    case SEND_CONTACT_FAIL:
      return {
        ...state,
        sent: false,
        formLoading: false,
        error: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        formLoading: true,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        sent: false,
        error: null,
        formLoading: false,
      };
    default:
      return state;
  }
};
