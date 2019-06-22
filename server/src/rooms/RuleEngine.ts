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
  difficulty: number;

  constructor(isBattle: boolean, exerciseId: number, difficulty: number) {
    this.isBattle = isBattle;
    this.exerciseId = exerciseId;
    this.difficulty = difficulty;
  }

  async dealRewards(state: StateHandler, questionId: number) {
    const loc = this.calculateReward(state.questions[questionId]);
    const exp = this.calculateExp();

    const statsRepository = getRepository(UserStats);
    const playerIds = Object.keys(state.players).map(key => state.players[key].id);
    await statsRepository.increment({ user: { id: In(playerIds) } }, 'loc', loc);
    await statsRepository.increment({ user: { id: In(playerIds) } }, 'experience', exp);
    return { loc, exp };
  }

  private calculateReward(question: QuestionState) {
    const loc = question.solution.split(/\r\n|\r|\n/).length;
    return Math.floor(loc * question.score);
  }

  private calculateExp() {
    switch (this.difficulty) {
      case 1:
        return this.EASY_EXP_REWARD;
      case 2:
        return this.NORMAL_EXP_REWARD;
      case 3:
        return this.HARD_EXP_REWARD;
    }
    return this.EASY_EXP_REWARD;
  }
}
