// src/Arena.js

import * as THREE from 'three';

export class Arena {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.spawns = [
            new THREE.Vector3(5, 0, 5),
            new THREE.Vector3(-5, 0, -5),
            new THREE.Vector3(10, 0, -10),
            new THREE.Vector3(-10, 0, 10)
        ];
        this.addGround();
        this.addWalls();
        this.addLighting();
    }

    addGround() {
        // Ground (Achaemenid Tile Look - simplified)
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x47392e }); // Dark terracotta/sand
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        this.scene.add(ground);
    }

    addWalls() {
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brownish wall
        const wallHeight = 4;
        const arenaSize = 25;

        // Wall geometries (simplified long walls)
        const wallGeometry = new THREE.BoxGeometry(50, wallHeight, 0.5);

        // North Wall
        let wallN = new THREE.Mesh(wallGeometry, wallMaterial);
        wallN.position.z = -arenaSize;
        wallN.position.y = wallHeight / 2 - 0.5;
        this.scene.add(wallN);

        // South Wall
        let wallS = new THREE.Mesh(wallGeometry, wallMaterial);
        wallS.position.z = arenaSize;
        wallS.position.y = wallHeight / 2 - 0.5;
        this.scene.add(wallS);

        // East Wall
        let wallE = new THREE.Mesh(new THREE.BoxGeometry(0.5, wallHeight, 50), wallMaterial);
        wallE.position.x = arenaSize;
        wallE.position.y = wallHeight / 2 - 0.5;
        this.scene.add(wallE);

        // West Wall
        let wallW = new THREE.Mesh(new THREE.BoxGeometry(0.5, wallHeight, 50), wallMaterial);
        wallW.position.x = -arenaSize;
        wallW.position.y = wallHeight / 2 - 0.5;
        this.scene.add(wallW);
    }

    addLighting() {
        // Soft Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Directional Light (Sun/Ceiling)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(0, 10, 0);
        this.scene.add(directionalLight);
    }
          }
