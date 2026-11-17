// Entwickler-Werkzeug (nicht Teil der Website): rendert jede Ebene aus scene.ts als SVG-Standbild
// und schickt es an den lokalen Server aus scripts/capture-plates.mjs, der es in src/assets/plates/ speichert.
// Die Standbilder sind die Ersatzansicht ohne 3D (Handy, reduzierte Bewegung) und sehen aus wie die Bühne.
import * as THREE from 'three';
import { createPlates } from './scene';

// Farben wie in design-system/tokens.css: --ink, --white, --line-strong
const PALETTE = { ink: '#0b0a09', raised: '#ffffff', soft: '#8a8a8a' };
const DIR = new THREE.Vector3(1, 0.82, 1).normalize(); // gleicher Blickwinkel wie main.ts
const NAMES = ['websites', 'marketing', 'ki'] as const;
const WIDTH = 1200;
const HEIGHT = 900; // 4:3 wie die bisherigen Illustrationen
const LINE = 1.25; // Strichstärke im SVG
const MARGIN = 1.04;

function render(index: number): string {
  const plate = createPlates(PALETTE)[index];
  const object = new THREE.Group();
  object.add(plate.group);
  object.rotation.y = -0.3; // wie das Schlüsselbild "hero" der Leistungsseiten
  object.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.copy(center).addScaledVector(DIR, 30);
  camera.lookAt(center);
  camera.updateMatrixWorld(true);

  // Ausschnitt so wählen, dass die Ebene mit wenig Rand ins 4:3-Format passt:
  // alle tatsächlichen Eckpunkte in Kamerasicht projizieren (nicht nur den Begrenzungsquader).
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  object.traverse((o) => {
    if (!(o instanceof THREE.Mesh || o instanceof THREE.Line)) return;
    const pos = o.geometry.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const p = new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    }
  });
  let w = maxX - minX;
  let h = maxY - minY;
  if (w / h > WIDTH / HEIGHT) h = (w * HEIGHT) / WIDTH;
  else w = (h * WIDTH) / HEIGHT;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  camera.left = cx - (w / 2) * MARGIN;
  camera.right = cx + (w / 2) * MARGIN;
  camera.top = cy + (h / 2) * MARGIN;
  camera.bottom = cy - (h / 2) * MARGIN;
  camera.updateProjectionMatrix();

  return toSvg(object, camera);
}

/** Bildschirmkoordinaten (SVG) eines Punktes in Weltkoordinaten. */
function screen(p: THREE.Vector3, camera: THREE.Camera): string {
  const v = p.clone().project(camera);
  return `${(((v.x + 1) / 2) * WIDTH).toFixed(1)},${(((1 - v.y) / 2) * HEIGHT).toFixed(1)}`;
}

/**
 * Eigene Projektion statt SVGRenderer (der flache Linien und dünne Körper falsch sortiert):
 * zuerst die Grundplatte, dann die Linien auf ihr, dann die Körper von hinten nach vorn,
 * jeweils nur mit den Seiten, die zur Kamera zeigen.
 */
function toSvg(object: THREE.Object3D, camera: THREE.Camera): string {
  const ink = PALETTE.ink;
  const boxes: { mesh: THREE.Mesh; depth: number }[] = [];
  const lines: THREE.Line[] = [];
  object.traverse((o) => {
    if (o instanceof THREE.Mesh && o.geometry instanceof THREE.BoxGeometry) {
      boxes.push({ mesh: o, depth: o.getWorldPosition(new THREE.Vector3()).dot(DIR) });
    } else if (o instanceof THREE.Line && !(o instanceof THREE.LineSegments)) {
      lines.push(o); // Kantenlinien (LineSegments) zeichnen wir selbst als Umriss der Seiten
    }
  });
  const [base, ...rest] = boxes; // die erste Box ist immer die Grundplatte (siehe Builder in scene.ts)
  rest.sort((a, b) => a.depth - b.depth);

  const out: string[] = [];
  const drawBox = (mesh: THREE.Mesh) => {
    const g = mesh.geometry as THREE.BoxGeometry;
    const { width: w, height: h, depth: d } = g.parameters;
    const fill = (mesh.material as THREE.MeshBasicMaterial).color.getHexString() === ink.slice(1) ? ink : PALETTE.raised;
    const c = (x: number, y: number, z: number) => new THREE.Vector3((x * w) / 2, (y * h) / 2, (z * d) / 2).applyMatrix4(mesh.matrixWorld);
    // Seiten als [Normale, vier Ecken]
    const faces: [THREE.Vector3, number[][]][] = [
      [new THREE.Vector3(0, 1, 0), [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]]],
      [new THREE.Vector3(1, 0, 0), [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]],
      [new THREE.Vector3(-1, 0, 0), [[-1, -1, -1], [-1, 1, -1], [-1, 1, 1], [-1, -1, 1]]],
      [new THREE.Vector3(0, 0, 1), [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]],
      [new THREE.Vector3(0, 0, -1), [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]]],
    ];
    const rot = new THREE.Matrix3().setFromMatrix4(mesh.matrixWorld);
    for (const [n, corners] of faces) {
      if (n.clone().applyMatrix3(rot).dot(DIR) <= 0) continue; // Seite zeigt von der Kamera weg
      const pts = corners.map(([x, y, z]) => screen(c(x, y, z), camera)).join(' ');
      out.push(`<polygon points="${pts}" fill="${fill}" stroke="${ink}" stroke-width="${LINE}" stroke-linejoin="round"/>`);
    }
  };

  drawBox(base.mesh);
  for (const l of lines) {
    const pos = l.geometry.getAttribute('position');
    const pts: string[] = [];
    for (let i = 0; i < pos.count; i++) pts.push(screen(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(l.matrixWorld), camera));
    const soft = (l.material as THREE.LineBasicMaterial).color.getHexString() === PALETTE.soft.slice(1);
    const tag = l instanceof THREE.LineLoop ? 'polygon' : 'polyline';
    out.push(`<${tag} points="${pts.join(' ')}" fill="none" stroke="${soft ? PALETTE.soft : ink}" stroke-width="${soft ? 1 : LINE}" stroke-linejoin="round"/>`);
  }
  for (const b of rest) drawBox(b.mesh);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">${out.join('')}</svg>`;
}

async function run() {
  const status = document.getElementById('status')!;
  for (let i = 0; i < NAMES.length; i++) {
    const svg = render(i);
    const res = await fetch(`/save?name=${NAMES[i]}`, { method: 'POST', body: svg });
    status.textContent += `${NAMES[i]}: ${res.ok ? 'gespeichert' : 'Fehler'} (${svg.length} Zeichen)\n`;
  }
  status.textContent += 'fertig';
}

run();
