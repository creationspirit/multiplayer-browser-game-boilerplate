import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { Lights } from './Lights';

export class Pickup {
  private scene: BABYLON.Scene;
  id: string;
  pickupMesh: BABYLON.Mesh;
  boundingBox!: BABYLON.Mesh;
  solveAreaBox!: BABYLON.Mesh;
  particleSet!: BABYLON.ParticleSystemSet;
  label!: GUI.Rectangle;

  constructor(scene: BABYLON.Scene, id: string, prefabMesh: BABYLON.Mesh) {
    this.scene = scene;
    this.id = id;
    this.pickupMesh = prefabMesh.clone(this.id);
    this.pickupMesh.isVisible = false;
  }

  init(lights: Lights) {
    this.boundingBox = BABYLON.MeshBuilder.CreateBox(
      `boundingBox_${this.id}`,
      { width: 1, height: 4, depth: 1 },
      this.scene
    );
    this.boundingBox.position = this.pickupMesh.position;
    this.boundingBox.parent = this.pickupMesh;
    this.boundingBox.checkCollisions = true;
    this.boundingBox.isVisible = false;
    this.boundingBox.isPickable = false;

    this.solveAreaBox = BABYLON.MeshBuilder.CreateBox(
      `solveAreaBox_${this.id}`,
      { width: 3, height: 4, depth: 3 },
      this.scene
    );
    this.solveAreaBox.position = this.pickupMesh.position;
    this.solveAreaBox.isVisible = false;
    this.solveAreaBox.isPickable = false;

    this.scene.beginAnimation(this.pickupMesh, 0, 420, true);

    lights.addShadowCaster(this.pickupMesh);

    BABYLON.ParticleHelper.CreateAsync('pickupEmit', this.scene).then(set => {
      this.particleSet = set;
      this.particleSet.start(this.pickupMesh);
    });

    this.label = this.createSolveLabel();
    // this.label.linkWithMesh(this.pickupMesh);

    this.pickupMesh.isVisible = true;
  }

  private createSolveLabel() {
    const label = new GUI.Rectangle(`pickupLabel_${this.id}`);
    label.background = 'black';
    label.height = 0.05;
    label.alpha = 0.5;
    label.width = 0.15;
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -400;

    const textBlock = new GUI.TextBlock();
    textBlock.resizeToFit = true;
    textBlock.text = 'Press SPACE to start solving';
    textBlock.fontSize = 24;
    textBlock.color = 'white';
    label.addControl(textBlock);

    return label;
  }
}
