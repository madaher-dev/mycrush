import {
  GET_MATCHES,
  MATCH_ERROR,
  LOGOUT,
  CLEAR_ERRORS,
  SET_MATCH_LOADING
} from '../actions/Types';

const initialState = {
  matches: [{}],
  error: null,
  loading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MATCHES:
      return {
        ...state,
        matches: action.payload.matches,
        loading: false
      };
    case MATCH_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        crushes: [],
        error: null
      };
    case SET_MATCH_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};
