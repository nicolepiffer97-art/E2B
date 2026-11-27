/* Visual enhancement only: app.js continues to own selection, tabs, content and keyboard events. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const keys = ['solar', 'wind', 'bess', 'bio', 'hydrogen', 'digital'];
  const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const translated = (p, origin) => [p[0] + origin[0], p[1] + origin[1]];
  const diamond = (rx, ry) => [[0, -ry], [rx, 0], [0, ry], [-rx, 0]];
  const outline = points => points.map((p, i) => (i ? 'L' : 'M') + p.join(' ')).join(' ') + 'Z';
  const line = points => points.map((p, i) => (i ? 'L' : 'M') + p.join(' ')).join(' ');
  function geometry(compact) {
    const center = compact ? [280, 243] : [410, 267.5];
    const dx = compact ? 190 : 255, dy = dx / 2;
    const positions = {
      solar: [center[0] - dx, center[1] - dy], wind: [center[0], center[1] - dy], bess: [center[0] + dx, center[1] - dy],
      bio: [center[0] - dx, center[1] + dy], hydrogen: [center[0], center[1] + dy], digital: [center[0] + dx, center[1] + dy]
    };
    const base = diamond(compact ? 64 : 82, compact ? 32 : 41);
    const hub = diamond(compact ? 54 : 64, compact ? 27 : 32);
    const sideIndex = {ne: 0, se: 1, sw: 2, nw: 3};
    const port = (vertices, origin, side) => {
      const i = sideIndex[side];
      return translated(midpoint(vertices[i], vertices[(i + 1) % 4]), origin);
    };
    const outer = (key, side) => port(base, positions[key], side);
    const inner = side => port(hub, center, side);
    // Each technology has one direct route to the hub, anchored at exact side midpoints.
    const routes = {
      solar: [[outer('solar', 'se'), inner('nw')]],
      wind: [[outer('wind', 'se'), inner('ne')]],
      bess: [[outer('bess', 'sw'), inner('ne')]],
      bio: [[outer('bio', 'ne'), inner('sw')]],
      hydrogen: [[outer('hydrogen', 'ne'), inner('se')]],
      digital: [[outer('digital', 'nw'), inner('se')]]
    };
    return {compact, center, positions, base, hub, routes, width: compact ? 560 : 820, height: compact ? 460 : 520,
      labelY: (compact ? 32 : 41) + 28, thickness: compact ? 14 : 18};
  }
  function element(tag, attributes = {}) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }
  let svg;
  const assetBoxes = {solar: [146, 142, -121], wind: [132, 150, -143], bess: [148, 130, -111],
    bio: [134, 140, -119], hydrogen: [140, 80, -69], digital: [142, 142, -123]};
  function layout(compact) {
    svg ||= document.querySelector('.ecosystem');
    if (!svg) return;
    const g = geometry(compact);
    svg.setAttribute('viewBox', `0 0 ${g.width} ${g.height}`);
    svg.querySelector('.map-grid').setAttribute('width', g.width);
    svg.querySelector('.map-grid').setAttribute('height', g.height);
    const hub = svg.querySelector('.central-node');
    hub.setAttribute('transform', `translate(${g.center.join(' ')})`);
    const [n, e, s, w] = g.hub, down = p => [p[0], p[1] + g.thickness];
    hub.querySelector('.hub-surface').setAttribute('d', outline(g.hub));
    hub.querySelector('.hub-left').setAttribute('d', outline([w, s, down(s), down(w)]));
    hub.querySelector('.hub-right').setAttribute('d', outline([s, e, down(e), down(s)]));
    hub.querySelector('.hub-outline').setAttribute('d', outline(g.hub));
    svg.querySelectorAll('[data-node]').forEach(node => {
      const key = node.dataset.node;
      node.setAttribute('transform', `translate(${g.positions[key].join(' ')})`);
      node.querySelector('.node-base').setAttribute('d', outline(g.base));
      node.querySelector('.node-shadow').setAttribute('rx', compact ? 42 : 54);
      node.querySelector('.node-shadow').setAttribute('ry', compact ? 12 : 15);
      node.querySelector('.node-label').setAttribute('y', g.labelY);
      const hit = node.querySelector('.node-hit');
      const scale = compact ? .82 : 1, [width, height, y] = assetBoxes[key], image = node.querySelector('.node-asset');
      const assetY = y * scale + (compact && key === 'hydrogen' ? 7 : 0), hitY = assetY - 3;
      hit.setAttribute('x', compact ? -87 : -105); hit.setAttribute('y', hitY);
      hit.setAttribute('width', compact ? 174 : 210); hit.setAttribute('height', g.labelY + 13 - hitY);
      image.setAttribute('x', -width * scale / 2); image.setAttribute('width', width * scale);
      image.setAttribute('height', height * scale); image.setAttribute('y', assetY);
    });
    svg.querySelectorAll('[data-route]').forEach(route => route.setAttribute('d', g.routes[route.dataset.route].map(line).join(' ')));
  }
  // Exposed geometry is also used for deterministic midpoint and symmetry checks.
  window.E2BEcosystem = {geometry, layout};
  svg = document.querySelector('.ecosystem');
  if (!svg) return;
  svg.classList.add('ecosystem-3d');
  const defs = svg.querySelector('defs');
  const surface = element('linearGradient', {id: 'hub-surface-3d', x1: 0, y1: 0, x2: 0, y2: 1});
  [[0, '#a56ded'], [.48, '#7c37dd'], [1, '#51209b']].forEach(([offset, color]) => surface.append(element('stop', {offset, 'stop-color': color})));
  const side = element('linearGradient', {id: 'hub-side-3d', x1: 0, y1: 0, x2: 1, y2: 0});
  [[0, '#381368'], [.55, '#6c2fbc'], [1, '#8b46d5']].forEach(([offset, color]) => side.append(element('stop', {offset, 'stop-color': color})));
  defs.append(surface, side);
  const grid = defs.querySelector('#mapgrid');
  grid.setAttribute('width', 44); grid.setAttribute('height', 44);
  const gridLine = grid.querySelector('path');
  gridLine.setAttribute('d', 'M44 0H0V44'); gridLine.setAttribute('stroke', '#2b618c'); gridLine.setAttribute('opacity', '.20');
  const network = svg.querySelector('.network-lines');
  const flows = element('g', {class: 'energy-flows', 'aria-hidden': 'true', fill: 'none'});
  keys.forEach(key => flows.append(element('path', {'data-route': key})));
  network.after(flows);
  const hub = svg.querySelector('.central-node');
  const label = hub.querySelector('.central-label');
  hub.replaceChildren(element('path', {class: 'hub-left', fill: 'url(#hub-side-3d)'}),
    element('path', {class: 'hub-right', fill: '#542394'}),
    element('path', {class: 'hub-surface', fill: 'url(#hub-surface-3d)'}),
    element('path', {class: 'hub-outline', fill: 'none'}), label);
  label.setAttribute('y', 9);
  svg.querySelectorAll('[data-node]').forEach(node => {
    const old = node.querySelector('.node-illustration');
    const shadow = element('ellipse', {class: 'node-shadow', cx: 0, cy: 10});
    node.querySelector('.node-base').before(shadow);
    const image = element('image', {class: 'node-asset', href: `assets/ecosystem-3d/${node.dataset.node}.webp`,
      preserveAspectRatio: 'xMidYMax meet', 'aria-hidden': 'true', decoding: 'async'});
    old.replaceWith(image);
  });
  const observer = new IntersectionObserver(entries => svg.classList.toggle('ecosystem-in-view', entries[0].isIntersecting));
  observer.observe(svg);
})();
