import { MobileControls } from './MobileControls.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Arena } from './Arena.js';

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

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

    this.player = new Player(this.camera);
    this.scene.add(this.player.object);

    this.arena = new Arena(this.scene);

    this.enemies = [];
    for (let i = 0; i < 3; i++) {
      const enemy = new Enemy();
      enemy.object.position.set(
        Math.random() * 10 - 5,
        0,
        Math.random() * -10
      );
      this.scene.add(enemy.object);
      this.enemies.push(enemy);
    }

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    this.player.update(delta);

    this.enemies.forEach(e =>
      e.update(this.player.object.position)
    );

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
