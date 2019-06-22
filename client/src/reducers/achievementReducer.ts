import { IActions } from '../actions';
import { IAchievementState } from '../types/index';
import { ACHIEVEMENTS_LOADING, ACHIEVEMENTS_SUCCESS, ACHIEVEMENTS_ERROR } from '../constants/index';
import { Reducer } from 'redux';

const initialState: IAchievementState = {
  loading: false,
  achievements: [],
  error: null,
};

export const achievements: Reducer<IAchievementState, IActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ACHIEVEMENTS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ACHIEVEMENTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case ACHIEVEMENTS_SUCCESS:
      return {
        loading: false,
        achievements: action.achievements,
        error: null,
      };
  }
  return state;
};
