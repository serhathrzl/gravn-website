import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO (Launch): echte Domain eintragen, sobald sie feststeht (siehe docs/launch-checkliste.md).
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    sitemap({
      // Rechtsseiten sind noch Entwürfe (noindex) und gehören bis zur Freigabe nicht in die Sitemap.
      filter: (page) => !/\/(impressum|datenschutz|404)\/?$/.test(page),
    }),
  ],
  // Keine Inline-Skripte erzeugen, damit die CSP ohne 'unsafe-inline' für Skripte auskommt.
  vite: { build: { assetsInlineLimit: 0 } },
});
