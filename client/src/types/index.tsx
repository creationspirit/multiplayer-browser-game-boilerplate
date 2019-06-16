import * as Colyseus from 'colyseus.js';

export interface IClientState {
  client: Colyseus.Client | null;
}

export interface IAuthState {
  isAuthenticating: boolean;
  user: {} | null;
  error: string | null;
}

export interface IStageState {
  loading: boolean;
  stages: [];
  error: string | null;
}

export interface IRootState {
  gameClient: IClientState;
  auth: IAuthState;
  stages: IStageState;
}
