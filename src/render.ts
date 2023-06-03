import * as THREE from "three";
import { Particle } from "./particle";
import { WATER_PARTICLE_RADIUS } from "./consts";

let points: THREE.Points;

export function initParticleObjects(particles: Array<Particle>, scene: THREE.Scene) {
  const numParticles = particles.length;

  const positions = new Float32Array(numParticles * 3);
  for (let i = 0; i < numParticles; i++) {
    let p = particles[i];
    positions[3 * i] = p.pos[0];
    positions[3 * i + 1] = p.pos[1];
    positions[3 * i + 2] = p.pos[2];
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      scale: { value: window.innerWidth },
      radius: { value: WATER_PARTICLE_RADIUS }
    },
    vertexShader: require("./shader/vertexShader.glsl"),
    fragmentShader: require("./shader/fragmentShader.glsl"),
  });
  
  points = new THREE.Points(geometry, material);
  scene.add(points);
}

export function renderParticleObjects(particles: Array<Particle>) {
  const numParticles = particles.length;
  (points.material as THREE.ShaderMaterial).uniforms.scale.value = window.innerWidth;

  const positions = (points.geometry.attributes.position as THREE.BufferAttribute).array as Array<number>;
  for (let i = 0; i < numParticles; i++) {
    let p = particles[i];
    positions[3 * i] = p.pos[0];
    positions[3 * i + 1] = p.pos[1];
    positions[3 * i + 2] = p.pos[2];
  }

  points.geometry.attributes.position.needsUpdate = true;
}

export function removeParticleObjects(scene: THREE.Scene) {
  if(points !== undefined) {
    scene.remove(points);
    points.geometry.dispose();
    (points.material as THREE.Material).dispose();
  }
}