import * as THREE from 'https://cdn.skypack.dev/three';

export class Player {
  constructor(camera) {
    this.camera = camera;
    this.object = new THREE.Object3D();
    this.object.add(camera);

    this.speed = 4;
    this.health = 100;

    // Look
    this.yaw = 0;
    this.pitch = 0;

    // Dash
    this.isDashing = false;
    this.dashTime = 0;

    // Weapon
    this.canFire = true;
    this.fireCooldown = 0.25;
    this.fireTimer = 0;

    // Rage
    this.rage = 0;

    // Glory Kill Camera FX
    this.shakeTime = 0;
    this.shakeStrength = 0.15;
  }

  look(dx, dy) {
    this.yaw -= dx * 0.002;
    this.pitch -= dy * 0.002;
    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

    this.object.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }

  moveMobile(move, delta) {
    const dir = new THREE.Vector3(move.x, 0, -move.y).applyEuler(this.object.rotation);
    this.object.position.addScaledVector(dir, this.speed * delta);
  }

  dash() {
    this.isDashing = true;
    this.dashTime = 0.2;
  }

  triggerFire() {
    if (!this.canFire) return false;
    this.canFire = false;
    this.fireTimer = this.fireCooldown;
    return true;
  }

  heal(amount) {
    this.health = Math.min(100, this.health + amount);
  }

  gainRage(amount) {
    this.rage = Math.min(100, this.rage + amount);
  }

  applyShake(duration = 0.2) {
    this.shakeTime = duration;
  }

  update(delta) {
    if (!this.canFire) {
      this.fireTimer -= delta;
      if (this.fireTimer <= 0) this.canFire = true;
    }

    if (this.isDashing) {
      this.object.translateZ(-12 * delta);
      this.dashTime -= delta;
      if (this.dashTime <= 0) this.isDashing = false;
    }

    // Camera Shake
    if (this.shakeTime > 0) {
      this.shakeTime -= delta;
      this.camera.position.x = (Math.random() - 0.5) * this.shakeStrength;
      this.camera.position.y = (Math.random() - 0.5) * this.shakeStrength;
    } else {
      this.camera.position.set(0, 0, 0);
    }
  }
}
