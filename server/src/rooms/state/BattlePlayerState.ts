import { Schema, type } from '@colyseus/schema';
import { Vector3 } from 'babylonjs';

export class BattlePlayerState extends Schema {
  @type('number')
  id: number;

  @type('string')
  name: string;

  @type('string')
  team: string;

  @type('number')
  x: number | undefined;

  @type('number')
  y: number | undefined;

  constructor(id: number, name: string, team: string, x: number, y: number) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
    this.id = id;
    this.team = team;
  }

  updatePosition(position: Vector3) {
    (this.x = position.x), (this.y = position.z);
  }
}
