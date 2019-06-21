// Actions
export const ADD_GAME_CLIENT = 'ADD_GAME_CLIENT';
export type ADD_GAME_CLIENT = typeof ADD_GAME_CLIENT;

export const REMOVE_GAME_CLIENT = 'REMOVE_GAME_CLIENT';
export type REMOVE_GAME_CLIENT = typeof REMOVE_GAME_CLIENT;

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export type LOGIN_SUCCESS = typeof LOGIN_SUCCESS;

export const LOGIN_ERROR = 'LOGIN_ERROR';
export type LOGIN_ERROR = typeof LOGIN_ERROR;

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export type LOGIN_REQUEST = typeof LOGIN_REQUEST;

export const LOGOUT = 'LOGOUT';
export type LOGOUT = typeof LOGOUT;

export const STAGES_LOADING = 'STAGES_LOADING';
export type STAGES_LOADING = typeof STAGES_LOADING;

export const STAGES_SUCCESS = 'STAGES_SUCCESS';
export type STAGES_SUCCESS = typeof STAGES_SUCCESS;

export const STAGES_ERROR = 'STAGES_ERROR';
export type STAGES_ERROR = typeof STAGES_ERROR;

export const ACHIEVEMENTS_LOADING = 'ACHIEVEMENTS_LOADING';
export type ACHIEVEMENTS_LOADING = typeof ACHIEVEMENTS_LOADING;

export const ACHIEVEMENTS_SUCCESS = 'ACHIEVEMENTS_SUCCESS';
export type ACHIEVEMENTS_SUCCESS = typeof ACHIEVEMENTS_SUCCESS;

export const ACHIEVEMENTS_ERROR = 'ACHIEVEMENTS_ERROR';
export type ACHIEVEMENTS_ERROR = typeof ACHIEVEMENTS_ERROR;

export const USERS_LOADING = 'USERS_LOADING';
export type USERS_LOADING = typeof USERS_LOADING;

export const USERS_SUCCESS = 'USERS_SUCCESS';
export type USERS_SUCCESS = typeof USERS_SUCCESS;

export const USERS_ERROR = 'USERS_ERROR';
export type USERS_ERROR = typeof USERS_ERROR;

export enum QuestionStatus {
  STANDARD = 'std',
  EVALUATE = 'eval',
  SOLVED = 'solv',
  PARTIAL = 'part',
}

export enum GameStatus {
  ONGOING = 'ong',
  WIN = 'win',
  LOSE = 'los',
  OVER = 'ovr',
}
