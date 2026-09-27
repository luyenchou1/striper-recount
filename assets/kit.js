/* Tackle Box Rock! kit: shared helpers for scenes.
   Characters and props live in engine/characters.js (TBR.kit.striper, TBR.kit.kid, ...).
   All helpers return SVG strings in the 1920x1080 space. */
(function () {
  'use strict';
  var TBR = window.TBR = window.TBR || {};
  var K = TBR.kit = TBR.kit || {};
  // Ask for the label face now, so pages that only wait on document.fonts.ready (the model
  // sheet) still get it; the engine's loader requests every face again before frame one.
  try { if (document.fonts && document.fonts.load) document.fonts.load('40px "Lilita One"').catch(function () {}); } catch (e) {}

  /* 70s cel palette. Scenes should draw only from these. */
  K.C = {
    ink: '#1E1510', cream: '#F4E6C4', paper: '#EAD8AC', mustard: '#E0A526', orange: '#D9642B',
    avocado: '#8A9A3B', olive: '#5E6B2A', sky: '#7EC4D8', skyDeep: '#4E9DBB', sea: '#2F7CA0', seaDeep: '#1F5673',
    brick: '#B4412F', brown: '#7A4E2A', tan: '#C99B63', sand: '#E7CF8E', pink: '#E8927C', white: '#FBF6EA',
    silver: '#C9D3CF', stripe: '#2B2B2B', magenta: '#B0135A', gray: '#8C8475'
  };
  K.INK_W = 7; // standard outline weight at 1080p

  K.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  K.lerp = function (a, b, t) { return a + (b - a) * t; };
  K.prog = function (t, t0, dur) { return K.clamp((t - t0) / dur, 0, 1); };
  K.ease = {
    linear: function (t) { return t; },
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    back: function (t) { var c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    bounce: function (t) { var n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; }
  };
  /* Pop-on scale with overshoot: 0 before t0, overshoots, settles at 1. */
  K.pop = function (t, t0, dur) { var p = K.prog(t, t0, dur || 0.35); return p <= 0 ? 0 : K.ease.back(p); };
  /* Beat bounce: 0..1 pulse on each beat (104 BPM by default). */
  K.beat = function (T, bpm) { var tl = TBR.timeline || {}; var b = (T * (bpm || tl.song_bpm || tl.bpm || 104) / 60) % 1; return Math.pow(1 - b, 3); };
  /* Stepped hold: pick one of n held poses that changes every `every` seconds. */
  K.hold = function (T, every, n, seed) { return Math.floor(TBR.hash(Math.floor(T / every) + (seed || 0)) * n); };
  K.blink = function (T, seed) { var c = (T + (seed || 0) * 1.37) % 3.2; return c > 3.0; };

  K.g = function (inner, tr) { return '<g' + (tr ? ' transform="' + tr + '"' : '') + '>' + inner + '</g>'; };
  K.at = function (x, y, s, rot, inner) {
    return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' + (rot ? ' rotate(' + rot.toFixed(2) + ')' : '') + (s !== 1 && s != null ? ' scale(' + s.toFixed(3) + ')' : '') + '">' + inner + '</g>';
  };
  K.esc = function (s) { return TBR.esc(s); };

  /* Hand-lettered text. font: 'title' | 'label' | 'hand'. */
  K.FONTS = { title: "'Shrikhand', 'Cooper Black', Georgia, serif", label: "'Lilita One', 'Chewy', 'Chalkboard SE', sans-serif", hand: "'Patrick Hand', 'Chalkboard SE', sans-serif", cc: "'Courier Prime', 'Courier New', monospace" };
  /* Size factors per face. Lilita One runs wider than Chewy, the label face it replaced, so
     label lettering is drawn at 0.86 of the asked-for size and keeps Chewy's widths: every
     tag, sign and card fitted to Chewy still fits. Sizes passed to the kit stay in Chewy
     units; K.fs(font, size) gives the size actually drawn (K.fs('label', 40) is 34.4, other
     faces return size unchanged, font defaults to 'label' like K.text). Code that writes its
     own <text> in K.FONTS.label must pass its font-size through K.fs. */
  K.FONT_SCALE = { label: 0.86 };
  K.fs = function (font, size) {
    var k = K.FONT_SCALE[font || 'label'];
    return k ? Math.round(size * k * 100) / 100 : size;
  };
  K.text = function (str, x, y, o) {
    o = o || {};
    var key = o.font || 'label', fs = K.fs(key, o.size || 64), fill = o.fill || K.C.ink, anchor = o.anchor || 'middle', font = K.FONTS[key];
    var sw = o.strokeW ? K.fs(key, o.strokeW) : fs * 0.12;
    var stroke = o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + sw + '" paint-order="stroke" stroke-linejoin="round"' : '';
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" font-family="' + font + '" font-size="' + fs + '" fill="' + fill + '"' + stroke +
      (o.rot ? ' transform="rotate(' + o.rot + ' ' + x + ' ' + y + ')"' : '') + (o.spacing ? ' letter-spacing="' + o.spacing + '"' : '') + '>' + K.esc(str) + '</text>';
  };
  /* Label tag with a little string, like a museum tag on an object. size is in Chewy units
     like K.text's; the tag width is sized from it and K.text scales the lettering. */
  K.tag = function (str, x, y, o) {
    o = o || {}; var fs = o.size || 40, w = str.length * fs * 0.55 + 40, h = fs * 1.5;
    return '<g transform="translate(' + x + ' ' + y + ')' + (o.rot ? ' rotate(' + o.rot + ')' : '') + '">' +
      '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="10" fill="' + (o.fill || K.C.cream) + '" stroke="' + K.C.ink + '" stroke-width="5"/>' +
      K.text(str, 0, fs * 0.35, { size: fs, fill: o.color || K.C.ink, font: o.font || 'label' }) + '</g>';
  };
  /* 70s starburst behind titles. */
  K.starburst = function (x, y, r1, r2, n, fill, rot) {
    var pts = [], i;
    for (i = 0; i < n * 2; i++) { var a = (i / (n * 2)) * Math.PI * 2 + (rot || 0), r = i % 2 ? r2 : r1; pts.push((x + Math.cos(a) * r).toFixed(1) + ',' + (y + Math.sin(a) * r).toFixed(1)); }
    return '<polygon points="' + pts.join(' ') + '" fill="' + fill + '" stroke="' + K.C.ink + '" stroke-width="' + K.INK_W + '" stroke-linejoin="round"/>';
  };
  /* Circular iris wipe: p=0 fully open, p=1 closed on (cx,cy).
     o (optional): r0 = the start radius (default 1300), or 'corner' for just past the
     farthest frame corner from (cx, cy), so the ring starts off frame wherever it closes;
     r = an explicit radius (overrides p, for a scene that holds the ring on a face);
     rim = width of an ink ring drawn on the edge (default none). */
  K.irisCorner = function (cx, cy) {
    return Math.max(Math.hypot(cx + 50, cy + 50), Math.hypot(1970 - cx, cy + 50), Math.hypot(cx + 50, 1130 - cy), Math.hypot(1970 - cx, 1130 - cy));
  };
  K.iris = function (p, cx, cy, o) {
    o = o || {};
    var R = function (v) { return Math.round(v * 10) / 10; };
    var r0 = o.r0 === 'corner' ? K.irisCorner(cx, cy) + (o.rim || 0) : (o.r0 || 1300);
    var r = R(o.r != null ? Math.max(0, o.r) : K.lerp(r0, 0, K.clamp(p, 0, 1)));
    cx = R(cx); cy = R(cy);
    var s = '<path fill="' + K.C.ink + '" fill-rule="evenodd" d="M-50,-50 H1970 V1130 H-50 Z M' + R(cx + r) + ',' + cy + ' a' + r + ',' + r + ' 0 1,0 ' + R(-2 * r) + ',0 a' + r + ',' + r + ' 0 1,0 ' + R(2 * r) + ',0 Z"/>';
    if (o.rim && r > 0) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + K.C.ink + '" stroke-width="' + o.rim + '"/>';
    return s;
  };
  /* The SOMEDAY wish (s14 bar 75.5, carried over the cut into s15): the thought bubble with
     about twenty plain stripers swimming together and SOMEDAY lettered in brick under them,
     so the word is the last thing to leave frame when the bubble lifts away. One drawing
     shared by both scenes so it matches across the cut (same fish seed, same swim).
     o: x, y (bubble centre), scale, rot; stage 1 | 2 | 3 (dot, puff, full bubble; default 3);
     tail [dx, dy] toward his head; T global seconds (bobs the fish on the beat); word 0..1
     scale of the lettering (for its pop-on; default 1). 700 x 320 at scale 1.
     Uses K.thought and K.swimSchool from characters.js (called at render time). */
  K.somedayBubble = function (o) {
    o = o || {};
    var st = o.stage == null ? 3 : o.stage, ws = o.word == null ? 1 : o.word;
    var inner = st >= 3 ? K.swimSchool({ n: 20, x: 0, y: -26, w: 470, h: 190, size: 0.5, seed: 3, T: o.T }) : '';
    var s = K.thought({ w: 700, h: 320, stage: st, tail: o.tail || [0, 1], inner: inner });
    if (st >= 3 && ws > 0) s += K.at(0, 112, ws, -2, K.text('SOMEDAY', 0, 0, { size: 64, font: 'hand', fill: K.C.brick, spacing: 4 }));
    return K.at(o.x || 0, o.y || 0, o.scale == null ? 1 : o.scale, o.rot || 0, s);
  };
  /* Rays/sunburst background, 70s style. */
  K.rays = function (cx, cy, n, c1, c2, rot) {
    var s = '<rect width="1920" height="1080" fill="' + c1 + '"/>', i;
    for (i = 0; i < n; i++) {
      var a0 = (i / n) * Math.PI * 2 + (rot || 0), a1 = a0 + Math.PI / n;
      s += '<path d="M' + cx + ',' + cy + ' L' + (cx + Math.cos(a0) * 2400).toFixed(0) + ',' + (cy + Math.sin(a0) * 2400).toFixed(0) + ' L' + (cx + Math.cos(a1) * 2400).toFixed(0) + ',' + (cy + Math.sin(a1) * 2400).toFixed(0) + ' Z" fill="' + c2 + '"/>';
    }
    return s;
  };
  /* Simple wavy water band. */
  K.waves = function (y, amp, len, fill, phase, h) {
    var d = 'M' + (-len * 2 + ((phase || 0) % len)) + ',' + y, x;
    for (x = -len * 2; x < 1920 + len * 2; x += len) d += ' q' + (len / 2) + ',' + (-amp) + ' ' + len + ',0';
    return '<path d="' + d + ' V' + (y + (h || 1200)) + ' H-400 Z" fill="' + fill + '" stroke="' + K.C.ink + '" stroke-width="' + (K.INK_W - 2) + '"/>';
  };
  /* Speech-balloon style caption card for spoken asides (optional in scenes). */
  K.balloon = function (str, x, y, w, o) {
    o = o || {}; var fs = o.size || 44, lines = K.wrap(str, Math.floor(w / (fs * 0.5))), h = lines.length * fs * 1.2 + 40;
    var s = '<rect x="' + (x - w / 2) + '" y="' + (y - h) + '" width="' + w + '" height="' + h + '" rx="36" fill="' + K.C.white + '" stroke="' + K.C.ink + '" stroke-width="6"/>';
    lines.forEach(function (ln, i) { s += K.text(ln, x, y - h + 20 + fs + i * fs * 1.2, { size: fs, font: 'hand' }); });
    return s;
  };
  K.wrap = function (str, n) {
    var words = String(str).split(' '), rows = [], row = '';
    words.forEach(function (w) { if ((row + ' ' + w).length > n && row) { rows.push(row); row = w; } else row = row ? row + ' ' + w : w; });
    if (row) rows.push(row); return rows;
  };
})();
