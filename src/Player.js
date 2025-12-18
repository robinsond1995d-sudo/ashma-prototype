import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export class Player {
  constructor(camera) {
    this.camera = camera;
    this.speed = 6;

    this.object = new THREE.Object3D();
    this.object.add(this.camera);
    this.camera.position.y = 1.6;

    this.keys = {};
    this.initControls();
  }

  initControls() {
    window.addEventListener('keydown', e => this.keys[e.code] = true);
    window.addEventListener('keyup', e => this.keys[e.code] = false);

    window.addEventListener('mousemove', e => {
      if (document.pointerLockElement !== document.body) return;
      this.object.rotation.y -= e.movementX * 0.002;
      this.camera.rotation.x -= e.movementY * 0.002;
      this.camera.rotation.x = Math.max(-1.5, Math.min(1.5, this.camera.rotation.x));
    });
  }

  update(delta) {
    const dir = new THREE.Vector3();
    if (this.keys['KeyW']) dir.z -= 1;
    if (this.keys['KeyS']) dir.z += 1;
    if (this.keys['KeyA']) dir.x -= 1;
    if (this.keys['KeyD']) dir.x += 1;

    dir.normalize().applyEuler(this.object.rotation);
    this.object.position.addScaledVector(dir, this.speed * delta);
  }
  }
