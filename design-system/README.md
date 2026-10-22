GRAVN is a strategy, design and AI studio. The brand is quiet, monochrome and exact: big light grotesk headlines, fine hairlines, square controls, one arrow as the only ornament. Everything earns its place; nothing shouts.

## Logo

The wordmark is **drawn, not typed** — five geometric letters at a single hairline weight, tracked wide. The A has no crossbar (Λ) and mirrors the V beside it; their legs run parallel, which gives the mark its rhythm and is the brand's one signature shape. The G is an open circle with a short inward bar — on its own it is the **mark**.

- Use `assets/logos/gravn-wordmark-ink.svg` on Paper and White, `gravn-wordmark-paper.svg` on Ink. In code, use `Gravn.Logo` (inline SVG, inherits `text`).
- `Logo variant="lockup"` (wordmark + "DIGITAL" in `font-mono` at .42em tracking) for the header; `wordmark` alone for the full-width footer; `mark` for favicon, avatars and anything under 120px wide. Favicon: `gravn-favicon.svg`.
- Clear space: one cap height on every side. Minimum: wordmark 16px cap height, mark 20px.
- Never set "GRAVN" in a font as a logo, never add a crossbar to the Λ, never outline, stretch, rotate, gradient-fill or recolour it beyond `ink` / `paper`.

## Voice

- German, informal **du**, short declarative sentences that end in a period: "Digital denken. Mehr bewegen." Headlines come in pairs of two short statements on two lines.
- Verbs over adjectives: *verstehen, konzipieren, umsetzen, weiterentwickeln*. Concrete over grand.
- The only question is the closing invitation: "Was hast du vor?"
- **Never claim what isn't true:** no client logos, testimonials, results or numbers unless they are real and approved. Visuals are illustrations, not case studies.
- No emoji, no exclamation marks, no "KI-Revolution" hype. Write "KI" in German copy, "AI" only in the hero meta line.
- Eyebrows are numbered: "01 / Unsere Expertise" (rendered uppercase by `eyebrow`).

## Colour

Monochrome by design, with one brass accent. Four brand values, two grounds.

- `paper` is the page ground; `ink` is the second ground. Sections alternate Paper → Ink → Paper; set `data-theme="dark"` on an Ink section and every semantic token flips.
- Build with semantic tokens only: `surface`, `surface-raised`, `surface-inverse`, `text`, `text-secondary`, `line`, `line-strong`, `action`, `on-action`, `accent`, `focus`. Raw values (`ink`, `paper`, `white`, `graphite`, `ash`, `carbon`) are for the logo and illustrations.
- `text-secondary` is `graphite` on Paper and `ash` on Ink — never `graphite` on Ink (3.3:1, fails for body text).
- **One accent: brass.** `accent` is `brass-deep` on Paper and `brass` on Ink — a warm metal against black and white, like an engraved plate. Use it as a highlight, never as a fill: section and card indices (`Eyebrow` index, `ServiceCard` index), the active nav underline, arrows on hover, and at most one accented word or closing period per viewport (`<span class="gv-accent">.</span>`). Never on buttons, backgrounds, body text or the logo.
- The ratio stays roughly 90 % monochrome, 9 % hairline grey, 1 % brass. If you notice the accent, there is too much of it.
- `steel` is for illustration only (metallic renders, diagram fills). No gradients.
- Never pure `#000` or `#fff` as a page ground.

## Typography

Geist (variable, 100–900) for everything; Geist Mono for eyebrows, indices, tags and the logo descriptor. Both are self-hosted in `fonts/` (SIL OFL, licence in `fonts/OFL-Geist.txt`) — do not load them from Google Fonts on the live site (GDPR: embedding Google Fonts transfers visitor IPs to Google).

- `display` (91/97, weight 350, −0.045em) for the hero only; `display-cta` (128/120) only for "Was hast du vor?". Mobile: 47/51 and 64/62.
- `heading-1` (56/60) for section headlines, `heading-2` (28/32) for card titles, `numeral` (64, weight 250) for process numbers.
- `lead` (21/30) for intros, `body` (16/24) for running text, `label` (15/20) for buttons and nav, `eyebrow` (mono 11/16, +0.14em, uppercase) for meta.
- Tight tracking on large sizes, normal on body. Never bold — the heaviest weight in use is 450. Never centred except in single-line CTAs.

## Layout

- Desktop frame 1440px (`container`) with `space-8` (80px) gutters and a 3-column grid at `space-6` gaps; mobile 390px with `space-5` (24px) gutters and one column. Below 768px the nav becomes a menu.
- Section padding `space-10` (160px) desktop, `space-9` (120px) mobile. Heading to content `space-7`.
- Section heads are split: headline left (7/11), intro right (4/11), bottom-aligned (`SectionHeading`).
- Paragraphs max `measure` (560px). Generous empty space is part of the brand — don't fill it.

## Lines, shapes, surfaces

- Structure comes from 1px `line` rules (`hairline`), not boxes or shadows. There are **no shadows** and **no radii**: `radius-none` everywhere; `radius-full` only for dots inside illustrations.
- Cards are open: a raised visual frame (`surface-raised`, 4:3), then text, closed by a bottom rule. No card borders, no coloured left borders.

## Iconography

One icon family, drawn for GRAVN: 24px grid, 1.5px stroke, square caps, no fills (`assets/icons/`). The arrow (`arrow-up-right`) is the brand's only ornament — it follows every CTA and card title. `arrow-right` for in-flow progression, `menu` / `close` for the mobile nav. No emoji, no third-party icon sets mixed in.

## Imagery

Abstract, monochrome, precise: dark studio renders of metallic forms (`steel` on `ink`), line diagrams of workflows, typographic tiles. No stock people, no robots, no glowing brains, no blue-purple "AI" gradients.

**Service illustrations (website).** Each discipline has one isometric line illustration in 4:3: `src/assets/illustrations/websites.png`, `marketing.png`, `ki.png` (greyscale, derived from the originals in `Bilder Website/`). They are the approved imagery for `ServiceCard` and the service pages.
- Greyscale only. The brass of the originals is removed so the 90 / 9 / 1 colour ratio holds; brass stays a typographic highlight.
- The soft ground shadows inside the illustrations are part of the artwork. The "no shadows, no gradients" rule still applies to the UI itself (cards, buttons, frames).
- The corner and callout labels are baked into the image (not selectable, not translatable). Every image needs a descriptive `alt` text. The meta label "AI / AUTOMATION" in the third image breaks the "KI" rule; re-export it as "KI / AUTOMATISIERUNG" when the originals are next updated.
- Use the `Illustration` component (WebP, responsive sizes); never link the 3200 px originals.
- `ServiceCard` uses the raised (light) frame for all three cards; `visualTone="inverse"` is not used with these images.

## Motion and states

- Hover is quiet: 180ms `cubic-bezier(.2,0,0,1)`. Arrows shift 2px up-right and turn `accent`; link underlines draw in; primary fills lighten slightly. Nothing bounces, nothing scales.
- Respect `prefers-reduced-motion` (durations drop to 0).
- Focus: 2px solid `focus` ring, 3px offset, on every interactive element — never removed.
- Controls are at least `control-height` (48px) tall.

## Building the website

Load `tokens.css`, the two `@font-face` fonts, then `components/bundle.css`. In React use `window.Gravn.*` (or port the components — they are plain function components with `gv-` class names, typed in `components/index.d.ts`). Wire the header CTA and "Projekt besprechen" to the contact flow, and ship `/impressum` and `/datenschutz` before launch.
