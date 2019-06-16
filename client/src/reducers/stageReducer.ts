import { IActions } from '../actions';
import { IStageState } from '../types/index';
import { STAGES_LOADING, STAGES_SUCCESS, STAGES_ERROR } from '../constants/index';
import { Reducer } from 'redux';

const initialState: IStageState = {
  loading: false,
  stages: [],
  error: null,
};

export const stages: Reducer<IStageState, IActions> = (state = initialState, action) => {
  switch (action.type) {
    case STAGES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STAGES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case STAGES_SUCCESS:
      return {
        loading: false,
        stages: action.stages,
        error: null,
      };
  }
  return state;
};
