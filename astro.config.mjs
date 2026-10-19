import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domain: gravndigital.com (www als Hauptadresse; Weiterleitung von der Domain ohne www beim Hosting einrichten).
export default defineConfig({
  site: 'https://www.gravndigital.com',
  integrations: [
    sitemap({
      // Rechtsseiten sind noch Entwürfe (noindex) und gehören bis zur Freigabe nicht in die Sitemap.
      filter: (page) => !/\/(impressum|datenschutz|404)\/?$/.test(page),
    }),
  ],
  // Keine Inline-Skripte erzeugen, damit die CSP ohne 'unsafe-inline' für Skripte auskommt.
  vite: { build: { assetsInlineLimit: 0 } },
});
