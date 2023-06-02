import { vec3 } from "gl-matrix";

export const BOUND = 10;
export const EPSILON = 0.1;
export const PADDING = 5;

export const WATER_DENSITY = 998;
export const WATER_GAS_CONSTANT = 1000;
export const WATER_VISCOSITY = 0.5 ;
export const WATER_COLOR = "#0000ff";

export const KERNEL_DISTANCE = 1;
export const SQR_KERNEL_DISTANCE = KERNEL_DISTANCE ** 2;
export const GRAVITY = vec3.fromValues(0,-10, 0);

const KERNEL_FACTOR = 315 / 64 / Math.PI / KERNEL_DISTANCE ** 9;
export function poly6Kernel(r: vec3) {
  let sqrd = vec3.sqrLen(r);
  return KERNEL_FACTOR * (SQR_KERNEL_DISTANCE - sqrd) ** 3;
}

const GRAD_FACTOR = -45 / Math.PI / KERNEL_DISTANCE ** 6;
export function poly6Grad(r: vec3) {
  let d = vec3.len(r);
  let ret = vec3.clone(r);
  if (d === 0) {
    vec3.zero(ret);
    return ret;
  }
  vec3.scale(ret, ret, (GRAD_FACTOR * (KERNEL_DISTANCE - d) ** 2) / d);
  return ret;
}

const LAP_FACTOR = 45 / Math.PI / KERNEL_DISTANCE ** 6;
export function poly6Lap(r: vec3) {
  let d = vec3.len(r);
  return LAP_FACTOR * (KERNEL_DISTANCE - d);
}
