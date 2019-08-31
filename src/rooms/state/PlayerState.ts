import { Schema, type } from '@colyseus/schema';
import { Vector3 } from 'babylonjs';

export class PlayerState extends Schema {
  @type('string')
  id: string;

  @type('number')
  x: number | undefined;

  @type('number')
  y: number | undefined;

  constructor(id: string, x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.id = id;
  }

  updatePosition(position: Vector3) {
    (this.x = position.x), (this.y = position.z);
  }
}
