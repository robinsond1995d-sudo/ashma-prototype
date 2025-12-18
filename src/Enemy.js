import * as THREE from 'https://cdn.skypack.dev/three';

export class Enemy {
  constructor(scene, type = 'BRUTE') {
    this.type = type;

    this.health =
      type === 'IMMORTAL' ? 300 :
      type === 'SHIELDED' ? 120 : 100;

    this.state = 'CHASE';
    this.isDead = false;
    this.isStaggered = false;

    this.fearTimer = 0;
    this.attackCooldown = 0;

    const geo =
      type === 'IMMORTAL'
        ? new THREE.BoxGeometry(1.4, 2.6, 1.4)
        : new THREE.BoxGeometry(1, 2, 1);

    const mat = new THREE.MeshStandardMaterial({
      color:
        type === 'IMMORTAL' ? 0x222222 :
        type === 'SHIELDED' ? 0x333366 :
        type === 'ARCHER' ? 0x336633 :
        0x880000
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.y = geo.parameters.height / 2;
    this.mesh.userData.enemy = this;
    scene.add(this.mesh);
  }

  takeDamage(amount, hitType = 'NORMAL') {
    if (this.isDead) return;

    if (this.type === 'IMMORTAL' && hitType !== 'GLORY' && hitType !== 'RAGE') {
      amount *= 0.35;
    }

    if (this.type === 'SHIELDED' && hitType !== 'HEADSHOT') {
      amount *= 0.2;
    }

    this.health -= amount;

    if (this.type !== 'IMMORTAL') {
      if (this.health <= 20 && !this.isStaggered) {
        this.isStaggered = true;
        this.state = 'FEAR';
        this.mesh.material.color.set(0xffaa00);
      }
      if (this.health <= 40) {
        this.state = 'CHARGE';
      }
    }

    if (this.type === 'IMMORTAL' && this.health <= 100) {
      this.state = 'CHARGE';
      this.mesh.material.color.set(0x550000);
    }

    if (this.health <= 0) this.isDead = true;
  }

  triggerFear(duration = 1) {
    if (this.type === 'IMMORTAL') return;
    this.state = 'FEAR';
    this.fearTimer = duration;
  }

  smash(player) {
    if (this.attackCooldown > 0) return;
    this.attackCooldown = 1.5;
    player.health -= this.type === 'IMMORTAL' ? 35 : 20;
  }

  shoot(player) {
    if (this.attackCooldown > 0) return;
    this.attackCooldown = 1.4;
    player.health -= 10;
  }

  update(player, delta) {
    if (this.isDead) return;

    this.attackCooldown -= delta;
    const dist = this.mesh.position.distanceTo(player.object.position);

    if (this.type === 'ARCHER' && dist > 4) this.state = 'RANGED';
    if (this.type === 'IMMORTAL' && dist < 2) this.state = 'SMASH';

    const speed = {
      CHASE: 0.5,
      FEAR: 0.15,
      CHARGE: 1.3,
      RANGED: 0,
      SMASH: 0
    }[this.state];

    this.mesh.lookAt(player.object.position);

    if (this.state === 'FEAR') {
      this.fearTimer -= delta;
      if (this.fearTimer <= 0) this.state = 'CHASE';
    }

    if (this.state === 'RANGED') return this.shoot(player);
    if (this.state === 'SMASH') return this.smash(player);

    if (!this.isStaggered)
      this.mesh.translateZ(-speed * delta);
  }
}
