import * as BABYLON from 'babylonjs';

export class Player {
  private scene: BABYLON.Scene;
  speed: number = 0.15;
  playerMesh!: BABYLON.Mesh;
  actionTriggerBox!: BABYLON.Mesh;
  id: string;

  constructor(scene: BABYLON.Scene, id: string) {
    this.scene = scene;
    this.id = id;
  }

  init(position: BABYLON.Vector3) {
    this.playerMesh = BABYLON.MeshBuilder.CreateSphere(
      `player_${this.id}`,
      { diameterX: 1, diameterY: 0.75, diameterZ: 1 },
      this.scene
    );
    this.playerMesh.checkCollisions = true;
    this.playerMesh.position = position;

    // This mesh is used to trigger actions on intersection
    this.actionTriggerBox = BABYLON.MeshBuilder.CreateBox('collider', { size: 1 }, this.scene);
    this.actionTriggerBox.parent = this.playerMesh;
    this.actionTriggerBox.actionManager = new BABYLON.ActionManager(this.scene);
  }

  getActionManager() {
    return this.actionTriggerBox.actionManager as BABYLON.ActionManager;
  }

  applyMovement(data: any) {
    const direction = data.direction;
    const up = new BABYLON.Vector2(direction.x, direction.y);
    const down = new BABYLON.Vector2(-direction.x, -direction.y);
    const left = new BABYLON.Vector2(-direction.y, direction.x);
    const right = new BABYLON.Vector2(direction.y, -direction.x);

    let moveDir = new BABYLON.Vector2(0, 0);
    if (data.keyUp) {
      moveDir.addInPlace(up);
    }
    if (data.keyDown) {
      moveDir.addInPlace(down);
    }
    if (data.keyLeft) {
      moveDir.addInPlace(left);
    }
    if (data.keyRight) {
      moveDir.addInPlace(right);
    }
    moveDir = moveDir.normalize();
    moveDir.scaleInPlace(this.speed);
    this.playerMesh.moveWithCollisions(new BABYLON.Vector3(moveDir.x, 0, moveDir.y));
  }
}
