// Bündelt die 3D-Bühne der Startseite (src/scripts/story) zu einer einzelnen klassischen
// Datei public/story.js. So läuft sie auch in der Doppelklick-Vorschau (file://).
// Wird von "npm run dev" und "npm run build" aufgerufen.
import { build } from 'vite';

await build({
  configFile: false,
  publicDir: false,
  logLevel: 'warn',
  build: {
    outDir: 'public',
    emptyOutDir: false,
    minify: true,
    lib: { entry: 'src/scripts/story/main.ts', formats: ['iife'], name: 'GravnStory', fileName: () => 'story.js' },
  },
});
