import * as Colyseus from 'colyseus.js';
import { Vector3 } from 'babylonjs';

export const PLAYER_MOVEMENT: string = 'move';

export class RouterService {
  private room: Colyseus.Room;

  constructor(room: Colyseus.Room) {
    this.room = room;
    this.room.onJoin.add(() => {
      console.log('client joined successfully');

      this.room.state.players.onAdd = (player: any, sessionId: any) => {
        console.log(player, 'has been added at', sessionId);
      };

      this.room.state.players.onRemove = (player: any, sessionId: any) => {
        console.log(player, 'has been removed from', sessionId);
      };

      this.room.state.players.onChange = (player: any, sessionId: any) => {
        console.log(player, 'has been changed, ', sessionId);
      };
    });
    this.room.onStateChange.add((state: any) => {
      console.log('the room state has been updated:', state);
    });
  }

  sendMovement(
    direction: Vector3,
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
