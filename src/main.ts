import * as dat from "dat.gui";
import * as Stats from "stats.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import "./style/style.css";

const scene = new THREE.Scene();
const setcolor = "#000000";
scene.background = new THREE.Color(setcolor);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
camera.position.set(40, 40, 45);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);

function window_onsize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onresize = window_onsize;

// ================ Light setting ================

const ambientLight = new THREE.AmbientLight(0x9090a0, 1.0);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(30, 30, 0);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// ================ Creating Ground ================

const groundGeo = new THREE.PlaneGeometry(2 * 10, 2 * 10, 1, 1);
const groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 155, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI * 0.5;
ground.receiveShadow = true;
scene.add(ground);

// ===================== CONTROL =====================

const ui = {
  toggleUpdating: () => {
    isPlaying = !isPlaying;
  },
  timestep: 30,
};

// ===================== GUI =====================

function initGUI() {
  const gui = new dat.GUI();
  gui.add(ui, "toggleUpdating").name("Run / Pause");
  gui.add(ui, "timestep", 1, 100).step(1).name("TimeStep");
}

// ===================== MAIN =====================

let isPlaying: Boolean = false;

function main() {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  animate();
  function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    if (isPlaying) {
      updateStates(ui.timestep / 1000);
    }
    renderer.render(scene, camera);
    stats.end();
  }
}

function updateStates(dt: number) {
  
}

function preventDefault() {
  document.oncontextmenu = () => false;
  document.onselectstart = () => false;
}

window.onload = () => {
  preventDefault();
  initGUI();
  main();
};
