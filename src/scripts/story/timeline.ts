// Zeitachse der Scroll-Geschichte: ein Schlüsselbild pro Kapitel, dazwischen wird weich überblendet.
// Die Reihenfolge muss zu den Abschnitten mit data-chapter in src/pages/index.astro passen.

export interface Frame {
  /** Abstand zwischen den Ebenen */
  gap: number;
  /** Vergrößerung der Kamera */
  zoom: number;
  /** Position des Objekts im Bild, 0 = links/oben, 1 = rechts/unten */
  cx: number;
  cy: number;
  /** Drehung um die Hochachse (Bogenmaß) */
  rot: number;
  /** Höhe, auf die die Kamera blickt */
  ty: number;
  /** Deckkraft der Ebenen: Websites, Marketing, KI */
  op: [number, number, number];
  /** Deckkraft der Verbindungslinien zwischen den Ebenen */
  link: number;
}

const FOCUS_GAP = 2.6;
const DIM = 0.14;

const MARK = 0.09; // Wasserzeichen

export const frames: Record<string, Frame> = {
  intro: { gap: 1.05, zoom: 0.82, cx: 0.79, cy: 0.6, rot: -0.35, ty: 0, op: [1, 1, 1], link: 0 },
  disziplinen: { gap: 1.7, zoom: 0.8, cx: 0.72, cy: 0.5, rot: 0, ty: 0, op: [1, 1, 1], link: 0 },
  websites: { gap: FOCUS_GAP, zoom: 1.15, cx: 0.71, cy: 0.5, rot: 0.2, ty: FOCUS_GAP, op: [1, DIM, DIM], link: 0 },
  marketing: { gap: FOCUS_GAP, zoom: 1.15, cx: 0.71, cy: 0.5, rot: 0.45, ty: 0, op: [DIM, 1, DIM], link: 0 },
  ki: { gap: FOCUS_GAP, zoom: 1.15, cx: 0.71, cy: 0.5, rot: 0.7, ty: -FOCUS_GAP, op: [DIM, DIM, 1], link: 0 },
  zusammenspiel: { gap: 1.0, zoom: 0.9, cx: 0.74, cy: 0.5, rot: 1.0, ty: 0, op: [1, 1, 1], link: 1 },
  ablauf: { gap: 0.55, zoom: 0.62, cx: 0.5, cy: 0.52, rot: 1.25, ty: 0, op: [MARK, MARK, MARK], link: MARK },
  ueber: { gap: 0.55, zoom: 0.62, cx: 0.72, cy: 0.5, rot: 1.5, ty: 0, op: [MARK, MARK, MARK], link: MARK },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, (t - 0.2) / 0.6));
  return x * x * (3 - 2 * x);
};

export function mix(a: Frame, b: Frame, t: number): Frame {
  return {
    gap: lerp(a.gap, b.gap, t),
    zoom: lerp(a.zoom, b.zoom, t),
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
    rot: lerp(a.rot, b.rot, t),
    ty: lerp(a.ty, b.ty, t),
    op: [lerp(a.op[0], b.op[0], t), lerp(a.op[1], b.op[1], t), lerp(a.op[2], b.op[2], t)],
    link: lerp(a.link, b.link, t),
  };
}

/**
 * Zielbild für eine Scroll-Position.
 * t = Kapitelnummer + Fortschritt im Kapitel (0..1); das Schlüsselbild gilt in der Kapitelmitte.
 */
export function sample(order: Frame[], t: number): Frame {
  const u = Math.min(order.length - 1, Math.max(0, t - 0.5));
  const i = Math.min(order.length - 2, Math.floor(u));
  return mix(order[i], order[i + 1], smooth(u - i));
}
