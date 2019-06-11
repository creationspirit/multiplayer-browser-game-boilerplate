import { Room, Client } from 'colyseus';

import { StateHandler } from './StateHandler';
import { PlayerState } from './state/PlayerState';
import { QuestionStatus } from './state/QuestionState';
import { World } from '../game/World';
import { createVector } from '../utils/gameUtils';
import { questionAPI, generateJWT } from '../config/requests';

import { LEVEL_CONFIG_MOCK as LEVEL } from '../config/mocks';

export enum MessageType {
  LVL_INIT = 'LVL_INIT',
  MOVE = 'move',
  SOLUTION_UPDATE = 'supd',
  SOLVE_ATTEMPT = 'solv',
  COLLECT = 'coll',
}

// this should be on metadata for onInit method
const TIME: number = 30 * 60000; // 30 min

// ALL client.sessionId SHOULD BE CHANGED TO client.id IN A PRODUCTION ENVIRONMENT
export class GameRoom extends Room<StateHandler> {
  maxClients = 4;

  private world!: World;
  private timer!: number;

  // When room is initialized
  onInit(options: any) {
    this.world = new World();
    this.timer = TIME;
    this.world.init(LEVEL);
    console.log('world is initialized');
    this.getQuestions();

    this.setSimulationInterval(() => this.onUpdate());
    this.setState(new StateHandler(TIME));

    this.clock.setInterval(() => {
      this.timer = this.timer - 1000;
      this.state.updateTimer(this.timer);
    }, 1000);
  }

  // Checks if a new client is allowed to join.
  requestJoin(options: any, isNew: boolean) {
    return options.create ? options.create && isNew : this.clients.length > 0;
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
    const data = message.data;
    const player = this.state.getPlayer(client.sessionId);

    if (message.type === MessageType.MOVE) {
      this.world.players[client.sessionId].applyMovement(data);
    }

    if (message.type === MessageType.SOLUTION_UPDATE) {
      this.state.questions[data.id].solution = data.sourceCode;
    }

    if (message.type === MessageType.SOLVE_ATTEMPT) {
      this.solveQuestion(data.id);
    }

    if (message.type === MessageType.COLLECT) {
      const reward = this.state.questions[data.id].calculateReward();
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
  onDispose() {}

  async getQuestions() {
    let questions;
    try {
      questions = await questionAPI.get('/question', {
        headers: { Authorization: generateJWT() },
        params: { n: LEVEL.pickups.length },
      });
    } catch (e) {
      return console.log('Unable to fetch questions', e);
    }
    // console.log((questions as AxiosResponse).data);
    questions.data.forEach((questionData: any, index: number) => {
      this.world.addPickup(questionData.id, createVector(LEVEL.pickups[index].position));
      this.state.addQuestion(
        questionData,
        LEVEL.pickups[index].position.x,
        LEVEL.pickups[index].position.z
      );
    });
  }

  async solveQuestion(id: string) {
    let response;
    this.state.questions[id].status = QuestionStatus.EVALUATE;
    const solution = this.state.questions[id].solution;
    try {
      response = await questionAPI.post(
        `/question/exec/${id}`,
        {
          source: solution,
        },
        {
          headers: { Authorization: generateJWT() },
        }
      );
    } catch (e) {
      this.state.questions[id].status = QuestionStatus.STANDARD;
      return console.log('Unable to solve question', e);
    }
    response.data.result.c_outcome.forEach((outcome: any, index: number) => {
      this.state.questions[id].tests[index].updateCurrent(outcome);
    });
    this.state.questions[id].score = parseFloat(response.data.result.score_perc);

    if (response.data.result.is_partial) {
      this.state.questions[id].status = QuestionStatus.PARTIAL;
    } else if (response.data.result.is_correct) {
      this.state.questions[id].status = QuestionStatus.SOLVED;
    } else {
      this.state.questions[id].status = QuestionStatus.STANDARD;
    }
  }
}
