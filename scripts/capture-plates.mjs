// Erzeugt die Standbilder der drei Ebenen (src/assets/plates/*.svg) aus dem 3D-Objekt.
// Aufruf: node scripts/capture-plates.mjs, dann http://localhost:4500 im Browser öffnen.
// Die Seite rendert die SVGs und schickt sie hierher; danach mit Strg+C beenden.
import { build } from 'vite';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const OUT = 'src/assets/plates';
const NAMES = new Set(['websites', 'marketing', 'ki', 'team']);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gravn-capture-'));

await build({
  configFile: false,
  publicDir: false,
  logLevel: 'warn',
  build: {
    outDir: tmp,
    emptyOutDir: true,
    minify: false,
    lib: { entry: 'src/scripts/story/capture.ts', formats: ['iife'], name: 'GravnCapture', fileName: () => 'capture.js' },
  },
});

const page = '<!doctype html><meta charset="utf-8"><title>Standbilder</title><pre id="status"></pre><script src="/capture.js"></script>';
fs.mkdirSync(OUT, { recursive: true });

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/') return res.end(page);
    if (req.method === 'GET' && url.pathname === '/capture.js') {
      res.setHeader('content-type', 'text/javascript');
      return res.end(fs.readFileSync(path.join(tmp, 'capture.js')));
    }
    const name = url.searchParams.get('name') ?? '';
    if (req.method === 'POST' && url.pathname === '/save' && NAMES.has(name)) {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        if (!body.startsWith('<svg')) return res.writeHead(400).end();
        fs.writeFileSync(path.join(OUT, `${name}.svg`), body);
        console.log(`gespeichert: ${OUT}/${name}.svg (${body.length} Zeichen)`);
        res.end('ok');
      });
      return;
    }
    res.writeHead(404).end();
  })
  .listen(4500, '127.0.0.1', () => console.log('Standbilder: http://localhost:4500 öffnen'));
