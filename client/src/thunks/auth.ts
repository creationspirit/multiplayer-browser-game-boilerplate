import { loginError, loginSuccess, loginRequest, logout } from '../actions/auth';
import { Dispatch } from 'redux';
import { ThunkResult } from './index';
import { gameAPI } from '../config/request';

export const login = (edgarToken: string): ThunkResult<void> => {
  return async (dispatch: Dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await gameAPI.post('/users/login', { edgarToken });
      localStorage.setItem('token', response.data.token);
      dispatch(loginSuccess(response.data.user));
    } catch (e) {
      if (e.response.status === 400) {
        dispatch(loginError(e.response.data.message));
      } else {
        dispatch(loginError('Login failed'));
      }
    }
  };
};

export const fetchUserData = (): ThunkResult<void> => {
  return async (dispatch: Dispatch) => {
    const token = localStorage.token;
    if (token) {
      try {
        const response = await gameAPI.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(loginSuccess(response.data));
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  };
};
