import { Schema, type, MapSchema } from '@colyseus/schema';

export class TestState extends Schema {
  @type('string')
  input: string;

  @type('string')
  output: string;

  @type('string')
  current: string;

  @type('boolean')
  isCorrect: boolean;

  constructor(input: string, output: string) {
    super();
    this.input = input;
    this.output = output;
    this.current = '';
    this.isCorrect = false;
  }

  updateCurrent(outcome: any) {
    this.current = outcome.output;
    this.isCorrect = outcome.isCorrect;
  }
}
