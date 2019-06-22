import { Schema, type, MapSchema } from '@colyseus/schema';
import { SolutionState } from './SolutionState';
import { Teams } from '../constants';

export class BattleQuestionState extends Schema {
  @type('number')
  id: number;

  @type('number')
  x: number | undefined;

  @type('number')
  y: number | undefined;

  @type('string')
  text: string;

  @type({ map: SolutionState })
  solutions = new MapSchema<SolutionState>();

  constructor(data: any, x: number, y: number) {
    super();
    this.id = data.id;
    this.text = data.question_text;
    this.x = x;
    this.y = y;
    this.solutions[Teams.BLUE] = new SolutionState(data.tests);
    this.solutions[Teams.RED] = new SolutionState(data.tests);
  }
}
