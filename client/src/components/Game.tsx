import * as React from 'react';

import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import * as Colyseus from 'colyseus.js';

import CodeEditor from './CodeEditor';
import BabylonScene, { ISceneEventArgs } from './Scene';
import { Player } from '../game/Player';
import { RouterService } from '../game/routing/routerService';
import { Lights } from '../game/Lights';
import { Pickup } from '../game/Pickup';
import { Area } from '../game/Area';

export interface IGameProps {
  client: Colyseus.Client;
}

export default class PageWithScene extends React.Component<IGameProps, {}> {
  state = { inSolvingAreaOf: undefined, taskInProgress: false };

  private router: RouterService;

  constructor(props: IGameProps) {
    super(props);
    const room = props.client.join('game');
    this.router = new RouterService(room);
  }

  onSceneMount = (args: ISceneEventArgs) => {
    const { canvas, scene, engine } = args;

    scene.gravity = new BABYLON.Vector3(0, -5, 0);
    scene.collisionsEnabled = true;

    const area = new Area(scene);
    area.init();

    const lights = new Lights(scene);
    lights.init();

    const skyboxTexture = new BABYLON.CubeTexture(
      `${process.env.PUBLIC_URL}/assets/textures/skybox/space`,
      scene,
      ['_left.png', '_up.png', '_front.png', '_right.png', '_down.png', '_back.png']
    );
    scene.createDefaultSkybox(skyboxTexture, false, 1000);

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');

    BABYLON.ParticleHelper.BaseAssetsUrl = `${process.env.PUBLIC_URL}/assets/`;
    // BABYLON.Constants.PARTICLES_BaseAssetsUrl = ''

    const player = new Player(scene, 'player');
    player.init();

    const assetsManager = new BABYLON.AssetsManager(scene);
    const corridorTask = assetsManager.addMeshTask(
      'corridor task',
      '',
      `${process.env.PUBLIC_URL}/assets/`,
      'corridor4.babylon'
    );

    const pickupTask = assetsManager.addMeshTask(
      'pickup task',
      '',
      `${process.env.PUBLIC_URL}/assets/`,
      'pickup.babylon'
    );

    corridorTask.onSuccess = task => {
      task.loadedMeshes.forEach(mesh => {
        if (mesh.id !== 'Corridor4exits') {
          mesh.visibility = 0;
        }
      });
    };

    pickupTask.onSuccess = task => {
      const prefabPickup = task.loadedMeshes[0] as BABYLON.Mesh;
      prefabPickup.isVisible = false;

      const pickUp = new PickUp(scene, 'pickup1', prefabPickup);
      pickUp.init(lights);

      player.actionTriggerBox.actionManager = new BABYLON.ActionManager(scene);
      player.actionTriggerBox.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: pickUp.solveAreaBox,
          },
          () => {
            advancedTexture.addControl(pickUp.label);
            pickUp.label.linkWithMesh(pickUp.pickupMesh);
            this.setState({ inSolvingAreaOf: pickUp.pickupMesh });
          }
        )
      );
      player.actionTriggerBox.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: pickUp.solveAreaBox,
          },
          () => {
            advancedTexture.removeControl(pickUp.label);
            this.setState({ inSolvingAreaOf: undefined, taskInProgress: false });
          }
        )
      );
    };
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnKeyUpTrigger,
          parameter: ' ',
        },
        () => {
          console.log('Starting task solving');
          this.setState({ taskInProgress: true });
        },
        new BABYLON.PredicateCondition(scene.actionManager as BABYLON.ActionManager, () => {
          return !!this.state.inSolvingAreaOf;
        })
      )
    );

    assetsManager.onFinish = tasks => {
      engine.runRenderLoop(() => {
        player.sendMovement(this.router);
        scene.render();
      });
    };

    assetsManager.load();
  };

  render() {
    return (
      <div>
        <BabylonScene
          onSceneMount={this.onSceneMount}
          adaptToDeviceRatio={true}
          height={'650'}
          width={'1200'}
        />
        {this.state.taskInProgress && <CodeEditor />}
      </div>
    );
  }
}
