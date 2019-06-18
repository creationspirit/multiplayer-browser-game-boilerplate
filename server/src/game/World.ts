import * as BABYLON from 'babylonjs';

import { Area } from './Area';
import { Pickup } from './Pickup';
import { Player } from './Player';
import { createVector } from '../utils/gameUtils';
import { XMLHttpRequest } from 'xhr2';

(global as any).XMLHttpRequest = XMLHttpRequest;

export enum PrefabID {
  PICKUP = 'Barrel_WideS',
  CORRIDOR = 'Corridor',
  CORRIDOR_4 = 'Corridor4',
  CORRIDOR_T = 'CorridorT',
  CORRIDOR_L = 'CorridorL',
}

export class World {
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  private assetsManager: BABYLON.AssetsManager;
  private area: Area;
  private prefabs: { [id: string]: BABYLON.Mesh } = {};

  private pickups: { [id: string]: Pickup } = {};
  players: { [id: string]: Player } = {};

  constructor() {
    this.engine = new BABYLON.NullEngine();
    this.scene = new BABYLON.Scene(this.engine);

    this.assetsManager = new BABYLON.AssetsManager(this.scene);
    this.area = new Area(this.scene);
  }

  private createMeshTask(taskId: string, fileName: string) {
    console.log('createTask', taskId);
    return this.assetsManager.addMeshTask(taskId, '', 'http://localhost:4000/assets/', fileName);
  }

  private storePrefab(prefabName: string, task: BABYLON.MeshAssetTask) {
    console.log('storing prefab', prefabName);
    // console.log(task.loadedMeshes);
    const prefabMesh = task.loadedMeshes.find(mesh => mesh.id === prefabName) as BABYLON.Mesh;
    prefabMesh.setEnabled(false);
    this.prefabs[prefabName] = prefabMesh;
  }

  init(levelConfig: any) {
    this.scene.gravity = new BABYLON.Vector3(0, -5, 0);
    this.scene.collisionsEnabled = true;
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);
    // Not sure why a camera is needed on the server side...
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      0.8,
      100,
      BABYLON.Vector3.Zero(),
      this.scene
    );
    const corridor4Task = this.createMeshTask('corridor4', 'corridor4.babylon');
    const corridorTask = this.createMeshTask('corridor', 'corridorNormal.babylon');
    const corridorTTask = this.createMeshTask('corridorT', 'corridorT.babylon');
    const corridorLTask = this.createMeshTask('corridorL', 'corridorL.babylon');

    corridor4Task.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_4, task);
    corridor4Task.onError = (task, message, exception) => console.log(message, exception);
    corridorTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR, task);
    corridorTask.onError = (task, message, exception) => console.log(message, exception);
    corridorTTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_T, task);
    corridorTTask.onError = (task, message, exception) => console.log(message, exception);
    corridorLTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_L, task);
    corridorLTask.onError = (task, message, exception) => console.log(message, exception);

    this.assetsManager.onFinish = tasks => {
      this.area.init(levelConfig.corridors, this.prefabs);

      this.scene.executeWhenReady(() => {
        console.log('scene ready');
        this.engine.runRenderLoop(() => {
          this.scene.render();
        });
      });
    };
    this.assetsManager.load();
  }

  createPlayer(id: string, position: BABYLON.Vector3): void {
    const player = new Player(this.scene, id);
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

  addPickup(id: number, position: BABYLON.Vector3) {
    const question = new Pickup(this.scene, id);
    question.init(position);
    this.pickups[id] = question;
  }

  removePickup(id: number) {
    const pickup: Pickup = this.pickups[id];
    if (pickup !== undefined) {
      pickup.boundingBox.dispose();
    }
    delete this.pickups[id];
  }

  dispose() {
    this.scene.dispose();
  }
}
