/****************************************************
 * ASHMA: Wrath of Persia
 * BUILD 2 — Boss Awakening
 * 3D Mobile FPS (Boss Only)
 * Three.js (Non-Module / CDN)
 ****************************************************/

let scene, camera, renderer;
let clock;

/* حرکت پلیر */
let move = { x: 0, z: 0 };
let yaw = 0, pitch = 0;
const PITCH_LIMIT = Math.PI / 2.2;

/* باس */
let boss;
let bossBaseZ = -14;
let time = 0;

/* =========================
   INIT
========================= */
init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030304);
  scene.fog = new THREE.FogExp2(0x000000, 0.065);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.6, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  /* نور محیطی – فضای ترس */
  scene.add(new THREE.AmbientLight(0x331111, 0.9));

  /* نور جهت‌دار باس */
  const spot = new THREE.SpotLight(
    0xff2200,
    2.4,
    40,
    Math.PI / 4,
    0.45,
    1.2
  );
  spot.position.set(4, 6, 6);
  scene.add(spot);

  /* زمین */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.9,
      metalness: 0.05
    })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  createBoss();
  setupTouchControls();

  window.addEventListener("resize", onResize);
}

/* =========================
   CREATE BOSS
========================= */
function createBoss() {
  boss = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x330000,
    metalness: 0.4,
    roughness: 0.45,
    emissive: 0x140000,
    emissiveIntensity: 0.5
  });

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.4, 1),
    mat
  );
  body.position.y = 2.2;

  boss.add(body);
  boss.position.z = bossBaseZ;

  scene.add(boss);
}

/* =========================
   TOUCH CONTROLS (FIXED)
========================= */
function setupTouchControls() {
  const joystick = document.getElementById("joystick");
  const stick = document.getElementById("stick");
  const lookArea = document.getElementById("look-area");

  let joyId = null;
  let lookId = null;
  let lastX = 0, lastY = 0;

  function centerJoy() {
    const r = joystick.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2
    };
  }

  joystick.addEventListener("touchstart", e => {
    joyId = e.changedTouches[0].identifier;
  }, { passive: false });

  joystick.addEventListener("touchmove", e => {
    const t = [...e.changedTouches].find(x => x.identifier === joyId);
    if (!t) return;

    const c = centerJoy();
    let dx = t.clientX - c.x;
    let dy = t.clientY - c.y;

    const max = 45;
    const d = Math.hypot(dx, dy);
    if (d > max) {
      dx *= max / d;
      dy *= max / d;
    }

    stick.style.transform = `translate(${dx}px, ${dy}px)`;
    move.x = dx / max;
    move.z = -dy / max;
  }, { passive: false });

  joystick.addEventListener("touchend", () => {
    joyId = null;
    move.x = move.z = 0;
    stick.style.transform = "translate(-50%, -50%)";
  });

  lookArea.addEventListener("touchstart", e => {
    const t = e.changedTouches[0];
    lookId = t.identifier;
    lastX = t.clientX;
    lastY = t.clientY;
  }, { passive: false });

  lookArea.addEventListener("touchmove", e => {
    const t = [...e.changedTouches].find(x => x.identifier === lookId);
    if (!t) return;

    const dx = t.clientX - lastX;
    const dy = t.clientY - lastY;

    yaw   -= dx * 0.0045;
    pitch -= dy * 0.0045;

    pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch));

    lastX = t.clientX;
    lastY = t.clientY;
  }, { passive: false });

  lookArea.addEventListener("touchend", () => {
    lookId = null;
  });
}

/* =========================
   RESIZE
========================= */
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* =========================
   GAME LOOP
========================= */
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  /* حرکت پلیر */
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3().crossVectors(
    forward,
    new THREE.Vector3(0, 1, 0)
  );

  camera.position
    .addScaledVector(forward, move.z * dt * 4)
    .addScaledVector(right,   move.x * dt * 4);

  /* چرخش دوربین */
  camera.rotation.set(0, 0, 0);
  camera.rotateY(yaw);
  camera.rotateX(pitch);

  /* حرکت تهدیدآمیز باس */
  time += dt;
  boss.position.z = bossBaseZ + Math.sin(time) * 0.4;

  renderer.render(scene, camera);
}
