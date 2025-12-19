let scene, camera, renderer, clock;
let move = { x: 0, z: 0 };
let yaw = 0, pitch = 0;
const PITCH_LIMIT = Math.PI / 2.2;

let boss;
let time = 0;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.06);

  camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  scene.add(new THREE.AmbientLight(0x552222, 1.2));

  const light = new THREE.PointLight(0xff2200, 3, 30);
  light.position.set(0, 6, 4);
  scene.add(light);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x080808 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  boss = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2.5, 1),
    new THREE.MeshStandardMaterial({
      color: 0x330000,
      emissive: 0x220000,
      emissiveIntensity: 0.7
    })
  );
  boss.position.set(0, 1.25, -10);
  scene.add(boss);

  setupTouch();
  window.addEventListener("resize", onResize);
}

function setupTouch() {
  const joystick = document.getElementById("joystick");
  const stick = document.getElementById("stick");
  const look = document.getElementById("look-area");

  let joyId = null;
  let lookId = null;
  let lastX = 0, lastY = 0;

  joystick.ontouchstart = e => {
    joyId = e.changedTouches[0].identifier;
  };

  joystick.ontouchmove = e => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== joyId) continue;

      const rect = joystick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let dx = t.clientX - cx;
      let dy = t.clientY - cy;
      const max = 40;
      const d = Math.hypot(dx, dy);
      if (d > max) {
        dx *= max / d;
        dy *= max / d;
      }

      stick.style.transform = `translate(${dx}px, ${dy}px)`;
      move.x = dx / max;
      move.z = -dy / max;
    }
  };

  joystick.ontouchend = () => {
    move.x = move.z = 0;
    stick.style.transform = "translate(-50%, -50%)";
    joyId = null;
  };

  look.ontouchstart = e => {
    const t = e.changedTouches[0];
    lookId = t.identifier;
    lastX = t.clientX;
    lastY = t.clientY;
  };

  look.ontouchmove = e => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== lookId) continue;

      yaw -= (t.clientX - lastX) * 0.004;
      pitch -= (t.clientY - lastY) * 0.004;
      pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch));

      lastX = t.clientX;
      lastY = t.clientY;
    }
  };

  look.ontouchend = () => { lookId = null; };
}

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(-forward.z, 0, forward.x);

  camera.position.addScaledVector(forward, move.z * dt * 4);
  camera.position.addScaledVector(right, move.x * dt * 4);

  camera.rotation.set(pitch, yaw, 0);

  time += dt;
  boss.position.z = -10 + Math.sin(time) * 0.6;

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  }
