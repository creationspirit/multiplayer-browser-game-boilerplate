import * as BABYLON from 'babylonjs';
import { createVector } from './utils';

export class Lights {
  private ambientLight!: BABYLON.HemisphericLight;
  private lights: BABYLON.Light[] = [];
  private scene: BABYLON.Scene;
  private shadowGenerators: BABYLON.ShadowGenerator[] = [];

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  private createPointLight(data: any, isGeneratingShadow: boolean) {
    const pointLight = new BABYLON.PointLight(data.id, createVector(data.position), this.scene);
    pointLight.diffuse = new BABYLON.Color3(1, 1, 1);
    pointLight.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
    pointLight.intensity = data.intensity;

    if (isGeneratingShadow) {
      const shadowGenerator = new BABYLON.ShadowGenerator(1024, pointLight);
      shadowGenerator.setDarkness(0.5);
      shadowGenerator.usePoissonSampling = true;
      this.shadowGenerators.push(shadowGenerator);
    }

    this.lights.push(pointLight);
  }

  init(data: any[]) {
    this.ambientLight = new BABYLON.HemisphericLight(
      'ambLight',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    this.ambientLight.intensity = 0.3;

    data.forEach(lightData => this.createPointLight(lightData, true));
  }

  addShadowCaster(mesh: BABYLON.AbstractMesh) {
    this.shadowGenerators.forEach(generator => generator.addShadowCaster(mesh));
  }
}
