import * as BABYLON from 'babylonjs';

export class Lights {
  private ambientLight!: BABYLON.HemisphericLight;
  private pointLight!: BABYLON.PointLight;
  private scene: BABYLON.Scene;
  private shadowGenerator!: BABYLON.ShadowGenerator;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  init() {
    this.ambientLight = new BABYLON.HemisphericLight(
      'ambLight',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    this.ambientLight.intensity = 0.4;

    this.pointLight = new BABYLON.PointLight(
      'pointLight',
      new BABYLON.Vector3(0, 2.4, 0),
      this.scene
    );
    this.pointLight.diffuse = new BABYLON.Color3(1, 1, 1);
    this.pointLight.specular = new BABYLON.Color3(0.5, 0.5, 0.5);

    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.pointLight);
    this.shadowGenerator.setDarkness(0.5);
    this.shadowGenerator.usePoissonSampling = true;
  }

  addShadowCaster(mesh: BABYLON.AbstractMesh) {
    this.shadowGenerator.addShadowCaster(mesh);
  }
}
