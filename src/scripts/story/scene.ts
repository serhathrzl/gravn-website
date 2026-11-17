// 3D-Objekt der Startseite: drei schwebende Ebenen (Websites, Marketing, KI).
// Alles entsteht aus Linien und einfachen Körpern, es gibt keine Modell-Dateien.
import * as THREE from 'three';

export interface Palette { ink: string; raised: string; soft: string }

export interface Plate {
  group: THREE.Group;
  materials: THREE.Material[];
}

const W = 4.2; // Breite (x)
const D = 3; // Tiefe (z)
const H = 0.1; // Dicke
const TOP = H / 2 + 0.004;

class Builder {
  group = new THREE.Group();
  line: THREE.LineBasicMaterial;
  soft: THREE.LineBasicMaterial;
  fill: THREE.MeshBasicMaterial;
  solid: THREE.MeshBasicMaterial;

  constructor(p: Palette, width = W, depth = D) {
    this.line = new THREE.LineBasicMaterial({ color: p.ink, transparent: true });
    this.soft = new THREE.LineBasicMaterial({ color: p.soft, transparent: true });
    this.fill = new THREE.MeshBasicMaterial({ color: p.raised, transparent: true, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    this.solid = new THREE.MeshBasicMaterial({ color: p.ink, transparent: true });
    this.box(0, 0, width, depth, H, -H / 2);
  }

  /** Körper mit Kantenlinien; x/z sind die Mitte, y0 die Unterkante. */
  box(x: number, z: number, w: number, d: number, h: number, y0 = H / 2, solid = false) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, solid ? this.solid : this.fill);
    mesh.position.set(x, y0 + h / 2, z);
    this.group.add(mesh);
    if (!solid) {
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), this.line);
      edges.position.copy(mesh.position);
      this.group.add(edges);
    }
  }

  /** Linienzug auf der Oberfläche; Punkte als [x, z]. */
  path(points: [number, number][], closed = false, soft = false, y = TOP) {
    const pts = points.map(([x, z]) => new THREE.Vector3(x, y, z));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = soft ? this.soft : this.line;
    this.group.add(closed ? new THREE.LineLoop(geo, mat) : new THREE.Line(geo, mat));
  }

  /** Rechteck auf der Oberfläche; x/z ist die linke obere Ecke. */
  rect(x: number, z: number, w: number, d: number, soft = false, y = TOP) {
    this.path([[x, z], [x + w, z], [x + w, z + d], [x, z + d]], true, soft, y);
  }

  ring(x: number, z: number, r: number, soft = false, y = TOP) {
    const pts: [number, number][] = [];
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      pts.push([x + Math.cos(a) * r, z + Math.sin(a) * r]);
    }
    this.path(pts, true, soft, y);
  }

  done(): Plate {
    return { group: this.group, materials: [this.line, this.soft, this.fill, this.solid] };
  }
}

/** Ebene 1: Website als Drahtmodell (Kopfzeile, Überschrift, Bild, Karten). */
function websitePlate(p: Palette): Plate {
  const b = new Builder(p);
  b.rect(-1.8, -1.2, 3.6, 2.4);
  b.path([[-1.8, -0.9], [1.8, -0.9]]);
  b.box(-1.45, -1.05, 0.4, 0.07, 0.012, H / 2, true);
  b.path([[0.9, -1.05], [1.15, -1.05]], false, true);
  b.path([[1.25, -1.05], [1.5, -1.05]], false, true);
  b.box(-0.6, -0.55, 1.9, 0.15, 0.012, H / 2, true);
  b.box(-0.9, -0.28, 1.3, 0.15, 0.012, H / 2, true);
  b.path([[-1.55, 0], [-0.3, 0]], false, true);
  b.path([[-1.55, 0.14], [-0.6, 0.14]], false, true);
  b.rect(0.45, -0.65, 1.15, 0.95);
  for (let i = 1; i < 7; i++) b.path([[0.45, -0.65 + i * 0.136], [1.6, -0.65 + i * 0.136]], false, true);
  for (let i = 0; i < 3; i++) b.rect(-1.55 + i * 1.08, 0.5, 0.95, 0.5, true);
  return b.done();
}

/** Ebene 2: Marketing als Signal (Kern, Ringe, Kontakte, drei Inhaltskarten). */
function marketingPlate(p: Palette): Plate {
  const b = new Builder(p);
  b.box(0, 0.15, 0.6, 0.6, 0.3);
  b.ring(0, 0.15, 0.55);
  b.ring(0, 0.15, 0.9, true);
  b.ring(0, 0.15, 1.25, true);
  const dots: [number, number][] = [[0.85, 0.45], [-0.75, 0.65], [-0.5, -0.6], [1.1, -0.35], [0.2, 1.38], [-1.2, 0.05], [0.55, -0.85], [-0.2, 1.0], [1.2, 0.5]];
  for (const [x, z] of dots) b.ring(x, z, 0.045);
  for (let i = 0; i < 3; i++) b.box(-1.2 + i * 1.2, -1.2, 0.55, 0.03, 0.85);
  b.box(1.75, 1.1, 0.16, 0.16, 0.7, H / 2, true);
  return b.done();
}

/** Ebene 3: KI als Ablauf (Eingang, Tor, erledigte Aufgaben, Ablaufplan). */
function kiPlate(p: Palette): Plate {
  const b = new Builder(p);
  b.rect(-1.9, -0.75, 3.8, 0.6);
  for (let i = 0; i < 3; i++) b.box(-1.6 + i * 0.5, -0.45, 0.3, 0.3, 0.3);
  b.box(0, -0.88, 0.14, 0.14, 0.95);
  b.box(0, -0.02, 0.14, 0.14, 0.95);
  b.box(0, -0.45, 0.14, 1.0, 0.14, H / 2 + 0.95);
  for (let i = 0; i < 3; i++) b.box(0.6 + i * 0.5, -0.45, 0.3, 0.3, 0.3, H / 2, true);
  b.rect(-1.5, 0.45, 0.5, 0.35);
  b.rect(-0.5, 0.3, 0.5, 0.35, true);
  b.rect(-0.5, 0.85, 0.5, 0.35, true);
  b.rect(0.5, 0.55, 0.5, 0.35);
  b.path([[-1.0, 0.62], [-0.75, 0.62], [-0.75, 0.47], [-0.5, 0.47]]);
  b.path([[-0.75, 0.62], [-0.75, 1.02], [-0.5, 1.02]]);
  b.path([[0, 0.47], [0.25, 0.47], [0.25, 0.72], [0.5, 0.72]]);
  b.path([[0, 1.02], [0.25, 1.02], [0.25, 0.72]]);
  return b.done();
}

/** Schlanke Figur wie im Architekturmodell: zwei Beine, Körper, kleiner abgesetzter Kopf. x/z = Standpunkt. */
function figure(b: Builder, x: number, z: number) {
  b.ring(x, z, 0.2, true);
  b.box(x - 0.042, z, 0.06, 0.07, 0.42);
  b.box(x + 0.042, z, 0.06, 0.07, 0.42);
  b.box(x, z, 0.2, 0.11, 0.36, H / 2 + 0.43);
  b.box(x, z, 0.1, 0.1, 0.1, H / 2 + 0.83);
}

/** Über uns: ein Team, das gemeinsam an deinem digitalen Auftritt baut.
 *  In der Mitte der Stapel der drei Ebenen (Websites, Marketing, KI), drumherum drei schlanke Figuren,
 *  feine Linien von jeder Figur zum Stapel. Einziger schwarzer Akzent: der Balken auf der obersten Ebene. */
export function createTeam(p: Palette): Plate {
  const b = new Builder(p, 3.0, 2.2);
  const cx = 0.2;
  const cz = 0.15;
  const levels = [0.2, 0.5, 0.8];
  for (const y of levels) b.box(cx, cz, 1.0, 0.72, 0.03, H / 2 + y);
  const top = (i: number) => H / 2 + levels[i] + 0.03 + 0.004;
  // unten: Ablauf-Kästchen (KI), Mitte: Signalring (Marketing), oben: Seite mit Überschrift (Websites)
  b.rect(cx - 0.38, cz - 0.2, 0.2, 0.14, true, top(0));
  b.rect(cx - 0.06, cz - 0.2, 0.2, 0.14, true, top(0));
  b.rect(cx + 0.14, cz + 0.06, 0.2, 0.14, true, top(0));
  b.ring(cx, cz, 0.22, true, top(1));
  b.ring(cx, cz, 0.08, false, top(1));
  b.rect(cx - 0.4, cz - 0.27, 0.8, 0.54, false, top(2));
  b.box(cx - 0.08, cz - 0.12, 0.44, 0.07, 0.006, top(2) - 0.004, true);
  b.path([[cx - 0.3, cz + 0.05], [cx + 0.1, cz + 0.05]], false, true, top(2));
  b.path([[cx - 0.3, cz + 0.13], [cx - 0.05, cz + 0.13]], false, true, top(2));
  // Drei Figuren links, hinten und rechts vom Stapel, je mit Linie zum Stapel
  const people: [number, number][] = [[-0.95, -0.35], [1.05, -0.65], [-0.55, 0.8]];
  for (const [x, z] of people) {
    figure(b, x, z);
    b.path([[x, z], [cx, cz]], false, true);
  }
  return b.done();
}

export function createPlates(p: Palette): Plate[] {
  return [websitePlate(p), marketingPlate(p), kiPlate(p)];
}

export function setOpacity(plate: Plate, opacity: number) {
  plate.group.visible = opacity > 0.01;
  for (const m of plate.materials) {
    m.opacity = opacity;
    const transparent = opacity < 0.99; // voll deckende Ebenen verdecken, was hinter ihnen liegt
    if (m.transparent !== transparent) {
      m.transparent = transparent;
      m.needsUpdate = true;
    }
  }
}
