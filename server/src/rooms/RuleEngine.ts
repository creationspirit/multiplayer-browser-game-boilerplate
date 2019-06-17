import { StateHandler } from './StateHandler';
import { QuestionState } from './state/QuestionState';
import { getRepository, In } from 'typeorm';
import { UserStageStats } from '../models/UserStageStats';
import { UserStats } from '../models/UserStats';

export default class RuleEngine {
  private EASY_EXP_REWARD = 50;
  private NORMAL_EXP_REWARD = 100;
  private HARD_EXP_REWARD = 200;

  isBattle: boolean;
  exerciseId: number;

  constructor(isBattle: boolean, exerciseId: number, difficulty: number) {
    this.isBattle = isBattle;
    this.exerciseId = exerciseId;
  }

  async dealRewards(state: StateHandler, questionId: number) {
    const loc = this.calculateReward(state.questions[questionId]);
    const exp = this.calculateReward(state.questions[questionId]);

    const statsRepository = getRepository(UserStats);
    const playerIds = Object.keys(state.players).map(key => state.players[key].id);
    await statsRepository.increment({ user: { id: In(playerIds) } }, 'loc', loc);
    return { loc, exp };
  }

  private calculateReward(question: QuestionState) {
    const loc = question.solution.split(/\r\n|\r|\n/).length;
    return Math.floor(loc * question.score);
  }
}
