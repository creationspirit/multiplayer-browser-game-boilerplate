import { Schema, type, MapSchema } from '@colyseus/schema';
import { BattlePlayerState } from './state/BattlePlayerState';
import { QuestionState } from './state/QuestionState';
import { BattleQuestionState } from './state/BattleQuestionState';
import { msToMinSec } from '../utils/gameUtils';
import { GameStatus, Teams } from './constants';

export class BattleStateHandler extends Schema {
  @type('string')
  status: string;

  @type('number')
  blueScore: number;

  @type('number')
  redScore: number;

  @type({ map: BattlePlayerState })
  players = new MapSchema<BattlePlayerState>();

  @type({ map: BattleQuestionState })
  questions = new MapSchema<BattleQuestionState>();

  constructor() {
    super();
    this.status = GameStatus.ONGOING;
    this.blueScore = 0;
    this.redScore = 0;
  }

  addPlayer(clientId: string, id: number, name: string, x: number, y: number): void {
    let blueCount = 0;
    let redCount = 0;
    Object.keys(this.players).forEach(key => {
      this.players[key].team === Teams.BLUE ? blueCount++ : redCount++;
    });
    const team = blueCount <= redCount ? Teams.BLUE : Teams.RED;
    this.players[clientId] = new BattlePlayerState(id, name, team, x, y);
  }

  getPlayer(clientId: string): BattlePlayerState {
    return this.players[clientId];
  }

  removePlayer(clientId: string): void {
    delete this.players[clientId];
  }

  addQuestion(data: any, x: number, y: number): void {
    const newQuestion = new BattleQuestionState(data, x, y);
    this.questions[data.id] = newQuestion;
  }

  removeQuestion(questionId: number): void {
    delete this.questions[questionId];
  }
}
