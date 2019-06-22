import { Action } from 'redux';
import * as constants from '../constants';
import * as Colyseus from 'colyseus.js';

import { ILoginSuccess, ILoginError, ILoginRequest, ILogout } from './auth';
import { IStagesError, IStagesLoading, IStagesSuccess } from './stages';
import { IAchievementsError, IAchievementsLoading, IAchievementsSuccess } from './achievements';
import { IUsersError, IUsersLoading, IUsersSuccess } from './users';

export type IActions =
  | IAddGameClient
  | IRemoveGameClient
  | ILoginSuccess
  | ILoginError
  | ILoginRequest
  | ILogout
  | IStagesError
  | IStagesSuccess
  | IStagesLoading
  | IAchievementsError
  | IAchievementsLoading
  | IAchievementsSuccess
  | IUsersError
  | IUsersLoading
  | IUsersSuccess;

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
