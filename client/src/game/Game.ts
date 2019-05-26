import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { ISceneEventArgs } from '../components/Scene';
import { Lights } from './Lights';
import { Pickup } from './Pickup';
import { Area } from './Area';
import { Player } from './Player';

BABYLON.ParticleHelper.BaseAssetsUrl = `${process.env.PUBLIC_URL}/assets/`;
// BABYLON.Constants.PARTICLES_BaseAssetsUrl = ''

export class Game {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  private lights: Lights;
  private player!: Player;
  private area: Area;
  private pickups: { [id: string]: Pickup } = {};

  private advancedTexture: GUI.AdvancedDynamicTexture;
  private assetsManager: BABYLON.AssetsManager;

  constructor(args: ISceneEventArgs) {
    this.canvas = args.canvas as HTMLCanvasElement;
    this.engine = args.engine;
    this.scene = args.scene;

    this.lights = new Lights(this.scene);
    this.area = new Area(this.scene);

    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
    this.assetsManager = new BABYLON.AssetsManager(this.scene);
  }

  load() {
    const skyboxTexture = new BABYLON.CubeTexture(
      `${process.env.PUBLIC_URL}/assets/textures/skybox/space`,
      this.scene,
      ['_left.png', '_up.png', '_front.png', '_right.png', '_down.png', '_back.png']
    );
    this.scene.createDefaultSkybox(skyboxTexture, false, 1000);
  }

  run() {}
}
