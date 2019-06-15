import { Action } from 'redux';
import * as constants from '../constants';

export interface ILoginSuccess extends Action {
  type: constants.LOGIN_SUCCESS;
  user: {};
}

export interface ILoginError extends Action {
  type: constants.LOGIN_ERROR;
  error: string;
}

export interface ILoginRequest extends Action {
  type: constants.LOGIN_REQUEST;
}

export interface ILogout extends Action {
  type: constants.LOGOUT;
}

export function loginSuccess(user: {}): ILoginSuccess {
  return {
    type: constants.LOGIN_SUCCESS,
    user,
  };
}

export function loginError(error: string): ILoginError {
  return {
    type: constants.LOGIN_ERROR,
    error,
  };
}

export function loginRequest(): ILoginRequest {
  return {
    type: constants.LOGIN_REQUEST,
  };
}

export function logout(): ILogout {
  return {
    type: constants.LOGOUT,
  };
}
