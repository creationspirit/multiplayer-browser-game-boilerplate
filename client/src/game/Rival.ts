import * as BABYLON from 'babylonjs';

export class Rival {
  private scene: BABYLON.Scene;
  id: string;
  mesh: BABYLON.Mesh;

  constructor(scene: BABYLON.Scene, id: string) {
    this.scene = scene;
    this.id = id;
    this.mesh = BABYLON.Mesh.CreateSphere(id, 16, 2, this.scene);
  }

  init(position: BABYLON.Vector3) {
    this.mesh.position = position;
  }

  update(position: BABYLON.Vector3) {
    this.mesh.position = position;
  }
}
