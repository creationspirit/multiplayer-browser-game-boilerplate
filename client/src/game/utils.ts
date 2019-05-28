import * as BABYLON from 'babylonjs';

export const createVector = (config: { x: number; y: number; z: number }): BABYLON.Vector3 => {
  return new BABYLON.Vector3(config.x, config.y, config.z);
};
