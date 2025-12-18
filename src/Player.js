import * as THREE from 'https://cdn.skypack.dev/three';

export class Player {
  constructor(camera) {
    this.object = new THREE.Object3D();
    this.object.add(camera);

    this.camera = camera;
    this.health = 100;
    this.rage = 0;

    this.velocity = new THREE.Vector3();
    this.speed = 4.5;

    this.dashCooldown = 0;
  }

  dash(dir) {
    if (this.dashCooldown > 0) return;
    this.velocity.add(dir.multiplyScalar(6));
    this.dashCooldown = 1;
  }

  update(delta) {
    this.dashCooldown -= delta;
    this.object.position.add(this.velocity.clone().multiplyScalar(delta));
    this.velocity.multiplyScalar(0.88);
  }
}
