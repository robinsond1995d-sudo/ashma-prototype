import * as THREE from 'https://cdn.skypack.dev/three';

export class Enemy {
  constructor(scene) {
    this.health = 100;
    this.isDead = false;
    this.isStaggered = false;

    const geo = new THREE.BoxGeometry(1, 2, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x880000 });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.y = 1;
    this.mesh.userData.enemy = this;
    scene.add(this.mesh);
  }

  takeDamage(amount) {
    if (this.isDead) return;

    this.health -= amount;

    if (this.health <= 20 && !this.isStaggered) {
      this.isStaggered = true;
      this.mesh.material.color.set(0xffaa00); // Finishable
    }

    if (this.health <= 0) {
      this.isDead = true;
    }
  }

  update(player) {
    if (this.isDead || this.isStaggered) return;

    this.mesh.lookAt(player.object.position);
    this.mesh.translateZ(0.5 * -0.02);
  }
}
