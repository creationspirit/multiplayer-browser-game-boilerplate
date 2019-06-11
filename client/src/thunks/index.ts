import * as Colyseus from 'colyseus.js';
import { addGameClient } from '../actions';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IRootState } from '../types';
import { IActions } from '../actions';

export type ThunkResult<R> = ThunkAction<R, IRootState, undefined, IActions>;

export const connectToGameClient = (): ThunkResult<void> => {
  return async (dispatch: Dispatch) => {
    const client = new Colyseus.Client('ws://localhost:4000');
    await dispatch(addGameClient(client));
  };
};
// export type connectToGameClient = typeof connectToGameClient;
