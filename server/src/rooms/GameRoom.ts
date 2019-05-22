import { Room, Client } from 'colyseus';

import { StateHandler } from './StateHandler';
import { Player } from '../entities/Player';

export class GameRoom extends Room<StateHandler> {
  maxClients = 4;

  // When room is initialized
  onInit(options: any) {
    this.setSimulationInterval(() => this.onUpdate());
    this.setState(new StateHandler());
  }

  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin(options: any, isNew: boolean) {
    return true;
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(options: any) {
    return true;
  }

  // When client successfully join the room
  onJoin(client: Client, options: any, auth: any) {
    const player = new Player({
      name: `Player ${this.clients.length}`,
    });

    this.state.addPlayer(client.id, player);
  }

  // When a client sends a message
  onMessage(client: Client, message: any) {
    const player = this.state.getPlayer(client.id);

    console.log(`[ ${client.id} ]`, player.name, 'sent:', message);
  }

  onUpdate() {
    this.state.update();
  }

  // When a client leaves the room
  onLeave(client: Client) {
    this.state.removePlayer(client.id);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
