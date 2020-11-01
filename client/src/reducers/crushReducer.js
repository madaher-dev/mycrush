import {
  ADD_CRUSH,
  DELETE_CRUSH,
  CRUSH_ERROR,
  GET_CRUSHES,
  CLEAR_CRUSHES,
  LOGOUT,
  CLEAR_ERRORS,
  SET_CRUSH_LOADING,
  MATCH_FOUND,
  SET_ADD,
  CLOSE_ADD
} from '../actions/Types';

const initialState = {
  crushes: [{}],
  current: null,
  error: null,
  loading: true,
  added: null,
  match: false,
  crushesLoaded: false,
  addOpen: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_CRUSH:
      return {
        ...state,
        crushes: [action.payload, ...state.crushes],
        loading: false,
        added: state.added + 1,
        addOpen: false
      };
    case MATCH_FOUND:
      return {
        ...state,
        current: action.payload,
        match: true,
        loading: false,
        addOpen: false
      };
    case GET_CRUSHES:
      return {
        ...state,
        crushes: action.payload,
        loading: false,
        crushesLoaded: true
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
        error: action.payload,
        crushesLoaded: false
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
    case SET_ADD:
      return {
        ...state,
        addOpen: true
      };
    case CLOSE_ADD:
      return {
        ...state,
        addOpen: false
      };
    case CLEAR_CRUSHES:
    case LOGOUT:
      return {
        ...state,
        crushes: [],
        error: null,
        current: null,
        crushesLoaded: false,
        addOpen: false
      };

    default:
      return state;
  }
};
