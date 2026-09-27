/* The film's sets, redrawn for the site's stages (1920 x 1080, or 1080 x 1350 on phones).
   SITE.set.dock(st, o)  the midday dock (s08, s09): sky, sun, clouds, sea band, planks
   SITE.set.room(st, o)  the calendar room (s05, s06): cream wall, wainscot, lamp
   SITE.set.beach(st, o) the ledger beach (s07): sky, sea, sand
   Each returns { svg, hz, floor } so a page can stand things on the floor line. */
(function () {
  'use strict';
  var S = window.SITE, K = S.K, C = S.C, INK = C.ink;
  function N(v) { return (+v).toFixed(1); }
  function path(d, fill, sw, extra, stroke) {
    return '<path d="' + d + '" fill="' + (fill || 'none') + '" stroke="' + (stroke || INK) + '" stroke-width="' + (sw == null ? 7 : sw) +
      '" stroke-linejoin="round" stroke-linecap="round"' + (extra || '') + '/>';
  }
  S.path = path; S.N = N;
  /* ---------- the site's rendering rules (Director, micro-site review 1) ----------
     One warm key light from the upper right. Every fill has one flat shade and one flat highlight
     (shade = multiply by #C4ACC0, highlight = a 40% screen of #FFF1C8); characters, lettering and data
     marks stay flat. Skies are three hard painted bands; water runs skyDeep, sea, seaDeep with cream
     sparkles in the sun's column; planks carry grain, knots and a lit top edge. */
  S.SH = { cream: '#BC9B94', paper: '#B49282', mustard: '#AC6F1D', orange: '#A74320', avocado: '#6A682C', olive: '#484820', sky: '#6184A3',
    skyDeep: '#3C6A8D', sea: '#245478', seaDeep: '#183A57', brick: '#8A2C23', brown: '#5E3520', tan: '#9A694B', sand: '#B28C6B', pink: '#B2625D',
    white: '#C1A6B0', silver: '#9A8E9C', gray: '#6C5958' };
  S.HI = { cream: '#F8EFD7', paper: '#F2E7C6', mustard: '#ECC76A', orange: '#E89F6E', avocado: '#B9C078', olive: '#9EA36D', sky: '#B2DAE4',
    skyDeep: '#95C2D0', sea: '#82AEBE', seaDeep: '#79969F', brick: '#D28970', brown: '#AF916D', tan: '#DFC194', sand: '#F1E1B1', pink: '#F1BBA5',
    white: '#FDF9F1', silver: '#DFE4DE', gray: '#BAB2A0' };
  S.HALF = { white: '#DECECD', cream: '#D8C1AC', paper: '#CFB597' };
  var SKY = ['#6BB5CF', '#7EC4D8', '#B2DAE4'];

  /* contact shadow under anything standing on the ground: flat, 0.9 x its footprint, offset left */
  S.shadow = function (x, y, fw, ground) {
    var w = 0.9 * fw;
    return '<ellipse cx="' + N(x - 0.04 * fw) + '" cy="' + N(y) + '" rx="' + N(w / 2) + '" ry="' + N(w * 0.08) + '" fill="' + (S.SH[ground || 'tan'] || ground) + '" opacity=".55"/>';
  };
  /* a tall prop's long shadow, skewed down-left */
  S.longShadow = function (x, y, w, h, ground) {
    var dx = -Math.tan(25 * Math.PI / 180) * h * 0.35;
    return '<path d="M' + N(x - w / 2) + ',' + N(y) + ' L' + N(x + w / 2) + ',' + N(y) + ' L' + N(x + w / 2 + dx) + ',' + N(y + h * 0.18) + ' L' + N(x - w / 2 + dx) + ',' + N(y + h * 0.18) + ' Z" fill="' + (S.SH[ground || 'tan'] || ground) + '" opacity=".35"/>';
  };
  /* cel-shade a prop: a hard shade crescent on its lower-left silhouette, a highlight on its upper right */
  S.cel = function (svg) { return '<g filter="url(#cel)">' + svg + '</g>'; };
  /* the page grain, on backgrounds only */
  S.grain = function (W, H, op) { return '<rect width="' + W + '" height="' + H + '" filter="url(#grainBg)" opacity="' + (op || 0.07) + '" style="mix-blend-mode:multiply"/>'; };

  var cloudD = 'M-120,30 q-40,0 -30,-34 q6,-30 44,-26 q12,-44 62,-40 q40,2 52,36 q30,-26 64,-4 q30,20 12,52 q30,10 18,32 Z', cloudN = 0;
  function cloud(x, y, k) {
    var id = 'cl' + (++cloudN % 1000), tr = 'translate(' + N(x) + ' ' + N(y) + ') scale(' + k + ')';
    return '<clipPath id="' + id + '"><rect x="-200" y="6" width="400" height="80" transform="' + tr + '"/></clipPath>' +
      '<path transform="' + tr + '" d="' + cloudD + '" fill="' + C.white + '"/>' +
      '<path transform="' + tr + '" d="' + cloudD + '" fill="' + S.HALF.white + '" clip-path="url(#' + id + ')"/>' +
      '<path transform="' + tr + '" d="' + cloudD + '" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
  }
  S.cloud = cloud;
  /* three hard painted bands of sky down to the horizon, with a gentle hand-painted edge */
  function sky(W, top, bottom) {
    var h = bottom - top, y1 = top + h * 0.42, y2 = top + h * 0.78, s = '';
    s += '<rect x="-20" y="' + (top - 20) + '" width="' + (W + 40) + '" height="' + N(h + 40) + '" fill="' + SKY[0] + '"/>';
    s += '<path d="M-20,' + N(y1) + ' Q' + N(W * 0.3) + ',' + N(y1 - 10) + ' ' + N(W * 0.55) + ',' + N(y1) + ' T' + (W + 20) + ',' + N(y1 - 4) + ' V' + N(bottom + 20) + ' H-20 Z" fill="' + SKY[1] + '"/>';
    s += '<path d="M-20,' + N(y2) + ' Q' + N(W * 0.25) + ',' + N(y2 + 8) + ' ' + N(W * 0.5) + ',' + N(y2) + ' T' + (W + 20) + ',' + N(y2 + 6) + ' V' + N(bottom + 20) + ' H-20 Z" fill="' + SKY[2] + '"/>';
    return s;
  }
  function sun(x, y, r) {
    return '<circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + (r + 30) + '" fill="' + S.HI.mustard + '" opacity=".45"/>' +
      '<circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + r + '" fill="' + C.mustard + '" stroke="' + INK + '" stroke-width="7"/>' +
      '<path d="M' + N(x + r * 0.25) + ',' + N(y - r * 0.62) + ' q' + N(r * 0.3) + ',' + N(r * 0.1) + ' ' + N(r * 0.42) + ',' + N(r * 0.4) + '" fill="none" stroke="' + S.HI.mustard + '" stroke-width="9" stroke-linecap="round"/>';
  }
  /* water between y0 and y1: skyDeep strip, sea, a seaDeep bottom band, wave ticks and sparkles in the sun's column */
  function water(st, W, y0, y1, sunX) {
    var h = y1 - y0, s = '', strip = Math.min(30, h * 0.2);
    s += '<rect x="-20" y="' + y0 + '" width="' + (W + 40) + '" height="' + N(h + 10) + '" fill="' + C.sea + '"/>';
    s += '<rect x="-20" y="' + y0 + '" width="' + (W + 40) + '" height="' + N(strip) + '" fill="' + C.skyDeep + '"/>';
    s += '<rect x="-20" y="' + N(y1 - h * 0.35) + '" width="' + (W + 40) + '" height="' + N(h * 0.35 + 10) + '" fill="' + C.seaDeep + '"/>';
    s += path('M-20,' + y0 + ' H' + (W + 20) + ' M-20,' + N(y0 + strip) + ' H' + (W + 20), 'none', 5);
    var d = '', dl = '';
    for (var x = 90; x < W; x += 260) { var yy = y0 + strip + (h - strip) * (0.28 + ((x / 260) % 3) * 0.16); d += 'M' + x + ',' + N(yy) + ' q24,-8 48,0 '; dl += 'M' + (x + 120) + ',' + N(yy + h * 0.14) + ' q20,-7 40,0 '; }
    s += path(d, 'none', 4) + path(dl, 'none', 4, '', S.HI.sea);
    var ph = (st.drawing >> 1) % 2, sp = '';
    for (var i = 0; i < 10; i++) {
      var sx = sunX + (TBR.hash(i * 3.7 + ph * 11) - 0.5) * 260, sy = y0 + strip + 6 + TBR.hash(i * 5.1 + ph * 7) * (h - strip - 12), L = 10 + TBR.hash(i + ph) * 16;
      sp += 'M' + N(sx) + ',' + N(sy) + ' h' + N(L) + ' ';
    }
    s += path(sp, 'none', 4, '', C.cream);
    return s;
  }
  /* plank floor from y0 down: seams widening toward us, lit top edges, grain and knots */
  function planks(W, y0, H, base) {
    var s = '', ys = [], y = y0, gap = 48;
    while (y < H) { y += gap; ys.push(y); gap *= 1.28; }
    var prev = y0, seams = '', lit = '', grain = '', knots = '', joins = '';
    ys.forEach(function (v, i) {
      seams += 'M-20,' + N(v) + ' H' + (W + 20) + ' ';
      lit += 'M-20,' + N(prev + 4) + ' H' + (W + 20) + ' ';
      var ph = v - prev;
      for (var k = 0; k < 3; k++) {
        var xx = (i * 373 + k * 640) % W; joins += 'M' + N(xx) + ',' + N(prev) + ' v' + N(ph) + ' ';
        var gx = (i * 211 + k * 523 + 90) % W, gy = prev + ph * (0.35 + 0.3 * TBR.hash(i * 3 + k));
        grain += 'M' + N(gx) + ',' + N(gy) + ' q' + N(ph * 0.9) + ',' + N(-ph * 0.12) + ' ' + N(ph * 2.2) + ',0 ';
      }
      if (i % 2 === 0) { var kx = (i * 577 + 300) % W; knots += '<ellipse cx="' + N(kx) + '" cy="' + N(prev + ph * 0.5) + '" rx="' + N(ph * 0.22) + '" ry="' + N(ph * 0.12) + '" fill="' + S.SH[base] + '" stroke="' + S.SH.brown + '" stroke-width="3"/>'; }
      prev = v;
    });
    s += path(lit, 'none', 3, '', S.HI[base]) + path(grain, 'none', 3, '', S.SH[base]) + knots;
    s += path(seams, 'none', 4, '', C.brown) + path(joins, 'none', 4, '', C.brown);
    return s;
  }
  S.set = {};

  S.set.dock = function (st, o) {
    o = o || {};
    var W = st.w, H = st.h, s = '';
    var HZ = o.hz || Math.round(H * (st.port ? 0.40 : 0.48)), DOCK = o.dock || Math.round(HZ + H * (st.port ? 0.075 : 0.085)), sunX = W - 180;
    s += sky(W, 0, HZ);
    if (o.sun !== false) s += sun(sunX, 110, 60);
    if (o.clouds !== false) s += cloud(W * 0.11, HZ * 0.6, 1.0) + cloud(W * 0.72, HZ * 0.42, 0.78);
    s += water(st, W, HZ, DOCK + 4, sunX);
    s += '<rect x="-20" y="' + DOCK + '" width="' + (W + 40) + '" height="' + (H - DOCK + 20) + '" fill="' + C.tan + '"/>';
    s += '<rect x="-20" y="' + (DOCK + 16) + '" width="' + (W + 40) + '" height="22" fill="' + S.SH.tan + '" opacity=".6"/>';
    s += '<rect x="-20" y="' + DOCK + '" width="' + (W + 40) + '" height="16" fill="' + C.brown + '"/>';
    s += path('M-20,' + (DOCK + 3) + ' H' + (W + 20), 'none', 3, '', S.HI.brown);
    s += path('M-20,' + DOCK + ' H' + (W + 20) + ' M-20,' + (DOCK + 16) + ' H' + (W + 20), 'none', 6);
    s += planks(W, DOCK + 16, H, 'tan');
    s += S.grain(W, H);
    return { svg: s, hz: HZ, floor: DOCK, ground: 'tan' };
  };

  S.set.room = function (st, o) {
    o = o || {};
    var W = st.w, H = st.h, s = '', FL = Math.round(H * (st.port ? 0.80 : 0.78)), lx = W - 170;
    s += '<rect width="' + W + '" height="' + H + '" fill="' + C.cream + '"/>';
    // the lamp's pool of light on the wall
    if (o.lamp !== false) s += '<path d="M' + (lx - 70) + ',128 L' + (lx + 70) + ',128 L' + (lx + 330) + ',' + N(FL) + ' L' + (lx - 330) + ',' + N(FL) + ' Z" fill="' + S.HI.mustard + '" opacity=".30"/>';
    // wallpaper dots and a picture rail
    var d = '';
    for (var y = 60; y < FL - 40; y += 90) for (var x = (y / 90 % 2) * 60 + 40; x < W; x += 120) d += 'M' + x + ',' + y + ' l0,0 ';
    s += path(d, 'none', 10, ' opacity=".2"', C.tan);
    s += '<rect x="-20" y="' + (FL - 64) + '" width="' + (W + 40) + '" height="64" fill="' + S.HALF.cream + '"/>' + path('M-20,' + (FL - 64) + ' H' + (W + 20), 'none', 4, '', C.brown);
    s += '<rect x="-20" y="' + FL + '" width="' + (W + 40) + '" height="' + (H - FL + 20) + '" fill="' + C.tan + '"/>';
    s += '<rect x="-20" y="' + FL + '" width="' + (W + 40) + '" height="26" fill="' + S.SH.tan + '" opacity=".7"/>';
    s += path('M-20,' + FL + ' H' + (W + 20), 'none', 7);
    s += planks(W, FL + 26, H, 'tan');
    if (o.lamp !== false) {
      s += path('M' + lx + ',-10 L' + lx + ',70', 'none', 5);
      s += path('M' + (lx - 70) + ',128 Q' + (lx - 66) + ',70 ' + lx + ',66 Q' + (lx + 66) + ',70 ' + (lx + 70) + ',128 Z', C.mustard, 7);
      s += path('M' + (lx - 58) + ',120 Q' + (lx - 52) + ',84 ' + (lx - 10) + ',74', 'none', 8, '', S.SH.mustard);
      s += '<ellipse cx="' + lx + '" cy="130" rx="44" ry="10" fill="' + C.white + '" stroke="' + INK + '" stroke-width="5"/>';
      s += path('M' + (lx - 30) + ',150 l-14,26 M' + lx + ',156 l0,30 M' + (lx + 30) + ',150 l14,26', 'none', 5);
    }
    s += S.grain(W, H);
    return { svg: s, floor: FL, ground: 'tan' };
  };

  S.set.beach = function (st, o) {
    o = o || {};
    var W = st.w, H = st.h, s = '', sunX = W * 0.5;
    var HZ = Math.round(H * (st.port ? 0.36 : 0.44)), SAND = Math.round(HZ + H * 0.13);
    s += sky(W, 0, HZ);
    if (o.sun) s += sun(sunX, 120, 56);
    if (o.clouds !== false) s += cloud(W * 0.18, HZ * 0.45, 0.9) + cloud(W * 0.8, HZ * 0.3, 0.7);
    s += water(st, W, HZ, SAND + 10, o.sun ? sunX : W * 0.62);
    var shore = 'M-20,' + SAND + ' Q' + N(W * 0.25) + ',' + (SAND - 18) + ' ' + N(W * 0.5) + ',' + SAND + ' T' + (W + 20) + ',' + SAND + ' V' + (H + 20) + ' H-20 Z';
    s += path(shore, C.sand, 0);
    s += '<path d="' + shore + '" fill="' + S.SH.sand + '" opacity=".55" transform="translate(0 0)" clip-path="url(#wetsand)"/>';
    s += '<clipPath id="wetsand"><rect x="-20" y="' + (SAND - 30) + '" width="' + (W + 40) + '" height="46"/></clipPath>';
    s += path(shore, 'none', 6);
    var sp = '', hs = '';
    for (var i = 0; i < 70; i++) { var x = TBR.hash(i * 1.7) * W, y = SAND + 40 + TBR.hash(i * 2.3) * (H - SAND - 40); sp += 'M' + N(x) + ',' + N(y) + ' l0,0 '; }
    for (var j = 0; j < 6; j++) { var hx = TBR.hash(j * 9.1) * W, hy = SAND + 70 + TBR.hash(j * 4.4) * (H - SAND - 120); hs += 'M' + N(hx) + ',' + N(hy) + ' q60,-14 120,0 '; }
    s += path(sp, 'none', 7, '', S.SH.sand) + path(hs, 'none', 5, '', S.HI.sand);
    s += S.grain(W, H);
    return { svg: s, hz: HZ, floor: SAND, ground: 'sand' };
  };

  /* A speech balloon with a tail pointing at the speaker's mouth (tx, ty); anchored at its centre (x, y). */
  S.say = function (str, x, y, w, tx, ty, o) {
    o = o || {};
    var fs = o.size || 42, lines = K.wrap(str, Math.floor(w / (fs * 0.48))), h = lines.length * fs * 1.18 + 36, s = '';
    var bx = x - w / 2, by = y - h / 2, ex = S.clamp(tx, bx + 50, bx + w - 50), ey = ty < y ? by : by + h;
    var bw = Math.min(70, w * 0.2), dir = ty < y ? -1 : 1;
    s += '<path d="M' + N(ex - bw / 2) + ',' + N(ey) + ' L' + N(tx) + ',' + N(ty) + ' L' + N(ex + bw / 2) + ',' + N(ey) + ' Z" fill="' + C.white + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
    s += '<rect x="' + N(bx) + '" y="' + N(by) + '" width="' + w + '" height="' + N(h) + '" rx="40" fill="' + C.white + '" stroke="' + INK + '" stroke-width="6"/>';
    s += '<path d="M' + N(ex - bw / 2 + 5) + ',' + N(ey) + ' L' + N(ex + bw / 2 - 5) + ',' + N(ey) + '" stroke="' + C.white + '" stroke-width="10"/>';
    lines.forEach(function (ln, i) { s += K.text(ln, x, by + 18 + fs + i * fs * 1.18, { size: fs, font: o.font || 'hand', fill: o.fill || INK }); });
    return s;
  };

  /* A hanging tag on a string, the film's label device: lines = [text, ...], band = header colour. */
  S.tag = function (o) {
    var w = o.w || 360, h = o.h || 110, s = '';
    s += '<rect x="' + N(-w / 2) + '" y="' + N(-h / 2) + '" width="' + w + '" height="' + h + '" rx="14" fill="' + (o.fill || C.cream) + '" stroke="' + INK + '" stroke-width="7"/>';
    if (o.band) s += '<rect x="' + N(-w / 2 + 3.5) + '" y="' + N(-h / 2 + 3.5) + '" width="' + (w - 7) + '" height="18" fill="' + o.band + '"/>' + path('M' + N(-w / 2) + ',' + N(-h / 2 + 22) + ' H' + N(w / 2), 'none', 5);
    // each line takes its own height, so a big number under small words never collides
    var ls = o.lines.map(function (ln) { return typeof ln === 'string' ? { t: ln } : ln; });
    var hs = ls.map(function (t) { return (t.size || o.size || 40) * 1.12; }), tot = hs.reduce(function (a, b) { return a + b; }, 0);
    var y = (o.band ? 12 : 0) - tot / 2;
    ls.forEach(function (t, i) {
      var sz = t.size || o.size || 40;
      s += K.text(t.t, 0, y + hs[i] * 0.5 + sz * 0.34, { size: sz, font: 'label', fill: t.fill || INK });
      y += hs[i];
    });
    return '<g transform="translate(' + N(o.x) + ' ' + N(o.y) + ') rotate(' + (o.rot || 0) + ')">' + s + '</g>';
  };
})();
