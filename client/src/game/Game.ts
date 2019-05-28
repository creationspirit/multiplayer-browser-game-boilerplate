import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import * as Colyseus from 'colyseus.js';

import { ISceneEventArgs } from '../components/Scene';
import { Lights } from './Lights';
import { Pickup } from './Pickup';
import { Area } from './Area';
import { Player } from './Player';
import { RouterService } from './routing/routerService';
import { GAME_ASSETS_URL, SKYBOX_TEXTURES_URL } from './constants';
import { createVector } from './utils';

BABYLON.ParticleHelper.BaseAssetsUrl = `${process.env.PUBLIC_URL}/assets/`;
// BABYLON.Constants.PARTICLES_BaseAssetsUrl = ''

export enum PrefabID {
  PICKUP = 'Barrel_WideS',
  CORRIDOR = 'Corridor',
  CORRIDOR_4 = 'Corridor4',
  CORRIDOR_T = 'CorridorT',
  CORRIDOR_L = 'CorridorL',
}

export class Game {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  private prefabs: { [id: string]: BABYLON.Mesh } = {};
  private lights: Lights;
  private player!: Player;
  private area: Area;
  private pickups: { [id: string]: Pickup } = {};

  private advancedTexture: GUI.AdvancedDynamicTexture;
  private assetsManager: BABYLON.AssetsManager;

  private router: RouterService;

  private setTaskInProgress: () => void;
  private removeTaskInProgress: () => void;

  constructor(
    args: ISceneEventArgs,
    client: Colyseus.Client,
    setTaskInProgress: () => void,
    removeTaskInProgress: () => void
  ) {
    this.canvas = args.canvas as HTMLCanvasElement;
    this.engine = args.engine;
    this.scene = args.scene;

    const room = client.join('game');
    this.router = new RouterService(room);

    this.lights = new Lights(this.scene);
    this.area = new Area(this.scene);

    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
    this.assetsManager = new BABYLON.AssetsManager(this.scene);

    this.setTaskInProgress = setTaskInProgress;
    this.removeTaskInProgress = removeTaskInProgress;
  }

  private createMeshTask(taskId: string, fileName: string) {
    return this.assetsManager.addMeshTask(taskId, '', GAME_ASSETS_URL, fileName);
  }

  private storePrefab(prefabName: string, task: BABYLON.MeshAssetTask) {
    const prefabMesh = task.loadedMeshes.find(mesh => mesh.id === prefabName) as BABYLON.Mesh;
    prefabMesh.getChildMeshes(true).forEach(child => (child.isVisible = false));
    prefabMesh.setEnabled(false);
    this.prefabs[prefabName] = prefabMesh;
  }

  load() {
    this.scene.gravity = new BABYLON.Vector3(0, -5, 0);
    this.scene.collisionsEnabled = true;
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);
    const skyboxTexture = new BABYLON.CubeTexture(SKYBOX_TEXTURES_URL, this.scene, [
      '_left.png',
      '_up.png',
      '_front.png',
      '_right.png',
      '_down.png',
      '_back.png',
    ]);
    this.scene.createDefaultSkybox(skyboxTexture, false, 1000);

    const corridor4Task = this.createMeshTask('corridor4', 'corridor4.babylon');
    const corridorTask = this.createMeshTask('corridor', 'corridorNormal.babylon');
    const corridorTTask = this.createMeshTask('corridorT', 'corridorT.babylon');
    const corridorLTask = this.createMeshTask('corridorL', 'corridorL.babylon');

    const pickupTask = this.createMeshTask('pickup', 'pickup.babylon');

    corridor4Task.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_4, task);
    corridorTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR, task);
    corridorTTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_T, task);
    corridorLTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_L, task);
    pickupTask.onSuccess = task => this.storePrefab(PrefabID.PICKUP, task);

    this.assetsManager.onFinish = tasks => {
      console.log(tasks);
      console.log(this.prefabs);
      this.initGameState(LEVEL);
      this.scene.executeWhenReady(() => this.run());
    };
  }

  initGameState(levelConfig: any) {
    this.area.init(levelConfig.corridors, this.prefabs);
    this.lights.init(levelConfig.lights);
    levelConfig.pickups.forEach((pickupConfig: any) => {
      const newPickup = new Pickup(this.scene, pickupConfig.id, this.prefabs[PrefabID.PICKUP]);
      newPickup.init(this.lights, createVector(pickupConfig.position));
      this.pickups[newPickup.id] = newPickup;
    });
    this.player = new Player(this.scene, 'player');
    this.player.init(createVector(levelConfig.spawnPoint));
    this.setupPlayerActions();
  }

  run() {
    this.engine.runRenderLoop(() => {
      this.player.sendMovement(this.router);
      this.scene.render();
    });
  }

  start() {
    this.assetsManager.load();
  }

  private setupPlayerActions() {
    const actionManager = this.player.getActionManager();
    Object.keys(this.pickups).forEach(key => {
      actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: this.pickups[key].solveAreaBox,
          },
          () => {
            this.advancedTexture.addControl(this.pickups[key].label);
            this.pickups[key].label.linkWithMesh(this.pickups[key].pickupMesh);
            this.player.inSolvingAreaOf = this.pickups[key];
          }
        )
      );
      actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: this.pickups[key].solveAreaBox,
          },
          () => {
            this.advancedTexture.removeControl(this.pickups[key].label);
            this.player.inSolvingAreaOf = undefined;
            this.removeTaskInProgress();
          }
        )
      );
      this.scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: ' ',
          },
          () => {
            this.setTaskInProgress();
          },
          new BABYLON.PredicateCondition(this.scene.actionManager as BABYLON.ActionManager, () => {
            return !!this.player.inSolvingAreaOf;
          })
        )
      );
    });
  }
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
  spawnPoint: { x: 9, y: 1, z: 0 },
};
