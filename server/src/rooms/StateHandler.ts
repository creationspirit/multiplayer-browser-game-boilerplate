import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerState } from './state/PlayerState';
import { QuestionState } from './state/QuestionState';
import { msToMinSec } from '../utils/gameUtils';

export class StateHandler extends Schema {
  @type('string')
  timer: string;

  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();

  @type({ map: QuestionState })
  questions = new MapSchema<QuestionState>();

  constructor(time: number) {
    super();
    this.timer = msToMinSec(time);
  }

  addPlayer(clientId: string, player: PlayerState): void {
    console.log('added player for ', clientId);
    this.players[clientId] = player;
  }

  getPlayer(clientId: string): PlayerState {
    return this.players[clientId];
  }

  removePlayer(clientId: string): void {
    delete this.players[clientId];
  }

  addQuestion(data: any, x: number, y: number): void {
    const newQuestion = new QuestionState(data, x, y);
    this.questions[data.id] = newQuestion;
  }

  updateTimer(time: number) {
    this.timer = msToMinSec(time);
  }
}
