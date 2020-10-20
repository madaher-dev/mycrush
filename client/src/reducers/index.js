import { combineReducers } from 'redux';
import userReducer from './userReducer';
import crushReducer from './crushReducer';
import alertReducer from './alertReducer';

export default combineReducers({
  users: userReducer,
  crushes: crushReducer,
  alerts: alertReducer
});
