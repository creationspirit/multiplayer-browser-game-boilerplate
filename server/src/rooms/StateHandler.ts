import { Schema, type, MapSchema } from '@colyseus/schema';
import { Player } from '../entities/Player';

export class StateHandler extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  update(): void {
    //
    // Implement your server-side game loop here
    //
  }

  addPlayer(clientId: string, player: Player): void {
    console.log('added player for ', clientId);
    this.players[clientId] = player;
  }

  getPlayer(clientId: string): Player {
    return this.players[clientId];
  }

  removePlayer(clientId: string): void {
    delete this.players[clientId];
  }
}
