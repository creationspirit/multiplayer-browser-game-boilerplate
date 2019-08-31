import * as BABYLON from 'babylonjs';
import { RouterService } from './routing/routerService';

export const LEFT: [number, string] = [65, 'a'];
export const RIGHT: [number, string] = [68, 'd'];
export const UP: [number, string] = [87, 'w'];
export const DOWN: [number, string] = [83, 's'];

export class Player {
  private scene: BABYLON.Scene;
  private keyDown: any = {};
  private keyFired: any = {};
  speed: number = 0.3;
  camera!: BABYLON.UniversalCamera;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  init(position: BABYLON.Vector3) {
    this.camera = new BABYLON.UniversalCamera('player', position, this.scene);
    this.camera.speed = this.speed;
    this.camera.applyGravity = true;
    this.camera.ellipsoid = new BABYLON.Vector3(1, 0.75, 1);
    this.camera.checkCollisions = true;
    this.camera.keysUp = [UP[0]]; // w
    this.camera.keysDown = [DOWN[0]]; // S
    this.camera.keysLeft = [LEFT[0]]; // A
    this.camera.keysRight = [RIGHT[0]]; // D
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.scene.activeCamera = this.camera;

    // This attaches the camera to the canvas
    this.camera.attachControl(
      this.scene.getEngine().getRenderingCanvas() as HTMLCanvasElement,
      true
    );
  }

  private keyDownEvt(keyCode: number) {
    if (!this.keyFired[keyCode]) {
      this.keyDown[keyCode] = true;
      this.keyFired[keyCode] = true;
    }
  }

  private keyUpEvt(keyCode: number) {
    this.keyDown[keyCode] = false;
    this.keyFired[keyCode] = false;
  }

  setupControls(sceneActionManager: BABYLON.ActionManager) {
    [LEFT, RIGHT, UP, DOWN].forEach((control: [number, string]) => {
      sceneActionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: control[1],
          },
          () => this.keyUpEvt(control[0])
        )
      );
      sceneActionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnKeyDownTrigger,
            parameter: control[1],
          },
          () => this.keyDownEvt(control[0])
        )
      );
    });
  }

  sendMovement(router: RouterService) {
    if (
      this.keyDown[UP[0]] ||
      this.keyDown[DOWN[0]] ||
      this.keyDown[LEFT[0]] ||
      this.keyDown[RIGHT[0]]
    ) {
      const direction: BABYLON.Vector3 = this.camera
        .getFrontPosition(1)
        .subtract(this.camera.position);
      router.sendMovement(
        new BABYLON.Vector2(direction.x, direction.z).normalize(),
        this.keyDown[UP[0]],
        this.keyDown[DOWN[0]],
        this.keyDown[LEFT[0]],
        this.keyDown[RIGHT[0]]
      );
    }
  }

  update(position: BABYLON.Vector3) {
    this.camera.position.x = position.x;
    this.camera.position.z = position.z;
  }
}
