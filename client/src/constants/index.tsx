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

export enum QuestionStatus {
  STANDARD = 'std',
  EVALUATE = 'eval',
  SOLVED = 'solv',
  PARTIAL = 'part',
}
