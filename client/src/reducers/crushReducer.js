import {
  ADD_CRUSH,
  DELETE_CRUSH,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CRUSH,
  FILTER_CRUSHES,
  CLEAR_FILTER,
  CRUSH_ERROR,
  GET_CRUSHES,
  CLEAR_CRUSHES
} from '../actions/Types';

const initialState = {
  crushes: null,
  current: null,
  filtered: null,
  error: null,
  loading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_CRUSH:
      return {
        ...state,
        crushes: [action.payload, ...state.contacts],
        loading: false
      };
    // case GET_CONTACTS:
    //   return {
    //     ...state,
    //     contacts: action.payload,
    //     loading: false
    //   };
    // case DELETE_CONTACT:
    //   return {
    //     ...state,
    //     contacts: state.contacts.filter(
    //       contact => contact._id !== action.payload
    //     ),
    //     loading: false
    //   };
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

    // case CLEAR_CONTACTS:
    //   return {
    //     ...state,
    //     filtered: null,
    //     contacts: null,
    //     error: null,
    //     current: null
    //   };
    // case CONTACT_ERROR:
    //   return {
    //     ...state,
    //     error: action.payload
    //   };
    default:
      return state;
  }
};
