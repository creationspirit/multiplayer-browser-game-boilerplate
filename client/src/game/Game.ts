import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import * as Colyseus from 'colyseus.js';

import Scene, { ISceneEventArgs } from '../components/Scene';
import { Lights } from './Lights';
import { Pickup } from './Pickup';
import { Area } from './Area';
import { Player } from './Player';
import { Rival } from './Rival';
import { RouterService } from './routing/routerService';
import { GAME_ASSETS_URL, SKYBOX_TEXTURES_URL } from './constants';
import { createVector } from './utils';

BABYLON.ParticleHelper.BaseAssetsUrl = `${process.env.PUBLIC_URL}/assets/`;
// BABYLON.Constants.PARTICLES_BaseAssetsUrl = ''

export enum PrefabID {
  PICKUP = 'Barrel_WideS',
  PLAYER = 'YBot',
  CORRIDOR = 'Corridor',
  CORRIDOR_4 = 'Corridor4',
  CORRIDOR_T = 'CorridorT',
  CORRIDOR_L = 'CorridorL',
}

export class Game {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  scene: BABYLON.Scene;

  private prefabs: { [id: string]: BABYLON.Mesh } = {};
  private lights: Lights;
  player!: Player;
  private rivals: { [id: string]: Rival } = {};
  private area: Area;
  private pickups: { [id: string]: Pickup } = {};
  timer!: GUI.TextBlock;
  scoreboard!: GUI.TextBlock;
  private questionNum: number;
  private solvedQuestionsNum: number;
  private mode: string;

  private advancedTexture: GUI.AdvancedDynamicTexture;
  private assetsManager: BABYLON.AssetsManager;

  router: RouterService;

  private setTaskInProgress: () => void;
  private removeTaskInProgress: () => void;
  setQuestion: (question: any) => void;
  resetState: (questionId: number) => void;
  setGameResult: (gameResult: string) => void;

  constructor(
    args: ISceneEventArgs,
    client: Colyseus.Client,
    roomId: string,
    roomData: any,
    setTaskInProgress: () => void,
    removeTaskInProgress: () => void,
    setQuestion: (question: any) => void,
    resetState: (questionId: number) => void,
    setGameResult: (gameResult: string) => void
  ) {
    this.canvas = args.canvas as HTMLCanvasElement;
    this.engine = args.engine;
    this.scene = args.scene;

    this.router = new RouterService(client, roomId, roomData);

    this.lights = new Lights(this.scene);
    this.area = new Area(this.scene);

    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui', true, this.scene);
    const { timerLabel, scoreboard } = this.createTimerGUI();
    this.timer = timerLabel;
    this.scoreboard = scoreboard;
    this.mode = roomData.mode;
    if (roomData.mode === 'battle') {
      this.timer.text = 'BLUE - RED';
      this.scoreboard.text = '0 - 0';
    }
    this.createCrosshairGUI();
    this.assetsManager = new BABYLON.AssetsManager(this.scene);

    this.questionNum = 0;
    this.solvedQuestionsNum = 0;

    // Store references to react state callbacks
    this.setTaskInProgress = setTaskInProgress;
    this.removeTaskInProgress = removeTaskInProgress;
    this.setQuestion = setQuestion;
    this.resetState = resetState;
    this.setGameResult = setGameResult;
  }

  private createMeshTask(taskId: string, fileName: string) {
    // console.log('creating task', taskId);
    return this.assetsManager.addMeshTask(taskId, '', GAME_ASSETS_URL, fileName);
  }

  private storePrefab(prefabName: string, task: BABYLON.MeshAssetTask) {
    // console.log('storing prefab', prefabName);
    const prefabMesh = task.loadedMeshes.find(mesh => mesh.id === prefabName) as BABYLON.Mesh;
    prefabMesh.getChildMeshes(true).forEach(child => (child.isVisible = false));
    prefabMesh.setEnabled(false);
    this.prefabs[prefabName] = prefabMesh;
  }

  private storePlayerPrefab(task: BABYLON.MeshAssetTask) {
    const prefabMesh = task.loadedMeshes.find(
      mesh => mesh.name === PrefabID.PLAYER
    ) as BABYLON.Mesh;
    prefabMesh.getChildMeshes(true).forEach(child => child.setEnabled(false));
    prefabMesh.setEnabled(false);
    this.prefabs[PrefabID.PLAYER] = prefabMesh;
  }

  load() {
    // this.scene.debugLayer.show();
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
    const playerTask = this.createMeshTask('player', 'player.babylon');

    corridor4Task.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_4, task);
    corridorTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR, task);
    corridorTTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_T, task);
    corridorLTask.onSuccess = task => this.storePrefab(PrefabID.CORRIDOR_L, task);
    pickupTask.onSuccess = task => this.storePrefab(PrefabID.PICKUP, task);
    playerTask.onSuccess = task => this.storePlayerPrefab(task);

    this.assetsManager.onFinish = tasks => {
      this.router.connect(this);
    };
  }

  initGameStateAndRun(levelConfig: any) {
    this.area.init(levelConfig.corridors, this.prefabs);
    this.lights.init(levelConfig.lights);
    this.player = new Player(this.scene, this.router.room.sessionId);
    this.player.init(createVector(levelConfig.spawnPoint));
    this.player.setupControls(this.scene.actionManager as BABYLON.ActionManager);
    this.setupPlayerActions();
    this.run();
  }

  private run() {
    this.scene.executeWhenReady(() => {
      this.engine.runRenderLoop(() => {
        this.player.sendMovement(this.router);
        this.scene.render();
      });
    });
  }

  start() {
    this.assetsManager.load();
  }

  private setupPlayerActions() {
    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnKeyUpTrigger,
          parameter: ' ',
        },
        () => {
          const question = this.router.room.state.questions[
            (this.player.inSolvingAreaOf as Pickup).id
          ];
          if (this.mode === 'game') {
            this.setQuestion(question);
          } else {
            this.setQuestion({
              solution: question.solutions[this.router.team as string].solution,
              tests: question.solutions[this.router.team as string].tests,
              status: question.solutions[this.router.team as string].status,
              id: question.id,
              text: question.text,
            });
          }
          this.player.isSolving = true;
        },
        new BABYLON.PredicateCondition(this.scene.actionManager as BABYLON.ActionManager, () => {
          return !!this.player.inSolvingAreaOf;
        })
      )
    );
  }

  private setupPickupActions(pickup: Pickup) {
    const actionManager = this.player.getActionManager();
    pickup.actions.push(actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
          parameter: pickup.solveAreaBox,
        },
        () => {
          this.advancedTexture.addControl(pickup.label);
          pickup.label.linkWithMesh(pickup.pickupMesh);
          this.player.inSolvingAreaOf = pickup;
        }
      )
    ) as BABYLON.IAction);
    pickup.actions.push(actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
          parameter: pickup.solveAreaBox,
        },
        () => {
          this.advancedTexture.removeControl(pickup.label);
          this.player.inSolvingAreaOf = undefined;
          this.removeTaskInProgress();
        }
      )
    ) as BABYLON.IAction);
  }

  addPlayer(key: string, position: BABYLON.Vector3) {
    const newRival = new Rival(this.scene, this.prefabs[PrefabID.PLAYER], key);
    newRival.init(position);
    this.rivals[key] = newRival;
  }

  removePlayer(key: string) {
    const rival = this.rivals[key];
    if (rival) {
      rival.skeleton.dispose();
      rival.mesh.dispose();
      delete this.rivals[key];
    }
  }

  updatePlayer(key: string, position: BABYLON.Vector3) {
    if (key === this.player.id) {
      position.y = 2;
      this.player.update(position);
    }
    if (this.rivals[key]) {
      this.rivals[key].update(position);
    }
  }

  addPickup(id: string, position: BABYLON.Vector3) {
    const newPickup = new Pickup(this.scene, id, this.prefabs[PrefabID.PICKUP]);
    newPickup.init(this.lights, position);
    this.setupPickupActions(newPickup);
    this.pickups[newPickup.id] = newPickup;
    this.questionNum++;
    if (this.mode !== 'battle') {
      this.scoreboard.text = `${this.solvedQuestionsNum}/${this.questionNum}`;
    }
  }

  removePickup(id: string) {
    const pickup: Pickup = this.pickups[id];
    if (pickup) {
      const actionManager = this.player.getActionManager();
      pickup.actions.forEach(action => {
        actionManager.unregisterAction(action);
      });
      pickup.dispose();
      delete this.pickups[id];
      this.solvedQuestionsNum++;
    }
    this.scoreboard.text = `${this.solvedQuestionsNum}/${this.questionNum}`;
  }

  createTimerGUI() {
    const label = new GUI.Rectangle(`timer_rectangle`);
    label.background = 'black';
    label.paddingTop = '10px';
    label.alpha = 0.6;
    label.cornerRadius = 20;
    label.width = '200px';
    label.height = '100px';
    label.thickness = 1;
    label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    label.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    const panel = new GUI.StackPanel();
    label.addControl(panel);

    const timerLabel = new GUI.TextBlock();
    timerLabel.resizeToFit = true;
    timerLabel.text = '30:00';
    timerLabel.fontSize = 30;
    timerLabel.fontStyle = 'bold';
    timerLabel.color = 'white';
    panel.addControl(timerLabel);

    const scoreboard = new GUI.TextBlock();
    scoreboard.resizeToFit = true;
    scoreboard.text = `${this.solvedQuestionsNum}/${this.questionNum}`;
    scoreboard.fontSize = 30;
    scoreboard.fontStyle = 'bold';
    scoreboard.color = 'white';
    panel.addControl(scoreboard);

    this.advancedTexture.addControl(label);

    return { timerLabel, scoreboard };
  }

  createNotificationGUI(text: string, timeout: number | null = null) {
    const label = new GUI.Rectangle('reward_rectangle');
    label.background = 'black';
    label.paddingTop = '120px';
    label.alpha = 0.6;
    label.cornerRadius = 20;
    label.width = '350px';
    label.height = '270px';
    label.thickness = 1;
    label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    label.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    const textBlock = new GUI.TextBlock();
    textBlock.resizeToFit = true;
    textBlock.text = text;
    textBlock.fontSize = 30;
    textBlock.fontStyle = 'bold';
    textBlock.color = 'white';
    label.addControl(textBlock);
    this.advancedTexture.addControl(label);
    if (timeout) {
      setTimeout(() => {
        this.advancedTexture.removeControl(label);
        label.dispose();
      }, timeout);
    }
  }

  createCrosshairGUI() {
    const image = new GUI.Image('crosshair', `${process.env.PUBLIC_URL}/icons/crosshair.png`);
    image.width = '30px';
    image.height = '30px';
    image.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    image.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.advancedTexture.addControl(image);
  }
}
