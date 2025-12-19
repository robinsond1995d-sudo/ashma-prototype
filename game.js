// ========== ASHMA 3D – BUILD 2: BOSS AWAKENING + PRESSURE ==========
let scene, camera, renderer, clock;
let speed = 0, turn = 0;
let baseCameraPos = new THREE.Vector3(0, 1.6, 6); // Base camera position
let boss, bossState = 'idle', fearLevel = 0;
const BOSS_IDLE_DIST = 15; // Distance to start hunting
const BOSS_RAGE_DIST = 8;  // Distance to enter rage
const BOSS_SPEED_IDLE = 0.5;
const BOSS_SPEED_HUNT = 1.5;
const BOSS_SPEED_RAGE = 3.0;

// ---------- SCENE ----------
scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 6, 28); // Initial fog

camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.copy(baseCameraPos); // Use base position
camera.rotation.y = Math.PI; // Look towards the center

// ---------- RENDERER ----------
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// ---------- LIGHT ----------
scene.add(new THREE.AmbientLight(0x220000, 0.4));

const fire = new THREE.PointLight(0xff5a1e, 2, 18);
fire.position.set(0, 4, 2);
scene.add(fire);

// ---------- FLOOR ----------
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({
        color: 0x2a1a0e, roughness: 1, metalness: 0.1
    })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// ---------- WALLS ----------
function addWall(x, z) {
    const w = new THREE.Mesh(
        new THREE.BoxGeometry(6, 3, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x160c05, roughness: 0.8 })
    );
    w.position.set(x, 1.5, z);
    scene.add(w);
}
addWall(0, -10); // Wall behind player
addWall(-10, 0); // Left wall
addWall(10, 0);  // Right wall
addWall(0, 10); // Wall in front of player

// ---------- BOSS (IMMORTAL GUARD) ----------
const bossGeometry = new THREE.CapsuleGeometry(0.8, 2.5, 4, 8);
const bossMaterial = new THREE.MeshStandardMaterial({ color: 0x330000, roughness: 0.5, metalness: 0.3 });
boss = new THREE.Mesh(bossGeometry, bossMaterial);
boss.position.set(0, 1.25, -20); // Start far away
scene.add(boss);

// ---------- CLOCK ----------
clock = new THREE.Clock();

// ---------- TOUCH JOYSTICK ----------
const joy = document.getElementById("joy");
const dot = document.getElementById("dot");
let base = { x: 0, y: 0 }, drag = false;
let joyDir = new THREE.Vector2();

joy.addEventListener("touchstart", e => {
    e.preventDefault();
    drag = true;
    base.x = e.touches[0].clientX;
    base.y = e.touches[0].clientY;
    dot.style.transition = "none";
}, { passive: false });

joy.addEventListener("touchmove", e => {
    e.preventDefault();
    if (!drag) return;
    let dx = e.touches[0].clientX - base.x;
    let dy = e.touches[0].clientY - base.y;

    const maxDist = 40;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);

    joyDir.x = Math.cos(angle) * (dist / maxDist);
    joyDir.y = Math.sin(angle) * (dist / maxDist);

    dot.style.left = `${40 + joyDir.x * maxDist}px`;
    dot.style.top = `${40 + joyDir.y * maxDist}px`;

    speed = -joyDir.y; // Forward/Backward
    turn = -joyDir.x * 0.01; // Left/Right turning strength
}, { passive: false });

joy.addEventListener("touchend", () => {
    drag = false;
    speed = turn = 0;
    dot.style.transition = "left 0.1s ease-out, top 0.1s ease-out";
    dot.style.left = "40px";
    dot.style.top = "40px";
});

// ---------- GAME LOGIC FUNCTIONS ----------
function updateBoss(dt) {
    const playerPos = camera.position;
    const bossPos = boss.position;
    const distance = playerPos.distanceTo(bossPos);

    // Update boss state based on distance
    if (distance < BOSS_RAGE_DIST) {
        bossState = 'rage';
    } else if (distance < BOSS_IDLE_DIST) {
        bossState = 'hunt';
    } else {
        bossState = 'idle';
    }

    // Move boss based on state
    let currentBossSpeed = 0;
    if (bossState === 'hunt') {
        currentBossSpeed = BOSS_SPEED_HUNT;
    } else if (bossState === 'rage') {
        currentBossSpeed = BOSS_SPEED_RAGE;
    }

    if (currentBossSpeed > 0) {
        const direction = new THREE.Vector3().subVectors(playerPos, bossPos).normalize();
        boss.position.addScaledVector(direction, currentBossSpeed * dt);
    }

    // Boss always looks at the player (Y-axis only)
    const lookAtPlayer = new THREE.Vector3(playerPos.x, bossPos.y, playerPos.z);
    boss.lookAt(lookAtPlayer);
}

function updateFear(dt) {
    const playerPos = camera.position;
    const bossPos = boss.position;
    const distance = playerPos.distanceTo(bossPos);

    // Calculate fear level (0 to 1) based on distance
    // Fear starts at BOSS_IDLE_DIST and peaks closer to 0
    fearLevel = Math.max(0, Math.min(1, 1 - (distance - 2) / (BOSS_IDLE_DIST - 2)));

    // Apply FEAR effects
    // 1. Camera Shake
    if (fearLevel > 0.1) { // Only shake if there's significant fear
        camera.position.x = baseCameraPos.x + (Math.random() - 0.5) * fearLevel * 0.1;
        camera.position.y = baseCameraPos.y + (Math.random() - 0.5) * fearLevel * 0.1;
        camera.position.z = baseCameraPos.z + (Math.random() - 0.5) * fearLevel * 0.1;
    } else {
        camera.position.lerp(baseCameraPos, 0.1); // Smoothly return to base if no fear
    }

    // 2. Fog and Darkness
    scene.fog.far = 28 - fearLevel * 20; // Fog gets denser
    scene.fog.near = 6 - fearLevel * 4;
    // Ambient light gets darker
    scene.children[0].intensity = 0.4 - fearLevel * 0.3; // Ambient light index 0

    // 3. Control Reduction
    const controlMultiplier = 1 - fearLevel * 0.6; // Max 60% reduction
    const currentSpeed = speed * controlMultiplier;
    const currentTurn = turn * controlMultiplier;

    // Apply player movement
    camera.rotation.y += currentTurn;
    camera.position.x += Math.sin(camera.rotation.y) * currentSpeed * dt * 5;
    camera.position.z += Math.cos(camera.rotation.y) * currentSpeed * dt * 5;

    // Store base camera position without shake for next frame
    baseCameraPos.copy(camera.position);

    // Audio Terror Simulation (visual/control effects)
    // The visual and control effects already simulate the "terror"
    // For actual sound, Web Audio API would be used here, e.g.:
    // if (fearLevel > 0.5 && !heartbeatPlaying) { startHeartbeatSound(); }
    // else if (fearLevel < 0.3 && heartbeatPlaying) { stopHeartbeatSound(); }
}


// ---------- LOOP ----------
function loop() {
    const dt = Math.min(clock.getDelta(), 0.05); // Cap dt to prevent jumps

    // Update Boss and Fear System BEFORE player movement
    updateBoss(dt);
    updateFear(dt); // This also applies player movement based on fear

    fire.intensity = 1.5 + Math.sin(clock.elapsedTime * 6) * 0.4; // Fire flicker

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
loop();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
