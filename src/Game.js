import * as THREE from 'https://cdn.skypack.dev/three';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Arena } from './Arena.js';
import { MobileControls } from './MobileControls.js';

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);

    this.player = new Player(this.camera);
    this.scene.add(this.player.object);

    new Arena(this.scene);

    this.enemies = [];
    this.spawnEnemies(5);

    if (this.isMobile) {
      this.mobileControls = new MobileControls(this.player);
    } else {
      document.body.addEventListener('click', () => document.body.requestPointerLock());
      window.addEventListener('mousemove', e => {
        if (document.pointerLockElement) this.player.look(e.movementX, e.movementY);
      });
      window.addEventListener('mousedown', () => this.fire());
    }

    this.createFlash();
    this.animate();
  }

  fire() {
    if (!this.player.triggerFire()) return;

    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const hits = this.raycaster.intersectObjects(this.enemies.map(e => e.mesh));

    if (!hits.length) return;

    const enemy = hits[0].object.userData.enemy;
    const dist = hits[0].distance;

    // 🔥 GLORY KILL
    if (enemy.isStaggered && dist < 2) {
      this.gloryKill(enemy);
      return;
    }

    enemy.takeDamage(40);
  }

  gloryKill(enemy) {
    // Camera Lunge
    const dir = new THREE.Vector3()
      .subVectors(enemy.mesh.position, this.player.object.position)
      .normalize();

    this.player.object.position.addScaledVector(dir, 1);

    // FX
    this.player.applyShake(0.3);
    this.flash();

    // Time Stop
    const oldTimeScale = this.clock.autoStart;
    this.clock.autoStart = false;

    setTimeout(() => {
      this.clock.autoStart = oldTimeScale;
    }, 150);

    // Rewards
    this.player.heal(40);
    this.player.gainRage(30);

    this.scene.remove(enemy.mesh);
    this.enemies = this.enemies.filter(e => e !== enemy);
  }

  createFlash() {
    this.flashDiv = document.createElement('div');
    Object.assign(this.flashDiv.style, {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background: 'white',
      opacity: 0,
      pointerEvents: 'none',
      zIndex: 20
    });
    document.body.appendChild(this.flashDiv);
  }

  flash() {
    this.flashDiv.style.opacity = 0.8;
    setTimeout(() => (this.flashDiv.style.opacity = 0), 80);
  }

  spawnEnemies(n) {
    for (let i = 0; i < n; i++) {
      const e = new Enemy(this.scene);
      e.mesh.position.set(Math.random() * 10 - 5, 1, -Math.random() * 10);
      this.enemies.push(e);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();

    if (this.isMobile) {
      this.player.update(delta);
    } else {
      this.player.update(delta);
    }

    this.enemies.forEach(e => e.update(this.player));
    this.renderer.render(this.scene, this.camera);
  }
}
