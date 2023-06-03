import { vec3 } from "gl-matrix";
import { Particle } from "./particle";
import {
  BOUND,
  EPSILON,
  GRAVITY,
  WATER_DENSITY,
  WATER_GAS_CONSTANT,
  WATER_VISCOSITY,
  poly6Grad,
  poly6Kernel,
  poly6Lap,
} from "./consts";
import { Scene } from "three";
import { boundaries } from "./boundary";
import { initParticleObjects, renderParticleObjects } from "./render";
import { bindHashTable, hashNearNeighbors, updateHashTable } from "./hashing";

let particles: Array<Particle> = [];

export function solveFluid(dt: number) {
  updateHashTable();
  computeProperties();
  computeAcceleration();
  updateParcitles(dt);
  handleBoundaries();
}

export function renderFluid() {
  renderParticleObjects(particles);
}

export function initFluid(res: number, scene: Scene) {
  particles = [];
  for (let x = -BOUND / 2; x < BOUND / 2; x += res) {
    for (let y = -BOUND / 2; y < BOUND / 2; y += res) {
      for (let z = -BOUND / 2; z < BOUND / 2; z += res) {
        let noiseX = (Math.random() * res) / 10;
        let noiseY = (Math.random() * res) / 10;
        let noiseZ = (Math.random() * res) / 10;
        particles.push(new Particle(x + noiseX, y + noiseY, z + noiseZ, 1, scene));
      }
    }
  }
  bindHashTable(particles);
  updateHashTable();
  computeDensity();
  let max_density = 0;
  particles.forEach((p) => {
    max_density = Math.max(max_density, p.density);
  });
  const WATER_PARTICLE_MASS = WATER_DENSITY / max_density;
  particles.forEach((p) => {
    p.mass = WATER_PARTICLE_MASS;
  });
  computeProperties();
  initParticleObjects(particles, scene);
  bindHashTable([...particles, ...boundaries]);
}

function computeDensity() {
  let r = vec3.create();
  particles.forEach((p) => {
    p.density = 0;
    hashNearNeighbors(p.pos).forEach((p_) => {
      vec3.sub(r, p.pos, p_.pos);
      p.density += p_.mass * poly6Kernel(r);
    });
  });
}

function computeProperties() {
  let r = vec3.create();
  particles.forEach((p) => {
    p.density = 0;
    hashNearNeighbors(p.pos).forEach((p_) => {
      vec3.sub(r, p.pos, p_.pos);
      p.density += p_.mass * poly6Kernel(r);
    });
    p.pressure = WATER_GAS_CONSTANT * (p.density - WATER_DENSITY);
  });
}


function computeAcceleration() {
  let r = vec3.create();
  let acc_pressure = vec3.create();
  let acc_viscosity = vec3.create();
  let acc_p_ = vec3.create();
  let acc_v_ = vec3.create();
  particles.forEach((p) => {
    vec3.copy(p.acc, GRAVITY);
    vec3.zero(acc_pressure);
    vec3.zero(acc_viscosity);
    hashNearNeighbors(p.pos).forEach((p_) => {
      let isBoundary = p_.pressure === undefined;

      vec3.sub(r, p.pos, p_.pos);
      acc_p_ = poly6Grad(r);
      if (isBoundary) vec3.scale(acc_p_, acc_p_, (p_.mass / p.density) * Math.max(0, p.pressure));
      else vec3.scale(acc_p_, acc_p_, ((p_.mass / p_.density) * (p.pressure + p_.pressure)) / 2);
      vec3.add(acc_pressure, acc_pressure, acc_p_);

      vec3.sub(acc_v_, p.vel, p_.vel);
      if (isBoundary) vec3.scale(acc_v_, acc_v_, (p_.mass / p.density) * poly6Lap(r));
      else vec3.scale(acc_v_, acc_v_, (p_.mass / p_.density) * poly6Lap(r));
      vec3.add(acc_viscosity, acc_viscosity, acc_v_);
    });
    vec3.scaleAndAdd(p.acc, p.acc, acc_pressure, -1 / p.density);
    vec3.scaleAndAdd(p.acc, p.acc, acc_viscosity, -WATER_VISCOSITY);
  });
}

function updateParcitles(dt: number) {
  particles.forEach((p) => {
    p.update(dt);
  });
}

function handleBoundaries() {
  particles.forEach((p) => {
    if (p.pos[0] < -(BOUND - EPSILON)) {
      p.pos[0] = -(BOUND - EPSILON);
    }
    if (p.pos[0] > BOUND - EPSILON) {
      p.pos[0] = BOUND - EPSILON;
    }
    if (p.pos[1] < -(BOUND - EPSILON)) {
      p.pos[1] = -(BOUND - EPSILON);
    }
    if (p.pos[1] > BOUND - EPSILON) {
      p.pos[1] = BOUND - EPSILON;
    }
    if (p.pos[2] < -(BOUND - EPSILON)) {
      p.pos[2] = -(BOUND - EPSILON);
    }
    if (p.pos[2] > BOUND - EPSILON) {
      p.pos[2] = BOUND - EPSILON;
    }
  });
}
