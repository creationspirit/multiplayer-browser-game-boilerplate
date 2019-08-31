export const ADD_GAME_CLIENT = 'ADD_GAME_CLIENT';
export type ADD_GAME_CLIENT = typeof ADD_GAME_CLIENT;

export const REMOVE_GAME_CLIENT = 'REMOVE_GAME_CLIENT';
export type REMOVE_GAME_CLIENT = typeof REMOVE_GAME_CLIENT;

export enum GameStatus {
  ONGOING = 'ong',
  WIN = 'win',
  LOSE = 'los',
  OVER = 'ovr',
}

export enum MessageType {
  PLAYER_MOVEMENT = 'move'
}
