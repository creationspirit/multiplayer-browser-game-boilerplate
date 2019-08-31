import { Action } from 'redux';
import * as constants from '../constants';
import * as Colyseus from 'colyseus.js';

export type IActions =
  | IAddGameClient
  | IRemoveGameClient

export interface IAddGameClient extends Action {
  type: constants.ADD_GAME_CLIENT;
  client: Colyseus.Client;
}

export interface IRemoveGameClient extends Action {
  type: constants.REMOVE_GAME_CLIENT;
}

export function addGameClient(client: Colyseus.Client): IAddGameClient {
  return {
    type: constants.ADD_GAME_CLIENT,
    client,
  };
}

export function removeGameClient(): IRemoveGameClient {
  return {
    type: constants.REMOVE_GAME_CLIENT,
  };
}
