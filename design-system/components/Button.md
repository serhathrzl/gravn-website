# Button

Square action control with a trailing arrow — the brand's main call to action.

**Consumer provides:** a label (`children`), `variant`, and either `href` (renders `<a>`) or `onClick`.

- `primary`: `action` fill, `on-action` label. One per viewport; the label is a verb phrase ("Projekt besprechen").
- `secondary`: transparent with `line-strong` hairline. Next to a primary, never alone in a hero.
- `link`: text + arrow, underline draws in on hover. Secondary navigation ("Leistungen entdecken").

Min height 48px (`control-height`), 2px `focus` ring at 3px offset. Hover is quiet: fill lightens slightly, arrow shifts 2px up-right in 180ms; no motion with reduced-motion. Don't round it, don't add icons other than the arrow.
