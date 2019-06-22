import {
  achievementsError,
  achievementsSuccess,
  achievementsLoading,
} from '../actions/achievements';
import { Dispatch } from 'redux';
import { ThunkResult } from './index';
import { gameAPI } from '../config/request';

export const fetchAchievements = (): ThunkResult<void> => {
  return async (dispatch: Dispatch) => {
    dispatch(achievementsLoading());
    const token = localStorage.token;
    try {
      const response = await gameAPI.get('/achievements', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(achievementsSuccess(response.data.achievements));
    } catch (e) {
      if (e.response.status === 400) {
        dispatch(achievementsError(e.response.data.message));
      } else {
        dispatch(achievementsError('Achievements fetch failed'));
      }
    }
  };
};
