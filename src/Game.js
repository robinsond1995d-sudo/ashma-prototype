
import * as THREE from 'https://cdn.skypack.dev/three';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';

export class Game {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      100
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    container.appendChild(this.renderer.domElement);

    this.player = new Player(this.camera);
    this.scene.add(this.player.object);

    this.enemies = [];
    this.lastShot = 0;

    this.initLights();
    this.spawnEnemies(6);

    window.addEventListener('click', () => this.fire());
  }

  initLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const d = new THREE.DirectionalLight(0xffffff, 0.6);
    d.position.set(5, 10, 5);
    this.scene.add(d);
  }

  spawnEnemies(n) {
    const types = ['BRUTE', 'ARCHER', 'SHIELDED'];

    for (let i = 0; i < n; i++) {
      const type = Math.random() < 0.15
        ? 'IMMORTAL'
        : types[Math.floor(Math.random() * types.length)];

      const e = new Enemy(this.scene, type);
      e.mesh.position.set(Math.random()*8-4,1,-Math.random()*8-3);
      this.enemies.push(e);
    }
  }

  fire() {
    const now = performance.now();
    if (now - this.lastShot < 250) return;
    this.lastShot = now;

    const ray = new THREE.Raycaster(
      this.camera.getWorldPosition(new THREE.Vector3()),
      this.camera.getWorldDirection(new THREE.Vector3())
    );

    const hits = ray.intersectObjects(
      this.enemies.map(e => e.mesh)
    );

    if (!hits.length) return;

    const enemy = hits[0].object.userData.enemy;
    
    // Check for Glory Kill condition (HP <= 20 and close enough, assumed in main loop logic)
    const dist = enemy.mesh.position.distanceTo(this.player.object.position);
    if (enemy.health <= 20 && dist < 2 && enemy.type !== 'IMMORTAL') {
        // Simple GK implementation here (needs more logic in full build)
        // For this final locked build, we focus on the core damage/heal/rage loop.
        // We'll proceed with basic damage here.
    }

    // Headshot logic is simplified here as we don't have separate hit detection zones
    const isHeadshot = Math.random() < 0.1; // Placeholder for complexity we removed

    enemy.takeDamage(
        isHeadshot ? 60 : 40,
        isHeadshot ? 'HEADSHOT' : 'NORMAL'
    );

    if (enemy.health <= 0) {
      this.player.health = Math.min(100, this.player.health + 20);
      this.player.rage = Math.min(100, this.player.rage + 20);
      
      // Simple Fear Shockwave for the final build
      if (enemy.type !== 'IMMORTAL') {
          this.enemies.forEach(e => {
            const d = e.mesh.position.distanceTo(enemy.mesh.position);
            if (d < 8) e.triggerFear(1.2);
          });
      }
    }
  }

  update(delta) {
    this.player.update(delta);

    this.enemies.forEach(e => e.update(this.player, delta));
    this.enemies = this.enemies.filter(e => !e.isDead);

    this.renderer.render(this.scene, this.camera);
  }
}
