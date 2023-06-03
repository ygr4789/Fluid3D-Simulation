import { vec3 } from "gl-matrix";
import { BOUND, WATER_DENSITY, poly6Kernel } from "./consts";
import { Particle } from "./particle";
import { bindHashTable, hashNearNeighbors, updateHashTable } from "./hashing";

export let boundaries: Array<Particle> = [];

export function initBoundaries(res: number) {
  boundaries = [];
  for (let x = -BOUND; x <= BOUND; x += res) {
    for (let y = -BOUND; y <= BOUND; y += res) {
      boundaries.push(new Particle(x, y, -BOUND, 1));
      boundaries.push(new Particle(x, y, BOUND, 1));
    }
  }
  for (let x = -BOUND; x <= BOUND; x += res) {
    for (let z = -BOUND; z <= BOUND; z += res) {
      boundaries.push(new Particle(x, -BOUND, z, 1));
      boundaries.push(new Particle(x, BOUND, z, 1));
    }
  }
  for (let z = -BOUND; z <= BOUND; z += res) {
    for (let y = -BOUND; y <= BOUND; y += res) {
      boundaries.push(new Particle(-BOUND, y, z, 1));
      boundaries.push(new Particle(BOUND, y, z, 1));
    }
  }
  bindHashTable(boundaries);
  updateHashTable();
  computeDensity();
  boundaries.forEach((p) => {
    let volume = 1 / p.density;
    p.mass = 2 * WATER_DENSITY * volume;
  });
}

function computeDensity() {
  let r = vec3.create();
  boundaries.forEach((p) => {
    p.density = 0;
    hashNearNeighbors(p.pos).forEach((p_) => {
      vec3.sub(r, p.pos, p_.pos);
      p.density += p_.mass * poly6Kernel(r);
    });
  });
}
