// Erzeugt vorschau/: eigenständige HTML-Dateien, die per Doppelklick (file://) funktionieren. Aufruf: npm run vorschau
import fs from 'node:fs'; import path from 'node:path';
const src = 'dist', out = 'vorschau';
fs.rmSync(out, { recursive: true, force: true }); fs.cpSync(src, out, { recursive: true });
fs.rmSync(path.join(out, 'sitemap-0.xml'), { force: true }); fs.rmSync(path.join(out, 'sitemap-index.xml'), { force: true });
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of walk(out)) {
  if (f.endsWith('.css')) { fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/url\(\/_astro\//g, 'url(./')); continue; }
  if (!f.endsWith('.html')) continue;
  const depth = path.relative(out, path.dirname(f)).split(path.sep).filter(Boolean).length;
  const pre = depth ? '../'.repeat(depth) : './';
  let h = fs.readFileSync(f, 'utf8');
  h = h.replace(/(href|src|action)="\/([^"]*)"/g, (_, a, p) => {
    if (p.startsWith('/')) return _;
    const [pathPart, hash] = p.split('#'); const hs = hash ? '#' + hash : '';
    if (pathPart === '') return `${a}="${pre}index.html${hs}"`;
    if (/\.[a-z0-9]+$/i.test(pathPart)) return `${a}="${pre}${pathPart}${hs}"`;
    return `${a}="${pre}${pathPart.replace(/\/$/, '')}/index.html${hs}"`;
  });
  h = h.replace(/srcset="([^"]*)"/g, (_, v) => `srcset="${v.replace(/(^|,\s*)\/(?!\/)/g, '$1' + pre)}"`);
  h = h.replace(/<script type="module" src=/g, '<script defer src=');
  fs.writeFileSync(f, h);
}

// Schritt 2: alles in jede HTML-Datei einbetten (CSS, Fonts, Skripte), damit sie per Doppelklick funktioniert.
const cssFile = fs.readdirSync(path.join(out, '_astro')).find((n) => n.endsWith('.css'));
let css = fs.readFileSync(path.join(out, '_astro', cssFile), 'utf8').replace(/url\(\.\/([^)]+\.woff2)\)/g, (_, n) =>
  `url(data:font/woff2;base64,${fs.readFileSync(path.join(out, '_astro', n)).toString('base64')})`);
for (const f of walk(out).filter((x) => x.endsWith('.html'))) {
  let h = fs.readFileSync(f, 'utf8');
  h = h.replace(/<link rel="stylesheet" href="[^"]*\.css"\s*\/?>/g, () => `<style>${css}</style>`);
  h = h.replace(/<link rel="preload"[^>]*>/g, '');
  h = h.replace(/<script defer src="([^"]+\.js)"><\/script>/g, (_, p) => {
    const file = path.join(out, '_astro', path.basename(p));
    return `<script>${fs.readFileSync(file, 'utf8')}</script>`;
  });
  fs.writeFileSync(f, h);
}
// Nur CSS, JS und Fonts sind jetzt eingebettet; Bilder in _astro bleiben als Dateien liegen.
for (const n of fs.readdirSync(path.join(out, '_astro'))) if (/\.(css|js|woff2)$/.test(n)) fs.rmSync(path.join(out, '_astro', n));
fs.rmSync(path.join(out, '_headers'), { force: true });
