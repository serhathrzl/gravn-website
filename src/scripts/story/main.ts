// Startet die 3D-Bühne (Startseite und Leistungsseiten). Ohne dieses Skript (oder wenn es abbricht)
// bleibt die statische Ansicht mit den Standbildern sichtbar.
// Welche Zeitachse gilt, steht in data-story am Element .story (home, websites, marketing, ki).
import * as THREE from 'three';
import { createPlates, createTeam, setOpacity } from './scene';
import { timelines, mix, sample, type Frame, type StoryPage } from './timeline';

const VIEW = 7.5; // sichtbare Höhe der Szene bei zoom = 1
const DIR = new THREE.Vector3(1, 0.82, 1).normalize(); // Blickwinkel wie in den Illustrationen
const UP = new THREE.Vector3(0, 1, 0);

function cssVar(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function boot() {
  const story = document.querySelector<HTMLElement>('.story');
  const canvas = document.querySelector<HTMLCanvasElement>('#story-canvas');
  if (!story || !canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wide = window.matchMedia('(min-width: 1024px)'); // Bühne nur auf großen Bildschirmen, sonst statische Ansicht
  if (!wide.matches) return;

  const frames = timelines[(story.dataset.story ?? 'home') as StoryPage];
  if (!frames) return;
  const chapters = Array.from(story.querySelectorAll<HTMLElement>('[data-chapter]'));
  const order = chapters.map((c) => frames[c.dataset.chapter ?? '']).filter(Boolean) as Frame[];
  if (order.length < 2 || order.length !== chapters.length) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const object = new THREE.Group();
  const palette = {
    ink: cssVar('--ink', '#0b0a09'),
    raised: cssVar('--white', '#ffffff'),
    soft: cssVar('--line-strong', '#8a8a8a'),
  };
  // Über uns zeigt die Team-Szene als einzige Gruppe, alle anderen Seiten die drei Ebenen.
  const plates = story.dataset.story === 'about' ? [createTeam(palette)] : createPlates(palette);
  for (const p of plates) object.add(p.group);
  scene.add(object);

  // Verbindungslinien zwischen den Ebenen (Kapitel Zusammenspiel); Höhe wird mit dem Abstand skaliert.
  const linkMaterial = new THREE.LineBasicMaterial({ color: cssVar('--ink', '#0b0a09'), transparent: true, opacity: 0 });
  const links = new THREE.Group();
  for (const [x, z] of [[1.75, 1.2], [-1.75, 1.2], [1.75, -1.2], [-1.75, -1.2]]) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, -1, z), new THREE.Vector3(x, 1, z)]);
    links.add(new THREE.Line(geo, linkMaterial));
  }
  object.add(links);

  const nav = story.querySelector<HTMLElement>('.chapter-nav');
  const navLinks = nav ? Array.from(nav.querySelectorAll<HTMLAnchorElement>('a')) : [];
  let activeChapter = -1;

  let width = 0;
  let height = 0;
  const root = document.documentElement;
  let stopped = false;
  function resize() {
    if (!canvas!.clientWidth || !canvas!.clientHeight) return;
    width = canvas!.clientWidth;
    height = canvas!.clientHeight;
    renderer.setSize(width, height, false);
  }
  new ResizeObserver(resize).observe(document.body);

  /** Kapitelnummer + Fortschritt, gemessen an der Bildschirmmitte. */
  function progress() {
    const mid = window.innerHeight / 2;
    for (let i = 0; i < chapters.length; i++) {
      const r = chapters[i].getBoundingClientRect();
      if (mid < r.top) return i;
      if (mid < r.bottom) return i + (mid - r.top) / r.height;
    }
    return chapters.length;
  }

  function apply(f: Frame, time: number) {
    plates.forEach((p, i) => {
      p.group.position.y = (1 - i) * f.gap;
      setOpacity(p, f.op[i]);
    });
    object.rotation.y = f.rot + Math.sin(time * 0.0004) * 0.04;
    links.scale.y = f.gap;
    links.visible = f.link > 0.01;
    linkMaterial.opacity = f.link;

    const h = VIEW / f.zoom;
    const w = h * (width / height);
    camera.left = -w * f.cx;
    camera.right = w * (1 - f.cx);
    camera.top = h * f.cy;
    camera.bottom = -h * (1 - f.cy);
    // Der Blickpunkt liegt auf der gedrehten Ebene; deshalb mit der Objektdrehung mitführen.
    const target = new THREE.Vector3(f.tx, f.ty, f.tz).applyAxisAngle(UP, object.rotation.y);
    camera.position.set(target.x + DIR.x * 30, target.y + DIR.y * 30, target.z + DIR.z * 30);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }

  // Die Grafikkarte steigt aus: zurück zur statischen Ansicht.
  canvas.addEventListener('webglcontextlost', () => {
    stopped = true;
    root.classList.remove('story-on');
  });

  let current = sample(order, progress());
  function tick(time: number) {
    if (stopped) return;
    requestAnimationFrame(tick);
    if (document.hidden || !wide.matches) return; // schmal: das CSS zeigt die statische Ansicht
    const r = story!.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const t = progress();
    const mid = window.innerHeight / 2;
    nav?.classList.toggle('is-visible', r.top < mid && r.bottom > mid);
    const chapter = Math.min(chapters.length - 1, Math.floor(t));
    if (chapter !== activeChapter) {
      activeChapter = chapter;
      navLinks.forEach((a, i) => (i === chapter ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    }
    current = mix(current, sample(order, t), 0.09);
    apply(current, time);
    renderer.render(scene, camera);
  }

  root.classList.add('story-on');
  resize();
  try {
    apply(current, 0);
    renderer.render(scene, camera);
  } catch {
    stopped = true;
    root.classList.remove('story-on');
    return;
  }
  requestAnimationFrame(tick);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
