import { Room, Client } from 'colyseus';

import { StateHandler } from './StateHandler';
import { PlayerState } from './state/PlayerState';
import { World } from '../game/World';

import { MessageType } from '../constants'

export class GameRoom extends Room<StateHandler> {
  maxClients = 4;

  private world!: World;

  // When room is initialized
  onInit(options: any) {

    this.world = new World();
    this.world.init();

    console.log('World is initialized');

    this.setSimulationInterval(() => this.onUpdate());
    this.setState(new StateHandler());
  }

  // Checks if a new client is allowed to join.
  requestJoin(options: any, isNew: boolean) {
    return options.create ? options.create && isNew : this.clients.length > 0;
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  async onAuth(options: any) {
    return true;
  }

  // When client successfully join the room
  onJoin(client: Client, options: any) {
    this.world.createPlayer(client.sessionId);
    const player = new PlayerState(
      client.sessionId,
      this.world.players[client.sessionId].playerMesh.position.x,
      this.world.players[client.sessionId].playerMesh.position.z,
    );
    this.state.addPlayer(client.sessionId, player);
    console.log(`player ${client.sessionId} joined room ${this.roomId}.`);
  }

  // When a client sends a message
  onMessage(client: Client, message: any) {
    const data = message.data;
    const player = this.state.getPlayer(client.sessionId);

    if (message.type === MessageType.PLAYER_MOVEMENT) {
      this.world.players[client.sessionId].applyMovement(data);
    }
  }

  onUpdate() {
    Object.keys(this.world.players).forEach(key => {
      const pos = this.world.players[key].playerMesh.position;
      this.state.players[key].updatePosition(pos);
    });
  }

  // When a client leaves the room
  onLeave(client: Client) {
    this.world.removePlayer(client.sessionId);
    this.state.removePlayer(client.sessionId);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    this.world.dispose();
  }
}
