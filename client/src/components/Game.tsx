import * as React from 'react';

import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import BabylonScene, { ISceneEventArgs } from './Scene';
import CodeEditor from './CodeEditor';

export default class PageWithScene extends React.Component<{}, {}> {
  state = { inSolvingAreaOf: undefined, taskInProgress: false };

  createLabel = (mesh: BABYLON.AbstractMesh) => {
    const label = new GUI.Rectangle('label for ' + mesh.name);
    label.background = 'black';
    label.height = 0.05;
    label.alpha = 0.5;
    label.width = 0.15;
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -400;

    const text1 = new GUI.TextBlock();
    text1.resizeToFit = true;
    text1.text = 'Press SPACE to start solving';
    text1.fontSize = 24;
    text1.color = 'white';
    label.addControl(text1);

    return label;
  };

  onSceneMount = (args: ISceneEventArgs) => {
    const { canvas, scene, engine } = args;

    scene.gravity = new BABYLON.Vector3(0, -5, 0);
    scene.collisionsEnabled = true;

    const ground = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 50, height: 50 }, scene);
    ground.position = new BABYLON.Vector3(0, 0.2, 0);
    ground.checkCollisions = true;
    ground.visibility = 0;
    ground.isPickable = false;
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

    const pointLight = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 2.4, 0), scene);
    pointLight.diffuse = new BABYLON.Color3(1, 1, 1);
    pointLight.specular = new BABYLON.Color3(0.5, 0.5, 0.5);

    const shadowGenerator = new BABYLON.ShadowGenerator(1024, pointLight);
    shadowGenerator.setDarkness(0.5);
    shadowGenerator.usePoissonSampling = true;

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.4;

    const skyboxTexture = new BABYLON.CubeTexture(
      `${process.env.PUBLIC_URL}/assets/textures/skybox/space`,
      scene,
      ['_left.png', '_up.png', '_front.png', '_right.png', '_down.png', '_back.png']
    );
    scene.createDefaultSkybox(skyboxTexture, false, 1000);

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
    // console.log(advancedTexture);

    BABYLON.ParticleHelper.BaseAssetsUrl = `${process.env.PUBLIC_URL}/assets/`;

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 2, -3), scene);
    camera.speed = 0.3;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    const cameraCollider = BABYLON.MeshBuilder.CreateBox('collider', { size: 1 }, scene);
    cameraCollider.parent = camera;
    camera.checkCollisions = true;
    camera.keysUp = [87]; // w
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    scene.activeCamera = camera;
    // This attaches the camera to the canvas
    camera.attachControl(canvas as HTMLElement, true);

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
      task.loadedMeshes[0].receiveShadows = true;
      task.loadedMeshes[0].checkCollisions = false;
    };

    pickupTask.onSuccess = task => {
      const pickupMesh = task.loadedMeshes[0];

      const boundingBox = BABYLON.MeshBuilder.CreateBox(
        'pickupBox',
        { width: 1, height: 4, depth: 1 },
        scene
      );
      boundingBox.position = pickupMesh.position;
      boundingBox.checkCollisions = true;
      boundingBox.visibility = 0;
      boundingBox.isPickable = false;

      const solveAreaBox = BABYLON.MeshBuilder.CreateBox(
        'pickupBox',
        { width: 3, height: 4, depth: 3 },
        scene
      );
      solveAreaBox.position = pickupMesh.position;
      solveAreaBox.visibility = 0;
      solveAreaBox.isPickable = false;

      scene.beginAnimation(pickupMesh, 0, 420, true);

      shadowGenerator.addShadowCaster(pickupMesh);

      BABYLON.ParticleHelper.CreateAsync('pickupEmit', scene).then(set => {
        set.start();
      });

      const label = this.createLabel(pickupMesh);
      cameraCollider.actionManager = new BABYLON.ActionManager(scene);
      cameraCollider.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: solveAreaBox,
          },
          () => {
            advancedTexture.addControl(label);
            label.linkWithMesh(pickupMesh);
            this.setState({ inSolvingAreaOf: pickupMesh });
          }
        )
      );
      cameraCollider.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: solveAreaBox,
          },
          () => {
            advancedTexture.removeControl(label);
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
