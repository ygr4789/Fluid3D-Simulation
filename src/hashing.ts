import { vec3 } from "gl-matrix";
import { BOUND, KERNEL_DISTANCE, PADDING, SQR_KERNEL_DISTANCE } from "./consts";
import { Particle } from "./particle";

const max_xi = Math.floor(((BOUND + PADDING) * 2) / KERNEL_DISTANCE);
const max_yi = Math.floor(((BOUND + PADDING) * 2) / KERNEL_DISTANCE);
const max_zi = Math.floor(((BOUND + PADDING) * 2) / KERNEL_DISTANCE);

let particles: Array<Particle>;
let particleNum: number;
let indexOfNum: Uint32Array;
let countTable: Uint32Array;
let particleTable: Uint32Array;
let tableSize = max_xi * max_yi * max_zi;

function index(xi: number, yi: number, zi: number) {
  return xi * max_xi * max_yi + yi * max_yi + zi;
}

export function bindHashTable(particles_: Array<Particle>) {
  particles = particles_;
  tableSize = max_xi * max_yi * max_zi;
  particleNum = particles.length;
  indexOfNum = new Uint32Array(particleNum);
  countTable = new Uint32Array(tableSize + 1);
  particleTable = new Uint32Array(particleNum);
}

export function updateHashTable() {
  for (let i = 0; i < particleNum; i++) {
    let xi = Math.floor((particles[i].pos[0] + (BOUND + PADDING)) / KERNEL_DISTANCE);
    let yi = Math.floor((particles[i].pos[1] + (BOUND + PADDING)) / KERNEL_DISTANCE);
    let zi = Math.floor((particles[i].pos[2] + (BOUND + PADDING)) / KERNEL_DISTANCE);
    indexOfNum[i] = index(xi, yi, zi);
  }
  countTable.fill(0);
  for (let i = 0; i < particleNum; i++) {
    countTable[indexOfNum[i]]++;
  }
  for (let i = 0; i < tableSize; i++) {
    countTable[i + 1] += countTable[i];
  }
  for (let i = 0; i < particleNum; i++) {
    particleTable[--countTable[indexOfNum[i]]] = i;
  }
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
        let i = index(xi_, yi_, zi_);
        let begin = countTable[i];
        let end = countTable[i + 1];
        for (let k = begin; k < end; k++) {
          let t = particleTable[k];
          if (vec3.sqrDist(loc, particles[t].pos) < SQR_KERNEL_DISTANCE) ret.push(particles[t]);
        }
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