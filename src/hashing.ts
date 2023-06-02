import { vec3 } from "gl-matrix";
import { Particle } from "./particle";
import { KERNEL_DISTANCE, BOUND, PADDING, SQR_KERNEL_DISTANCE } from "./consts";

let hashTable: Array<Array<Particle>>;
const max_xi = Math.floor(((BOUND + PADDING) * 2) / KERNEL_DISTANCE);
const max_yi = Math.floor(((BOUND + PADDING) * 2) / KERNEL_DISTANCE);
const max_zi = Math.floor(((BOUND + PADDING) * 2) / KERNEL_DISTANCE);

export function updateHashTable(particles: Array<Particle>) {
  hashTable = new Array(max_xi * max_yi * max_zi);
  for (let i = 0; i < hashTable.length; i++) {
    hashTable[i] = new Array();
  }
  particles.forEach((p) => {
    let xi = Math.floor((p.pos[0] + (BOUND + PADDING)) / KERNEL_DISTANCE);
    let yi = Math.floor((p.pos[1] + (BOUND + PADDING)) / KERNEL_DISTANCE);
    let zi = Math.floor((p.pos[2] + (BOUND + PADDING)) / KERNEL_DISTANCE);
    let cell = hashTable[xi * max_xi * max_yi + yi * max_yi + zi];
    cell.push(p);
  });
}

export function hashNearNeighbors(loc: vec3) {
  let ret: Array<Particle> = [];
  let xi = Math.floor((loc[0] + (BOUND + PADDING)) / KERNEL_DISTANCE);
  let yi = Math.floor((loc[1] + (BOUND + PADDING)) / KERNEL_DISTANCE);
  let zi = Math.floor((loc[2] + (BOUND + PADDING)) / KERNEL_DISTANCE);
  for (let xi_ = xi - 1; xi_ <= xi + 1; xi_++) {
    if (xi_ < 0 || xi >= max_xi) continue;
    for (let yi_ = yi - 1; yi_ <= yi + 1; yi_++) {
      if (yi_ < 0 || yi >= max_yi) continue;
      for (let zi_ = zi - 1; zi_ <= zi + 1; zi_++) {
        if (zi_ < 0 || zi >= max_zi) continue;
        hashTable[xi_ * max_xi * max_yi + yi_ * max_yi + zi_].forEach((p) => {
          if (vec3.sqrDist(loc, p.pos) < SQR_KERNEL_DISTANCE) ret.push(p);
        });
      }
    }
  }
  return ret;
}

export function naiveNearNeighbors(loc: vec3, particles: Array<Particle>) {
  let ret: Array<Particle> = [];
  particles.forEach((p) => {
    if (vec3.sqrDist(loc, p.pos) < SQR_KERNEL_DISTANCE) ret.push(p);
  });
  return ret;
}
