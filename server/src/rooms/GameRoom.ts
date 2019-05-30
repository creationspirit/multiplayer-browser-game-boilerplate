import { Room, Client } from 'colyseus';

import { StateHandler } from './StateHandler';
import { PlayerState } from './state/PlayerState';
import { World } from '../game/World';
import { createVector } from '../utils/gameUtils';

export enum MessageType {
  LVL_INIT = 'LVL_INIT',
  MOVE = 'move',
}

// ALL client.sessionId SHOULD BE CHANGED TO client.id IN A PRODUCTION ENVIRONMENT
export class GameRoom extends Room<StateHandler> {
  maxClients = 4;

  private world!: World;

  // When room is initialized
  onInit(options: any) {
    this.world = new World();
    console.log('world init');
    this.world.init(LEVEL);

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
    this.send(client, { type: MessageType.LVL_INIT, data: LEVEL });
    this.world.createPlayer(client.sessionId, createVector(LEVEL.spawnPoint));
    const player = new PlayerState(
      `Player ${this.clients.length}`,
      LEVEL.spawnPoint.x,
      LEVEL.spawnPoint.z
    );
    this.state.addPlayer(client.sessionId, player);
  }

  // When a client sends a message
  onMessage(client: Client, message: any) {
    const player = this.state.getPlayer(client.sessionId);
    if (message.type === MessageType.MOVE) {
      this.world.players[client.sessionId].applyMovement(message.data);
    }
    // console.log(`[ ${client.sessionId} ]`, player.name, 'sent:', message);
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
  onDispose() {}
}

export const LEVEL = {
  id: 'level1',
  corridors: [
    {
      type: 'Corridor4',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 9, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -9, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 0, y: 0, z: 9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 0, y: 0, z: -9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 9, y: 0, z: -18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 9, y: 0, z: 18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -9, y: 0, z: 18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -9, y: 0, z: -18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 18, y: 0, z: 9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -18, y: 0, z: 9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: -18, y: 0, z: -9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'Corridor',
      position: { x: 18, y: 0, z: -9 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'CorridorT',
      position: { x: 18, y: 0, z: 0 },
      rotation: { x: 0, y: Math.PI, z: 0 },
    },
    {
      type: 'CorridorT',
      position: { x: -18, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'CorridorT',
      position: { x: 0, y: 0, z: 18 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'CorridorT',
      position: { x: 0, y: 0, z: -18 },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      type: 'CorridorL',
      position: { x: 18, y: 0, z: 18 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      type: 'CorridorL',
      position: { x: -18, y: 0, z: 18 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: 'CorridorL',
      position: { x: 18, y: 0, z: -18 },
      rotation: { x: 0, y: Math.PI, z: 0 },
    },
    {
      type: 'CorridorL',
      position: { x: -18, y: 0, z: -18 },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
  ],
  pickups: [
    {
      id: 'pickup1',
      position: { x: 0, y: 0, z: 0 },
    },
    {
      id: 'pickup2',
      position: { x: 18, y: 0, z: 18 },
    },
    {
      id: 'pickup3',
      position: { x: -18, y: 0, z: 18 },
    },
    {
      id: 'pickup4',
      position: { x: -18, y: 0, z: -18 },
    },
    {
      id: 'pickup5',
      position: { x: 18, y: 0, z: -18 },
    },
  ],
  lights: [
    {
      id: 'pointLight1',
      position: { x: 0, y: 2.4, z: 0 },
      intensity: 1,
    },
    {
      id: 'pointLight2',
      position: { x: 18, y: 2.4, z: 18 },
      intensity: 0.3,
    },
    {
      id: 'pointLight3',
      position: { x: -18, y: 2.4, z: -18 },
      intensity: 0.3,
    },
  ],
  spawnPoint: { x: 9, y: 2, z: 0 },
};
