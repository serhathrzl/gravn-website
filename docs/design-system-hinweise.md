# Hinweise zum Designsystem (nicht geändert, nur dokumentiert)

1. `.gv-section-heading` setzt `container-type: inline-size` auf sich selbst. Die `@container`-Regel `grid-template-columns: 1fr` kann das Element selbst nicht treffen, nur Kinder. Folge: Der Kopf bleibt mobil zweispaltig. Workaround in `src/styles/global.css` per Media-Query. Empfehlung: Im Designsystem einen Wrapper als Container nutzen.
2. Die Klassen `.display`, `.heading-1`, `.display-cta` haben keine Mobile-Größen. Ergänzt in `src/styles/global.css` (47/51, 36/40, 64/62 laut README).
3. Ordner umbenannt von `gravn-design-system` zu `design-system`; Groß-/Kleinschreibung der Asset-Pfade im README korrigiert.
