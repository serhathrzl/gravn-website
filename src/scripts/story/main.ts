// Startet die 3D-Bühne der Startseite. Ohne dieses Skript (oder wenn es abbricht)
// bleibt die statische Ansicht mit den Illustrationen sichtbar.
import * as THREE from 'three';
import { createPlates, setOpacity } from './scene';
import { frames, mix, sample, type Frame } from './timeline';

const VIEW = 7.5; // sichtbare Höhe der Szene bei zoom = 1
const DIR = new THREE.Vector3(1, 0.82, 1).normalize(); // Blickwinkel wie in den Illustrationen

function cssVar(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function boot() {
  const story = document.querySelector<HTMLElement>('.story');
  const canvas = document.querySelector<HTMLCanvasElement>('#story-canvas');
  if (!story || !canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 1023px)').matches) return; // Prototyp: Bühne nur auf großen Bildschirmen

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
  const plates = createPlates({
    ink: cssVar('--ink', '#0b0a09'),
    raised: cssVar('--white', '#ffffff'),
    soft: cssVar('--line-strong', '#8a8a8a'),
  });
  for (const p of plates) object.add(p.group);
  scene.add(object);

  let width = 0;
  let height = 0;
  function resize() {
    width = canvas!.clientWidth;
    height = canvas!.clientHeight;
    renderer.setSize(width, height, false);
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

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

    const h = VIEW / f.zoom;
    const w = h * (width / height);
    camera.left = -w * f.cx;
    camera.right = w * (1 - f.cx);
    camera.top = h * f.cy;
    camera.bottom = -h * (1 - f.cy);
    camera.position.set(DIR.x * 30, f.ty + DIR.y * 30, DIR.z * 30);
    camera.lookAt(0, f.ty, 0);
    camera.updateProjectionMatrix();
  }

  let current = sample(order, progress());
  function tick(time: number) {
    requestAnimationFrame(tick);
    if (document.hidden) return;
    const r = story!.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    current = mix(current, sample(order, progress()), 0.09);
    apply(current, time);
    renderer.render(scene, camera);
  }

  document.documentElement.classList.add('story-on');
  resize();
  requestAnimationFrame(tick);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
