/* The Striper Recount micro-site runtime.
   Every interactive is a page module: SITE.register({id, short, title, build(api)}). The build script
   makes one standalone HTML per page (body data-mode="single" data-page=id) and the scrolling site
   (data-mode="site": the video, then every page as a full-screen section). The art is the video's own:
   engine/kit.js and engine/characters.js draw into a 1920x1080 stage (1080x1350 on phones), under the
   film's line boil, redrawn on twos (12 drawings a second) while anything moves. */
(function () {
  'use strict';
  var S = window.SITE = {}, K = TBR.kit, C = K.C;
  S.K = K; S.C = C; S.pages = [];
  S.register = function (def) { S.pages.push(def); };
  var NS = 'http://www.w3.org/2000/svg', reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var portQ = null;
  try { portQ = window.matchMedia('(max-aspect-ratio: 1/1), (max-width: 820px)'); } catch (e) {}
  S.isPort = function () { return !!(portQ && portQ.matches); };

  function el(tag, attrs, parent, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  S.el = el;

  /* ---------- formatting ---------- */
  S.m = function (v, d) { return (v >= 100 ? v.toFixed(0) : v.toFixed(d == null ? 1 : d)) + 'M'; };      // millions
  S.pct = function (v, d) { var s = Math.abs(v).toFixed(d || 0); return (v < 0 ? '−' : v > 0 ? '+' : '') + s + '%'; };
  S.lerp = function (a, b, t) { return a + (b - a) * t; };
  S.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- ids: every stage's ids get a suffix so several stages can share a page ---------- */
  function ns(svg, sfx) {
    return svg.replace(/\bid="([^"]+)"/g, 'id="$1-' + sfx + '"')
      .replace(/url\(#([^)]+)\)/g, 'url(#$1-' + sfx + ')')
      .replace(/(xlink:)?href="#([^"]+)"/g, function (m, x, id) { return (x || '') + 'href="#' + id + '-' + sfx + '"'; });
  }

  /* ---------- the stage ---------- */
  var seq = 0;
  S.stage = function (host, draw, label) {
    var sfx = 'st' + (++seq), svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'stage'); svg.setAttribute('role', 'img');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    host.appendChild(svg);
    var st = { svg: svg, port: false, w: 1920, h: 1080, drawing: 0, anim: null };
    st.render = function () {
      st.port = S.isPort(); st.w = st.port ? 1080 : 1920; st.h = st.port ? 1250 : 1080;
      // landscape: fill the stage's own shape with more sky (the floor stays at the bottom)
      // landscape: fill the stage's own shape with more sky (the floor stays at the bottom); the picture
      // gets an explicit height so the readout cards sit right under it
      // a scrolly page on a phone pins a picture box of fixed height (so opening the controls can't shift the
      // text under it); the drawing is sized to what's left of it
      var fit = st.port && host.parentNode && host.parentNode.classList.contains('sc-graphic');
      if ((!st.port || fit) && host.clientWidth > 0) {
        var cs = getComputedStyle(host), padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight), padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        // everything else stacked in the host (readout cards, a scrolly page's bar) takes its share first
        var gap = parseFloat(cs.rowGap) || 0, extra = 0;
        Array.prototype.forEach.call(host.children, function (c) { if (c !== svg && c.offsetParent !== null && getComputedStyle(c).position !== 'absolute') extra += c.offsetHeight + gap; });
        var aw = host.clientWidth - padX, ah = Math.max(60, host.clientHeight - padY - extra);
        if (!st.port) st.h = Math.round(S.clamp(1920 * ah / aw, 1080, 1320));
        var hh = Math.min(ah, aw * st.h / st.w);
        svg.style.height = hh + 'px';
        svg.style.width = hh < aw * st.h / st.w - 1 ? (hh * st.w / st.h) + 'px' : '';
        svg.style.alignSelf = 'center';
      } else { svg.style.height = ''; svg.style.width = ''; }
      svg.setAttribute('viewBox', '0 0 ' + st.w + ' ' + st.h);
      var b = Math.floor(st.drawing / 2) % 4;       // the film's line boil: 4 drawings, each held for two
      var defs = '<defs><filter id="boil" x="-5%" y="-5%" width="110%" height="110%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="' + (b + 3) + '" result="n"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>' +
        // cel shading for props: a hard shade crescent lower left, a highlight upper right (SITE.cel)
        '<filter id="cel" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">' +
        '<feOffset in="SourceAlpha" dx="13" dy="-13" result="up"/><feComposite in="SourceAlpha" in2="up" operator="out" result="ll"/>' +
        '<feFlood flood-color="#C4ACC0" result="sc"/><feComposite in="sc" in2="ll" operator="in" result="sm"/>' +
        '<feBlend in="sm" in2="SourceGraphic" mode="multiply" result="sh"/>' +
        '<feOffset in="SourceAlpha" dx="-8" dy="8" result="dn"/><feComposite in="SourceAlpha" in2="dn" operator="out" result="ur"/>' +
        '<feFlood flood-color="#FFF1C8" flood-opacity="0.4" result="hc"/><feComposite in="hc" in2="ur" operator="in" result="hm"/>' +
        '<feBlend in="hm" in2="sh" mode="screen" result="lit"/><feComposite in="lit" in2="SourceAlpha" operator="in"/></filter>' +
        // paper grain for backgrounds (SITE.grain)
        '<filter id="grainBg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="' + (b + 9) + '" stitchTiles="stitch"/>' +
        '<feColorMatrix values="0 0 0 0 .25  0 0 0 0 .18  0 0 0 0 .1  0 0 0 1.4 -.2"/></filter></defs>';
      var inner = '';
      try { inner = draw(st); } catch (e) { inner = '<text x="40" y="80" font-size="40" fill="#B4412F">' + K.esc(String(e.message)) + '</text>'; if (window.console) console.error(e); }
      svg.innerHTML = ns(defs + '<g filter="url(#boil)">' + inner + '</g>', sfx);
      if (label) svg.setAttribute('aria-label', typeof label === 'function' ? label(st) : label);
    };
    /* redraw on twos for ms (step gets 0..1), so a change reads like the film's held drawings */
    st.animate = function (ms, step, done) {
      if (st.anim) cancelAnimationFrame(st.anim.raf);
      if (reduce || !ms) { if (step) step(1); st.render(); if (done) done(); return; }
      var t0 = performance.now(), last = -1, a = st.anim = { raf: 0 };
      (function tick(now) {
        var p = Math.min(1, (now - t0) / ms), f = Math.floor((now - t0) / (1000 / 12));
        if (f !== last || p >= 1) { last = f; st.drawing++; if (step) step(p); st.render(); }
        if (p < 1 && st.anim === a) a.raf = requestAnimationFrame(tick);
        else if (p >= 1) { st.anim = null; if (done) done(); }
      })(t0);
    };
    /* a scripted moment n drawings long (12 a second): fn(d) sets the state for drawing d, 0..n */
    st.play = function (n, fn, done) {
      var last = -1;
      st.animate(n * 1000 / 12, function (p) { var d = Math.min(n, Math.floor(p * n + 1e-6)); if (d !== last) { last = d; fn(d); } }, done);
    };
    /* pointer position in stage units */
    st.toLocal = function (e) {
      var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
      var p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };
    /* direct manipulation: anything drawn with data-hit="name" can be grabbed. o.start(name, pt, e) returns
       false to refuse; o.move(name, pt); o.end(name, pt). Mark grabbable art with style="touch-action:none"
       (S.grab below does both) so a phone scrolls the page everywhere else. */
    st.drag = function (o) {
      var cur = null;
      svg.addEventListener('pointerdown', function (e) {
        var t = e.target.closest && e.target.closest('[data-hit]'); if (!t) return;
        var name = t.getAttribute('data-hit'), pt = st.toLocal(e);
        if (o.start && o.start(name, pt, e) === false) return;
        cur = name; svg.setPointerCapture(e.pointerId); svg.classList.add('grabbing'); e.preventDefault();
      });
      svg.addEventListener('pointermove', function (e) {
        if (cur) { if (o.move) o.move(cur, st.toLocal(e), e); return; }
        var t = e.target.closest && e.target.closest('[data-hit]'); svg.classList.toggle('can-grab', !!t);
      });
      function up(e) { if (!cur) return; var n = cur; cur = null; svg.classList.remove('grabbing'); if (o.end) o.end(n, st.toLocal(e), e); }
      svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    };
    if (portQ && portQ.addEventListener) portQ.addEventListener('change', function () { st.render(); });
    if (window.ResizeObserver) { var lastW = 0, lastH = 0; new ResizeObserver(function () { var w = host.clientWidth, h = host.clientHeight; if (Math.abs(w - lastW) > 8 || Math.abs(h - lastH) > 8) { lastW = w; lastH = h; st.render(); } }).observe(host); }
    return st;
  };
  S.ease = { out: function (t) { return 1 - Math.pow(1 - t, 3); }, inOut: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    back: function (t) { var c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); } };
  S.reduce = reduce;
  /* wrap art so it can be grabbed: a generous invisible hit area (r) around (x, y) plus the art itself */
  S.grab = function (name, art, x, y, r) {
    return '<g data-hit="' + name + '" style="cursor:grab;touch-action:none">' + (r ? '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="transparent"/>' : '') + art + '</g>';
  };
  /* the film's pop-on: 0 -> overshoot -> 1 across a few drawings */
  S.pop = function (d, len) { len = len || 4; if (d >= len) return 1; var seq = [0.3, 0.8, 1.12, 0.96, 1]; return seq[Math.min(seq.length - 1, Math.floor(d / len * seq.length))]; };

  /* ---------- controls ---------- */
  S.seg = function (host, o) {
    var wrap = el('div', { class: 'ctl' }, host);
    if (o.label) el('div', { class: 'ctl-label', id: o.id ? o.id + '-l' : null }, wrap, '<span>' + o.label + '</span>');
    var box = el('div', { class: 'seg' + (o.small ? ' small' : ''), role: 'group', 'aria-label': o.aria || o.label || '' }, wrap), bs = [];
    var api = { value: o.value };
    o.options.forEach(function (op) {
      var b = el('button', { type: 'button', 'aria-pressed': String(op.v === o.value) }, box, op.t);
      b.addEventListener('click', function () { api.set(op.v, true); });
      bs.push([op.v, b]);
    });
    api.set = function (v, user) { api.value = v; bs.forEach(function (x) { x[1].setAttribute('aria-pressed', String(x[0] === v)); }); if (user && o.onChange) o.onChange(v); };
    return api;
  };
  S.slider = function (host, o) {
    var wrap = el('div', { class: 'ctl' }, host), id = 'r' + (++seq);
    el('label', { class: 'ctl-label', for: id }, wrap, '<span>' + o.label + '</span>');
    var rod = el('div', { class: 'rod' }, wrap);
    var r = el('input', { type: 'range', id: id, min: o.min, max: o.max, step: o.step || 1, value: o.value }, rod);
    rod.insertAdjacentHTML('beforeend', '<div class="blank" aria-hidden="true"><i></i></div><div class="bob" aria-hidden="true"></div><div class="ripple" aria-hidden="true"></div><div class="vtag" aria-hidden="true"></div>');
    var bob = rod.querySelector('.bob'), rip = rod.querySelector('.ripple'), vtag = rod.querySelector('.vtag');
    if (o.ticks) {
      var tk = el('div', { class: 'ticks', 'aria-hidden': 'true' }, wrap);
      o.ticks.forEach(function (t) { var sp = el('span', { class: t.hot ? 'hot' : null }, tk, t.t); sp.style.left = (100 * (t.v - o.min) / (o.max - o.min)) + '%'; });
    }
    var api = { value: +o.value, el: r }, lastV = +o.value, lastT = 0, tiltT = null;
    api.show = function () {
      var p = 100 * (api.value - o.min) / (o.max - o.min), txt = o.fmt ? o.fmt(api.value) : String(api.value);
      rod.style.setProperty('--p', p.toFixed(2) + '%'); vtag.textContent = txt; r.setAttribute('aria-valuetext', txt);
    };
    function tilt(v) {
      if (reduce) return;
      var now = performance.now(), dt = Math.max(16, now - lastT), sp = (v - lastV) / (o.max - o.min) / dt * 1000;
      lastV = v; lastT = now;
      rod.style.setProperty('--tilt', S.clamp(sp * 18, -24, 24).toFixed(1) + 'deg');
      clearTimeout(tiltT); tiltT = setTimeout(function () { rod.style.setProperty('--tilt', '0deg'); }, 140);
    }
    function settle() {
      if (reduce) return;
      bob.classList.remove('dip'); rip.classList.remove('on'); void bob.offsetWidth;
      bob.classList.add('dip'); rip.classList.add('on');
    }
    api.set = function (v, user) { api.value = +v; r.value = v; api.show(); if (user && o.onInput) o.onInput(api.value); };
    r.addEventListener('input', function () { api.value = +r.value; tilt(api.value); api.show(); if (o.onInput) o.onInput(api.value); });
    r.addEventListener('change', function () { settle(); if (o.onChange) o.onChange(api.value); });
    api.show();
    return api;
  };
  /* a number that counts up to its new value over a quarter second; the newest value always wins */
  function countTo(elv, txt) {
    var from = elv.textContent, a = parseFloat(from.replace(/[^0-9.\-−]/g, '').replace('−', '-')), b = parseFloat(String(txt).replace(/[^0-9.\-−]/g, '').replace('−', '-'));
    if (reduce || isNaN(a) || isNaN(b) || a === b || !/\d/.test(from)) { elv._cu = (elv._cu || 0) + 1; elv.textContent = txt; return; }
    var dec = (String(txt).split('.')[1] || '').replace(/\D.*$/, '').length, t0 = performance.now(), tok = elv._cu = (elv._cu || 0) + 1;
    (function step(now) {
      if (elv._cu !== tok) return;                     // a newer value took over this readout
      var p = Math.min(1, (now - t0) / 250), v = a + (b - a) * p;
      elv.textContent = p < 1 ? String(txt).replace(/[−-]?\d[\d,]*\.?\d*/, (v < 0 ? '−' : '') + Math.abs(v).toFixed(dec)) : txt;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  S.countTo = countTo;
  /* a year picker: one column of paired bars per year (e.g. old count beside corrected count), tap or drag
     across it to pick a year, arrow keys too. o: {years, series: [{cls, vals}], max, value (index),
     label(i) -> aria text, onPick(i)}. Returns {set(i), value}. */
  S.yearPicker = function (host, o) {
    var box = el('div', { class: 'ypick', role: 'slider', tabindex: '0', 'aria-label': o.aria || 'Year', 'aria-valuemin': o.years[0], 'aria-valuemax': o.years[o.years.length - 1] }, host);
    var wrap = el('div', { class: 'ywrap' }, box), cols = el('div', { class: 'ycols' }, wrap), cs = [];
    el('span', { class: 'ybob', 'aria-hidden': 'true' }, wrap);
    var axis = el('div', { class: 'yaxis', 'aria-hidden': 'true' }, wrap);
    box.style.setProperty('--n', o.years.length);
    o.years.forEach(function (y, i) {
      var c = el('div', { class: 'ycol' }, cols);
      o.series.forEach(function (s) { var b = el('i', { class: s.cls }, c); b.style.height = (100 * s.vals[i] / o.max).toFixed(1) + '%'; });
      cs.push(c);
      if (y % 5 === 0 || i === o.years.length - 1) { var t = el('span', null, axis, String(y)); t.style.left = (100 * (i + 0.5) / o.years.length) + '%'; }
    });
    var api = { value: o.value };
    api.set = function (i, user) {
      i = S.clamp(Math.round(i), 0, o.years.length - 1);
      cs.forEach(function (c, k) { c.classList.toggle('sel', k === i); });
      box.style.setProperty('--at', (100 * (i + 0.5) / o.years.length).toFixed(2) + '%');
      box.setAttribute('aria-valuenow', o.years[i]); box.setAttribute('aria-valuetext', o.label ? o.label(i) : String(o.years[i]));
      var ch = i !== api.value; api.value = i;
      if (user && ch && o.onPick) o.onPick(i);
    };
    function at(e) { var r = cols.getBoundingClientRect(); return (e.clientX - r.left) / r.width * o.years.length - 0.5; }
    var down = false;
    box.addEventListener('pointerdown', function (e) { down = true; box.setPointerCapture(e.pointerId); box.classList.add('scrub'); api.set(at(e), true); });
    box.addEventListener('pointermove', function (e) { if (down) api.set(at(e), true); });
    function up() { down = false; box.classList.remove('scrub'); }
    box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
    box.addEventListener('keydown', function (e) {
      var k = e.key, n = o.years.length - 1, v = api.value;
      var to = k === 'ArrowLeft' || k === 'ArrowDown' ? v - 1 : k === 'ArrowRight' || k === 'ArrowUp' ? v + 1 : k === 'Home' ? 0 : k === 'End' ? n : k === 'PageUp' ? v + 5 : k === 'PageDown' ? v - 5 : null;
      if (to == null) return; e.preventDefault(); api.set(to, true);
    });
    api.el = box; api.set(o.value);
    return api;
  };
  S.cards = function (host, defs) {
    var box = el('div', { class: 'cards', 'aria-live': 'polite' }, host), m = {};
    defs.forEach(function (d) {
      var w = el('div', { class: 'cardwrap' }, box), c = el('div', { class: 'card' }, w, '<span class="k">' + d.k + '</span><span class="v"></span><span class="d"></span>');
      m[d.id] = c; c._w = w;
    });
    return function (vals) {
      Object.keys(vals).forEach(function (k) {
        var c = m[k], v = vals[k]; if (!c) return;
        var txt = v.v != null ? v.v : v, ve = c.querySelector('.v');
        if (ve.textContent !== String(txt)) { countTo(ve, txt); if (!reduce && ve.textContent) { c.classList.remove('swing'); void c.offsetWidth; c.classList.add('swing'); } }
        c.querySelector('.d').textContent = v.d || '';
        c.classList.toggle('hot', !!v.hot);
        c._w.hidden = !!v.hide;
      });
    };
  };

  /* ---------- the site ---------- */
  function file(p) { return p.id + '.html'; }
  S.boot = function () {
    var mode = document.body.getAttribute('data-mode'), only = document.body.getAttribute('data-page');
    var pages = S.pages, main = document.getElementById('main');
    var bar = document.getElementById('dots'), bobEl = el('span', { class: 'bob', 'aria-hidden': 'true' }, bar);
    var topbar = bar.parentNode, cb = el('button', { class: 'chapbtn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'chaplist' }, topbar);
    var cl = el('div', { class: 'chaplist', id: 'chaplist' }, topbar);
    cb.addEventListener('click', function () { var o = !cl.classList.contains('open'); cl.classList.toggle('open', o); cb.setAttribute('aria-expanded', String(o)); });
    function mark(idx) {
      pages.forEach(function (p, i) { p._dot.setAttribute('aria-current', String(i === idx)); p._li.setAttribute('aria-current', String(i === idx)); });
      if (idx >= 0) { var a = pages[idx]._dot; bobEl.style.transform = 'translateX(' + (a.offsetLeft + 11) + 'px)'; bobEl.style.opacity = 1; } else bobEl.style.opacity = 0;
      cb.innerHTML = idx >= 0 ? (idx + 1) + ' of ' + pages.length + ': ' + pages[idx].short + ' <span aria-hidden="true">▾</span>' : 'The interactives <span aria-hidden="true">▾</span>';
    }
    pages.forEach(function (p, i) {
      var href = mode === 'site' ? '#' + p.id : file(p);
      var a = el('a', { href: href, 'aria-label': (i + 1) + '. ' + p.short }, bar, '<span class="tip">' + (i + 1) + '. ' + p.short + '</span>');
      p._dot = a; p._li = el('a', { href: href }, cl, (i + 1) + '. ' + p.short);
      p._li.addEventListener('click', function () { cl.classList.remove('open'); cb.setAttribute('aria-expanded', 'false'); });
    });
    S._mark = mark;
    pages.forEach(function (p, i) {
      if (mode === 'single' && p.id !== only) return;
      var sec = el('section', { class: 'ch', id: p.id, 'aria-labelledby': p.id + '-h' }, main);
      if (p.scrolly) return scrolly(p, i, sec);
      var stageHost = el('div', { class: 'ch-stage' }, sec);
      var panel = el('div', { class: 'ch-panel' }, sec);
      el('p', { class: 'kicker' }, panel, (i + 1) + ' of ' + pages.length + ' · ' + p.short);
      el('h2', { id: p.id + '-h' }, panel, p.title);
      var api = {
        panel: panel, stageHost: stageHost,
        stage: function (draw, label) { return S.stage(stageHost, draw, label); },
        lede: function (h) { return el('p', { class: 'lede' }, panel, h); },
        take: function (h) { var t = el('p', { class: 'take' }, panel, h); api._take = t; return t; },
        gotIt: function () { var t = api._take; if (!t || t.querySelector('.gotit')) return; var g = el('span', { class: 'gotit', 'aria-hidden': 'true' }, t, 'GOT IT'); requestAnimationFrame(function () { g.classList.add('on'); }); },
        note: function (h) { return el('p', { class: 'note' }, panel, h); },
        pov: function (h) { return el('p', { class: 'pov' }, panel, '<span class="povtxt">' + h + '</span>'); },
        more: function (sum, h) { var d = el('details', { class: 'more' }, panel); el('summary', null, d, sum); el('div', null, d, h); return d; },
        seg: function (o) { return S.seg(panel, o); }, slider: function (o) { return S.slider(panel, o); },
        cards: function (d) { return S.cards(stageHost, d); }, box: function (cls) { return el('div', { class: cls || '' }, panel); }
      };
      try { p.build(api); } catch (e) { el('p', { class: 'note' }, panel, 'This interactive hit an error: ' + K.esc(e.message)); if (window.console) console.error(e); }
      navrow(panel, i);
      p._sec = sec;
    });
    function navrow(host, i) {
      var nav = el('div', { class: 'navrow' }, host), nx = pages[i + 1];
      if (nx) el('a', { class: 'btn', href: mode === 'site' ? '#' + nx.id : file(nx) }, nav, 'Next: ' + nx.short + ' <span class="fishy" aria-hidden="true"></span>');
      else el('a', { class: 'btn', href: mode === 'site' ? '#top' : 'index.html' }, nav, 'Watch the song again <span aria-hidden="true">↑</span>');
      if (mode === 'single' && i > 0) el('a', { class: 'btn ghost', href: file(pages[i - 1]) }, nav, '<span aria-hidden="true">←</span> ' + pages[i - 1].short);
      return nav;
    }
    /* a scrolly page (NYT style): one page scroll. The picture is pinned while short step cards scroll past
       it, each one setting the picture's state; the last step turns on the page's own controls, which sit
       in the bar under the picture, so hands and eyes stay on the picture. On phones the picture pins to
       the top and the cards scroll up under it.
       api.step(html) adds a step card; api.onStep(fn(i, prev)) hears the step change (the closing block,
       api.panel, counts as the last step); api.bar is the strip under the picture; api.playing(on). */
    function scrolly(p, i, sec) {
      sec.classList.add('sc');
      var head = el('header', { class: 'sc-head' }, sec);
      el('p', { class: 'kicker' }, head, (i + 1) + ' of ' + pages.length + ' · ' + p.short);
      el('h2', { id: p.id + '-h' }, head, p.title);
      var graphic = el('div', { class: 'sc-graphic' }, sec), stageHost = el('div', { class: 'ch-stage' }, graphic);
      var text = el('div', { class: 'sc-text' }, sec), end = el('div', { class: 'sc-end' }, text);
      var bar = el('div', { class: 'sc-bar' }, stageHost), steps = [], cbs = [], cur = -1, stages = [];
      var api = {
        panel: end, stageHost: stageHost, bar: bar,
        stage: function (draw, label) { var st = S.stage(stageHost, draw, label); stageHost.insertBefore(st.svg, bar); stages.push(st); return st; },
        step: function (h, cls) { var s = el('div', { class: 'step' + (cls ? ' ' + cls : '') }, null, h); text.insertBefore(s, end); steps.push(s); return s; },
        onStep: function (fn) { cbs.push(fn); },
        // the controls take their room under the picture, so the picture is redrawn to the space left
        playing: function (on) { if (sec.classList.contains('playing') === !!on) return; sec.classList.toggle('playing', !!on); stages.forEach(function (st) { st.render(); }); },
        current: function () { return cur; },
        take: function (h) { var t = el('p', { class: 'take' }, end, h); api._take = t; return t; },
        gotIt: function () { var t = api._take; if (!t || t.querySelector('.gotit')) return; var g = el('span', { class: 'gotit', 'aria-hidden': 'true' }, t, 'GOT IT'); requestAnimationFrame(function () { g.classList.add('on'); }); },
        note: function (h) { return el('p', { class: 'note' }, end, h); },
        pov: function (h) { return el('p', { class: 'pov' }, end, '<span class="povtxt">' + h + '</span>'); },
        more: function (sum, h) { var d = el('details', { class: 'more' }, end); el('summary', null, d, sum); el('div', null, d, h); return d; },
        seg: function (o) { return S.seg(bar, o); }, box: function (cls, host) { return el('div', { class: cls || '' }, host || bar); }
      };
      try { p.build(api); } catch (e) { el('p', { class: 'note' }, end, 'This interactive hit an error: ' + K.esc(e.message)); if (window.console) console.error(e); }
      api.nav = navrow(end, i);
      p._sec = sec;
      var all = steps.concat([end]);
      // the trigger line: 60% down a laptop screen; on a phone, a little under halfway down the space left under the pinned picture
      function line() {
        if (!S.isPort()) return innerHeight * 0.6;
        var gb = S.clamp(graphic.getBoundingClientRect().bottom, 0, innerHeight);
        return gb + (innerHeight - gb) * 0.42;
      }
      function track() {
        var r = sec.getBoundingClientRect(); if (r.bottom < -40 || r.top > innerHeight + 40) return;
        var L = line(), idx = 0;
        all.forEach(function (s, k) { if (s.getBoundingClientRect().top < L) idx = k; });
        if (idx === cur) return;
        var prev = cur; cur = idx;
        all.forEach(function (s, k) { s.classList.toggle('on', k === idx); s.classList.toggle('past', k < idx); });
        cbs.forEach(function (f) { try { f(idx, prev); } catch (e) { if (window.console) console.error(e); } });
      }
      var queued = false;
      function later() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; track(); }); }
      window.addEventListener('scroll', later, { passive: true }); window.addEventListener('resize', later);
      setTimeout(track, 0);
      // a step card can be clicked to scroll it to the trigger line
      all.forEach(function (s) {
        if (s === end) return;
        s.addEventListener('click', function (e) {
          if (e.target.closest('a,button,summary,input,textarea')) return;
          var y = s.getBoundingClientRect().top + scrollY - line() + 8;
          window.scrollTo({ top: y, behavior: S.reduce ? 'auto' : 'smooth' });
        });
      });
    }
    // the bobber sits on the current chapter (site mode: the section crossing the middle of the screen)
    if (mode === 'single') mark(pages.map(function (p) { return p.id; }).indexOf(only));
    else {
      // on every scroll, whichever section holds the middle of the screen (the hero counts as none); worked out
      // from where things are, so a fast scroll back or a jump from the chapter line can't leave it behind
      var cur = null, q = false;
      function here() {
        var mid = innerHeight * 0.5, idx = -1;
        pages.forEach(function (p, i) { if (!p._sec) return; var r = p._sec.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) idx = i; });
        if (idx !== cur) { cur = idx; mark(idx); }
      }
      window.addEventListener('scroll', function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; here(); }); }, { passive: true });
      mark(-1); setTimeout(here, 0);
    }
    window.addEventListener('resize', function () { var cur = -1; pages.forEach(function (p, i) { if (p._dot.getAttribute('aria-current') === 'true') cur = i; }); if (cur >= 0) mark(cur); });
    // web fonts: redraw every stage once the faces arrive, so lettering measures right
    var fs = document.fonts;
    if (fs && fs.load) Promise.all(['40px "Lilita One"', '40px Shrikhand', '40px "Patrick Hand"', 'bold 40px "Courier Prime"'].map(function (f) { return fs.load(f).catch(function () {}); }))
      .then(function () { document.dispatchEvent(new Event('site:fonts')); });
  };
})();
