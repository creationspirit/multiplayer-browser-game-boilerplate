import * as BABYLON from 'babylonjs';

export class Area {
  private scene: BABYLON.Scene;
  private ground!: BABYLON.Mesh;
  private meshes: BABYLON.Mesh[] = [];

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  init() {
    this.ground = BABYLON.MeshBuilder.CreatePlane('ground', { width: 50, height: 50 }, this.scene);
    // has to be little above other meshes to keep collisions smooth
    this.ground.position = new BABYLON.Vector3(0, 0.2, 0);
    this.ground.checkCollisions = true;
    this.ground.isVisible = false;
    this.ground.isPickable = false;
    this.ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    // this.mesh.push(plane);

    this.meshes.forEach(element => {
      element.receiveShadows = true;
    });
  }
}
