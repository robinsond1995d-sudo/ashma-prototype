import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class Enemy {
  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    this.mesh.position.set(0, 1, -6);
    this.hp = 40;
  }

  update(player) {
    const target = player.body.position.clone();
    this.mesh.lookAt(target);
    this.mesh.position.lerp(target, 0.002);
  }

  hit(player) {
    const dist = this.mesh.position.distanceTo(player.body.position);
    if (dist < 2) {
      this.hp -= 1;
      if (this.hp <= 0) {
        this.hp = 40;
        this.mesh.position.set(
          (Math.random() - 0.5) * 16,
          1,
          (Math.random() - 0.5) * 16
        );
        return true;
      }
    }
    return false;
  }
}
