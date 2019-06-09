import { Schema, type, MapSchema } from '@colyseus/schema';

export class TestState extends Schema {
  @type('number')
  id: number;

  @type('string')
  input: string;

  @type('string')
  output: string;

  @type('string')
  current: string;

  constructor(id: number, input: string, output: string) {
    super();
    this.id = id;
    this.input = input;
    this.output = output;
    this.current = '';
  }
}
