import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import { TestState } from './TestState';
import { QuestionStatus } from '../constants';

export class QuestionState extends Schema {
  @type('number')
  id: number;

  @type('number')
  x: number | undefined;

  @type('number')
  y: number | undefined;

  @type('string')
  text: string;

  @type('string')
  solution: string;

  @type([TestState])
  tests = new ArraySchema<TestState>();

  @type('number')
  score: number;

  @type('string')
  status: string;

  constructor(data: any, x: number, y: number) {
    super();
    this.id = data.id;
    this.text = data.question_text;
    this.x = x;
    this.y = y;
    this.solution = '';
    this.score = 0;
    this.status = QuestionStatus.STANDARD;
    data.tests.forEach((testData: any) => this.addTest(testData));
  }

  addTest(testData: any) {
    const newTest = new TestState(testData.input, testData.output);
    this.tests.push(newTest);
  }
}
