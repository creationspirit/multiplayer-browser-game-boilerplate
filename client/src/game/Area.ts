import * as BABYLON from 'babylonjs';
import { createVector } from './utils';

export class Area {
  private scene: BABYLON.Scene;
  private ground!: BABYLON.Mesh;
  private meshes: BABYLON.Mesh[] = [];

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  init(data: any[], prefabs: { [id: string]: BABYLON.Mesh }) {
    this.ground = BABYLON.MeshBuilder.CreatePlane(
      'ground',
      { width: 200, height: 200 },
      this.scene
    );
    // has to be little above other meshes to keep collisions smooth
    this.ground.position = new BABYLON.Vector3(0, 0.2, 0);
    this.ground.checkCollisions = true;
    this.ground.isVisible = false;
    this.ground.isPickable = false;
    this.ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    data.forEach((meshData, index) => {
      console.log(prefabs);
      console.log(meshData.type);
      const mesh = prefabs[meshData.type].clone(`area${index}`);
      mesh.position = createVector(meshData.position);
      mesh.rotation = createVector(meshData.rotation);
      mesh.receiveShadows = true;
      mesh.setEnabled(true);
      this.meshes.push(mesh);
    });
  }
}
