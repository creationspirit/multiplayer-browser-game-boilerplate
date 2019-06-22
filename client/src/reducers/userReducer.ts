import { IActions } from '../actions';
import { IUserState } from '../types/index';
import { USERS_LOADING, USERS_SUCCESS, USERS_ERROR } from '../constants/index';
import { Reducer } from 'redux';

const initialState: IUserState = {
  loading: false,
  users: [],
  error: null,
};

export const users: Reducer<IUserState, IActions> = (state = initialState, action) => {
  switch (action.type) {
    case USERS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case USERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case USERS_SUCCESS:
      return {
        loading: false,
        users: action.users,
        error: null,
      };
  }
  return state;
};
