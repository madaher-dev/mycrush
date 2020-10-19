import { combineReducers } from 'redux';
import navReducer from './navReducer';

export default combineReducers({
  //volunteer: volunteerReducer,
  nav: navReducer
  // user: userReducer,
});
