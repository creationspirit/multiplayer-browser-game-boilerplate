import { Action } from 'redux';
import * as constants from '../constants';

export interface IAchievementsSuccess extends Action {
  type: constants.ACHIEVEMENTS_SUCCESS;
  achievements: [];
}

export interface IAchievementsError extends Action {
  type: constants.ACHIEVEMENTS_ERROR;
  error: string;
}

export interface IAchievementsLoading extends Action {
  type: constants.ACHIEVEMENTS_LOADING;
}

export function achievementsSuccess(achievements: []): IAchievementsSuccess {
  return {
    type: constants.ACHIEVEMENTS_SUCCESS,
    achievements,
  };
}

export function achievementsError(error: string): IAchievementsError {
  return {
    type: constants.ACHIEVEMENTS_ERROR,
    error,
  };
}

export function achievementsLoading(): IAchievementsLoading {
  return {
    type: constants.ACHIEVEMENTS_LOADING,
  };
}
