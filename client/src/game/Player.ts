import * as BABYLON from 'babylonjs';
import { RouterService } from './routing/routerService';

export const LEFT: number = 65; // A
export const RIGHT: number = 68; // D
export const UP: number = 87; // W
export const DOWN: number = 83; // S

export class Player {
  private scene: BABYLON.Scene;
  private keyDown: any = {};
  private keyFired: any = {};
  speed: number = 0.3;
  camera!: BABYLON.UniversalCamera;
  actionTriggerBox!: BABYLON.Mesh;
  id: string;

  constructor(scene: BABYLON.Scene, id: string) {
    this.scene = scene;
    this.id = id;
  }

  init() {
    this.camera = new BABYLON.UniversalCamera('player', new BABYLON.Vector3(0, 2, -3), this.scene);
    this.camera.speed = this.speed;
    this.camera.applyGravity = true;
    this.camera.ellipsoid = new BABYLON.Vector3(1, 0.75, 1);
    this.camera.checkCollisions = true;
    this.camera.keysUp = [UP]; // w
    this.camera.keysDown = [DOWN]; // S
    this.camera.keysLeft = [LEFT]; // A
    this.camera.keysRight = [RIGHT]; // D
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.scene.activeCamera = this.camera;

    // This mesh is used to trigger actions on intersection
    this.actionTriggerBox = BABYLON.MeshBuilder.CreateBox('collider', { size: 1 }, this.scene);
    this.actionTriggerBox.parent = this.camera;

    // This attaches the camera to the canvas
    this.camera.attachControl(
      this.scene.getEngine().getRenderingCanvas() as HTMLCanvasElement,
      true
    );

    // Register event listener for keys
    window.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        this.keyDownEvt(event);
      },
      false
    );
    window.addEventListener(
      'keyup',
      (event: KeyboardEvent) => {
        this.keyUpEvt(event);
      },
      false
    );
  }

  private keyDownEvt(evt: KeyboardEvent) {
    if (!this.keyFired[evt.keyCode]) {
      this.keyDown[evt.keyCode] = true;
      this.keyFired[evt.keyCode] = true;
    }
  }

  private keyUpEvt(evt: KeyboardEvent) {
    this.keyDown[evt.keyCode] = false;
    this.keyFired[evt.keyCode] = false;
  }

  sendMovement(router: RouterService) {
    const direction: BABYLON.Vector3 = this.camera.position.subtract(
      this.camera.getFrontPosition(1)
    );

    if (this.keyDown[UP] || this.keyDown[DOWN] || this.keyDown[LEFT] || this.keyDown[RIGHT]) {
      router.sendMovement(
        direction,
        this.keyDown[UP],
        this.keyDown[DOWN],
        this.keyDown[LEFT],
        this.keyDown[RIGHT]
      );
    }
  }

  update(position: BABYLON.Vector3) {
    this.camera.position = position;
  }
}
