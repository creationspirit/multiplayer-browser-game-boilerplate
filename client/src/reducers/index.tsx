import { combineReducers } from 'redux';
import { gameClient } from './gameClientReducer';
import { auth } from './authReducer';

export default combineReducers({
  gameClient,
  auth,
});
