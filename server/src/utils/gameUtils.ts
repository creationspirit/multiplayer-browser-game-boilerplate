import * as BABYLON from 'babylonjs';

export const createVector = (config: { x: number; y: number; z: number }): BABYLON.Vector3 => {
  return new BABYLON.Vector3(config.x, config.y, config.z);
};

export const msToMinSec = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const getRandomArrayElements = (arr: [any], n: number) => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  let x;
  while (n--) {
    x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};
