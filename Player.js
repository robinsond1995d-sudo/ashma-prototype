import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class Player {
  constructor(camera) {
    this.camera = camera;
    this.camera.position.set(0, 2, 5);

    this.body = new THREE.Object3D();
    this.body.position.set(0, 0, 0);
    this.body.add(this.camera);

    this.hp = 100;
    this.shoot = false;

    this.speed = 0.12;
    this.keys = {};

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('mousedown', () => {
      this.shoot = true;
    });
    window.addEventListener('mouseup', () => {
      this.shoot = false;
    });
  }

  update() {
    if (this.keys['KeyW']) this.body.translateZ(-this.speed);
    if (this.keys['KeyS']) this.body.translateZ(this.speed);
    if (this.keys['KeyA']) this.body.translateX(-this.speed);
    if (this.keys['KeyD']) this.body.translateX(this.speed);
  }
}
