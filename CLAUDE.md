# GRAVN Digital – Website

Statische Agentur-Website (Deutsch, "du"). Inhaber ist Einsteiger: Claude erklärt auf Deutsch, einfach, empfiehlt statt Optionen aufzuzählen.

## Stack
Astro (statisch) + TypeScript, kein UI-Framework. Hosting-Ziel: Cloudflare Pages via GitHub (noch nicht eingerichtet). Plan: `~/.claude/plans/pasted-content-id-137b-role-synchronous-spark.md`.

## Befehle
- `npm run dev` – lokale Vorschau
- `npm run build` – Typprüfung + Build (muss vor jedem Abschluss grün sein)

## Struktur
- `design-system/` – Quelle der Marke (tokens.json → tokens.css, bundle.css, Fonts, Logos). Nicht ändern ohne Freigabe.
- `src/components/*.astro` – portierte Designsystem-Komponenten (`gv-` Klassen bleiben).
- `src/layouts/Base.astro`, `src/pages/`, `src/styles/global.css`.

## Designregeln
All UI follows the GRAVN design system in `design-system/`. Before building or changing any UI:

1. Read `design-system/README.md` (brand rules: voice, colour, type, layout, accent usage) and the relevant `design-system/components/<Component>.md`.
2. Use only CSS custom properties from `design-system/tokens.css` — never hard-code colours, font sizes, spacing or radii. Use semantic tokens (`--surface`, `--text`, `--text-secondary`, `--line`, `--action`, `--on-action`, `--accent`, `--focus`), not raw ones (`--ink`, `--paper`).
3. Dark sections: set `data-theme="dark"` on the section; tokens flip automatically.
4. Reuse the components (`gv-` classes in `design-system/components/bundle.css`, props typed in `components/index.d.ts`). Port them to the project's framework rather than inventing new variants.
5. Logo: use the SVGs in `design-system/assets/logos/` or the inline `Logo` component. Never set "GRAVN" in a font, never recolour it.
6. Fonts are self-hosted from `design-system/fonts/` — never load Google Fonts (GDPR).
7. `tokens.json` is the source of truth. If a token changes, regenerate `tokens.css`; don't edit it by hand.
8. Brass `--accent` is a highlight only (indices, active nav, hover arrows, one accented word/period per view) — never a fill.

## Inhalte & Recht
- Nichts erfinden: keine Kunden, Logos, Testimonials, Zahlen, Projekte. Fehlende Firmendaten als sichtbare Platzhalter.
- Keine Tracker/Drittanbieter-Skripte ohne Freigabe (DSGVO). Impressum/Datenschutz vor Launch rechtlich prüfen lassen.
- Entscheidungen zu Kosten, externen Diensten, Marke, Sicherheit: erst erklären, dann Freigabe holen.

## Stand
Phasen 1–7 umgesetzt (siehe Plan). Vor Launch: `docs/launch-checkliste.md` abarbeiten. Designsystem-Auffälligkeiten: `docs/design-system-hinweise.md`. Inhalte/Texte: `docs/inhalt-entwurf.md`.
Security-Header liegen in `public/_headers` (CSP ohne Inline-Skripte; `assetsInlineLimit: 0` in `astro.config.mjs` muss bleiben).

## Vorschau
`npm run vorschau` baut die Seite und erzeugt `vorschau/` (per Doppelklick öffnbar, nicht in Git). Nach jeder inhaltlichen Änderung ausführen, damit die Vorschau aktuell ist.
