import { IActions } from '../actions';
import { IAuthState } from '../types/index';
import { LOGIN_REQUEST, LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from '../constants/index';
import { Reducer } from 'redux';

const initialState: IAuthState = {
  isAuthenticating: false,
  user: null,
  error: null,
};

export const auth: Reducer<IAuthState, IActions> = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        isAuthenticating: false,
        error: action.error,
      };
    case LOGIN_SUCCESS:
      return {
        isAuthenticating: false,
        user: action.user,
        error: null,
      };
    case LOGOUT:
      return {
        isAuthenticating: false,
        user: null,
        error: null,
      };
  }
  return state;
};
