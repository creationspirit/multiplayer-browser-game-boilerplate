import * as BABYLON from 'babylonjs';

import { Player } from './Player';
import { XMLHttpRequest } from 'xhr2';

(global as any).XMLHttpRequest = XMLHttpRequest;

export class World {
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  players: { [id: string]: Player } = {};

  constructor() {
    this.engine = new BABYLON.NullEngine();
    this.scene = new BABYLON.Scene(this.engine);
  }

  init() {
    this.scene.gravity = new BABYLON.Vector3(0, -5, 0);
    this.scene.collisionsEnabled = true;

    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      0.8,
      100,
      BABYLON.Vector3.Zero(),
      this.scene
    );

    const ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, this.scene);
    ground.checkCollisions = true;

    this.engine.runRenderLoop(() => {
        if (this.scene) {
            this.scene.render();
        }
    });
  }

  createPlayer(id: string): void {
    const player = new Player(this.scene, id);
    const position = new BABYLON.Vector3(this.getRandomNum(-2, 2), 1, this.getRandomNum(-2, 2))
    player.init(position);

    this.players[id] = player;
  }

  removePlayer(id: string) {
    const player: Player = this.players[id];
    if (player !== undefined) {
      player.playerMesh.dispose();
    }
    delete this.players[id];
  }

  dispose() {
    this.scene.dispose();
  }

  private getRandomNum(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
