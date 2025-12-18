import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export class Enemy {
  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1.8, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b0000 });

    this.object = new THREE.Mesh(geometry, material);
    this.object.position.y = 0.9;

    this.speed = 1.5;
  }

  update(playerPosition) {
    const direction = playerPosition.clone().sub(this.object.position);
  direction.y = 0;
    direction.normalize();

    this.object.position.addScaledVector(direction, this.speed * 0.016);
  }
}
