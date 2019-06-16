import { combineReducers } from 'redux';
import { gameClient } from './gameClientReducer';
import { auth } from './authReducer';
import { stages } from './stageReducer';

export default combineReducers({
  gameClient,
  auth,
  stages,
});
