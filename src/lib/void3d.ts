/* Escena 3D del VOID construida por código.
   Cuando llegue el CAD del proveedor, solo hay que reemplazar buildDome() y buildCap()
   por el modelo cargado; el resto (materiales, escenas, gestos) no cambia. */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type Finish = {
  id: string;
  name: string;
  dome: string;
  cap: string;
  clearCap?: boolean;
  clearDome?: boolean;
};

/* Primer color = silicona, segundo = tapa de metal. Mismo orden que la web. */
export const FINISHES: Finish[] = [
  { id: "bs", name: "Black Silver", dome: "#0B0B0B", cap: "#C9CBCE" },
  { id: "bg", name: "Black Gold", dome: "#0B0B0B", cap: "#C9A24D" },
  { id: "yg", name: "Yellow Gold", dome: "#E9C93D", cap: "#C9A24D" },
  { id: "ws", name: "White Silver", dome: "#F2F0EC", cap: "#C9CBCE" },
  { id: "wp", name: "White Purple", dome: "#F2F0EC", cap: "#B23FA6" },
  { id: "wr", name: "White Rose Gold", dome: "#F2F0EC", cap: "#D29A86" },
  { id: "wc", name: "White Clear", dome: "#F2F0EC", cap: "#E6E3DE", clearCap: true },
  { id: "bc", name: "Black Clear", dome: "#0B0B0B", cap: "#E6E3DE", clearCap: true },
  { id: "pb", name: "Purple Black", dome: "#9B35A8", cap: "#1A1A1A" },
  { id: "rb", name: "Rose Gold Black", dome: "#D29A86", cap: "#1A1A1A" },
  { id: "sy", name: "Silver Yellow", dome: "#C9CBCE", cap: "#E9C93D" },
  { id: "sp", name: "Silver Purple", dome: "#C9CBCE", cap: "#B23FA6" },
  { id: "dp", name: "Doble Purple", dome: "#9B35A8", cap: "#B23FA6" },
  { id: "cy", name: "Clear Yellow", dome: "#E6E3DE", cap: "#E9C93D", clearDome: true },
];

export type Quality = "hi" | "lo";

export interface StageOptions {
  quality: Quality;
  initial: string;
  onSelect: (id: string) => void;
  onFallback: (reason: string) => void;
  /* Dónde está el oído dentro de la foto: tamaño de la imagen, punto (u,v) en 0..1 y object-position. */
  earImage: { w: number; h: number; u: number; v: number; px: number; py: number };
}

export interface Stage {
  setProgress(p: number): void;
  select(id: string): void;
  setVisible(v: boolean): void;
  resize(): void;
  dispose(): void;
}

const TAU = Math.PI * 2;
const N = FINISHES.length;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const fade = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- Geometría ---------- */

function buildDome(): THREE.BufferGeometry {
  /* Perfil de la silicona: punta redondeada, falda y cuello hacia la tapa. */
  const prof: [number, number][] = [
    [0, 0.9], [0.22, 0.88], [0.44, 0.82], [0.62, 0.7], [0.76, 0.52], [0.84, 0.32],
    [0.86, 0.14], [0.8, 0.02], [0.64, -0.04], [0.46, -0.07], [0.3, -0.1], [0.3, -0.3], [0, -0.3],
  ];
  const pts = prof.map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, 44);
  g.computeVertexNormals();
  return g;
}

function buildCap(): { ring: THREE.BufferGeometry; disc: THREE.BufferGeometry; inset: THREE.BufferGeometry } {
  return {
    ring: new THREE.TorusGeometry(0.66, 0.15, 20, 56),
    disc: new THREE.CylinderGeometry(0.66, 0.66, 0.3, 56),
    inset: new THREE.CylinderGeometry(0.27, 0.27, 0.05, 40),
  };
}

type PlugMats = { dome: THREE.MeshPhysicalMaterial; cap: THREE.MeshPhysicalMaterial };

function makeMats(f: Finish, hi: boolean): PlugMats {
  const dome = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(f.dome),
    roughness: 0.62,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.6,
    sheen: 0.18,
    sheenRoughness: 0.85,
    sheenColor: new THREE.Color(0xffffff),
    envMapIntensity: 0.22,
    transmission: hi && f.clearDome ? 0.5 : 0,
    thickness: 0.6,
    ior: 1.42,
    attenuationColor: new THREE.Color(f.dome),
    attenuationDistance: 1.4,
    transparent: !hi && !!f.clearDome,
    opacity: !hi && f.clearDome ? 0.72 : 1,
  });
  const cap = new THREE.MeshPhysicalMaterial(
    f.clearCap
      ? { color: new THREE.Color(f.cap), metalness: 0, roughness: 0.1, clearcoat: 0.8, transmission: hi ? 0.65 : 0, thickness: 0.4, ior: 1.5, transparent: !hi, opacity: hi ? 1 : 0.7 }
      : { color: new THREE.Color(f.cap), metalness: 1, roughness: 0.22, clearcoat: 0.5, clearcoatRoughness: 0.12 }
  );
  return { dome, cap };
}

function buildPlug(geo: ReturnType<typeof buildCap>, domeGeo: THREE.BufferGeometry, mats: PlugMats, insetMat: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  const dome = new THREE.Mesh(domeGeo, mats.dome);
  const ring = new THREE.Mesh(geo.ring, mats.cap);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.3;
  const disc = new THREE.Mesh(geo.disc, mats.cap);
  disc.position.y = -0.3;
  const inset = new THREE.Mesh(geo.inset, insetMat);
  inset.position.y = -0.47;
  g.add(dome, ring, disc, inset);
  return g;
}

/* ---------- Escena ---------- */

export function createStage(canvas: HTMLCanvasElement, opts: StageOptions): Stage {
  let hi = opts.quality === "hi";
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, hi ? 2 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 6.2);

  /* Luz: un estudio neutro como base y tres luces de club. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.75;
  const sweep = new THREE.PointLight(0xffffff, 14, 20, 1.6);
  sweep.position.set(0, 2.2, 2.8);
  const blue = new THREE.PointLight(0x3b7df0, 28, 20, 1.8);
  blue.position.set(-3.2, -0.8, 1.2);
  const warm = new THREE.PointLight(0xffc7a1, 14, 20, 1.8);
  warm.position.set(3.2, 1.6, 2.2);
  scene.add(sweep, blue, warm);

  /* Materiales y geometría compartida. */
  const domeGeo = buildDome();
  const capGeo = buildCap();
  const insetMat = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.35, metalness: 0.6 });
  const caseMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.55, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.5, side: THREE.DoubleSide });
  const cordMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });

  /* Estuche: dos mitades, la tapa gira sobre una bisagra atrás. */
  const caseGroup = new THREE.Group();
  const R = 1.15;
  const bottom = new THREE.Mesh(new THREE.SphereGeometry(R, 56, 28, 0, TAU, Math.PI / 2, Math.PI / 2), caseMat);
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0, -R * 0.98);
  const lid = new THREE.Mesh(new THREE.SphereGeometry(R, 56, 28, 0, TAU, 0, Math.PI / 2), caseMat);
  lid.position.set(0, 0, R * 0.98);
  lidPivot.add(lid);
  const cord = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.045, 12, 32), cordMat);
  cord.position.set(0, R * 0.78, -R * 0.62);
  cord.rotation.x = Math.PI / 2.6;
  lid.add(cord);
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.86, R * 0.86, 0.08, 48), new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.95 }));
  inner.position.y = -0.3;
  caseGroup.add(bottom, lidPivot, inner);
  caseGroup.scale.set(1, 0.92, 1);
  scene.add(caseGroup);

  /* Gemelo que se queda en el estuche. */
  const twinMats = makeMats(FINISHES[0], hi);
  const twin = buildPlug(capGeo, domeGeo, twinMats, insetMat);
  twin.scale.setScalar(0.42);
  twin.position.set(0.42, -0.26, 0.1);
  twin.rotation.set(0.25, 0, -0.2);
  caseGroup.add(twin);

  /* VOID principal: el que flota, cambia de color y aterriza. */
  let current = FINISHES.find((f) => f.id === opts.initial) || FINISHES[0];
  const mainMats = makeMats(current, hi);
  const spin = new THREE.Group(); // giro del usuario
  const main = buildPlug(capGeo, domeGeo, mainMats, insetMat);
  spin.add(main);
  scene.add(spin);
  const target = { dome: new THREE.Color(current.dome), cap: new THREE.Color(current.cap), capMetal: current.clearCap ? 0 : 1, capRough: current.clearCap ? 0.1 : 0.22 };

  /* Anillo de 14. */
  const ring = new THREE.Group();
  const ringPlugs: THREE.Group[] = FINISHES.map((f) => {
    const g = buildPlug(capGeo, domeGeo, makeMats(f, hi), insetMat);
    g.rotation.x = 0.42;
    ring.add(g);
    return g;
  });
  scene.add(ring);

  /* Estado de gestos. */
  let p = 0, scenePhase = 1;
  let spinY = 0, spinVel = 0;
  let ringRot = -FINISHES.indexOf(current) * (TAU / N), ringVel = 0, ringTarget: number | null = ringRot;
  let dragging = false, lastX = 0, lastT = 0, moved = 0;
  let visible = true, alive = true;
  let selectedIdx = FINISHES.indexOf(current);
  let earWorld = new THREE.Vector3(0.6, 0.1, 0);

  /* fit: 1 en pantallas anchas, baja hasta 0.5 en vertical para que nada se corte. */
  let fit = 1;
  function resize() {
    const w = canvas.clientWidth || 390, h = canvas.clientHeight || 844;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fit = Math.max(0.5, Math.min(1, camera.aspect / 1.5));
    computeEar();
  }
  function computeEar() {
    /* Reproduce el recorte de object-fit: cover para ubicar el oído en pantalla y lo proyecta al plano z = 0. */
    const W = canvas.clientWidth || 390, H = canvas.clientHeight || 844, im = opts.earImage;
    const sc = Math.max(W / im.w, H / im.h), dw = im.w * sc, dh = im.h * sc;
    const sx = (W - dw) * im.px + im.u * dw, sy = (H - dh) * im.py + im.v * dh;
    const v = new THREE.Vector3((sx / W) * 2 - 1, 1 - (sy / H) * 2, 0.5).unproject(camera);
    const dir = v.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z;
    earWorld = camera.position.clone().add(dir.multiplyScalar(t));
  }

  function setFinish(f: Finish) {
    current = f;
    selectedIdx = FINISHES.indexOf(f);
    target.dome.set(f.dome);
    target.cap.set(f.cap);
    target.capMetal = f.clearCap ? 0 : 1;
    target.capRough = f.clearCap ? 0.1 : 0.22;
    mainMats.dome.transmission = hi && f.clearDome ? 0.7 : 0;
    mainMats.cap.transmission = hi && f.clearCap ? 0.65 : 0;
    mainMats.cap.clearcoat = f.clearCap ? 0.8 : 0.5;
  }

  /* Gestos: arrastre horizontal gira; el scroll vertical sigue libre (touch-action: pan-y en CSS). */
  function down(e: PointerEvent) {
    dragging = true; moved = 0; lastX = e.clientX; lastT = performance.now();
    canvas.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent) {
    if (!dragging) return;
    const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(8, now - lastT);
    moved += Math.abs(dx);
    const k = 0.012;
    if (scenePhase === 4) { ringRot += dx * k * 0.6; ringVel = (dx * k * 0.6) / dt * 16; ringTarget = null; }
    else { spinY += dx * k; spinVel = (dx * k) / dt * 16; }
    lastX = e.clientX; lastT = now;
  }
  function up() {
    if (!dragging) return;
    dragging = false;
    if (scenePhase === 4) snapRing();
  }
  function snapRing() {
    const step = TAU / N;
    const idx = ((Math.round(-ringRot / step) % N) + N) % N;
    ringTarget = -Math.round(-ringRot / step) * step;
    if (idx !== selectedIdx) { setFinish(FINISHES[idx]); opts.onSelect(FINISHES[idx].id); }
  }
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("lostpointercapture", up);

  /* Vigilante de rendimiento: baja calidad, y si no alcanza, avisa para mostrar el respaldo. */
  let frames = 0, tStart = 0, checked = 0, lowRuns = 0;
  const noFallback = typeof location !== "undefined" && /[?&]nofb/.test(location.search);
  const debug = { fps: 0, quality: opts.quality, downgraded: false };
  (window as unknown as { __void3d?: typeof debug }).__void3d = debug;
  function watchdog(now: number) {
    if (!tStart) tStart = now;
    frames++;
    if (now - tStart < 2500) return;
    const fps = (frames * 1000) / (now - tStart);
    frames = 0; tStart = now; checked++;
    debug.fps = Math.round(fps);
    if (fps < 30 && hi) {
      debug.downgraded = true; debug.quality = "lo";
      hi = false;
      renderer.setPixelRatio(1);
      [mainMats, twinMats, ...ringPlugs.map((g) => ({ dome: (g.children[0] as THREE.Mesh).material as THREE.MeshPhysicalMaterial, cap: (g.children[1] as THREE.Mesh).material as THREE.MeshPhysicalMaterial }))].forEach((m) => { m.dome.transmission = 0; m.cap.transmission = 0; m.dome.needsUpdate = true; m.cap.needsUpdate = true; });
    } else if (fps < 15 && !hi) {
      /* Tres mediciones seguidas por debajo de 15 fps: mejor la foto que un 3D a saltos. */
      lowRuns++;
      if (lowRuns >= 3 && !noFallback) { opts.onFallback("fps " + fps.toFixed(0)); alive = false; }
    } else lowRuns = 0;
  }

  /* Coreografía por progreso de scroll. */
  const camPos = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  function layout(now: number) {
    const t = now / 1000;
    sweep.position.x = Math.sin(t * 0.55) * 3.4;
    sweep.position.y = 2.0 + Math.cos(t * 0.4) * 0.6;
    sweep.intensity = hi ? 14 : 11;

    /* Fases */
    scenePhase = p < 0.15 ? 1 : p < 0.35 ? 2 : p < 0.6 ? 3 : p < 0.8 ? 4 : 5;

    /* Cámara */
    const s2 = ease(fade(p, 0.15, 0.35)), s3 = easeInOut(fade(p, 0.35, 0.6)), s4 = easeInOut(fade(p, 0.6, 0.8)), s5 = easeInOut(fade(p, 0.8, 1));
    const far = 1 + (1 - fit) * 0.35;
    let cz = lerp(6.2, 5.2, s2); cz = lerp(cz, 5.3, s3); cz = lerp(cz, 7.4, s4); cz = lerp(cz, 6.0, s5); cz *= far;
    let cy = lerp(0, 1.25, s4); cy = lerp(cy, 0, s5);
    camPos.set(0, cy, cz);
    camera.position.lerp(camPos, 0.18);
    camera.lookAt(0, lerp(0, 0.1, s3), 0);
    if (s5 > 0) computeEar();

    /* Estuche: gira solo + usuario, abre, se va. */
    const autoSpin = t * 0.25;
    caseGroup.rotation.y = autoSpin + spinY;
    caseGroup.rotation.x = 0.18;
    lidPivot.rotation.x = -2.1 * s2;
    caseGroup.position.y = lerp(0.1, -3.8, s3);
    caseGroup.scale.setScalar(0.92 * lerp(0.64, 1, (fit - 0.5) / 0.5));
    caseGroup.scale.y *= 0.92;
    caseGroup.visible = s3 < 1;

    /* VOID principal */
    const plugScale = lerp(0.72, 1.0, (fit - 0.5) / 0.5);
    const inCase = new THREE.Vector3(-0.42, -0.26, 0.1).multiplyScalar(0.92 * lerp(0.64, 1, (fit - 0.5) / 0.5)).applyEuler(new THREE.Euler(0.18, autoSpin + spinY, 0)).add(new THREE.Vector3(0, 0.1, 0));
    const floatPos = new THREE.Vector3(0, 0.15 + Math.sin(t * 1.3) * 0.06, 0);
    if (scenePhase <= 3) {
      spin.visible = true;
      spin.position.lerpVectors(inCase, floatPos, s3);
      main.scale.setScalar(lerp(0.42 * 0.92 * lerp(0.64, 1, (fit - 0.5) / 0.5), plugScale, s3));
      /* Perfil de tres cuartos: se ve la silicona y el canto de la tapa, nunca el fondo. */
      main.rotation.set(lerp(0.25, 0.35, s3), 0, lerp(-0.2, -0.95, s3));
      spin.rotation.y = s3 * (spinY + Math.sin(t * 0.5) * 0.4);
    } else if (scenePhase === 4) {
      /* El principal se funde en su puesto del anillo. */
      spin.visible = s4 < 0.5;
      spin.position.lerpVectors(floatPos, tmp.set(0, 0, 2.1), s4 * 2);
      main.scale.setScalar(lerp(plugScale, 0, s4 * 2));
    } else {
      spin.visible = true;
      const from = new THREE.Vector3(0, 0, 3.1 * fit);
      spin.position.lerpVectors(from, earWorld, s5);
      main.scale.setScalar(lerp(plugScale * 0.6, 0.2 + 0.08 * fit, s5));
      spin.rotation.y = lerp(spinY, 0, s5);
      main.rotation.set(lerp(0.42, -Math.PI / 2 + 0.12, s5), 0, lerp(0, 0.1, s5));
      mainMats.dome.transmission = hi && current.clearDome ? lerp(0.7, 0, s5) : 0;
    }

    /* Anillo */
    const ringOn = scenePhase === 4 || (scenePhase === 5 && s5 < 0.5);
    ring.visible = ringOn || (scenePhase === 3 && s3 > 0.9 && p > 0.58);
    if (ring.visible) {
      const open = scenePhase === 4 ? s4 : scenePhase === 5 ? 1 - s5 * 2 : 0;
      if (ringTarget !== null && !dragging) { ringRot += (ringTarget - ringRot) * 0.14; }
      else if (!dragging) { ringRot += ringVel; ringVel *= 0.9; if (Math.abs(ringVel) < 0.0015) snapRing(); }
      const step = TAU / N, radius = 3.1 * fit * ease(open);
      ringPlugs.forEach((g, i) => {
        const a = i * step + ringRot;
        const front = (Math.cos(a) + 1) / 2; // 1 adelante, 0 atrás
        g.position.set(Math.sin(a) * radius, Math.sin(a * 2) * 0.05, Math.cos(a) * radius);
        g.rotation.set(0.35, a * 0.3 + t * 0.2, -0.8);
        const sc = (0.3 + 0.3 * front) * ease(open) * plugScale;
        g.scale.setScalar(Math.max(0.001, sc));
      });
    }

    /* Giro con inercia */
    if (!dragging) { spinY += spinVel; spinVel *= 0.92; }

    /* Transición de color del principal */
    mainMats.dome.color.lerp(target.dome, 0.16);
    mainMats.dome.attenuationColor.lerp(target.dome, 0.16);
    mainMats.cap.color.lerp(target.cap, 0.16);
    mainMats.cap.metalness = lerp(mainMats.cap.metalness, target.capMetal, 0.16);
    mainMats.cap.roughness = lerp(mainMats.cap.roughness, target.capRough, 0.16);
  }

  function frame(now: number) {
    if (!alive) return;
    requestAnimationFrame(frame);
    if (!visible) return;
    layout(now);
    renderer.render(scene, camera);
    watchdog(now);
  }

  resize();
  requestAnimationFrame(frame);

  return {
    setProgress(v: number) { p = clamp01(v); },
    select(id: string) {
      const f = FINISHES.find((x) => x.id === id);
      if (!f || f === current) return;
      setFinish(f);
      ringTarget = -selectedIdx * (TAU / N);
      ringRot = ringTarget;
    },
    setVisible(v: boolean) { visible = v; },
    resize,
    dispose() {
      alive = false;
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("lostpointercapture", up);
      renderer.dispose();
      pmrem.dispose();
    },
  };
}
