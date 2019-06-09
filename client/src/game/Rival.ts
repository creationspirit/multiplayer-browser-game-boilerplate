import * as BABYLON from 'babylonjs';

export class Rival {
  private scene: BABYLON.Scene;
  id: string;
  mesh: BABYLON.Mesh;
  skeleton: BABYLON.Skeleton;
  idleRange: BABYLON.AnimationRange;
  walkRange: BABYLON.AnimationRange;
  runRange: BABYLON.AnimationRange;
  leftRange: BABYLON.AnimationRange;
  rightRange: BABYLON.AnimationRange;

  constructor(scene: BABYLON.Scene, prefabMesh: BABYLON.Mesh, id: string) {
    this.scene = scene;
    this.id = id;

    let skeleton = prefabMesh.getChildMeshes(true)[0].skeleton as BABYLON.Skeleton;
    this.mesh = prefabMesh.clone(this.id);

    skeleton = skeleton.clone(`skeleton_${id}`, `skeleton_${id}`);
    skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
    skeleton.animationPropertiesOverride.enableBlending = true;
    skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
    skeleton.animationPropertiesOverride.loopMode = 1;

    this.mesh.getChildMeshes(true)[0].skeleton = skeleton;
    this.skeleton = skeleton;
    this.mesh.isEnabled(false);

    this.idleRange = skeleton.getAnimationRange('YBot_Idle') as BABYLON.AnimationRange;
    this.walkRange = skeleton.getAnimationRange('YBot_Walk') as BABYLON.AnimationRange;
    this.runRange = skeleton.getAnimationRange('YBot_Run') as BABYLON.AnimationRange;
    this.leftRange = skeleton.getAnimationRange('YBot_LeftStrafeWalk') as BABYLON.AnimationRange;
    this.rightRange = skeleton.getAnimationRange('YBot_RightStrafeWalk') as BABYLON.AnimationRange;
  }

  init(position: BABYLON.Vector3) {
    this.mesh.position = position;
    this.scene.beginAnimation(this.skeleton, this.idleRange.from, this.idleRange.to, true);
  }

  update(position: BABYLON.Vector3) {
    this.mesh.position = position;
  }
}
