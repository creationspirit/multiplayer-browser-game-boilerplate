import { Room, Client } from 'colyseus';

import { StateHandler } from './StateHandler';
import { PlayerState } from './state/PlayerState';
import { World } from '../game/World';
import { createVector } from '../utils/gameUtils';
import { questionAPI, generateJWT } from '../config/requests';
import { AxiosResponse } from 'axios';

import { LEVEL_CONFIG_MOCK as LEVEL } from '../config/mocks';

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
    console.log('world is initialized');
    this.getQuestions();

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
    console.log(`player ${client.sessionId} joined.`);
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

  async getQuestions() {
    let questions;
    try {
      questions = await questionAPI.get('/question', {
        headers: { Authorization: generateJWT() },
        params: { n: LEVEL.pickups.length },
      });
    } catch (e) {
      console.log('Unable to fetch questions', e);
    }
    console.log((questions as AxiosResponse).data);
  }
}
