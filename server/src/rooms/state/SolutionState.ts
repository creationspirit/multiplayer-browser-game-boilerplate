import { Schema, type, ArraySchema } from '@colyseus/schema';
import { TestState } from './TestState';
import { QuestionStatus } from '../constants';

export class SolutionState extends Schema {
  @type('string')
  solution: string;

  @type([TestState])
  tests = new ArraySchema<TestState>();

  @type('string')
  status: string;

  constructor(testData: any) {
    super();
    this.solution = '';
    this.status = QuestionStatus.STANDARD;
    testData.forEach((data: any) => this.addTest(data));
  }

  addTest(testData: any) {
    const newTest = new TestState(testData.input, testData.output);
    this.tests.push(newTest);
  }
}
