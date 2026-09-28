/* 7. What happens next: the fish ladder (the film's s13 and s14, 2:50 to 3:08). The last page.
   A scrolly page, like the others (Luyen's reviews, Sep 26): each pool of the ladder is a step, and the
   Striper leaps up one pool per step, on an arc, with a splash. No spotlight: the leaps cross the picture.
     pool 1  the corrected numbers: the CORRECTED COUNT can, released August 2026 (the one check)
     pool 2  the benchmark: the Commission's pot on the bank; the can, the jar and the box drop in
     pool 3  peer review: three magnifiers lean in over the pot and blink one after another
     pool 4  the Board: the empty Board table on the near bank, gavel resting
     pool 5  new rules: the '?' sign, NOBODY KNOWS THE OUTCOME YET. Big Mama glides past upriver, Kit
             waves, the Striper turns, says his line and tips his hat.
   The reader's turn: four flip cards to tell your fishing buddies, with a Copy button (and any pool can be
   tapped to send the Striper there). Only step 1 carries a check: the others haven't happened yet. */
SITE.register({
  id: 'next', short: 'What happens next', title: 'What happens next', scrolly: true,
  build: function (api) {
    var S = SITE, K = S.K, C = S.C, INK = C.ink, N = S.N, path = S.path, hash = TBR.hash;
    var POOL = [
      { b: 'Corrected numbers', l: ['CORRECTED', 'NUMBERS'], t: '<b>Done.</b> In <b>late August 2026</b> NOAA released corrected recreational catch and effort going back to the early 1980s.' },
      { b: 'Benchmark assessment', l: ['BENCHMARK', 'ASSESSMENT'], t: '<b>Happening now.</b> Scientists rebuild the stock assessment with three new ingredients: the corrected catch, the new release-mortality estimate, and possibly a new math model (called WHAM).' },
      { b: 'Peer review', l: ['PEER', 'REVIEW'], t: 'Independent scientists check the new assessment before managers can use it.' },
      { b: 'The Board', l: ['STRIPED BASS', 'BOARD'], t: 'The Atlantic States Marine Fisheries Commission’s Striped Bass Management Board sets new targets and limits from the reviewed assessment.' },
      { b: 'New rules', l: ['NEW', 'RULES'], t: 'Seasons, size limits, bag limits and commercial quotas follow from the Board’s decisions.' }
    ];
    // the benchmark's three ingredients, in the order they go into the pot
    var ING = [
      { kind: 'can', name: 'the corrected catch', lines: ['CORRECTED', 'CATCH'], band: C.sea },
      { kind: 'jar', name: 'the new release-mortality estimate', lines: ['NEW RELEASE', 'DEATH RATE'], band: C.sky },
      { kind: 'box', name: 'maybe a new math model (called WHAM)', lines: ['MAYBE A NEW', 'MODEL (WHAM)'], band: C.tan }
    ];
    // the four answers live in site/src/answers.js, shared with the home page's short version
    var TELL = window.RC_ANSWERS || [];
    var HOP = 10;                     // drawings in the air for one pool
    var NEVER = -1e6;
    var st8 = {
      at: 0, target: 0, seen: [true, false, false, false, false], rev: [NEVER, NEVER, NEVER, NEVER, NEVER],
      hop: null, queue: [], landT: NEVER, cheerT: NEVER, topT: null, got: false,
      pot: 0, plopT: [NEVER, NEVER, NEVER], fullT: NEVER, drag: null, dragged: false, tried: false, checkT: 0, turn: false, autoPot: false,
      bye: false, byeT: NEVER
    };
    function lerp(a, b, t) { return a + (b - a) * t; }
    function rect(x, y, w, h, rx, fill, sw, extra) {
      return '<rect x="' + N(x) + '" y="' + N(y) + '" width="' + N(w) + '" height="' + N(h) + '" rx="' + (rx || 0) + '" fill="' + fill + '"' +
        (sw ? ' stroke="' + INK + '" stroke-width="' + sw + '" stroke-linejoin="round"' : '') + (extra || '') + '/>';
    }
    function blink(D, seed) { return ((D + seed * 17) % 46) < 2; }
    function tagW(lines, size) { var n = 0; lines.forEach(function (l) { n = Math.max(n, (typeof l === 'string' ? l : l.t).length); }); return Math.round(n * size * 0.86 * 0.57 + 48); }
    /* a tag hanging on a string from a pin at (ax, ay), the film's label device */
    function hang(ax, ay, o) {
      return path('M' + N(ax) + ',' + N(ay) + ' L' + N(o.x) + ',' + N(o.y - (o.h || 110) / 2 + 6), 'none', 4) +
        '<circle cx="' + N(ax) + '" cy="' + N(ay) + '" r="7" fill="' + C.cream + '" stroke="' + INK + '" stroke-width="4"/>' + tagShadow(o) + S.tag(o);
    }
    function tagShadow(o) { return '<g transform="translate(' + N(o.x + 6) + ' ' + N(o.y + 8) + ') rotate(' + (o.rot || 0) + ')">' + rect(-o.w / 2, -o.h / 2, o.w, o.h, 14, INK, 0, ' opacity=".15"') + '</g>'; }

    /* ---------------- geometry: one layout per orientation ---------------- */
    function lay(st) {
      var port = st.port, dy = st.h - (port ? 1250 : 1080), L;
      if (port) L = { port: true, W: st.w, H: st.h, BY: st.h - 58, x0: 280, sw: 150, sh: 146, SS: 0.55, KS: 0.55, KX: 104, pOff: 20, bw: 320, bh: 138, fs: 44, nfs: 62, clear: 284, cw: 104, ch: 100,
        potX: 162, potS: 0.58, pileX: 410, ingS: 0.4, boxS: 0.42, revS: 0.4, tabS: 0.46, mamaS: 0.3, hopH: 200, tfs: 44 };
      else L = { port: false, W: st.w, H: st.h, BY: st.h - 50, x0: 440, sw: 268, sh: 108 + dy * 0.2, SS: 0.75, KS: 0.75, KX: 136, pOff: 24, bw: 280, bh: 118, fs: 36, nfs: 56, clear: 300, cw: 100, ch: 92,
        potX: 312, potS: 0.84, pileX: 70, ingS: 0.4, boxS: 0.42, revS: 0.62, tabS: 0.62, mamaS: 0.45, hopH: 260, tfs: 38 };
      L.px = function (i) { return L.x0 + i * L.sw; };
      L.top = function (i) { return L.BY - (i + 1) * L.sh - 40; };
      L.wat = function (i) { return L.BY - (i + 1) * L.sh - 14; };
      L.post = function (i) { return L.px(i) + L.pOff; };
      L.sx = function (i) { return L.px(i) + L.sw * (L.port ? 0.5 : 0.54); };
      L.board = function (i) { var b = L.wat(i) - L.clear; return { x0: L.post(i) - L.bw + 40, x1: L.post(i) + 40, y0: b - L.bh, y1: b }; };
      L.KY = L.BY - (port ? 46 : 52);
      L.LRY = L.BY - (port ? 50 : 62);
      // the Commission's bank: a plateau above sign 1 and left of sign 2
      var b1 = L.board(0), b2 = L.board(1);
      L.PT = Math.round((port ? Math.min(b1.y0, b2.y0) : b1.y0) - 16);
      L.PX1 = port ? 560 : b2.x0 - 8;
      L.tabX = port ? 850 : 1300;
      L.qX = port ? 890 : 1722;
      return L;
    }

    /* ---------------- the set: sky, dam, river, banks ---------------- */
    function sun(x, y, r) {
      return '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 30) + '" fill="' + S.HI.mustard + '" opacity=".45"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + C.mustard + '" stroke="' + INK + '" stroke-width="7"/>' +
        path('M' + N(x + r * 0.25) + ',' + N(y - r * 0.62) + ' q' + N(r * 0.3) + ',' + N(r * 0.1) + ' ' + N(r * 0.42) + ',' + N(r * 0.4), 'none', 9, '', S.HI.mustard);
    }
    function backdrop(st, L, D) {
      var W = L.W, s = S.set.dock(st, { hz: L.H + 10, dock: L.H + 60, sun: !L.port, clouds: false }).svg;
      if (L.port) s += sun(1004, 88, 46);
      var hz = L.wat(3) - 10, far = 'M-30,' + N(hz + 30) + ' Q' + N(W * 0.18) + ',' + N(hz - 40) + ' ' + N(W * 0.4) + ',' + N(hz + 6) + ' Q' + N(W * 0.62) + ',' + N(hz + 40) + ' ' + N(W * 0.8) + ',' + N(hz - 14) + ' Q' + N(W * 0.92) + ',' + N(hz - 40) + ' ' + N(W + 30) + ',' + N(hz - 20) + ' V' + N(L.H + 30) + ' H-30 Z';
      s += path(far, S.HI.olive, 6) + path('M-30,' + N(hz + 70) + ' Q' + N(W * 0.3) + ',' + N(hz + 40) + ' ' + N(W * 0.55) + ',' + N(hz + 80) + ' T' + N(W + 30) + ',' + N(hz + 60) + ' V' + N(L.H + 30) + ' H-30 Z', C.avocado, 6);
      s += L.port ? S.cloud(470, 70, 0.62) : S.cloud(210, 92, 0.8) + S.cloud(1010, 110, 0.62);
      var gf = (D >> 1) % 2, gx = L.port ? [360, 460] : [560, 700], gy = L.port ? [250, 205] : [250, 196];
      s += K.gull({ x: gx[0], y: gy[0], scale: L.port ? 0.8 : 0.9, flap: gf }) + K.gull({ x: gx[1], y: gy[1], scale: L.port ? 0.6 : 0.66, flap: 1 - gf });
      // the dam: a poured-concrete face behind the top pool, formwork seams and tie holes
      var y4 = L.wat(4), dx0 = L.px(4) + L.sw * 0.45, dt = y4 + 36, seams = '', dots = '';
      s += rect(dx0, dt, W - dx0 + 40, L.BY - dt + 20, 0, C.tan, 7);
      for (var x = dx0 + 120; x < W; x += 130) { seams += 'M' + N(x) + ',' + N(dt + 30) + ' V' + N(L.BY) + ' '; for (var y = dt + 90; y < L.BY - 40; y += 160) dots += 'M' + N(x - 65) + ',' + N(y) + ' l0,0 '; }
      s += path(seams, 'none', 4, '', S.SH.tan) + path(dots, 'none', 10, '', C.brown);
      s += rect(dx0, dt + 4, 26, L.BY - dt, 0, S.SH.tan, 0, ' opacity=".5"');
      // the river above the dam: the olive far bank, then calm water running on upriver
      var rx = L.px(5) - 16, ph = (D >> 1) % 2;
      s += path('M' + N(rx) + ',' + N(y4 - 26) + ' Q' + N(rx + 200) + ',' + N(y4 - 64) + ' ' + N(W + 30) + ',' + N(y4 - 50) + ' L' + N(W + 30) + ',' + N(y4 + 4) + ' L' + N(rx) + ',' + N(y4 + 4) + ' Z', C.olive, 6);
      s += rect(rx, y4, W - rx + 30, 42, 0, C.sea, 6);
      s += path('M' + N(rx + 40 + ph * 24) + ',' + N(y4 + 18) + ' q18,-7 36,0 t36,0', 'none', 4, '', C.white);
      return s;
    }
    function riverFront(L) {
      var rx = L.px(5) - 16, y4 = L.wat(4);
      return rect(rx, y4 + 36, L.W - rx + 30, 30, 0, C.cream, 6) + path('M' + N(rx + 4) + ',' + N(y4 + 42) + ' H' + N(L.W + 20), 'none', 3, '', S.HI.cream);
    }
    function tufts(pts, h) {
      var d = '';
      pts.forEach(function (p, i) { var k = h * (0.8 + hash(i * 3.3) * 0.5); d += 'M' + N(p[0] - 8) + ',' + N(p[1]) + ' l-8,' + N(-k * 0.8) + ' M' + N(p[0]) + ',' + N(p[1]) + ' l2,' + N(-k) + ' M' + N(p[0] + 8) + ',' + N(p[1]) + ' l12,' + N(-k * 0.75) + ' '; });
      return path(d, 'none', 12, ' stroke-linecap="round"') + path(d, 'none', 5, ' stroke-linecap="round"', C.avocado);
    }
    /* the Commission's bank, upper left: a sand plateau (the scene for pools 1 to 3), falling away behind
       the ladder's first pools */
    function bankUL(L) {
      var PT = L.PT, x1 = L.PX1, s = '', BY = L.BY;
      var d = 'M-30,' + N(PT) + ' L' + N(x1 - 30) + ',' + N(PT) + ' Q' + N(x1 + 20) + ',' + N(PT + 2) + ' ' + N(x1 + 50) + ',' + N(PT + 50) +
        ' Q' + N(x1 + 130) + ',' + N(PT + 200) + ' ' + N(x1 + 260) + ',' + N(BY) + ' L-30,' + N(L.H + 30) + ' Z';
      s += path(d, C.sand, 7);
      // the lip's hard shade band and the lit top edge (key light upper right)
      s += '<clipPath id="ulc"><path d="' + d + '"/></clipPath>';
      s += '<g clip-path="url(#ulc)">' + path('M-30,' + N(PT + 26) + ' L' + N(x1 - 34) + ',' + N(PT + 26) + ' Q' + N(x1 + 6) + ',' + N(PT + 30) + ' ' + N(x1 + 26) + ',' + N(PT + 70) + ' L' + N(x1 + 26) + ',' + N(PT + 400) + ' L-30,' + N(PT + 400) + ' Z', S.SH.sand, 0, ' opacity=".5"') +
        path('M-30,' + N(PT + 400) + ' L' + N(x1 + 26) + ',' + N(PT + 400) + ' L' + N(x1 + 300) + ',' + N(BY + 40) + ' L-30,' + N(BY + 40) + ' Z', S.SH.sand, 0, ' opacity=".28"') + '</g>';
      s += path('M-20,' + N(PT + 5) + ' L' + N(x1 - 30) + ',' + N(PT + 5), 'none', 4, '', S.HI.sand);
      var strata = '';
      for (var k = 0; k < 7; k++) { var sx = 30 + hash(k * 2.1) * (x1 - 60), sy = PT + 70 + k * 64; strata += 'M' + N(sx) + ',' + N(sy) + ' q40,-10 80,0 '; }
      s += path(strata, 'none', 5, ' stroke-linecap="round"', C.tan);
      var tp = []; for (var t = 0; t < 7; t++) tp.push([20 + t * (x1 - 40) / 6 + (t % 2) * 18, PT + 3]);
      s += tufts(tp.filter(function (p, i) { return i !== 3 && i !== 4; }), L.port ? 26 : 30);
      return s;
    }
    /* Kit's bank, lower left, in the foreground */
    function bankLL(L) {
      var KX = L.KX, KY = L.KY, BY = L.BY, s = '';
      var d = 'M-30,' + N(KY - 6) + ' Q' + N(KX - 40) + ',' + N(KY - 14) + ' ' + N(KX + 110) + ',' + N(KY - 2) + ' Q' + N(KX + 230) + ',' + N(KY + 8) + ' ' + N(KX + (L.port ? 290 : 350)) + ',' + N(BY - 14) +
        ' Q' + N(KX + (L.port ? 330 : 400)) + ',' + N(BY + 30) + ' ' + N(KX + (L.port ? 350 : 430)) + ',' + N(L.H + 30) + ' L-30,' + N(L.H + 30) + ' Z';
      s += path(d, C.sand, 7);
      s += '<clipPath id="llc"><path d="' + d + '"/></clipPath><g clip-path="url(#llc)">' + rect(-30, KY + 26, KX + 480, 400, 0, S.SH.sand, 0, ' opacity=".45"') + '</g>';
      s += path('M' + N(KX - 60) + ',' + N(KY + 50) + ' q30,-8 60,0 M' + N(KX + 90) + ',' + N(KY + 36) + ' q24,-6 48,0', 'none', 5, ' stroke-linecap="round"', C.tan);
      s += tufts([[16, KY - 6], [KX + 170, KY + 6]], L.port ? 24 : 30);
      return s;
    }
    /* the near bank, lower right: the Board's table and the '?' sign stand here, in front of the
       ladder's lower stone and never over its pools */
    function bankLR(L) {
      var y = L.LRY, x0 = L.port ? 640 : 1010, W = L.W, s = '';
      var d = 'M' + N(x0) + ',' + N(L.BY + 20) + ' Q' + N(x0 + 30) + ',' + N(y + 6) + ' ' + N(x0 + 120) + ',' + N(y) + ' L' + N(W + 30) + ',' + N(y - 6) + ' L' + N(W + 30) + ',' + N(L.H + 30) + ' L' + N(x0) + ',' + N(L.H + 30) + ' Z';
      s += path(d, C.sand, 7);
      s += '<clipPath id="lrc"><path d="' + d + '"/></clipPath><g clip-path="url(#lrc)">' + rect(x0 - 10, y + 30, W - x0 + 60, 300, 0, S.SH.sand, 0, ' opacity=".45"') + '</g>';
      s += path('M' + N(x0 + 150) + ',' + N(y + 4) + ' H' + N(W + 20), 'none', 4, '', S.HI.sand);
      s += tufts([[x0 + 70, y + 4], [W - 40, y - 4]], L.port ? 24 : 30);
      // cattails at the water's edge
      var c = '', cx = x0 + (L.port ? 30 : 40);
      [[0, 150], [22, 120], [44, 170]].forEach(function (r) { c += 'M' + N(cx + r[0]) + ',' + N(y + 30) + ' q' + (r[0] - 20) * 0.2 + ',' + N(-r[1] * 0.5) + ' ' + N((r[0] - 22) * 0.3) + ',' + N(-r[1]) + ' '; });
      s += path(c, 'none', 11, ' stroke-linecap="round"') + path(c, 'none', 5, ' stroke-linecap="round"', C.olive);
      [[0, 150], [44, 170]].forEach(function (r) { var tx = cx + r[0] + (r[0] - 22) * 0.3, ty = y + 30 - r[1]; s += rect(tx - 9, ty - 4, 18, 44, 9, C.brown, 5); });
      return s;
    }
    function tailwater(L, D) {
      var y = L.BY - 34, f = (D >> 1) % 2, d = 'M' + (-60 + f * 40) + ',' + y;
      for (var x = -60 + f * 40; x < L.W + 160; x += 140) d += ' q70,-14 140,0';
      var s = path(d + ' V' + (L.H + 30) + ' H-60 Z', C.sea, 6);
      s += rect(-30, y + (L.H - y) * 0.55, L.W + 60, L.H, 0, C.seaDeep, 0);
      var w = '';
      for (var k = 0; k < 6; k++) { var wx = 180 + k * (L.W / 5) + (f ? 30 : 0), wy = y + 22 + (k % 2) * 18; w += 'M' + N(wx) + ',' + N(wy) + ' q24,-8 48,0 '; }
      return s + path(w, 'none', 4, ' stroke-linecap="round"', S.HI.sea);
    }

    /* ---------------- the ladder ---------------- */
    function ladderOpts(L, layer) { return { x: L.x0, y: L.BY, n: 5, stepW: L.sw, stepH: L.sh, signs: false, topSign: false, layer: layer }; }
    /* dressed-stone coursing on each block face, drawn over the back layer */
    function coursing(L) {
      var d = '';
      for (var i = 0; i < 5; i++) {
        var x0 = L.px(i) + 26, x1 = L.px(i) + L.sw - 12;
        for (var y = L.top(i) + 130, r = 0; y < L.BY - 30; y += 96, r++) {
          d += 'M' + N(x0) + ',' + N(y) + ' H' + N(x1) + ' ';
          var j = r % 2 ? 0.3 : 0.62; d += 'M' + N(x0 + (x1 - x0) * j) + ',' + N(y + 10) + ' v70 ';
        }
      }
      return path(d, 'none', 4, ' stroke-linecap="round"', S.HALF.cream);
    }
    /* the cascades churn on twos: foam and streaks change every other drawing */
    function cascades(L, D) {
      var s = '', f = (D >> 1) % 2;
      for (var i = 1; i < 5; i++) {
        var lx = L.px(i) + 12, y1 = L.wat(i), y0 = L.wat(i - 1) + 6;
        s += path('M' + N(lx + 10 - f * 6) + ',' + N(y1 + 14 + f * 8) + ' Q' + N(lx - 14) + ',' + N(y1 + 30) + ' ' + N(lx - 24 + f * 6) + ',' + N(y0 - 18), 'none', 4, ' stroke-linecap="round"', C.white);
        s += K.puff({ x: lx - 30 + f * 16, y: y0 + 4, r: 17 + f * 5, seed: i * 2 + f * 3, fill: C.white });
      }
      return s;
    }
    /* the pool signs: lettered once the Striper has been there (always for 1 and 2, the real present);
       on phones only the present and the pool he's in are lettered, so the boards never crowd */
    function lettered(L, i) {
      if (i < 2 || !L.port) return true;
      return st8.at === i && !st8.hop;
    }
    function signs(L, D) {
      var s = '';
      for (var i = 0; i < 5; i++) {
        var p = L.post(i), top = L.top(i), b = L.board(i), lt = lettered(L, i);
        var y1 = lt ? b.y1 : L.wat(i) - 128, x0 = lt ? b.x0 : p - L.cw / 2, x1 = lt ? b.x1 : p + L.cw / 2, y0 = lt ? b.y0 : y1 - L.ch, w = x1 - x0, h = y1 - y0;
        var o = rect(p - 10, y1 - 6, 20, top - y1 + 12, 3, C.brown, 6);
        var bd = rect(x0 + 6, y0 + 8, w, h, 10, INK, 0, ' opacity=".15"') + rect(x0, y0, w, h, 10, C.brown, 7) + rect(x0 + 10, y0 + 10, w - 20, h - 20, 6, 'none', 3, '').replace('stroke="' + INK + '"', 'stroke="' + C.tan + '"');
        bd += path('M' + N(x0 + 14) + ',' + N(y0 + 7) + ' H' + N(x1 - 14), 'none', 3, '', S.HI.brown);
        if (lt) {
          var nc = L.port ? 64 : 58, cx = x0 + nc + (w - nc) / 2 - 6, lines = POOL[i].l, lh = L.fs * 1.08, ty = (y0 + y1) / 2 - (lines.length - 1) * lh / 2 + L.fs * 0.33;
          bd += K.text(String(i + 1), x0 + nc / 2 + 6, (y0 + y1) / 2 + L.nfs * 0.34, { size: L.nfs, fill: C.mustard });
          lines.forEach(function (ln, k) { bd += K.text(ln, cx, ty + k * lh, { size: L.fs, fill: C.cream }); });
        } else bd += K.text(String(i + 1), p, (y0 + y1) / 2 + 22, { size: 64, fill: C.cream });
        // a sign letters in with a pop about its post top when the Striper first reaches it
        var dp = D - st8.rev[i], k = L.port && i > 1 && dp >= 0 && dp < 6 ? S.pop(dp, 5) : 1;
        o += k === 1 ? bd : '<g transform="translate(' + N(p) + ' ' + N(y1) + ') scale(' + k.toFixed(3) + ') translate(' + N(-p) + ' ' + N(-y1) + ')">' + bd + '</g>';
        if (i === 4 && !lt) o += K.qmark({ x: x1 + 18, y: y0 + 10, size: L.port ? 110 : 100 });
        // the one check: step 1 is done (the others haven't happened yet)
        if (i === 0) { var dc = D - st8.checkT, kc = dc >= 0 ? S.pop(dc, 5) : 0; if (kc > 0) o += K.check({ x: L.port ? x0 + 44 : x1 + 6, y: L.port ? y0 - 6 : (y0 + y1) / 2 + 4, scale: (L.port ? 1.25 : 1.1) * kc }); }
        // WE ARE HERE, painted on pool 2's sign post
        if (i === 1) o += weAreHere(L, p, y1);
        s += o;
      }
      return s;
    }
    function weAreHere(L, p, y1) {
      var s = '', fs = L.port ? 44 : 38;
      if (L.port) {
        var x0 = p - 110, w = 244, y0 = y1 + 4, h = 56;
        s += rect(x0 + 5, y0 + 6, w, h, 8, INK, 0, ' opacity=".15"') + rect(x0, y0, w, h, 8, C.mustard, 6) + path('M' + N(x0 + 10) + ',' + N(y0 + 6) + ' H' + N(x0 + w - 10), 'none', 3, '', S.HI.mustard);
        s += K.text('WE ARE HERE', x0 + w / 2, y0 + h / 2 + fs * 0.33, { size: fs, fill: C.brick });
      } else {
        var w2 = 222, h2 = 58, xa = p - w2 - 4, ya = y1 + 8;
        // an arrow board nailed to the post, pointing at the benchmark pool
        var d = 'M' + N(xa) + ',' + N(ya) + ' H' + N(xa + w2 - 22) + ' L' + N(xa + w2 + 6) + ',' + N(ya + h2 / 2) + ' L' + N(xa + w2 - 22) + ',' + N(ya + h2) + ' H' + N(xa) + ' Z';
        s += '<path d="' + d + '" fill="' + INK + '" opacity=".15" transform="translate(5 6)"/>' + path(d, C.mustard, 6) + path('M' + N(xa + 10) + ',' + N(ya + 6) + ' H' + N(xa + w2 - 26), 'none', 3, '', S.HI.mustard);
        s += K.text('WE ARE HERE', xa + (w2 - 16) / 2 + 4, ya + h2 / 2 + fs * 0.33, { size: fs, fill: C.brick });
        s += '<circle cx="' + N(p) + '" cy="' + N(ya + h2 / 2) + '" r="5" fill="' + INK + '"/>';
      }
      return s;
    }

    /* ---------------- the Commission's bank: pools 1 to 3 ---------------- */
    /* the ingredients wait in a tower on the bank: the box, the jar on the box, the can on the jar */
    function ingPos(L, i) {
      var PT = L.PT, y2 = PT - 170 * L.boxS, y1 = y2 - 234 * L.ingS;
      if (i === 0) return { x: L.pileX + 4, y: y1, s: L.ingS, top: y1 - 220 * L.ingS };
      if (i === 1) return { x: L.pileX - 2, y: y2, s: L.ingS, top: y1 };
      return { x: L.pileX, y: PT, s: L.boxS, top: y2 };
    }
    function inPot(L, i) {
      var px = L.potX, k = L.potS / 0.6, rim = L.PT - 250 * L.potS;
      // each pokes about half its height up over the rim
      var hw = 210 * L.potS, si = L.ingS * 1.1;
      if (i === 0) return { x: px - 0.46 * hw, y: rim + 0.52 * 219 * si, s: si, r: -8 };
      if (i === 1) return { x: px + 0.02 * hw, y: rim + 0.55 * 236 * si, s: si, r: 5 };
      return { x: px + 0.5 * hw, y: rim + 0.42 * 214 * L.boxS, s: L.boxS, r: 12 };
    }
    function ingredient(i, x, y, s, rot, sq) {
      var o = { kind: ING[i].kind, x: x, y: y, scale: s, rot: rot || 0 };
      if (sq) o.squash = sq;
      return S.cel(K.ingredient(o));
    }
    function commission(L, D) {
      var s = '', PT = L.PT, px = L.potX, ps = L.potS, k = ps / 0.6, rim = PT - 250 * ps, dr = D - st8.rev[1], open = st8.seen[1];
      // pool 1's scene: the CORRECTED COUNT can, released August 2026
      if (!open) {
        var cp = { x: L.pileX + (L.port ? -10 : 40), y: PT, s: L.ingS * 1.2 };
        s += S.shadow(cp.x, PT, 180 * cp.s, 'sand') + ingredient(0, cp.x, cp.y, cp.s);
        var tw = tagW(['AUG 2026'], L.tfs), th = L.tfs * 2.24 + 34;
        s += hang(cp.x + 30, cp.y - 190 * cp.s, { x: S.clamp(cp.x + 20, tw / 2 + 12, L.W - tw / 2 - 12), y: cp.y - 230 * cp.s - th / 2 - 40, w: tw, h: th, band: C.sea, rot: -3, lines: ['RELEASED', 'AUG 2026'], size: L.tfs });
        return s;
      }
      // pool 3: the peer reviewers lean in over the pot and blink one after another
      if (st8.seen[2]) {
        var dv = D - st8.rev[2], b = Math.floor(D / 2) % 14, gap = 232 * L.revS;
        [[-1, -9, [0.5, 0.9]], [0, 0, [0, 1]], [1, 9, [-0.5, 0.9]]].forEach(function (r, j) {
          // each rises on its own drawing, overshoots and settles, then leans in
          var d = dv - j * 2, rise = d >= 0 ? S.pop(d, 5) : dv < 0 ? 1 : 0, lean = d >= 0 ? S.ease.out(S.clamp((d - 3) / 5, 0, 1)) : 1;
          if (rise <= 0) return;
          var y = PT - 14 + (1 - Math.min(1, rise)) * 260 * L.revS - (rise > 1 ? (rise - 1) * 120 : 0);
          s += S.cel(K.magnifier({ x: px + r[0] * gap, y: y, scale: L.revS, rot: r[1] * lean, blink: dv > 10 && b === j * 2, look: r[2] }));
        });
      }
      // steam, one puff per ingredient in, rising a step every third drawing
      var np = st8.seen[2] ? 3 : st8.pot;
      for (var j = 0; j < np; j++) {
        var ph = (Math.floor(D / 3) + j * 2) % 6;
        s += K.puff({ x: px - 70 * k + j * 70 * k + (ph % 2) * 10, y: rim - 26 - ph * 26 * k, r: (20 + ph * 6) * k, seed: j + 2, fill: C.white });
      }
      // what's in the pot pokes up over the rim
      for (var n = 0; n < st8.pot; n++) {
        var q = inPot(L, n), dp = D - st8.plopT[n], sq = dp === 0 ? 0.14 : dp === 1 ? 0.06 : 0;
        s += ingredient(n, q.x, q.y + (dp === 0 ? -18 : 0), q.s, q.r, sq);
      }
      var pp = dr >= 0 ? S.pop(dr, 5) : 1;
      s += S.shadow(px, PT, 440 * ps * pp, 'sand') + '<g transform="translate(' + N(px) + ' ' + N(PT) + ') scale(' + pp.toFixed(3) + ') translate(' + N(-px) + ' ' + N(-PT) + ')">' + S.cel(K.stockPot({ x: px, y: PT, scale: ps, steam: 0 })) + '</g>';
      // plop: splash and a puff of steam
      for (var m = 0; m < st8.pot; m++) {
        var dq = D - st8.plopT[m];
        if (dq >= 0 && dq < 5) s += K.splash({ x: inPot(L, m).x, y: rim - 6, n: 5, r: 120 * k, p: 0.3 + dq * 0.2, fill: C.white }) + (dq < 3 ? K.puff({ x: px + 20, y: rim - 70 * k - dq * 20, r: (34 + dq * 10) * k, seed: 9 + m, fill: C.white }) : '');
      }
      // THE COMMISSION, tied to the pot's handle and hanging on its face
      if (!L.port && pp > 0.9) {
        var hx = px + 192 * ps, hy = PT - 157 * ps, tw2 = tagW(['THE COMMISSION'], L.tfs) - 10, th2 = L.tfs * 1.12 + 40;
        s += path('M' + N(hx) + ',' + N(hy) + ' Q' + N(hx - 10) + ',' + N(hy + 20) + ' ' + N(px + tw2 / 2 - 24) + ',' + N(PT - 74 * k - th2 / 2 + 8), 'none', 4);
        s += S.tag({ x: px + 4, y: PT - 74 * k, w: tw2, h: th2, band: C.brick, rot: -2, lines: ['THE COMMISSION'], size: L.tfs });
      }
      // the ingredients waiting on the bank (the can rides up onto the box as the benchmark opens)
      for (var i = 2; i >= st8.pot; i--) {
        if (st8.drag && st8.drag.i === i) continue;
        var ip = ingPos(L, i), yy = ip.y, xx = ip.x;
        if (dr >= 0 && dr < 12) {
          // the box drops in, then the jar; the can hops from the ground onto the box
          var land = i === 2 ? 3 : i === 1 ? 6 : 9, from = i === 0 ? { x: L.pileX + (L.port ? -10 : 40), y: PT } : { x: xx, y: yy - 320 };
          if (dr < land - 3) { if (i !== 0) continue; xx = from.x; yy = from.y; }                  // the can waits on the ground
          else if (dr < land) { var u = (dr - (land - 3)) / 3; xx = lerp(from.x, ip.x, u); yy = lerp(from.y, ip.y, u) - (i === 0 ? 120 * Math.sin(u * Math.PI) : 0); }
        }
        var sqz = dr >= 0 && dr - (i === 2 ? 3 : i === 1 ? 6 : 9) === 0 ? 0.12 : 0;
        if (i === 2) s += S.shadow(xx, PT, 300 * ip.s, 'sand');
        s += S.grab(i === st8.pot ? 'ing' : 'wait' + i, ingredient(i, xx, yy, ip.s, 0, sqz), xx, yy - 100 * ip.s, i === st8.pot ? 70 : 0);
      }
      // the next ingredient's tag, and a dashed arrow to the pot until someone has tried it
      if (st8.pot < 3 && !(st8.drag) && (dr < 0 || dr >= 12)) {
        var ni = st8.pot, np2 = ingPos(L, ni), tl = ING[ni].lines, tw3 = tagW(tl, L.tfs), th3 = L.tfs * 2.24 + 34;
        var topY = np2.top, tx = S.clamp(np2.x + (L.port ? 20 : 40), tw3 / 2 + 10, L.W - tw3 / 2 - 10), ty = ingPos(L, 0).top - th3 / 2 - (L.port ? 22 : 30);
        s += hang(np2.x + (ni === 2 ? 70 * np2.s : 20 * np2.s), topY + 8, { x: tx, y: ty, w: tw3, h: th3, band: ING[ni].band, rot: ni % 2 ? 2 : -2, lines: tl, size: L.tfs });
        if (st8.turn && !st8.dragged) {
          var ax = np2.x + (L.port ? -50 : 50), ay = topY + 30, bx = px + (L.port ? 40 : -50), by = rim - 20;
          s += path('M' + N(ax) + ',' + N(ay) + ' Q' + N((ax + bx) / 2) + ',' + N(Math.min(ay, by) - 120) + ' ' + N(bx) + ',' + N(by), 'none', 7, ' stroke-dasharray="16 12"', C.brick);
          var ang = Math.atan2(by - (Math.min(ay, by) - 120), bx - (ax + bx) / 2);
          s += path('M' + N(bx - Math.cos(ang - 0.5) * 30) + ',' + N(by - Math.sin(ang - 0.5) * 30) + ' L' + N(bx) + ',' + N(by) + ' L' + N(bx - Math.cos(ang + 0.5) * 30) + ',' + N(by - Math.sin(ang + 0.5) * 30), 'none', 7, '', C.brick);
        }
      }
      return s;
    }

    /* ---------------- the near bank: pools 4 and 5 ---------------- */
    function boardBank(L, D) {
      var s = '', y = L.LRY;
      if (st8.seen[4]) {
        // the '?' sign: NOBODY KNOWS THE OUTCOME YET, with the brick '?' bobbing on twos
        var d5 = D - st8.rev[4], p5 = d5 >= 0 ? S.pop(d5 - 2, 5) : 1;
        if (p5 > 0) {
          var fs = L.port ? 44 : 40, w = tagW(['THE OUTCOME YET'], fs) + 6, h = fs * 2.3 + 40, cx = L.qX, by1 = y - (L.port ? 150 : 190), by0 = by1 - h;
          var sg = S.longShadow(cx, y, 24, 300, 'sand') + rect(cx - 11, by1 - 6, 22, y - by1 + 8, 3, C.brown, 6);
          sg += rect(cx - w / 2 + 7, by0 + 9, w, h, 14, INK, 0, ' opacity=".15"') + rect(cx - w / 2, by0, w, h, 14, C.cream, 7) + path('M' + N(cx - w / 2 + 14) + ',' + N(by0 + 8) + ' H' + N(cx + w / 2 - 14), 'none', 4, '', S.HI.cream);
          sg += K.text('NOBODY KNOWS', cx, by0 + h / 2 - fs * 0.22, { size: fs }) + K.text('THE OUTCOME YET', cx, by0 + h / 2 + fs * 0.9, { size: fs });
          s += '<g transform="translate(' + N(cx) + ' ' + N(y) + ') scale(' + p5.toFixed(3) + ') translate(' + N(-cx) + ' ' + N(-y) + ')">' + sg + '</g>';
          var dq = d5 - 6, bob = (D >> 2) % 2 ? -12 : 0;
          if (dq >= 0 || d5 < 0) s += K.qmark({ x: cx + w / 2 - 30, y: by0 + 14 + bob, size: (L.port ? 120 : 124) * (dq >= 0 && dq < 5 ? S.pop(dq, 4) : 1), rot: bob ? 12 : 4 });
        }
      }
      if (st8.seen[3]) {
        var d4 = D - st8.rev[3], p4 = d4 >= 0 ? S.pop(d4, 5) : 1, tx = L.tabX;
        s += S.shadow(tx, y + 2, 760 * L.tabS * p4, 'sand') + '<g transform="translate(' + N(tx) + ' ' + N(y) + ') scale(' + p4.toFixed(3) + ') translate(' + N(-tx) + ' ' + N(-y) + ')">' + S.cel(K.boardTable({ x: tx, y: y, scale: L.tabS })) + '</g>';
      }
      return s;
    }

    /* ---------------- the leads ---------------- */
    function striper(L, D) {
      var res = { stand: '', air: '', say: '' }, SS = L.SS, h = st8.hop;
      if (h && D - h.t0 >= 1) {
        var d = D - h.t0, u = S.clamp((d - 1) / h.len, 0, 1), up = h.to > h.from;
        var x0 = L.sx(h.from), y0 = L.wat(h.from) + 10, x1 = L.sx(h.to), y1 = L.wat(h.to) + 10, hh = L.hopH + (up ? 0 : 60);
        var x = lerp(x0, x1, u), y = lerp(y0, y1, u) - 4 * hh * u * (1 - u), rot = up ? lerp(-34, 30, u) : lerp(34, -30, u);
        if (u > 0.1 && u < 0.6) { var ra = rot * Math.PI / 180, bk = (up ? -1 : 1) * 320 * SS; res.air += K.speedLines({ x: x + Math.cos(ra) * bk, y: y - 110 * SS + Math.sin(ra) * bk, len: 150 * SS / 0.62, n: 3, gap: 38 * SS / 0.62, w: 6, rot: up ? rot : 180 + rot }); }
        res.air += K.striper({ x: x, y: y, scale: SS, pose: 'leap', phase: u, rot: rot, flip: !up, expr: 'hopeful', look: 'upFwd', mouth: false, blink: false });
        return res;
      }
      var i = st8.at, o = { x: L.sx(i), y: L.wat(i) + 150 * SS, scale: SS, pose: 'hopeful', expr: 'hopeful', look: 'upFwd', blink: blink(D, 1) };
      if (h) { o.squash = 0.15; o.blink = false; }                                 // the crouch before take-off
      var dl = D - st8.landT;
      if (!h && dl >= 0 && dl < 3) o.squash = [0.16, 0.07, 0][dl];
      if (i === 1) {
        var df = D - st8.fullT;
        if (df >= 0 && df < 20) { o.pose = 'thumbsUp'; o.expr = 'happy'; o.look = 'cam'; }
        else if (st8.drag || (st8.pot < 3 && st8.seen[1])) o.look = 'upBack';
      }
      if (i === 2) o.look = 'upBack';
      if (i === 3) { o.look = 'downFwd'; o.expr = 'kind'; }
      var scripted = false;
      if (i === 4 && st8.topT != null) {
        var dt = D - st8.topT; scripted = true;
        if (dt >= 8) { o.flip = true; o.expr = 'kind'; o.look = [1, 0.4]; o.pose = 'neutral'; }
        if (dt >= 10 && dt < 26) o.mouth = dt % 3 === 2 ? 'closed' : 'open';
        if ((dt >= 22 && dt < 36) || (S.reduce && dt > 0)) { o.pose = 'tipHat'; o.expr = 'wink'; o.mouth = false; o.blink = false; }
        if (dt >= 10) {
          var hp = K.striperPoints(o).hook;
          // on phones the balloon hangs just below and left of him, so its tail is short (director 7c)
          res.say = L.port ? S.say('Nobody knows yet. That’s the honest answer.', hp[0] - 150, hp[1] + 310, 470, hp[0] - 20, hp[1] + 14, { size: 44 })
            : S.say('Nobody knows yet. That’s the honest answer.', L.board(3).x1 + 128, L.wat(4) - 122, 250, hp[0] - 12, hp[1] - 6, { size: 40 });
        }
      }
      // the closing (director 7b): back down in pool 1 beside Kit, who holds up the photo from the film's 3:22;
      // he tips his hat, says the film's last line and winks on "spring"
      if (i === 0 && st8.bye && !h) {
        var db = D - st8.byeT; scripted = true;
        o.flip = true; o.look = [1, 0.25]; o.expr = 'kind';
        if (db >= 6 && db < 18) { o.pose = 'tipHat'; o.blink = false; }
        if (db >= 4 && db < 26) o.mouth = db % 3 === 2 ? 'closed' : 'open';
        if (db >= 18 || S.reduce) { o.expr = 'wink'; o.mouth = false; o.blink = false; }
        if (db >= 4 || S.reduce) {
          var hb = K.striperPoints(o).hook;
          res.say = L.port ? S.say('Lost count, kid. Till next spring.', hb[0] + 250, hb[1] - 250, 400, hb[0] + 30, hb[1] - 20, { size: 44 })
            : S.say('Lost count, kid. Till next spring.', hb[0] + 300, hb[1] - 170, 360, hb[0] + 34, hb[1] - 10, { size: 42 });
        }
      }
      if (!h && !scripted && !(dl >= 0 && dl < 3)) {
        o.squash = S.breath(stage);
        var lk = st8.turn && !(i === 1 && D - st8.fullT >= 0 && D - st8.fullT < 20) && S.lookAt(stage, K.striperPoints(o).eye, o.flip); if (lk) o.look = lk;
      }
      var wat = L.wat(i);
      // he stands in the pool in front of the cascades, cut at the water line, with a ripple across him
      res.stand = '<clipPath id="pc"><rect x="-4000" y="-4000" width="9000" height="' + N(wat + 4 + 4000) + '"/></clipPath><g clip-path="url(#pc)">' + K.striper(o) + '</g>';
      var rp = '', f = (D >> 1) % 2, rx0 = o.x - (o.flip ? 150 : 110) * SS, rx1 = o.x + (o.flip ? 110 : 150) * SS;
      for (var rx = rx0; rx < rx1 - 20; rx += 40 * SS / 0.62) rp += (rx === rx0 ? 'M' + N(rx) + ',' + N(wat + 3) : '') + ' q' + N(10 * SS / 0.62) + ',' + (f ? -7 : -5) + ' ' + N(20 * SS / 0.62) + ',0 t' + N(20 * SS / 0.62) + ',0';
      res.stand += path(rp, 'none', 5, ' stroke-linecap="round"', C.white) + path('M' + N(rx0 - 34) + ',' + N(wat + 14) + ' q14,-7 28,0 M' + N(rx1 + 8) + ',' + N(wat + 14) + ' q14,-7 28,0', 'none', 4, ' stroke-linecap="round"', C.white);
      if (!h && dl >= 0 && dl < 4) {
        res.air += K.splash({ x: o.x - 10, y: wat + 6, n: 7, r: 300 * SS, p: 0.3 + dl * 0.25, fill: C.white });
        if (dl < 2) res.air += K.puff({ x: o.x - 150 * SS, y: wat + 4, r: 34 * SS, seed: 3, fill: C.white }) + K.puff({ x: o.x + 150 * SS, y: wat + 4, r: 30 * SS, seed: 5, fill: C.white });
      }
      res.o = o;
      return res;
    }
    function bigMama(L, D) {
      if (st8.topT == null) return '';
      var dm = D - st8.topT - 4, x;
      if (S.reduce) { if (L.port) return ''; x = L.W - 140; }     // reduced motion: held mid-glide (laptop only: on a phone her banner would sit on the signs)
      else { if (dm < 0 || dm > 44) return ''; x = lerp(L.px(4) + 20, L.W + 460 * L.mamaS / 0.45, dm / 40); }
      var ts = (L.port ? 44 : 36) / (24 * L.mamaS * 1.4 * 0.72);
      return K.bigMama({ x: x, y: L.wat(4) + 44, scale: L.mamaS, pose: 'glide', phase: (dm >> 1) % 2 ? 0.5 : 0, blink: false, look: 'fwd', tagScale: ts });
    }
    function kit(L, D) {
      var o = { x: L.KX, y: L.KY, scale: L.KS, pose: 'neutral', expr: 'kind', look: [1, -0.8], blink: blink(D, 2) };
      if (st8.at === 4 && !st8.hop) { o.pose = 'wave'; o.expr = 'grin'; o.rot = (D >> 2) % 2 ? 2 : -1; }
      else if (st8.turn) { var lk = S.lookAt(stage, K.kidPoints(o).eye, o.flip); if (lk) o.look = lk; }
      var dc = D - st8.cheerT;
      if (dc >= 0 && dc < 16) { var f = (dc >> 1) % 2; o.pose = 'cheer'; o.expr = 'grin'; o.frame = f; o.rot = f ? 3 : -3; o.blink = false; }
      // the closing: she holds up the photo she took at the start of the song
      var db = D - st8.byeT;
      if (st8.bye && st8.at === 0 && !st8.hop && (db >= 2 || S.reduce)) { o.pose = 'photo'; o.expr = db >= 26 || S.reduce ? 'grin' : 'tilt'; o.look = [1, -0.2]; o.rot = 0; o.frame = 0; }
      return S.shadow(L.KX, L.KY, 200 * L.KS / 0.75, 'sand') + K.kid(o);
    }
    /* TAP THE NEXT POOL: a dashed arc from the Striper to the next pool, until the first leap */
    function tapHint(L) {
      if (!st8.turn || st8.tried || st8.hop || st8.at >= 4) return '';
      var a = st8.at, b = a + 1, ax = L.sx(a) + 60 * L.SS, ay = L.wat(a) - 330 * L.SS, bx = L.sx(b) - 20, by = L.wat(b) - 40;
      var s = path('M' + N(ax) + ',' + N(ay) + ' Q' + N((ax + bx) / 2 + 20) + ',' + N(Math.min(ay, by) - 150) + ' ' + N(bx) + ',' + N(by), 'none', 7, ' stroke-dasharray="16 12"', C.brick);
      var ang = Math.atan2(by - (Math.min(ay, by) - 150), bx - ((ax + bx) / 2 + 20));
      s += path('M' + N(bx - Math.cos(ang - 0.5) * 32) + ',' + N(by - Math.sin(ang - 0.5) * 32) + ' L' + N(bx) + ',' + N(by) + ' L' + N(bx - Math.cos(ang + 0.5) * 32) + ',' + N(by - Math.sin(ang + 0.5) * 32), 'none', 7, '', C.brick);
      var fs = L.port ? 44 : 38, w = tagW(['TAP THE NEXT POOL'], fs), tx = L.px(b) + 40 + w / 2, ty = L.top(b) + (L.port ? 200 : 190);
      tx = S.clamp(tx, w / 2 + 16, L.W - w / 2 - 16);
      return s + tagShadow({ x: tx, y: ty, w: w, h: fs * 1.5 + 14, rot: -3 }) + S.tag({ x: tx, y: ty, w: w, h: fs * 1.5 + 14, fill: C.mustard, rot: -3, lines: ['TAP THE NEXT POOL'], size: fs });
    }
    /* tap targets: each pool (water and the air over it), and the Striper himself */
    function hits(L) {
      var s = '';
      if (!st8.turn) return s;
      for (var i = 0; i < 5; i++) {
        var x = L.px(i), y0 = L.board(i).y1 + 10, y1 = L.top(i) + 90;
        s += '<rect data-hit="pool:' + i + '" x="' + N(x) + '" y="' + N(y0) + '" width="' + L.sw + '" height="' + N(y1 - y0) + '" fill="transparent" style="cursor:pointer"/>';
      }
      return s;
    }

    /* ---------------- the frame ---------------- */
    var stage = api.stage(function (st) {
      var L = lay(st), D = clk.D, s = '';
      s += backdrop(st, L, D);
      s += bankUL(L);
      s += commission(L, D);
      s += S.cel(K.ladder(ladderOpts(L, 'back'))) + coursing(L);
      s += signs(L, D);
      s += hits(L);
      var sp = striper(L, D);
      s += bigMama(L, D);
      s += K.ladder(ladderOpts(L, 'front')) + cascades(L, D) + riverFront(L);
      s += sp.stand;
      s += tailwater(L, D);
      s += bankLR(L) + boardBank(L, D);
      s += bankLL(L) + kit(L, D);
      s += sp.air;
      s += tapHint(L);
      if (st8.drag) { var g = st8.drag, ip = ingPos(L, g.i); s += ingredient(g.i, g.x, g.y + 100 * ip.s, ip.s, -6); }
      s += sp.say;
      return s;
    }, function () {
      var t = 'A fish ladder of five pools climbing a dam. The Striper is in pool ' + (st8.at + 1) + ', ' + POOL[st8.at].b.toLowerCase() + '. Kit watches from the bank.';
      if (st8.seen[1]) t += ' The Commission’s pot has ' + st8.pot + ' of 3 ingredients in it.';
      if (st8.seen[2]) t += ' Three magnifiers lean in over the pot.';
      if (st8.seen[3]) t += ' The Board’s table waits on the near bank.';
      if (st8.seen[4]) t += ' A sign reads: nobody knows the outcome yet.';
      return t;
    });

    /* ---------------- the clock: 12 drawings a second while anything moves; on twos when idle ---------------- */
    var clk = { D: 0, raf: 0, last: 0, until: 0, inView: true, woke: 0 };
    function kick(n) { clk.until = Math.max(clk.until, clk.D + (n || 1)); wake(); }
    function wake() { clk.woke = performance.now(); run(); }
    function run() {
      if (S.reduce) { stage.render(); return; }              // reduced motion: no clock, just the end state
      if (!clk.raf) { clk.last = performance.now(); clk.raf = requestAnimationFrame(tick); }
    }
    function tick(t) {
      clk.raf = 0;
      var busy = clk.D < clk.until, idle = clk.inView && !document.hidden && t - clk.woke < 1000;
      if (!busy && !idle) return;
      if (t - clk.last >= 1000 / 12 - 2) {
        clk.last = t; clk.D++;
        step();
        if (busy || clk.D % 2 === 0) { stage.drawing = clk.D; stage.render(); }
      }
      clk.raf = requestAnimationFrame(tick);
    }
    /* per-drawing logic: finish hops, start queued ones, fire the payoff */
    function step() {
      var D = clk.D, h = st8.hop;
      if (h && D - h.t0 >= h.len + 1) land(h.to, D);
      if (!st8.hop && st8.queue.length && D - st8.landT >= 3) startHop(st8.queue.shift(), D);
      if (st8.topT != null && !st8.got && D - st8.topT >= 22) payoffLands();
      if (st8.autoPot && st8.at === 1 && !st8.hop && D - st8.landT >= 6) { st8.autoPot = false; addAll(false); }
    }
    /* reduced motion: every moment resolves to its end state at once */
    function settle() {
      var D = clk.D;
      if (st8.hop) { var to = st8.hop.to; st8.hop = null; land(to, D); }
      while (st8.queue.length) land(st8.queue.shift(), D);
      if (st8.topT != null && !st8.got) payoffLands();
      if (st8.autoPot && st8.at === 1) { st8.autoPot = false; addAll(false); }
    }
    function startHop(to, D) {
      var from = st8.at;
      if (to === from) return;
      if (from === 1 && to > 1 && st8.pot < 3) addAll(true);     // the benchmark can't wait: the rest go in
      st8.hop = { from: from, to: to, t0: D, len: to > from ? HOP : HOP + 2 + (from - to) };
      st8.cheerT = D + 1;
      st8.tried = true;
      kick(st8.hop.len + 8);
    }
    function land(k, D) {
      var T = S.reduce ? D - 999 : D;       // reduced motion: every moment is already over
      st8.hop = null; st8.at = k; st8.landT = T;
      if (!st8.seen[k]) { st8.seen[k] = true; st8.rev[k] = T; }
      if (k > 1 && st8.pot < 3) addAll(true);                // past the benchmark, the pot is full
      if (k === 4) { st8.topT = S.reduce ? D - 999 : D; kick(48); } else st8.topT = null;
      if (k === 0 && st8.bye) { st8.byeT = T; kick(30); }
      kick(14); ui();
    }
    function payoffLands() { st8.got = true; }
    function leapTo(k, bye) {
      st8.bye = !!bye;
      var cur = st8.queue.length ? st8.queue[st8.queue.length - 1] : st8.hop ? st8.hop.to : st8.at;
      st8.target = k; st8.tried = true;
      if (k > cur) for (var i = cur + 1; i <= k; i++) st8.queue.push(i);
      else if (k < cur) st8.queue.push(k);
      ui();
      if (S.reduce) { settle(); stage.render(); return; }
      if (!st8.hop && st8.queue.length) startHop(st8.queue.shift(), clk.D);
      kick(2);
    }
    function plop(i, D) {
      var T = S.reduce ? D - 999 : D;
      st8.pot = i + 1; st8.plopT[i] = T;
      if (st8.pot === 3) st8.fullT = T + 2;
      kick(22); ui();
    }
    function addAll(quick) {
      var D = S.reduce ? clk.D - 999 : clk.D;
      for (var i = st8.pot; i < 3; i++) { st8.plopT[i] = D + (i - st8.pot) * (quick ? 2 : 5); }
      st8.fullT = D + (3 - st8.pot) * (quick ? 2 : 5);
      st8.pot = 3; st8.dragged = true;
      kick(26); ui();
    }

    /* ---------------- direct manipulation: tap a pool; drag an ingredient into the pot ---------------- */
    stage.drag({
      start: function (name, pt) {
        if (name.indexOf('pool:') === 0) { if (st8.turn) leapTo(+name.slice(5)); return false; }
        if (name === 'ing' && st8.turn && st8.pot < 3 && st8.seen[1]) { st8.drag = { i: st8.pot, x: pt.x, y: pt.y }; kick(2); return; }
        return false;
      },
      move: function (name, pt) { if (st8.drag) { st8.drag.x = pt.x; st8.drag.y = pt.y; stage.render(); } },
      end: function (name, pt) {
        if (!st8.drag) return;
        var L = lay(stage), g = st8.drag, rim = L.PT - 250 * L.potS, hw = 210 * L.potS + 60;
        st8.drag = null; st8.dragged = true;
        if (Math.abs(pt.x - L.potX) < hw && pt.y > rim - 260 && pt.y < L.PT + 20) plop(g.i, clk.D);
        else { kick(2); stage.render(); }
      }
    });

    /* ---------------- the panel: the main control first ---------------- */
    var css = S.el('style', null, document.head);
    css.textContent = [
      '#next .seg button.seen::after{content:"";width:17px;height:15px;flex:none;background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 17 15\'%3E%3Cpath d=\'M3 8l4 4 7-9\' fill=\'none\' stroke=\'%231E1510\' stroke-width=\'5.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3Cpath d=\'M3 8l4 4 7-9\' fill=\'none\' stroke=\'%23FBF6EA\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat center/contain}',
      '#next .leaprow{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:-4px}',
      '#next .btn.leap{background:var(--sea);box-shadow:inset 0 -6px 0 var(--seaDeep),4px 5px 0 var(--ink)}',
      '#next .btn.leap:active{box-shadow:inset 0 -4px 0 var(--seaDeep),1px 1px 0 var(--ink)}',
      '#next .btn.small{min-height:46px;padding:8px 18px;font-size:17px}',
      '#next .addrow{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
      '#next .addrow[hidden]{display:none}',
      '#next .tell{display:flex;flex-direction:column;gap:12px}',
      '#next .tell .ctl-label{font-size:19px}',
      '#next .flips{display:grid;grid-template-columns:1fr;gap:12px}',
      '#next .step.turn .tell{margin-top:14px}',
      '#next .flip{appearance:none;display:grid;padding:0;margin:0;border:0;background:none;cursor:pointer;text-align:left;color:var(--ink);font:inherit;perspective:1100px;transition:transform .08s}',
      '#next .flip:hover{transform:translateY(-1px)}',
      '#next .flip .face{grid-area:1/1;display:flex;flex-direction:column;gap:8px;min-height:118px;padding:14px 14px 12px 16px;border:3px solid var(--ink);border-radius:12px;-webkit-backface-visibility:hidden;backface-visibility:hidden;transition:transform .36s steps(4,end)}',
      '#next .flip .front{background:var(--white) repeating-linear-gradient(180deg,transparent 0 27px,rgba(47,124,160,.14) 27px 28px) 0 46px/100% calc(100% - 46px) no-repeat;box-shadow:inset 0 -6px 0 var(--sh-cream),4px 5px 0 var(--ink)}',
      '#next .flip .back{background:var(--sea);color:var(--white);transform:rotateY(180deg);box-shadow:inset 0 -6px 0 var(--seaDeep),4px 5px 0 var(--ink)}',
      '#next .flip[aria-pressed="true"] .front{transform:rotateY(-180deg)}',
      '#next .flip[aria-pressed="true"] .back{transform:rotateY(0deg)}',
      '#next .flip .qrow{display:flex;gap:10px;align-items:flex-start}',
      '@media (max-aspect-ratio: 1/1), (max-width: 820px){#next .flip .face{min-height:112px}}',
      '#next .flip .n{flex:none;display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--brick);color:var(--cream);border:3px solid var(--ink);font:400 16px/1 var(--f-label)}',
      '#next .flip .q{font:400 20px/1.15 var(--f-label);text-wrap:balance}',
      '#next .flip .a{font:700 16px/1.42 var(--f-body);text-wrap:pretty}',
      '#next .flip .turn{margin-top:auto;display:flex;align-items:center;gap:6px;font:700 12px/1 var(--f-mono);color:var(--muted);letter-spacing:.04em}',
      '#next .flip .back .turn{color:var(--sky)}',
      '#next .flip .turn i{display:inline-block;width:18px;height:18px;background:var(--bobber) no-repeat center/contain}',
      '#next .flip.nudge .front{animation:nextNudge 1.1s steps(6,end) 2}',
      '@keyframes nextNudge{0%,100%{transform:rotate(0)}25%{transform:rotate(-2deg) translateY(-4px)}50%{transform:rotate(1.5deg)}75%{transform:rotate(-1deg) translateY(-2px)}}',
      '#next .copyrow{display:flex;flex-wrap:wrap;gap:12px;align-items:center}',
      '#next .copymsg{font:700 14px/1.3 var(--f-mono);color:var(--seaDeep)}',
      '#next .copyfall{width:100%;min-height:150px;padding:10px;border:3px solid var(--ink);border-radius:10px;background:var(--white);font:15px/1.45 var(--f-body);color:var(--ink)}',
      '@media (prefers-reduced-motion: reduce){#next .flip .face{transition:none}#next .flip.nudge .front{animation:none}#next .flip{transition:none}}'
    ].join('\n');

    /* ---------------- the walkthrough: one pool per step ---------------- */
    var WALK = [
      { cls: 'first', h: '<p>Before anything changes on the water, the corrected count has to climb this ladder.</p><p><b>Pool 1: done.</b> In late August 2026, NOAA released corrected catch and trips going back to 1981.</p>' },
      { h: '<p><b>Pool 2: the benchmark assessment, under way now.</b> Three new ingredients go in: the corrected catch, the new release death rate, and maybe a new math model (called WHAM).</p>' },
      { h: '<p><b>Pool 3: peer review.</b> Independent scientists check the new assessment before managers can use it.</p>' },
      { h: '<p><b>Pool 4: the Board.</b> The Atlantic States Marine Fisheries Commission’s Striped Bass Management Board sets new targets and limits from the reviewed assessment.</p>' },
      { h: '<p><b>Pool 5: new rules.</b> Seasons, size limits, bag limits and commercial quotas follow from the Board’s decisions.</p>' },
      { cls: 'turn', h: '<span class="go">Your turn</span><p>Four questions your fishing buddies will ask. Tap a card for the answer, then share all four. You can also tap any pool to send the Striper there.</p>' }
    ];
    var PLAY = WALK.length - 1, OUTRO = WALK.length, turnEl = null;
    WALK.forEach(function (d, i) { var e = api.step(d.h, d.cls); if (i === PLAY) turnEl = e; });
    function snap(n, quiet) {
      var k = Math.min(n, 4), D = clk.D;
      st8.bye = false; st8.byeT = NEVER;
      st8.hop = null; st8.queue = []; st8.at = k; st8.target = k; st8.landT = NEVER; st8.cheerT = NEVER; st8.drag = null;
      for (var i = 0; i < 5; i++) { st8.seen[i] = i <= k; st8.rev[i] = NEVER; }
      st8.pot = k >= 1 ? 3 : 0; st8.plopT = [NEVER, NEVER, NEVER]; st8.fullT = NEVER; st8.autoPot = false;
      st8.topT = k === 4 ? D - 60 : null; st8.got = k === 4;
      st8.turn = n >= PLAY; if (n < PLAY) st8.tried = false;
      api.playing(st8.turn); ui(); if (!quiet) stage.render();
    }
    function enter(n) {
      if (n >= 1 && n <= 4) { if (n === 1) st8.autoPot = true; leapTo(n); }
      else if (n === PLAY) { st8.turn = true; api.playing(true); stage.render(); nudgeCard(); }
    }
    api.onStep(function (n, prev) {
      var secEl = api.panel.closest('section'); if (secEl) secEl.classList.toggle('outro', n === OUTRO);
      if (n >= PLAY && prev >= PLAY) { if (n === OUTRO) closing(); else if (st8.bye) { st8.bye = false; kick(2); } return; }
      if (prev >= 0 && n === prev + 1 && !S.reduce) { snap(prev, true); enter(n); }
      else { snap(n); if (n === PLAY) nudgeCard(); }
      if (n === OUTRO) closing();
    });
    /* the closing: the reward beat, and the Striper leaps home to pool 1 beside Kit for the film's goodbye */
    function closing() {
      S.reward(api);
      if (st8.at === 0 && !st8.hop && !st8.queue.length) { st8.bye = true; st8.byeT = S.reduce ? clk.D - 999 : clk.D; kick(30); if (S.reduce) stage.render(); }
      else leapTo(0, true);
    }
    function nudgeCard() { if (flipsTouched || S.reduce) return; var c0 = flipEls[0]; if (c0) { c0.classList.remove('nudge'); void c0.offsetWidth; c0.classList.add('nudge'); } }
    var live = S.el('p', { class: 'sr', 'aria-live': 'polite' }, api.bar);
    function ui() { var t = 'The Striper is in pool ' + (st8.at + 1) + ': ' + POOL[st8.at].b.toLowerCase() + '.'; if (live.textContent !== t) live.textContent = t; }
    api.take('The count has been corrected. What it means for the stock and the rules comes out of the benchmark assessment, peer review and the Board. Nobody knows the outcome yet.');

    // What to tell your fishing buddies: four flip cards and a Copy button
    var tell = S.el('div', { class: 'tell' }, turnEl), flipsTouched = false;
    tell.innerHTML = '<div class="ctl-label"><span>What to tell your fishing buddies</span></div>';
    var flips = S.el('div', { class: 'flips' }, tell), flipEls = [];
    TELL.forEach(function (c, i) {
      var b = S.el('button', { type: 'button', class: 'flip', 'aria-pressed': 'false' }, flips,
        '<span class="face front"><span class="qrow"><span class="n" aria-hidden="true">' + (i + 1) + '</span><span class="q">' + c.q + '</span></span><span class="turn" aria-hidden="true"><i></i>TAP TO FLIP</span></span>' +
        '<span class="face back" aria-hidden="true"><span class="a">' + c.a + '</span><span class="turn" aria-hidden="true"><i></i>TAP TO FLIP BACK</span></span>');
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        flipsTouched = true; b.classList.remove('nudge');
        b.setAttribute('aria-pressed', String(on));
        b.querySelector('.back').setAttribute('aria-hidden', String(!on));
      });
      flipEls.push(b);
    });
    var copyRow = S.el('div', { class: 'copyrow' }, tell);
    var copyBtn = S.el('button', { type: 'button', class: 'btn leap small' }, copyRow, (FRAME.canShare() ? 'Share the four' : 'Copy all four') + ' <span class="fishy" aria-hidden="true"></span>');
    var copyMsg = S.el('span', { class: 'copymsg', role: 'status', 'aria-live': 'polite' }, copyRow);
    var fall = S.el('textarea', { class: 'copyfall', readonly: 'readonly', rows: '8', 'aria-label': 'The four answers, ready to copy', hidden: 'hidden' }, tell);
    // the four answers, the credit and the site's address: the share sheet on phones, else the clipboard
    // (the same code as the footer's Share link, in frame.js)
    copyBtn.addEventListener('click', function () {
      var txt = FRAME.fourText();
      FRAME.share({ title: 'The Striper Recount', text: txt, copy: txt }, { msg: copyMsg, fall: fall });
    });

    // after the takeaway: what the recount changes this season and when (process facts, no predictions),
    // then the "What you can do" block, cloned from the build's template (frame.js)
    S.el('p', { class: 'process' }, api.panel, '<b>This season.</b> The recount by itself doesn’t change any rule. Today’s seasons, size limits and bag limits stay until the Board, and your state, act.' +
      '<br><b>When.</b> The Atlantic States Marine Fisheries Commission ' + FRAME.link('asmfc', 'expects the benchmark assessment to be finished in mid-2027') + '. There’s no date yet for new rules.');
    FRAME.wycd(api.panel);

    // idle on twos only while the stage is on screen
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { clk.inView = es[0].isIntersecting; if (clk.inView) wake(); }, { threshold: 0.05 }).observe(api.stageHost);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
    api.stageHost.addEventListener('pointerdown', wake);
    S.idle(api.stageHost, wake);
    snap(0);
    st8.checkT = S.reduce ? -99 : 6;     // the step 1 check pops on with overshoot
    stage.render();
    wake();
    document.addEventListener('site:fonts', function () { stage.render(); });
  }
});
