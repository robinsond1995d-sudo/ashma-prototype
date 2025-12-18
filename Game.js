import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Arena } from './Arena.js';

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
    this.scene.add(hemiLight);

    this.player = new Player(this.camera);
    this.scene.add(this.player.body);

    this.enemy = new Enemy();
    this.scene.add(this.enemy.mesh);

    this.arena = new Arena(this.scene);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.loop = this.loop.bind(this);
    this.loop();
  }

  loop() {
    requestAnimationFrame(this.loop);

    this.player.update();
    this.enemy.update(this.player);

    if (this.player.shoot && this.enemy.hit(this.player)) {
      this.player.hp = Math.min(100, this.player.hp + 10);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
