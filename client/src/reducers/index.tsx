import { combineReducers } from 'redux';
import { gameClient } from './gameClientReducer';
import { auth } from './authReducer';
import { stages } from './stageReducer';
import { achievements } from './achievementReducer';

export default combineReducers({
  gameClient,
  auth,
  stages,
  achievements,
});
