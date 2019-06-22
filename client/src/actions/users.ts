import { Action } from 'redux';
import * as constants from '../constants';

export interface IUsersSuccess extends Action {
  type: constants.USERS_SUCCESS;
  users: [];
}

export interface IUsersError extends Action {
  type: constants.USERS_ERROR;
  error: string;
}

export interface IUsersLoading extends Action {
  type: constants.USERS_LOADING;
}

export function usersSuccess(users: []): IUsersSuccess {
  return {
    type: constants.USERS_SUCCESS,
    users,
  };
}

export function usersError(error: string): IUsersError {
  return {
    type: constants.USERS_ERROR,
    error,
  };
}

export function usersLoading(): IUsersLoading {
  return {
    type: constants.USERS_LOADING,
  };
}
