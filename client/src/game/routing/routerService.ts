import * as Colyseus from 'colyseus.js';
import * as BABYLON from 'babylonjs';

import { Game } from '../Game';

export const PLAYER_MOVEMENT: string = 'move';
export const SOLUTION_UPDATE: string = 'supd';
export const SOLVE_ATTEMPT: string = 'solv';
export const COLLECT: string = 'coll';

export class RouterService {
  client: Colyseus.Client;
  room!: Colyseus.Room;

  constructor(client: Colyseus.Client) {
    this.client = client;
  }

  connect(game: Game, roomId: string = 'game') {
    this.room = this.client.join(roomId);
    this.room.onJoin.add(() => {
      console.log('client joined successfully');

      this.room.onMessage.add((message: any) => {
        console.log(message);
        if (message.type === 'LVL_INIT') {
          game.initGameStateAndRun(message.data);
          this.setupMessageListeners(game);
        }
      });
    });
  }

  setupMessageListeners(game: Game) {
    // recieve game state for the first time
    this.room.onStateChange.addOnce((state: any) => {
      Object.keys(state.players).forEach((key: string) => {
        if (key !== this.room.sessionId) {
          game.addPlayer(key, new BABYLON.Vector3(state.players[key].x, 0.2, state.players[key].y));
        }
      });
      Object.keys(state.questions).forEach((key: string) => {
        game.addPickup(
          key,
          new BABYLON.Vector3(state.questions[key].x, 0.2, state.questions[key].y)
        );
      });
      game.timer.text = state.timer;
    });

    this.room.state.onChange = (changes: any) => {
      changes.forEach((change: any) => {
        if (change.field === 'timer') {
          game.timer.text = change.value;
        }
      });
    };

    this.room.state.questions.onAdd = (question: any, key: string) => {
      // console.log(question, 'has been added at', key);
      game.addPickup(key, new BABYLON.Vector3(question.x, 0.2, question.y));
    };

    this.room.state.players.onAdd = (player: any, key: string) => {
      if (key !== this.room.sessionId) {
        console.log(player, 'has been added at', key);
        game.addPlayer(key, new BABYLON.Vector3(player.x, 0.2, player.y));
      }
    };

    this.room.state.players.onChange = (player: any, key: string) => {
      // console.log(player, 'have changes at', key);
      game.updatePlayer(key, new BABYLON.Vector3(player.x, 0.2, player.y));
    };

    this.room.state.questions.onChange = (question: any, key: string) => {
      if (game.player.inSolvingAreaOf && parseInt(game.player.inSolvingAreaOf.id) === question.id) {
        game.setQuestion(question);
      }
    };
  }

  sendMovement(
    direction: BABYLON.Vector2,
    keyUp: boolean,
    keyDown: boolean,
    keyLeft: boolean,
    keyRight: boolean
  ) {
    this.room.send({
      type: PLAYER_MOVEMENT,
      data: { direction, keyUp, keyDown, keyLeft, keyRight },
    });
  }

  sendSolutionUpdate(id: string, sourceCode: string) {
    this.room.send({
      type: SOLUTION_UPDATE,
      data: { id, sourceCode },
    });
  }

  sendSolveAttempt(id: string) {
    this.room.send({
      type: SOLVE_ATTEMPT,
      data: { id },
    });
  }

  sendCollectReward(id: string) {
    this.room.send({
      type: COLLECT,
      data: { id },
    });
  }
}
