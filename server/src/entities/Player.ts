import { Schema, type, MapSchema } from '@colyseus/schema';

export class Player extends Schema {
  @type('string')
  name: string;

  @type('number')
  x: number | undefined;

  @type('number')
  y: number | undefined;

  constructor(data: any) {
    super();
    this.name = data.name;
  }
}
