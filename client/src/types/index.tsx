import * as Colyseus from 'colyseus.js';

export interface IClientState {
  client: Colyseus.Client | null;
}

export interface IRootState {
  gameClient: IClientState;
}
