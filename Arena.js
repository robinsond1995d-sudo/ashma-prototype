import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class Arena {
  constructor(scene) {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);
  }
}
