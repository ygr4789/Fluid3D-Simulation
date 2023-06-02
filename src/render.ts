import * as THREE from "three";
import { Particle } from "./particle";

let points: THREE.Points;

export function initParticleObjects(particles: Array<Particle>, scene: THREE.Scene) {
  const numParticles = particles.length;

  const positions = new Float32Array(numParticles * 3);
  const radius = new Float32Array(numParticles);

  for (let i = 0; i < numParticles; i++) {
    positions[3 * i] = particles[i].pos[0];
    positions[3 * i + 1] = particles[i].pos[1];
    positions[3 * i + 2] = particles[i].pos[2];
    radius[i] = 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("radius", new THREE.BufferAttribute(radius, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      scale: { value: window.innerWidth }
    },
    vertexShader: require("./shader/vertexShader.glsl"),
    fragmentShader: require("./shader/fragmentShader.glsl"),
  });
  
  
  //
  
  points = new THREE.Points(geometry, material);
  scene.add(points);
  
  //
}

export function renderParticleObjects(particles: Array<Particle>) {
  const numParticles = particles.length;
  (points.material as THREE.ShaderMaterial).uniforms.scale.value = window.innerWidth;

  const positions = (points.geometry.attributes.position as THREE.BufferAttribute).array as Array<number>;
  const radius = (points.geometry.attributes.radius as THREE.BufferAttribute).array as Array<number>;

  for (let i = 0; i < numParticles; i++) {
    positions[3 * i] = particles[i].pos[0];
    positions[3 * i + 1] = particles[i].pos[1];
    positions[3 * i + 2] = particles[i].pos[2];
  }

  points.geometry.attributes.position.needsUpdate = true;
  points.geometry.attributes.radius.needsUpdate = true;
}
