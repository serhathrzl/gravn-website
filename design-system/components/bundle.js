/* @ds-bundle: {"format":4,"namespace":"Gravn","components":[{"name":"Logo"},{"name":"Button"},{"name":"Eyebrow"},{"name":"SectionHeading"},{"name":"ServiceCard"},{"name":"ProcessStep"},{"name":"SiteHeader"},{"name":"SiteFooter"}]} */
(function () {
  var React = window.React, h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  /* ---------- glyphs (inline so they inherit currentColor) ---------- */
  function Wordmark(p) {
    return h('svg', { viewBox: '0 0 215 40', className: cx('gv-wordmark', p.className), role: 'img', 'aria-label': 'GRAVN', focusable: 'false' },
      h('g', { fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        h('path', { d: 'M33.44 6.56 A19 19 0 1 0 39 20 H22' }),
        h('path', { d: 'M57 1 H67 A9.5 9.5 0 0 1 67 20 H57' })),
      h('g', { fill: 'currentColor' },
        h('rect', { x: 56, y: 0, width: 2, height: 40 }),
        h('polygon', { points: '62.8,20 65.2,20 79.2,40 76.8,40' }),
        h('polygon', { points: '95.2,40 112.2,0 129.2,40 126.8,40 112.2,5.65 97.6,40' }),
        h('polygon', { points: '136.2,0 138.6,0 153.2,34.35 167.8,0 170.2,0 153.2,40' }),
        h('rect', { x: 186.2, y: 0, width: 2, height: 40 }),
        h('rect', { x: 212.2, y: 0, width: 2, height: 40 }),
        h('polygon', { points: '186.2,0 188.8,0 214.2,40 211.6,40' })));
  }
  function Mark(p) {
    return h('svg', { viewBox: '0 0 40 40', className: cx('gv-mark', p.className), role: 'img', 'aria-label': 'GRAVN', focusable: 'false' },
      h('path', { d: 'M33.44 6.56 A19 19 0 1 0 39 20 H22', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }));
  }
  function Arrow(p) {
    var d = p.dir === 'right' ? 'M4 12h15M13 6l6 6-6 6' : 'M7 17 17 7M9 7h8v8';
    return h('svg', { viewBox: '0 0 24 24', className: 'gv-arrow', 'aria-hidden': 'true', focusable: 'false', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'square' }, h('path', { d: d }));
  }

  /* ---------- Logo ---------- */
  function Logo(props) {
    var variant = props.variant || 'lockup';
    var size = props.size || 24;
    var inner;
    if (variant === 'mark') inner = h(Mark, null);
    else if (variant === 'wordmark') inner = h(Wordmark, null);
    else inner = h(React.Fragment, null, h(Wordmark, null), h('span', { className: 'gv-logo-descriptor' }, props.descriptor || 'Digital'));
    var Tag = props.href ? 'a' : 'span';
    return h(Tag, { href: props.href, className: cx('gv-logo', 'gv-logo--' + variant, props.className), style: { '--gv-logo-h': size + 'px' }, 'aria-label': props.href ? 'GRAVN Digital – Startseite' : undefined }, inner);
  }

  /* ---------- Button ---------- */
  function Button(props) {
    var variant = props.variant || 'primary';
    var arrow = props.arrow === undefined ? (variant === 'link' ? 'up-right' : 'up-right') : props.arrow;
    var rest = {};
    for (var k in props) if (['variant', 'arrow', 'children', 'className', 'href'].indexOf(k) < 0) rest[k] = props[k];
    rest.className = cx('gv-btn', 'gv-btn--' + variant, props.className);
    var Tag = props.href ? 'a' : 'button';
    if (props.href) rest.href = props.href; else if (!rest.type) rest.type = 'button';
    return h(Tag, rest, h('span', { className: 'gv-btn-label' }, props.children), arrow ? h(Arrow, { dir: arrow === 'right' ? 'right' : 'up-right' }) : null);
  }

  /* ---------- Eyebrow ---------- */
  function Eyebrow(props) {
    return h('p', { className: cx('gv-eyebrow', props.className) },
      props.index ? h(React.Fragment, null, h('span', { className: 'gv-eyebrow-index' }, props.index), h('span', { 'aria-hidden': 'true' }, ' / ')) : null,
      props.children);
  }

  /* ---------- SectionHeading ---------- */
  function SectionHeading(props) {
    var Tag = props.as || 'h2';
    return h('header', { className: cx('gv-section-heading', props.align === 'stacked' && 'is-stacked', props.className) },
      h('div', { className: 'gv-section-heading-main' },
        props.eyebrow ? h(Eyebrow, { index: props.index }, props.eyebrow) : null,
        h(Tag, { className: cx('gv-section-title', props.size === 'display' && 'is-display') }, props.title)),
      props.intro ? h('p', { className: 'gv-section-intro' }, props.intro) : null);
  }

  /* ---------- ServiceCard ---------- */
  function ServiceCard(props) {
    var Title = props.href ? 'a' : 'span';
    return h('article', { className: cx('gv-service', props.className) },
      h('div', { className: cx('gv-service-visual', props.visualTone === 'inverse' && 'is-inverse') }, props.visual || null),
      h('p', { className: 'gv-service-index' }, props.index),
      h('h3', { className: 'gv-service-title' },
        h(Title, { href: props.href, className: 'gv-service-link' }, props.title),
        h(Arrow, null)),
      props.text ? h('p', { className: 'gv-service-text' }, props.text) : null,
      props.tags && props.tags.length ? h('p', { className: 'gv-service-tags' }, props.tags.join(' / ')) : null);
  }

  /* ---------- ProcessStep ---------- */
  function ProcessStep(props) {
    return h('li', { className: cx('gv-step', props.className) },
      h('span', { className: 'gv-step-number' }, props.number),
      h('h3', { className: 'gv-step-title' }, props.title),
      props.text ? h('p', { className: 'gv-step-text' }, props.text) : null);
  }

  /* ---------- SiteHeader ---------- */
  function SiteHeader(props) {
    var st = React.useState(false), open = st[0], setOpen = st[1];
    var links = props.links || [];
    var cta = props.cta;
    return h('header', { className: cx('gv-header', open && 'is-open', props.className) },
      h('div', { className: 'gv-header-bar' },
        h(Logo, { href: props.homeHref || '/', size: 22 }),
        h('nav', { className: 'gv-header-nav', 'aria-label': 'Hauptnavigation' },
          links.map(function (l) { return h('a', { key: l.href, href: l.href, className: 'gv-nav-link', 'aria-current': l.current ? 'page' : undefined }, l.label); })),
        cta ? h(Button, { href: cta.href, className: 'gv-header-cta' }, cta.label) : null,
        h('button', { type: 'button', className: 'gv-header-toggle', 'aria-expanded': open, 'aria-controls': 'gv-menu', onClick: function () { setOpen(!open); } },
          h('span', { className: 'gv-visually-hidden' }, open ? 'Menü schließen' : 'Menü öffnen'),
          h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
            h('path', { d: open ? 'M6 6l12 12M18 6 6 18' : 'M4 9h16M4 15h16' })))),
      h('div', { id: 'gv-menu', className: 'gv-header-menu', hidden: !open },
        links.map(function (l) { return h('a', { key: l.href, href: l.href, className: 'gv-menu-link' }, l.label); }),
        cta ? h(Button, { href: cta.href }, cta.label) : null));
  }

  /* ---------- SiteFooter ---------- */
  function SiteFooter(props) {
    var year = props.year || new Date().getFullYear();
    var legal = props.legal || [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }];
    return h('footer', { className: cx('gv-footer', props.className) },
      h('div', { className: 'gv-footer-mark' }, h(Wordmark, null)),
      h('div', { className: 'gv-footer-row' },
        h('span', null, '© ' + year + ' GRAVN Digital'),
        h('nav', { 'aria-label': 'Rechtliches', className: 'gv-footer-legal' },
          legal.map(function (l) { return h('a', { key: l.href, href: l.href }, l.label); }))));
  }

  var api = { Logo: Logo, Button: Button, Eyebrow: Eyebrow, SectionHeading: SectionHeading, ServiceCard: ServiceCard, ProcessStep: ProcessStep, SiteHeader: SiteHeader, SiteFooter: SiteFooter };
  window.Gravn = Object.assign(window.Gravn || {}, api);
})();
