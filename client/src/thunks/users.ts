import { usersError, usersSuccess, usersLoading } from '../actions/users';
import { Dispatch } from 'redux';
import { ThunkResult } from './index';
import { gameAPI } from '../config/request';

export const fetchUsers = (): ThunkResult<void> => {
  return async (dispatch: Dispatch) => {
    dispatch(usersLoading());
    const token = localStorage.token;
    try {
      const response = await gameAPI.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(usersSuccess(response.data.users));
    } catch (e) {
      if (e.response.status === 400) {
        dispatch(usersError(e.response.data.message));
      } else {
        dispatch(usersError('Users fetch failed'));
      }
    }
  };
};
