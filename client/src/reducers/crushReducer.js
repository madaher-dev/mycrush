import {
  ADD_CRUSH,
  DELETE_CRUSH,
  CRUSH_ERROR,
  GET_CRUSHES,
  CLEAR_CRUSHES,
  LOGOUT,
  CLEAR_ERRORS,
  SET_CRUSH_LOADING,
  MATCH_FOUND
} from '../actions/Types';

const initialState = {
  crushes: [{}],
  current: null,
  filtered: null,
  error: null,
  loading: true,
  added: null,
  match: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_CRUSH:
      return {
        ...state,
        crushes: [action.payload, ...state.crushes],
        loading: false,
        added: state.added + 1
      };
    case MATCH_FOUND:
      return {
        ...state,
        current: action.payload,
        match: true,
        loading: false
      };
    case GET_CRUSHES:
      return {
        ...state,
        crushes: action.payload,
        loading: false
      };
    case DELETE_CRUSH:
      return {
        ...state,
        crushes: state.crushes.filter(crush => crush._id !== action.payload),
        loading: false
      };
    case CRUSH_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    case SET_CRUSH_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_CRUSHES:
    case LOGOUT:
      return {
        ...state,
        filtered: null,
        crushes: [],
        error: null,
        current: null
      };

    default:
      return state;
  }
};
