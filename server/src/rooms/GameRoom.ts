import { Room, Client } from 'colyseus';

import { StateHandler } from './StateHandler';
import { Player } from '../entities/Player';

// ALL client.sessionId SHOULD BE CHANGED TO client.id IN A PRODUCTION ENVIRONMENT
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
    // return options.create ? options.create && isNew : this.clients.length > 0;
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

    this.state.addPlayer(client.sessionId, player);
  }

  // When a client sends a message
  onMessage(client: Client, message: any) {
    const player = this.state.getPlayer(client.sessionId);

    console.log(`[ ${client.sessionId} ]`, player.name, 'sent:', message);
  }

  onUpdate() {
    this.state.update();
  }

  // When a client leaves the room
  onLeave(client: Client) {
    this.state.removePlayer(client.sessionId);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
