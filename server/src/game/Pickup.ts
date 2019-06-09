import * as BABYLON from 'babylonjs';

export class Pickup {
  private scene: BABYLON.Scene;
  id: string;
  boundingBox!: BABYLON.Mesh;
  solveAreaBox!: BABYLON.Mesh;
  particleSet!: BABYLON.ParticleSystemSet;

  constructor(scene: BABYLON.Scene, id: string) {
    this.scene = scene;
    this.id = id;
  }

  init(position: BABYLON.Vector3) {
    // this.pickupMesh.position = position;
    this.boundingBox = BABYLON.MeshBuilder.CreateBox(
      `boundingBox_${this.id}`,
      { width: 1, height: 4, depth: 1 },
      this.scene
    );
    this.boundingBox.position = position;
    this.boundingBox.checkCollisions = true;

    this.solveAreaBox = BABYLON.MeshBuilder.CreateBox(
      `solveAreaBox_${this.id}`,
      { width: 3, height: 4, depth: 3 },
      this.scene
    );
    this.solveAreaBox.position = position;
  }
}
