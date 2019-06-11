import { IActions } from '../actions';
import { IClientState } from '../types/index';
import { ADD_GAME_CLIENT, REMOVE_GAME_CLIENT } from '../constants/index';
import { Reducer } from 'redux';

export const gameClient: Reducer<IClientState, IActions> = (state = { client: null }, action) => {
  switch (action.type) {
    case ADD_GAME_CLIENT:
      return { client: action.client };
    case REMOVE_GAME_CLIENT:
      if (state.client) {
        state.client.close();
      }
      return { client: null };
  }
  return state;
};
