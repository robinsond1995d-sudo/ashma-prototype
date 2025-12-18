import * as THREE from 'https://cdn.skypack.dev/three';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Arena } from './Arena.js';
import { MobileControls } from './MobileControls.js';

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);

    this.player = new Player(this.camera);
    this.scene.add(this.player.object);

    this.arena = new Arena(this.scene);
    this.enemies = [];

    this.spawnEnemies(3);

    // ---------- Controls ----------
    if (this.isMobile) {
      this.mobileControls = new MobileControls(this.player);
      this.initMobileLook();
      this.createFireButton();
    } else {
      this.initPointerLock();
      window.addEventListener('mousedown', () => this.fire());
    }

    this.raycaster = new THREE.Raycaster();
    this.animate();
  }

  // ===============================
  // Desktop Pointer Lock
  // ===============================
  initPointerLock() {
    document.body.addEventListener('click', () => {
      document.body.requestPointerLock();
    });

    window.addEventListener('mousemove', e => {
      if (document.pointerLockElement) {
        this.player.look(e.movementX, e.movementY);
      }
    });
  }

  // ===============================
  // Mobile Swipe Look
  // ===============================
  initMobileLook() {
    let lastX = 0;
    let lastY = 0;

    window.addEventListener('touchstart', e => {
      const t = e.touches[0];
      lastX = t.clientX;
      lastY = t.clientY;
    });

    window.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const dx = t.clientX - lastX;
      const dy = t.clientY - lastY;

      this.player.look(dx * 0.4, dy * 0.4);

      lastX = t.clientX;
      lastY = t.clientY;
    });
  }

  // ===============================
  // Fire Button (Mobile)
  // ===============================
  createFireButton() {
    const btn = document.createElement('button');
    btn.innerText = '🔥';

    Object.assign(btn.style, {
      position: 'fixed',
      right: '20px',
      bottom: '40px',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      fontSize: '32px',
      background: 'rgba(255,50,50,0.8)',
      border: 'none',
      color: '#fff',
      zIndex: 10
    });

    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      this.fire();
    });

    document.body.appendChild(btn);
  }

  // ===============================
  // Shooting (Raycast)
  // ===============================
  fire() {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

    const hits = this.raycaster.intersectObjects(
      this.enemies.map(e => e.mesh)
    );

    if (hits.length > 0) {
      const enemy = hits[0].object.userData.enemy;
      enemy.takeDamage(50);

      if (enemy.isDead) {
        this.player.heal(20);
        this.scene.remove(enemy.mesh);
        this.enemies = this.enemies.filter(e => e !== enemy);
      }
    }
  }

  // ===============================
  // Enemy Spawn
  // ===============================
  spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
      const enemy = new Enemy(this.scene);
      enemy.mesh.position.set(
        Math.random() * 10 - 5,
        0,
        Math.random() * -10
      );
      this.enemies.push(enemy);
    }
  }

  // ===============================
  // Main Loop
  // ===============================
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (this.isMobile && this.mobileControls) {
      this.player.moveMobile(this.mobileControls.move, delta);
    }

    this.player.update(delta);

    this.enemies.forEach(enemy => enemy.update(this.player));

    this.renderer.render(this.scene, this.camera);
  }
}
