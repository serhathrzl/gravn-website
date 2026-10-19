# Logo

Renders the GRAVN logo inline as SVG, so it takes `currentColor` from its parent (`text` on any section ground).

**Consumer provides:** `variant`, `size` (cap height in px) and, for the home link, `href`.

- `lockup` (default): wordmark + mono descriptor "CONSULTING" at .42em tracking. Header and email signatures.
- `wordmark`: letters only. Footer (full width), favicons never.
- `mark`: the open G. Favicons, social avatars, loading states — anywhere below 120px width.

Do: give it clear space of one cap height on all sides. Use `ink` on light grounds, `paper` on dark.
Don't: stretch, outline, add effects, recolour with anything but `text`/`text-inverse`, or set the letters in a font instead — the wordmark is drawn, not typed. Minimum: wordmark 16px cap height, mark 20px.
