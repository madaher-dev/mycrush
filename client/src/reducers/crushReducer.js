import {
  ADD_CRUSH,
  DELETE_CRUSH,
  CRUSH_ERROR,
  GET_CRUSHES,
  CLEAR_CRUSHES,
  LOGOUT,
  CLEAR_ERRORS
} from '../actions/Types';

const initialState = {
  crushes: [{}],
  current: null,
  filtered: null,
  error: null,
  loading: true,
  added: null
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
    // case SET_CURRENT:
    //   return {
    //     ...state,
    //     current: action.payload
    //   };
    // case CLEAR_CURRENT:
    //   return {
    //     ...state,
    //     current: null
    //   };
    // case UPDATE_CONTACT:
    //   return {
    //     ...state,
    //     contacts: state.contacts.map(contact =>
    //       contact._id === action.payload._id ? action.payload : contact
    //     ),
    //     loading: false
    //   };
    // case FILTER_CONTACTS:
    //   return {
    //     ...state,
    //     filtered: state.contacts.filter(({ name, email }) => {
    //       const testString = `${name}${email}`.toLowerCase();
    //       return testString.includes(action.payload.toLowerCase());
    //     })
    //   };
    // case CLEAR_FILTER:
    //   return {
    //     ...state,
    //     filtered: null
    //   };

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
