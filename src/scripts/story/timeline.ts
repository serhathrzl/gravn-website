// Zeitachsen der Scroll-Geschichten: ein Schlüsselbild pro Kapitel, dazwischen wird weich überblendet.
// Die Kapitelnamen müssen zu den Abschnitten mit data-chapter passen:
// Startseite in src/pages/index.astro, Leistungsseiten in src/layouts/ServicePage.astro.

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
  /** Punkt, auf den die Kamera blickt (Höhe ty, auf der Ebene tx/tz) */
  ty: number;
  tx: number;
  tz: number;
  /** Deckkraft der Ebenen: Websites, Marketing, KI */
  op: [number, number, number];
  /** Deckkraft der Verbindungslinien zwischen den Ebenen */
  link: number;
}

export type StoryPage = 'home' | 'about' | 'websites' | 'marketing' | 'ki';

const FOCUS_GAP = 2.6;
const DIM = 0.14;
const MARK = 0.09; // Wasserzeichen

const f = (v: Partial<Frame> & Pick<Frame, 'zoom' | 'cx' | 'rot' | 'op'>): Frame => ({ gap: 0, cy: 0.5, ty: 0, tx: 0, tz: 0, link: 0, ...v });

const home: Record<string, Frame> = {
  intro: f({ gap: 1.05, zoom: 0.82, cx: 0.79, cy: 0.6, rot: -0.35, op: [1, 1, 1] }),
  disziplinen: f({ gap: 1.7, zoom: 0.8, cx: 0.72, rot: 0, op: [1, 1, 1] }),
  websites: f({ gap: FOCUS_GAP, zoom: 1.15, cx: 0.71, rot: 0.2, ty: FOCUS_GAP, op: [1, DIM, DIM] }),
  marketing: f({ gap: FOCUS_GAP, zoom: 1.15, cx: 0.71, rot: 0.45, op: [DIM, 1, DIM] }),
  ki: f({ gap: FOCUS_GAP, zoom: 1.15, cx: 0.71, rot: 0.7, ty: -FOCUS_GAP, op: [DIM, DIM, 1] }),
  zusammenspiel: f({ gap: 1.0, zoom: 0.9, cx: 0.74, rot: 1.0, op: [1, 1, 1], link: 1 }),
  ablauf: f({ gap: 0.55, zoom: 0.62, cx: 0.5, cy: 0.52, rot: 1.25, op: [MARK, MARK, MARK], link: MARK }),
  ueber: f({ gap: 0.55, zoom: 0.62, cx: 0.72, rot: 1.5, op: [MARK, MARK, MARK], link: MARK }),
};

/** Über uns: die Team-Szene (createTeam). Nur op[0] zählt; Kamera fährt vom Ganzen zu den Ebenen,
 *  dann zu den Figuren und endet als Wasserzeichen. */
const about: Record<string, Frame> = {
  hero: f({ zoom: 1.4, cx: 0.75, cy: 0.56, rot: -0.3, ty: 0.3, op: [1, 0, 0] }),
  blick: f({ zoom: 1.9, cx: 0.72, rot: 0.05, tx: 0.2, ty: 0.55, tz: 0.15, op: [1, 0, 0] }),
  zusammenarbeit: f({ zoom: 1.55, cx: 0.73, rot: 0.75, ty: 0.35, op: [1, 0, 0] }),
  team: f({ zoom: 0.85, cx: 0.5, cy: 0.52, rot: 1.25, ty: 0.3, op: [MARK, 0, 0] }),
};

/** Leistungsseiten: nur die eigene Ebene, die Kamera fährt je Kapitel an andere Stellen. */
function service(index: 0 | 1 | 2): Record<string, Frame> {
  const on = [0, 0, 0] as Frame['op'];
  on[index] = 1;
  const mark = [0, 0, 0] as Frame['op'];
  mark[index] = MARK;
  return {
    hero: f({ zoom: 1.0, cx: 0.75, cy: 0.56, rot: -0.3, op: on }),
    ausgangslage: f({ zoom: 1.55, cx: 0.72, rot: -0.05, tx: -0.7, tz: -0.55, op: on }),
    leistungen: f({ zoom: 1.55, cx: 0.72, rot: 0.35, tx: 0.75, tz: 0.35, op: on }),
    nutzen: f({ zoom: 1.1, cx: 0.73, rot: 0.8, op: on }),
    ablauf: f({ zoom: 0.62, cx: 0.5, cy: 0.52, rot: 1.2, op: mark }),
  };
}

export const timelines: Record<StoryPage, Record<string, Frame>> = {
  home,
  about,
  websites: service(0),
  marketing: service(1),
  ki: service(2),
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
    tx: lerp(a.tx, b.tx, t),
    tz: lerp(a.tz, b.tz, t),
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
