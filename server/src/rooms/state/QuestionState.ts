import { Schema, type, MapSchema } from '@colyseus/schema';
import { TestState } from './TestState';

export class QuestionState extends Schema {
  @type('string')
  id: string;

  @type('number')
  x: number | undefined;

  @type('number')
  y: number | undefined;

  @type('string')
  text: string;

  @type('string')
  solution: string;

  @type({ map: TestState })
  tests = new MapSchema<TestState>();

  constructor(data: any, x: number, y: number) {
    super();
    this.id = data.id;
    this.text = data.question_text;
    this.x = x;
    this.y = y;
    this.solution = '';
    data.tests.forEach((testData: any) => this.addTest(testData));
  }

  addTest(testData: any) {
    const newTest = new TestState(testData.id, testData.input, testData.output);
    this.tests[testData.id] = newTest;
  }
}
