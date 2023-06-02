import { vec3 } from "gl-matrix";
import * as THREE from "three";

export class Particle {
  pos: vec3;
  vel: vec3;
  acc: vec3;
  pressure: number;
  density: number;
  mass: number;
  color: number;
  constructor(x: number, y: number, z: number, mass: number, scene: THREE.Scene | undefined = undefined) {
    this.pos = vec3.fromValues(x, y, z);
    this.vel = vec3.create();
    this.acc = vec3.create();
    this.mass = mass;
  }
  update(dt: number) {
    vec3.scaleAndAdd(this.vel, this.vel, this.acc, dt);
    vec3.scaleAndAdd(this.pos, this.pos, this.vel, dt);
  }
}
