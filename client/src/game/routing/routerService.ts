import * as Colyseus from 'colyseus.js';
import * as BABYLON from 'babylonjs';

import { Game } from '../Game';

export const PLAYER_MOVEMENT: string = 'move';

export class RouterService {
  client: Colyseus.Client;
  room!: Colyseus.Room;

  constructor(client: Colyseus.Client) {
    this.client = client;
    // this.room.state.players.onAdd = (player: any, sessionId: any) => {
    //   // console.log(player, 'has been added at', sessionId);
    // };

    // this.room.state.players.onRemove = (player: any, sessionId: any) => {
    //   // console.log(player, 'has been removed from', sessionId);
    // };
    // this.room.onStateChange.add((state: any) => {
    //   console.log('the room state has been updated:', state);
    // });
  }

  connect(game: Game, roomId: string = 'game') {
    this.room = this.client.join(roomId);
    this.room.onJoin.add(() => {
      console.log('client joined successfully');

      this.room.onMessage.add((message: any) => {
        console.log(message);
        if (message.type === 'LVL_INIT') {
          game.initGameStateAndRun(message.data);
        }
      });

      // this.room.state.players.onChange = (player: any, sessionId: any) => {
      //   console.log(player, 'has been changed, ', sessionId);
      // };

      this.room.state.players.onAdd = (player: any, key: string) => {
        console.log(player, 'has been added at', key);
        game.addPlayer(key, new BABYLON.Vector3(player.x, 0.2, player.y));

        // player.onChange = (changes: any) => {
        //   changes.forEach((change: any) => {
        //     console.log(change.field);
        //     console.log(change.value);
        //     console.log(change.previousValue);
        //   });
        // };
      };

      this.room.state.players.onChange = (player: any, key: string) => {
        // console.log(player, "have changes at", key);
        game.updatePlayer(key, new BABYLON.Vector3(player.x, 0.2, player.y));
      };
    });
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
}
