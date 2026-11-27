/* Procedural energy ribbons. SVG stays decorative; native scrolling and controls keep their input. */
(() => {
  'use strict';
  const root = document.querySelector('.integration-flow');
  const original = root?.querySelector('.energy-wave');
  if (!original) return;
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width:700px)');
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * t * (t * (t * 6 - 15) + 10);
  const palette = [[0, [0, 74, 135]], [.17, [49, 132, 189]], [.48, [98, 84, 217]], [.75, [124, 55, 221]], [1, [124, 55, 221]]];
  function colorAt(t) {
    const upper = palette.findIndex(stop => stop[0] >= t);
    const a = palette[Math.max(0, upper - 1)], b = palette[Math.max(0, upper)];
    const weight = a === b ? 0 : (t - a[0]) / (b[0] - a[0]);
    return 'rgb(' + a[1].map((channel, i) => Math.round(mix(channel, b[1][i], weight))).join(',') + ')';
  }
  function hash(x, y) {
    let n = Math.imul(x ^ 0x45d9f3b, 374761393) ^ Math.imul(y, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }
  // Smooth value noise provides drifting, non-periodic shapes without a sine-wave loop.
  function noise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y), u = smooth(x - ix), v = smooth(y - iy);
    return mix(mix(hash(ix, iy), hash(ix + 1, iy), u), mix(hash(ix, iy + 1), hash(ix + 1, iy + 1), u), v) * 2 - 1;
  }
  function element(tag, attributes = {}) {
    const node = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  }
  function spring(state, key, target, dt, stiffness = 90, damping = 14) {
    const velocity = key + 'Velocity';
    state[velocity] += ((target - state[key]) * stiffness - state[velocity] * damping) * dt;
    state[key] += state[velocity] * dt;
  }
  function curve(points) {
    if (points.length < 2) return '';
    const pair = p => p[0].toFixed(2) + ' ' + p[1].toFixed(2);
    let path = 'M' + pair(points[0]);
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], d = points[Math.min(points.length - 1, i + 2)];
      path += 'C' + pair([b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6]) + ' ' +
        pair([c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6]) + ' ' + pair(c);
    }
    return path;
  }
  const surfaces = [];
  let frame = 0, measureFrame = 0, lastTime = 0, time = 0, previousScroll = scrollY;
  let scrollStrength = 0, lastScrollTime = 0, randomSeed = 4107;
  const random = () => {
    randomSeed = (Math.imul(randomSeed, 1664525) + 1013904223) >>> 0;
    return randomSeed / 4294967296;
  };
  function addSurface(svg, host, primary, converge = false) {
    const id = 'energy-field-' + surfaces.length;
    const defs = element('defs');
    const gradient = element('linearGradient', {id: id + '-ink', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 1000, y2: 0});
    [[0, '#004a87', .04], [.17, '#3184bd', .78], [.48, '#6254d9', 1], [.75, '#7c37dd', .9], [1, '#7c37dd', .08]].forEach(([offset, color, opacity]) => {
      gradient.append(element('stop', {offset, 'stop-color': color, 'stop-opacity': opacity}));
    });
    const blur = element('filter', {id: id + '-soft', filterUnits: 'userSpaceOnUse', x: -12, y: -12});
    blur.append(element('feGaussianBlur', {stdDeviation: 2.2}));
    defs.append(gradient, blur);
    const layer = element('g', {'aria-hidden': 'true'});
    const path = kind => {
      const p = element('path', {class: 'energy-flow-line ' + kind, stroke: 'url(#' + id + '-ink)'});
      layer.append(p);
      return p;
    };
    const halo = path('energy-flow-halo');
    halo.setAttribute('filter', 'url(#' + id + '-soft)');
    const strands = Array.from({length: 5}, () => path('energy-flow-strand'));
    const main = path('energy-flow-main');
    const local = path('energy-flow-local');
    local.setAttribute('filter', 'url(#' + id + '-soft)');
    const pulseGradients = [];
    const pulsePaths = Array.from({length: 6}, (_, i) => {
      const gradient = element('linearGradient', {id: id + '-pulse-' + i, gradientUnits: 'userSpaceOnUse'});
      const stops = [0, .65, 1].map(offset => element('stop', {offset, 'stop-color': '#7c37dd', 'stop-opacity': offset === .65 ? 1 : 0}));
      gradient.append(...stops); defs.append(gradient);
      pulseGradients.push({gradient, stops});
      const pulse = path('energy-flow-pulse');
      pulse.setAttribute('stroke', 'url(#' + id + '-pulse-' + i + ')');
      return pulse;
    });
    svg.replaceChildren(defs, layer);
    const surface = {svg, host, primary, converge, gradient, blur, halo, strands, main, local, pulsePaths, pulseGradients,
      active: false, vertical: false, length: 1000, width: 1000, height: 84, left: 0, top: 0, points: [], pulses: [],
      nextPulse: 1 + random() * 2, lastInteraction: -1, lastScrollPulse: -1, lastFocus: 0,
      pointer: {position: .5, targetPosition: .5, normal: 0, normalVelocity: 0, targetNormal: 0,
        strength: 0, strengthVelocity: 0, targetStrength: 0, speed: 0, lastX: null, lastY: null, lastInput: 0}};
    surfaces.push(surface);
    return surface;
  }
  addSurface(original, root, true);
  // Reprise the same energy in the existing white margins, ending together before the contact section.
  for (const [selector, converge] of [['#territori', false], ['#gruppo', true]]) {
    const host = document.querySelector(selector);
    if (!host) continue;
    const svg = element('svg', {class: 'energy-wave energy-continuation', 'aria-hidden': 'true', focusable: 'false', preserveAspectRatio: 'none'});
    host.classList.add('energy-continuation-host');
    host.append(svg);
    addSurface(svg, host, false, converge);
  }
  function measure() {
    measureFrame = 0;
    for (const s of surfaces) {
      s.vertical = s.primary && narrow.matches;
      s.width = s.vertical ? 40 : s.svg.clientWidth;
      const steps = s.host.querySelectorAll('.integration-step');
      const last = steps[steps.length - 1];
      s.height = s.vertical ? Math.max(80, last.offsetTop + last.offsetHeight + 8) : s.primary ? 84 : 40;
      s.length = s.vertical ? s.height : s.width;
      s.svg.style.height = s.height + 'px';
      s.svg.setAttribute('viewBox', '0 0 ' + s.width + ' ' + s.height);
      s.gradient.setAttribute('x2', s.vertical ? 0 : s.width);
      s.gradient.setAttribute('y2', s.vertical ? s.height : 0);
      s.blur.setAttribute('width', s.width + 24);
      s.blur.setAttribute('height', s.height + 24);
      const rect = s.svg.getBoundingClientRect();
      s.left = rect.left;
      s.top = rect.top + scrollY;
      s.pointer.targetStrength = 0;
      paint(s, 0);
    }
    schedule();
  }
  function scheduleMeasure() { if (!measureFrame) measureFrame = requestAnimationFrame(measure); }
  function point(s, t, strand, focus) {
    const p = s.pointer;
    const envelope = smooth(clamp(t * 6)) * smooth(clamp((1 - t) * 6));
    const scale = s.vertical ? .40 : s.primary ? 1 : .47;
    const base = noise(t * 3.4 + 13, time * .13 + 8) * 15 + noise(t * 6.8 + 21, time * .19 + 31) * 5;
    const seed = strand * 13.71;
    let spread = strand ? noise(t * 4.7 + seed, time * (.11 + strand * .013) + seed) * 26 : 0;
    if (s.converge) spread *= 1 - smooth(clamp((t - .48) / .44));
    const distance = (t - p.position) * s.length;
    const field = Math.exp(-.5 * (distance / (100 + p.speed * .025)) ** 2) * clamp(p.strength, 0, 1.15);
    const attraction = p.normal * .68 + noise(t * 11 + seed, time * .7 + seed) * (strand ? 4.5 : 1.5) * scale;
    const limit = s.vertical ? 12 : s.primary ? 26 : 13;
    const offset = limit * Math.tanh(envelope * ((base + spread) * scale * (1 + focus * .12) + attraction * field) / limit);
    return s.vertical ? [20 + offset, t * s.length] : [t * s.length, (s.primary ? 36 : 20) + offset];
  }
  function emit(s, origin, kind) {
    if (reduced.matches) return;
    const capacity = kind === 'ambient' ? 4 : 6;
    for (const direction of kind === 'ambient' ? [1] : [-1, 1]) {
      if (s.pulses.length >= capacity) break;
      s.pulses.push({position: origin, direction, strand: Math.floor(random() * 6), speed: (115 + random() * 70) / s.length,
        life: 0, kind});
    }
  }
  function paint(s, dt) {
    const focus = clamp(1 - Math.abs(s.top - scrollY - innerHeight * .6) / (innerHeight * .7));
    const boost = scrollStrength * focus;
    const count = s.vertical ? 42 : Math.min(64, Math.max(32, Math.ceil(s.length / 24)));
    const paths = [];
    for (let strand = 0; strand < 6; strand++) {
      const points = Array.from({length: count + 1}, (_, i) => point(s, i / count, strand, boost));
      paths.push(points);
      const d = curve(points);
      (strand ? s.strands[strand - 1] : s.main).setAttribute('d', d);
      if (!strand) s.halo.setAttribute('d', d);
    }
    s.main.style.strokeWidth = (1.18 + noise(19, time * .21) * .10 + boost * .23).toFixed(2);
    s.halo.style.opacity = (.13 + boost * .12).toFixed(3);
    s.strands.forEach((path, i) => {path.style.opacity = (.18 + (noise(i * 8, time * .16) + 1) * .06 + boost * .08).toFixed(3);});
    // Local light blooms along the curve instead of producing sparks or following the whole pointer.
    if (s.pointer.strength > .015 && !reduced.matches) {
      const from = Math.max(0, Math.floor(s.pointer.position * count) - 4), to = Math.min(count, from + 9);
      s.local.setAttribute('d', curve(paths[0].slice(from, to + 1)));
      s.local.style.opacity = (clamp(s.pointer.strength) * .30).toFixed(3);
    } else s.local.style.opacity = '0';
    s.pulses = s.pulses.filter(pulse => {
      pulse.position += pulse.speed * pulse.direction * dt * (1 + boost * .55);
      pulse.life += dt;
      return pulse.position > -.08 && pulse.position < 1.08 && pulse.life < 12;
    });
    s.pulsePaths.forEach((path, i) => {
      const pulse = s.pulses[i];
      if (!pulse || reduced.matches) {path.style.opacity = '0'; return;}
      const head = clamp(pulse.position), tail = clamp(head - pulse.direction * .055);
      const points = Array.from({length: 6}, (_, n) => point(s, mix(tail, head, n / 5), pulse.strand, boost));
      path.setAttribute('d', curve(points));
      const light = s.pulseGradients[i], start = points[0], end = points[points.length - 1];
      light.gradient.setAttribute('x1', start[0]); light.gradient.setAttribute('y1', start[1]);
      light.gradient.setAttribute('x2', end[0]); light.gradient.setAttribute('y2', end[1]);
      light.stops.forEach((stop, n) => stop.setAttribute('stop-color', colorAt(mix(tail, head, [0, .65, 1][n]))));
      const edge = smooth(clamp(head * 9)) * smooth(clamp((1 - head) * 9));
      path.style.opacity = (edge * Math.min(1, pulse.life * 3) * (pulse.kind === 'ambient' ? .48 : .78)).toFixed(3);
    });
    s.points = paths[0];
    if (!reduced.matches && focus > .88 && s.lastFocus <= .88 && scrollStrength > .03) emit(s, .5, 'scroll');
    s.lastFocus = focus;
  }
  function tick(stamp) {
    frame = 0;
    if (document.hidden || reduced.matches) {lastTime = 0; return;}
    const dt = lastTime ? Math.min((stamp - lastTime) / 1000, .032) : 1 / 60;
    lastTime = stamp;
    time += dt;
    scrollStrength *= Math.exp(-dt * 2.5);
    for (const s of surfaces) {
      if (!s.active) continue;
      const p = s.pointer;
      p.position += (p.targetPosition - p.position) * (1 - Math.exp(-dt * 13));
      spring(p, 'normal', p.targetNormal, dt);
      spring(p, 'strength', p.targetStrength, dt);
      p.speed *= Math.exp(-dt * 3);
      if (time > s.nextPulse) {emit(s, .005, 'ambient'); s.nextPulse = time + 1.8 + random() * 3.1;}
      if (p.strength > .28 && time - s.lastInteraction > .85) {emit(s, p.position, 'pointer'); s.lastInteraction = time;}
      if (scrollStrength > .13 && time - s.lastScrollPulse > .9) {emit(s, clamp(.18 + s.lastFocus * .60), 'scroll'); s.lastScrollPulse = time;}
      paint(s, dt);
    }
    schedule();
  }
  function schedule() {
    if (!frame && !document.hidden && !reduced.matches && surfaces.some(s => s.active)) frame = requestAnimationFrame(tick);
  }
  function release() {for (const s of surfaces) {s.pointer.targetStrength = 0; s.pointer.lastX = null;}}
  function input(event) {
    if (reduced.matches || (event.pointerType === 'touch' && event.buttons === 0)) return;
    const stamp = performance.now();
    for (const s of surfaces) {
      if (!s.active) continue;
      const p = s.pointer, rect = s.svg.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      const along = s.vertical ? y : x, normal = s.vertical ? x - 20 : y - (s.primary ? 36 : 20);
      const outside = Math.max(-along, along - s.length, 0), distance = Math.hypot(normal, outside);
      const speed = p.lastX === null ? 0 : Math.hypot(event.clientX - p.lastX, event.clientY - p.lastY) / Math.max(.008, (stamp - p.lastInput) / 1000);
      p.speed = mix(p.speed, Math.min(speed, 1600), .25);
      p.lastX = event.clientX; p.lastY = event.clientY; p.lastInput = stamp;
      p.targetPosition = clamp(along / s.length);
      p.targetNormal = clamp(normal, s.vertical ? -10 : -19, s.vertical ? 10 : 19);
      p.targetStrength = smooth(clamp(1 - distance / (event.pointerType === 'touch' ? 115 : 105))) * (.72 + clamp(p.speed / 900) * .28);
    }
    schedule();
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastTime = 0;
    release();
    for (const s of surfaces) {
      s.pointer.strength = 0; s.pointer.strengthVelocity = 0;
      s.pointer.normal = 0; s.pointer.normalVelocity = 0;
      s.pulses = [];
      if (reduced.matches) paint(s, 0);
    }
    schedule();
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const s = surfaces.find(item => item.svg === entry.target);
      s.active = entry.isIntersecting;
      if (s.active) {const rect = s.svg.getBoundingClientRect(); s.top = rect.top + scrollY;}
      else {s.pointer.targetStrength = 0; s.pointer.strength = 0; s.pulses = [];}
    }
    if (!surfaces.some(s => s.active)) {cancelAnimationFrame(frame); frame = 0; lastTime = 0;}
    schedule();
  });
  surfaces.forEach(s => observer.observe(s.svg));
  const resize = new ResizeObserver(scheduleMeasure);
  surfaces.forEach(s => resize.observe(s.host));
  window.addEventListener('pointermove', input, {passive: true});
  window.addEventListener('pointerdown', input, {passive: true});
  window.addEventListener('pointerup', event => {if (event.pointerType !== 'mouse') release();}, {passive: true});
  window.addEventListener('pointercancel', release, {passive: true});
  window.addEventListener('pointerout', event => {if (!event.relatedTarget) release();}, {passive: true});
  window.addEventListener('blur', release);
  window.addEventListener('scroll', () => {
    const delta = Math.abs(scrollY - previousScroll), now = performance.now();
    const velocity = delta / clamp(now - lastScrollTime, 16, 100);
    previousScroll = scrollY; lastScrollTime = now;
    scrollStrength = Math.min(1, scrollStrength + Math.min(delta / innerHeight, velocity * .09));
    release(); schedule();
  }, {passive: true});
  window.addEventListener('resize', scheduleMeasure, {passive: true});
  window.addEventListener('pageshow', scheduleMeasure);
  root.addEventListener('transitionend', scheduleMeasure);
  narrow.addEventListener('change', scheduleMeasure);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  document.fonts?.ready.then(scheduleMeasure);
  measure();
})();
