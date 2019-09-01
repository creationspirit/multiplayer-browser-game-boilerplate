import * as Colyseus from 'colyseus.js';
import { addGameClient } from '../actions';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IRootState } from '../types';
import { IActions } from '../actions';

export type ThunkResult<R> = ThunkAction<R, IRootState, undefined, IActions>;

export const connectToGameClient = (): ThunkResult<void> => {
  return async (dispatch: Dispatch) => {
    const gameServerUrl = process.env.NODE_ENV === 'development' ? 'ws://localhost:4000' : process.env.REACT_APP_GAME_SERVER_URL;
    const client = new Colyseus.Client(gameServerUrl as string);
    await dispatch(addGameClient(client));
  };
};
