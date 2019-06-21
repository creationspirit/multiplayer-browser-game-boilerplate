import { Room, Client } from 'colyseus';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';

import { BattleStateHandler } from './BattleStateHandler';
import { World } from '../game/World';
import { createVector, getRandomArrayElements } from '../utils/gameUtils';
import { questionAPI, generateJWT } from '../config/requests';
import { User } from '../models/User';
import RuleEngine from './RuleEngine';
import { MessageType, GameStatus, QuestionStatus } from './constants';

import { LEVEL_CONFIG_MOCK as LEVEL } from '../config/mocks';

interface IConfig {
  stage: number;
  difficulty: number;
}

// ALL client.sessionId SHOULD BE CHANGED TO client.id IN A PRODUCTION ENVIRONMENT
export class BattleRoom extends Room<BattleStateHandler> {
  maxClients = 4;

  private world!: World;
  private config!: IConfig;
  // private ruleEngine!: RuleEngine;

  // When room is initialized
  onInit(options: any) {
    this.config = options.roomData;
    // this.ruleEngine = new RuleEngine(
    //   options.roomData.mode === 2 ? true : false,
    //   options.roomData.stage,
    //   options.roomData.difficulty
    // );
    console.log('Creating a room with configuration:', options);
    this.world = new World();
    this.world.init(LEVEL);
    console.log('World is initialized');
    this.getQuestions();

    this.setSimulationInterval(() => this.onUpdate());
    this.setState(new BattleStateHandler());
  }

  // Checks if a new client is allowed to join.
  requestJoin(options: any, isNew: boolean) {
    return options.create ? options.create && isNew : this.clients.length > 0;
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  async onAuth(options: any) {
    try {
      const decoded = await jwt.verify(options.token, process.env.JWT_SECRET as string);
      const user = await getRepository(User).findOneOrFail({
        edgarId: (decoded as { _id: number })._id,
      });
      return user ? user : false;
    } catch (e) {
      return false;
    }
  }

  // When client successfully join the room
  onJoin(client: Client, options: any, auth: User) {
    this.send(client, { type: MessageType.LVL_INIT, data: LEVEL });
    this.world.createPlayer(client.sessionId, createVector(LEVEL.spawnPoint));
    this.state.addPlayer(
      client.sessionId,
      auth.id,
      `${auth.firstName} ${auth.lastName}`,
      LEVEL.spawnPoint.x,
      LEVEL.spawnPoint.z
    );
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
      const team = this.state.players[client.sessionId].team;
      this.state.questions[data.id].solutions[team].solution = data.sourceCode;
    }

    if (message.type === MessageType.SOLVE_ATTEMPT) {
      this.solveQuestion(data.id, this.state.players[client.sessionId].team);
    }

    if (message.type === MessageType.COLLECT) {
      this.completeQuestion(data.id);
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

  async getQuestions() {
    let response;
    try {
      response = await questionAPI.get(`/exercise/${this.config.stage}/questions`, {
        headers: { Authorization: generateJWT() },
      });
    } catch (e) {
      return console.log('Unable to fetch questions', e);
    }
    let questions: any[] = response.data.data.questions;

    // filter only questions of desired difficulty
    questions = questions.filter((q: any) => {
      return q.id_difficulty_level === this.config.difficulty;
    });
    // choose random questions from a pool of questions
    questions = getRandomArrayElements(questions, LEVEL.pickups.length);

    questions.forEach((questionData: any, index: number) => {
      this.world.addPickup(questionData.id, createVector(LEVEL.pickups[index].position));
      this.state.addQuestion(
        questionData,
        LEVEL.pickups[index].position.x,
        LEVEL.pickups[index].position.z
      );
    });
  }

  async solveQuestion(id: string, team: string) {
    let response;
    this.state.questions[id].solutions[team].status = QuestionStatus.EVALUATE;
    const solution = this.state.questions[id].solutions[team].solution;
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
      this.state.questions[id].solutions[team].status = QuestionStatus.STANDARD;
      return console.log('Unable to solve question', e);
    }
    response.data.result.c_outcome.forEach((outcome: any, index: number) => {
      this.state.questions[id].solutions[team].tests[index].updateCurrent(outcome);
    });

    if (response.data.result.is_partial) {
      this.state.questions[id].solutions[team].status = QuestionStatus.PARTIAL;
    } else if (response.data.result.is_correct) {
      this.state.questions[id].solutions[team].status = QuestionStatus.SOLVED;
    } else {
      this.state.questions[id].solutions[team].status = QuestionStatus.STANDARD;
    }
  }

  async completeQuestion(questionId: number) {
    try {
      // const reward = await this.ruleEngine.dealRewards(this.state, questionId);
      this.state.removeQuestion(questionId);
      this.world.removePickup(questionId);

      if (this.state.questions.size === 0) {
        this.state.status = GameStatus.OVER;
      }

      // this.broadcast(
      //   {
      //     type: MessageType.DISPLAY_REWARD,
      //     data: {
      //       id: questionId,
      //       loc: reward.loc,
      //       exp: reward.exp,
      //     },
      //   },
      //   { afterNextPatch: true }
      // );
    } catch (e) {}
  }
}
