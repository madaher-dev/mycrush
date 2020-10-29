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
  loading: true,
  matchesLoaded: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MATCHES:
      return {
        ...state,
        matches: action.payload.matches,
        loading: false,
        matchesLoaded: true
      };
    case MATCH_ERROR:
      return {
        ...state,
        error: action.payload,
        matchesLoaded: false
      };
    case LOGOUT:
      return {
        ...state,
        crushes: [],
        error: null,
        matchesLoaded: false
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
