import { Action } from 'redux';
import * as constants from '../constants';

export interface IStagesSuccess extends Action {
  type: constants.STAGES_SUCCESS;
  stages: [];
}

export interface IStagesError extends Action {
  type: constants.STAGES_ERROR;
  error: string;
}

export interface IStagesLoading extends Action {
  type: constants.STAGES_LOADING;
}

export function stagesSuccess(stages: []): IStagesSuccess {
  return {
    type: constants.STAGES_SUCCESS,
    stages,
  };
}

export function stagesError(error: string): IStagesError {
  return {
    type: constants.STAGES_ERROR,
    error,
  };
}

export function stagesLoading(): IStagesLoading {
  return {
    type: constants.STAGES_LOADING,
  };
}
