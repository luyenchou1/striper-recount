/* 5. Stripers killed by fishing (the film's s11 and s12, 2:20 to 2:43).
   A scrolly page, like the others: a walkthrough with a spotlight (the picture is busy and holds still, and each
   step's motion stays inside its subject), plain numbers (killed in millions; rates as "in 100"), an equation
   under the picture, then one slider for the reader.
   The film's two framed stacks on the pier, drawn to one scale: every block, in either stack, is 250,000
   stripers, and both stacks stand on the same baseline beside a tide staff.
     ANGLERS    = fish kept + released fish that die (9 in 100 in the assessment; about 4.5 in the new study)
     COMMERCIAL = landings + fish thrown back dead (a dashed "?" cap on top, sized by the discard figure)
   Steps, one number to a card: what counts as a kill; each block is 250,000; the anglers' old count; the
   commercial count; the recount (the shade pulls down a notch, Kit stamps RECOUNT, then the blocks it took lift off
   the stack one at a time into a crate at her feet, and she catches the last); the release study; if the assessment
   uses it (the same as the recount, RELEASE STUDY); commercial didn't go up (the film's exchange at 2:40, and BIGGER SHARE lands on the commercial frame); the
   question mark (the 1990s estimate drawn as a dashed ghost cap). Then the reader's turn: a slider for the
   commercial discard figure, from 0 to the 1990s estimate. The chalkboard holds the inputs, and each correction
   is written in as it lands; on a phone the board shows only the line that changes. */
SITE.register({
  id: 'removals', short: 'Stripers killed by fishing', title: 'Stripers killed by fishing', scrolly: true,
  build: function (api) {
    var S = SITE, K = S.K, C = S.C, INK = C.ink, R = RC.removals2025, RT = RC.rates, N = S.N, path = S.path;
    var BLK = 0.25, NA = 12, NC = 7, PLATE = ' ', LUNGE = 22;          // millions of fish per block; frame capacities
    function r1(v) { return Math.round(v * 10) / 10; }
    var RM_OLD = r1(RT.releaseOld * 100), RM_NEW = r1(RT.releaseNew * 100), DISC = r1(RT.discardNow * 100), DISC90 = r1(RT.discard1990s * 100);
    var PRE = [{ fixed: false, rm: RM_OLD }, { fixed: true, rm: RM_OLD }, { fixed: true, rm: RM_NEW }];
    var st8 = { fixed: false, rm: RM_OLD, disc: DISC, prev: null, busy: false, pull: null, spin: -1, snapL: 0, dispL: null, kit: null,
      hideRC: false, hideST: false, paid: false, pay: 0, talk: -1, ktalk: -1, say: false, kq: false, tried: false, focus: null, fz: -99,
      ghost90: false, turn: false, crate: 0, crateT: -99, swapT: -99, fly: null, sq: -99, pb: [], pbT: -99, surp: -99, wr: {} };

    /* Every total on the page (the stacks, the chips under the picture, the step cards, the takeaway and the
       picture's label) comes from these lines and data.js. Anglers' kills are the fish kept plus the released fish
       that die. Whether the 2025 kept figure already includes release deaths is being confirmed with ASGA; if it
       does, angM is the one line to change. */
    function angM(o) { o = o || st8; return (o.fixed ? R.kept : R.keptOld) + (o.fixed ? R.released : R.releasedOld) * o.rm / 100; }
    function discM(o) { o = o || st8; return R.commLandings * o.disc / 100; }
    function comM(o) { return R.commLandings + discM(o); }
    function mil(v) { return (Math.round(v * 100) / 100).toFixed(2) + ' million'; }
    var A_OLD = angM(PRE[0]), A_FIX = angM(PRE[1]), A_ST = angM(PRE[2]), C_NOW = comM({ disc: DISC });

    function lv(m) { return m / BLK; }
    var L_OLD = lv(A_OLD), L_FIX = lv(A_FIX), L_ST = lv(A_ST), L_LAND = lv(R.commLandings);
    function fmtP(v) { return String(Math.abs(v - Math.round(v)) < 1e-6 ? Math.round(v) : v.toFixed(1)); }      // a rate, as "in 100"

    /* ---------------- small drawing helpers ---------------- */
    function rect(x, y, w, h, rx, fill, sw, extra, stroke) {
      return '<rect x="' + N(x) + '" y="' + N(y) + '" width="' + N(Math.max(0, w)) + '" height="' + N(Math.max(0, h)) + '" rx="' + rx + '" fill="' + fill + '"' +
        (sw ? ' stroke="' + (stroke || INK) + '" stroke-width="' + sw + '" stroke-linejoin="round"' : '') + (extra || '') + '/>';
    }
    function circ(x, y, r, fill, sw, stroke) {
      return '<circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r) + '" fill="' + fill + '"' + (sw ? ' stroke="' + (stroke || INK) + '" stroke-width="' + sw + '"' : '') + '/>';
    }
    var cv = null;
    function tw(str, size, font) {        // measured width of lettering (after the fonts load, the page redraws)
      font = font || 'hand';
      try { if (!cv) cv = document.createElement('canvas').getContext('2d'); cv.font = K.fs(font, size) + 'px ' + K.FONTS[font]; return cv.measureText(str).width; }
      catch (e) { return str.length * size * 0.52; }
    }
    /* a tag hanging on a string from (ax, ay) */
    function hang(ax, ay, o) {
      return path('M' + N(ax) + ',' + N(ay) + ' L' + N(o.x) + ',' + N(o.y - (o.h || 110) / 2 + 6), 'none', 5) + circ(ax, ay, 7, C.cream, 4) + S.tag(o);
    }
    function tagW(lines, size) { var m = 0; lines.forEach(function (l) { m = Math.max(m, tw(l, size, 'label')); }); return Math.round(m + 56); }
    function around(x, y, k, inner) { return k === 1 ? inner : '<g transform="translate(' + N(x) + ' ' + N(y) + ') scale(' + k + ') translate(' + N(-x) + ' ' + N(-y) + ')">' + inner + '</g>'; }

    /* ---------------- layout, per orientation ---------------- */
    function lay(st) {
      var port = st.port, dy = st.h - (port ? 1250 : 1080), L;
      if (port) L = { port: true, hz: 430, dock: 500, GY: 1222, PH: 46, BH: 44, BW: 150, XA: 300, XT: 516, XC: 718, KS: 0.6, SX: 978, SS: 0.56, KD: 66,
        bx: 808, bgy: 700, bw: 540, bh: 500, bleg: 40, rowK: 1.06, banY: 22, banW: 930, banS: 46, lab: 44, big: 52, tg: 44 };
      else L = { port: false, hz: 560, dock: 640, GY: 1015, PH: 60, BH: 42, BW: 170, XA: 430, XT: 690, XC: 930, KS: 0.8, SX: 1800, SS: 0.8, KD: 124,
        bx: 1400, bgy: 760, bw: 580, bh: 452, bleg: 60, rowK: 1.1, banY: 34, banW: 950, banS: 52, lab: 40, big: 52, tg: 40 };
      ['hz', 'dock', 'GY', 'bgy'].forEach(function (k) { L[k] += dy; });
      if (!port) {                                                   // a taller laptop stage gets taller blocks (same scale in both stacks) and a bigger board
        var e = Math.max(0, dy);
        L.BH = Math.round(42 + e * 0.085); L.bw = Math.round(580 + e * 0.08); L.bh = Math.round(452 + e * 0.4); L.bx = 1400 - Math.round(e * 0.1);
        L.lab = Math.round(40 + e * 0.02); L.big = Math.round(52 + e * 0.025);
      }
      L.dy = dy; L.W = st.w; L.H = st.h;
      if (!port) L.banY += Math.round(dy * 0.4);
      L.base = L.GY - L.PH - 22;                                     // the top of the bottom rail: level 0
      L.pw = L.BW + 70;
      L.topA = L.GY - L.PH - (NA * L.BH + 60); L.topC = L.GY - L.PH - (NC * L.BH + 60);
      L.RY = L.topA + 12; L.RH = L.pw / 2 - 6;
      // Kit stamps from the stepladder: the rubber face lands on the middle of each ghost band
      var kp = K.kidPoints({ pose: 'stamp', x: 0, y: 0, scale: L.KS });
      L.kfx = (kp.near[0] + kp.far[0]) / 2; L.kfy = (kp.near[1] + kp.far[1]) / 2 + 84 * L.KS;
      L.imp = [yAt(L, impAt(L_FIX, L_OLD, 1)), yAt(L, impAt(L_ST, L_FIX, 2))];
      L.rung = [L.imp[0] + 12 - L.kfy, L.imp[1] + 12 - L.kfy];
      L.kx = L.XA - L.kfx; L.lx = L.kx - LUNGE; L.kd = L.lx - L.KD / 0.8 * L.KS * 1.25;
      // the crate at Kit's feet, in front of her boots: the blocks the corrections take off drop into it
      L.CW = L.BW + (port ? 80 : 70); L.CH = port ? 108 : 116; L.cx = Math.max(L.CW / 2 + 10, L.kd - 20);
      // the phone's chalkboard: only the line that changes, big, up under the banner
      if (port) L.pb = { x: 700, top: 170, w: 740, h: 256, gy: L.bgy };
      return L;
    }
    /* where an imprint sits in a ghost band (levels lo..hi): a one-line word goes inside one whole ghost block,
       so the block edges above and below it stay visible; two lines straddle the band's middle */
    function impAt(lo, hi, lines) {
      var c = Math.floor((lo + hi) / 2) + 0.5;
      return lines === 1 && c > lo + 0.3 && c < hi - 0.3 ? c : (lo + hi) / 2;
    }
    /* level (in blocks) -> y, matching the blocks' 4 px gaps */
    function yAt(L, l) { var i = Math.floor(l), f = l - i; return L.base - i * L.BH - 4 - f * (L.BH - 4); }
    function yLine(L, i) { return L.base - i * L.BH; }

    /* ---------------- the set pieces ---------------- */
    function banner(L) {                                             // the film's ribbon banner (s11 header)
      var cx = L.W / 2, x0 = cx - L.banW / 2, x1 = cx + L.banW / 2, y0 = L.banY, y1 = y0 + 98, ty0 = y0 + 24, ty1 = y1 + 24, s = '';
      s += path('M' + N(x0 + 90) + ',' + (y0 + 6) + ' L' + N(x0 + 90) + ',-40 M' + N(x1 - 90) + ',' + (y0 + 6) + ' L' + N(x1 - 90) + ',-40', 'none', 4);
      var b = path('M' + N(x0 + 40) + ',' + ty0 + ' L' + N(x0 - 70) + ',' + ty0 + ' L' + N(x0 - 38) + ',' + N((ty0 + ty1) / 2) + ' L' + N(x0 - 70) + ',' + ty1 + ' L' + N(x0 + 40) + ',' + ty1 + ' Z', C.paper, 6);
      b += path('M' + N(x1 - 40) + ',' + ty0 + ' L' + N(x1 + 70) + ',' + ty0 + ' L' + N(x1 + 38) + ',' + N((ty0 + ty1) / 2) + ' L' + N(x1 + 70) + ',' + ty1 + ' L' + N(x1 - 40) + ',' + ty1 + ' Z', C.paper, 6);
      b += path('M' + N(x0) + ',' + (y1 - 2) + ' L' + N(x0 + 40) + ',' + ty1 + ' L' + N(x0 + 40) + ',' + (y1 - 2) + ' Z', C.tan, 5);
      b += path('M' + N(x1) + ',' + (y1 - 2) + ' L' + N(x1 - 40) + ',' + ty1 + ' L' + N(x1 - 40) + ',' + (y1 - 2) + ' Z', C.tan, 5);
      b += path('M' + N(x0) + ',' + y0 + ' Q' + N(cx) + ',' + (y0 - 12) + ' ' + N(x1) + ',' + y0 + ' L' + N(x1) + ',' + y1 + ' Q' + N(cx) + ',' + (y1 - 12) + ' ' + N(x0) + ',' + y1 + ' Z', C.cream, 7);
      s += S.cel(b);
      s += K.text('STRIPERS KILLED BY FISHING', cx + 1, y0 + 68, { size: L.banS, font: 'title', fill: C.brick, stroke: INK, strokeW: 5, spacing: 2, rot: -1.5 });
      return s;
    }
    function gillnet(L, dr) {                                          // a small gillnet drifting behind the commercial post
      var h = Math.max(24, L.dock - L.hz - 40), x = (L.port ? 330 : L.XC - 170) + ((dr >> 1) % 2) * 8;
      return '<g opacity=".9">' + K.gillnet({ x: x, y: L.hz + 22, w: L.port ? 300 : 360, h: h, mesh: 30 }) + '</g>';
    }

    /* ---------------- the chalkboard ---------------- */
    /* the inputs, in chalk. Old figures are struck through once they are corrected; numbers you set yourself are in
       pink chalk. A correction is written in (polish D4): the strike draws across over three drawings, then the new
       figure appears left to right over four, and three flecks of chalk dust fall under the end of the strike. */
    var ROWLAB = { kept: 'KEPT', rel: 'RELEASED', rm: 'RELEASED FISH THAT DIE:', land: 'LANDED', disc: 'THROWN BACK DEAD' };
    function rowVals(id, full) {                                     // full: the corrected form, for sizing
      var fixedShown = full || (st8.fixed && !st8.hideRC), rmShown = full ? RM_NEW : st8.hideST && st8.prev ? st8.prev.rm : st8.rm, dsc = full ? DISC90 : st8.disc;
      if (id === 'kept') return fixedShown ? { old: S.m(R.keptOld, 2), v: S.m(R.kept, 2), w: 'kept' } : { v: S.m(R.keptOld, 2) };
      if (id === 'rel') return fixedShown ? { old: S.m(R.releasedOld, 1), v: S.m(R.released, 2), w: 'rel' } : { v: S.m(R.releasedOld, 1) };
      if (id === 'rm') return Math.abs(rmShown - RM_OLD) < 1e-6 ? { v: fmtP(RM_OLD), post: 'IN 100' } : { old: fmtP(RM_OLD), pre: 'ABOUT', v: fmtP(rmShown), post: 'IN 100', w: 'rm' };
      if (id === 'land') return { v: S.m(R.commLandings, 2) };
      return Math.abs(dsc - DISC) < 1e-6 ? { v: fmtP(DISC), post: 'IN 100' } : { old: fmtP(DISC), v: fmtP(dsc), post: 'IN 100', fill: C.pink, w: 'disc' };
    }
    function valsW(o, lab, big) {
      var gap = big * 0.3;
      return (o.old ? tw(o.old, big) + gap : 0) + (o.pre ? tw(o.pre, lab) + 10 : 0) + tw(o.v, big) + (o.post ? tw(o.post, lab) + 10 : 0);
    }
    function wAge(k) { var t = st8.wr[k]; return S.reduce || t == null || t < 0 ? 99 : stage.drawing - t; }
    function chalk(str, x, y, size, fill, op) { return (op ? '<g opacity="' + op + '">' : '') + K.text(str, N(x), N(y), { size: size, font: 'hand', fill: fill || C.cream, anchor: 'start' }) + (op ? '</g>' : ''); }
    function chalkVals(x, y, o, lab, big, xMax) {
      var s = '', g = '', cr = C.cream, gap = big * 0.3;
      if (o.old && x + valsW(o, lab, big) > xMax) o = { v: o.v, pre: o.pre, post: o.post, fill: o.fill };    // no room: the struck figure gives way
      var a = o.w ? wAge(o.w) : 99;
      if (o.old) {
        var w0 = tw(o.old, big), sy = y - big * 0.3, f = a >= 2 ? 1 : (a + 1) / 3;
        s += chalk(o.old, x, y, big, cr, 0.5);
        s += '<path d="M' + N(x - 4) + ',' + N(sy) + ' q' + N(w0 / 2) + ',-7 ' + N(w0 + 8) + ',3" fill="none" stroke="' + cr + '" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="' + (1 - f).toFixed(3) + '"/>';
        if (a === 3 || a === 4) {                                    // chalk dust off the end of the strike
          var ex = x + w0 + 4, fall = a === 3 ? 8 : 20, op = a === 3 ? 0.9 : 0.45;
          [[-12, 0], [-2, 7], [7, 3]].forEach(function (q) { s += '<circle cx="' + N(ex + q[0]) + '" cy="' + N(sy + 10 + fall + q[1]) + '" r="4" fill="' + cr + '" opacity="' + op + '"/>'; });
        }
        x += w0 + gap;
      }
      var gx = x;
      if (o.pre) { g += chalk(o.pre, x, y, lab, o.fill); x += tw(o.pre, lab) + 10; }
      g += chalk(o.v, x, y, big, o.fill); x += tw(o.v, big);
      if (o.post) { g += chalk(o.post, x + 10, y, lab, o.fill); x += 10 + tw(o.post, lab); }
      if (o.old && a < 7) {                                          // written in, left to right
        if (a < 3) g = '';
        else {
          var id = 'wr' + o.w;
          g = '<clipPath id="' + id + '"><rect x="' + N(gx - 6) + '" y="' + N(y - big * 1.1) + '" width="' + N((x - gx + 12) * (a - 2) / 4) + '" height="' + N(big * 1.5) + '"/></clipPath>' +
            '<g clip-path="url(#' + id + ')">' + g + '</g>';
        }
      }
      return s + g;
    }
    /* the laptop's board: every input */
    function board(L) {
      var x0 = L.bx - L.bw / 2 + 34, top = L.bgy - L.bleg - L.bh, s = '';
      s += S.shadow(L.bx, L.bgy, L.bw * 0.7) + S.longShadow(L.bx, L.bgy, L.bw * 0.5, L.bleg + L.bh);
      s += S.cel(K.chalkboard({ x: L.bx, y: L.bgy, w: L.bw, h: L.bh, legH: L.bleg }));
      var lab = L.lab, big = L.big, y = top + 22, xMax = L.bx + L.bw / 2 - 22;
      function head(str) { y += lab * 1.16; s += chalk(str, x0, y, lab, C.mustard); s += path('M' + N(x0) + ',' + N(y + 8) + ' h' + N(tw(str, lab) + 6), 'none', 3.5, ' opacity=".7"', C.mustard); y += 6; }
      function row(id) {                                             // the figures shrink a little rather than drop the struck one
        y += big * L.rowK; s += chalk(ROWLAB[id], x0, y, lab);
        var xv = x0 + tw(ROWLAB[id], lab) + 16, k = Math.min(1, (xMax - xv) / valsW(rowVals(id, true), lab, big) * 0.98);
        s += chalkVals(xv, y, rowVals(id), lab * k, big * k, xMax);
      }
      head('ANGLERS'); row('kept'); row('rel');
      y += lab * 1.12; s += chalk(ROWLAB.rm, x0, y, lab);
      y += big * (L.rowK - 0.04); s += chalkVals(x0 + 20, y, rowVals('rm'), lab, big, xMax);
      y += 6; head('COMMERCIAL, NOT REVISED'); row('land'); row('disc');
      return s;
    }
    /* the phone's board: only the line (or, for the recount, the two lines) that changes at this step, in chalk big
       enough to read. It pops on when its line changes. */
    function twoLine(id) { return id === 'rm' || id === 'disc'; }
    function boardPhone(L) {
      var ids = st8.pb; if (!ids || !ids.length) return '';
      var LB = 58, BG = 98, P = L.pb, s = '', x0 = P.x - P.w / 2 + 34, xMax = P.x + P.w / 2 - 26, avail = xMax - x0, k = 1;
      ids.forEach(function (id) {
        var o = rowVals(id, true), need = twoLine(id) ? Math.max(tw(ROWLAB[id], LB), 20 + valsW(o, LB, BG)) : tw(ROWLAB[id], LB) + 16 + valsW(o, LB, BG);
        k = Math.min(k, avail / need * 0.96);
      });
      var lab = LB * k, big = BG * k, hs = ids.map(function (id) { return twoLine(id) ? lab * 1.2 + big * 1.02 : big * 1.12; });
      var tot = hs.reduce(function (a, b) { return a + b; }, 0), y = P.top + (P.h - tot) / 2 - 8;
      var inner = S.shadow(P.x, P.gy, P.w * 0.7) + S.cel(K.chalkboard({ x: P.x, y: P.gy, w: P.w, h: P.h, legH: P.gy - P.top - P.h }));
      ids.forEach(function (id, i) {
        if (twoLine(id)) { y += lab * 1.2; inner += chalk(ROWLAB[id].replace(/:$/, ''), x0, y, lab); y += big * 1.02; inner += chalkVals(x0 + 20, y, rowVals(id), lab, big, xMax); }
        else { y += big * 1.12; inner += chalk(ROWLAB[id], x0, y, lab); inner += chalkVals(x0 + tw(ROWLAB[id], lab) + 16 * k, y, rowVals(id), lab, big, xMax); }
      });
      var pa = st8.pbT >= 0 ? stage.drawing - st8.pbT : 99, pk = pa >= 0 && pa < 3 && !S.reduce ? [0.9, 1.05, 1][pa] : 1;
      s += around(P.x, P.gy, pk, inner);
      return s;
    }
    function boardRect(L) {                                          // the board's face, for the spotlight
      if (L.port) { var P = L.pb; return st8.pb.length ? [P.x - P.w / 2 - 18, P.top - 18, P.w + 36, P.h + 36] : null; }
      return null;
    }

    /* the tide staff between the frames: the stacks' scale, in millions of fish */
    function staff(L) {
      var x = L.XT, w = L.port ? 82 : 90, yt = yLine(L, NA) - 30, yb = L.base + 6, s = '', d = '', dd = '';
      s += S.shadow(x, L.GY, w) + S.longShadow(x, L.GY, w * 0.5, L.GY - yt);
      s += rect(x - 10, yb - 4, 20, L.GY - yb + 4, 3, C.brown, 7);
      s += S.cel(rect(x - w / 2, yt, w, yb - yt, 8, C.white, 6) + circ(x, yt - 4, 16, C.mustard, 6));
      for (var i = 1; i <= NA; i++) {
        var yy = yLine(L, i);
        if (i % 4) d += 'M' + N(x - w / 2 + 3) + ',' + N(yy) + ' h20 ';
        else dd += 'M' + N(x - w / 2 + 3) + ',' + N(yy) + ' H' + N(x + w / 2 - 3) + ' ';
      }
      s += path(d, 'none', 4) + path(dd, 'none', 7, '', C.brick);
      [1, 2, 3].forEach(function (m) { s += K.text(m + 'M', x + 6, yLine(L, m * 4) + L.big * 0.86, { size: L.big, font: 'label', fill: INK }); });
      return s;
    }
    /* the film's K.stack frame (wood cel-shaded; the blocks stay flat) */
    function frameWood(L, x, n) {
      var pw = L.pw, pht = n * L.BH + 60, top = L.GY - L.PH - pht, s = '';
      s += rect(x - 12, L.GY - L.PH - 10, 24, L.PH + 10, 3, C.brown, 7);
      s += rect(x - pw / 2 - 16, top - 16, pw + 32, pht + 32, 10, C.brown, 7) + rect(x - pw / 2, top, pw, pht, 4, C.cream, 4.5);
      return S.shadow(x, L.GY, pw * 0.5) + S.longShadow(x, L.GY, pw * 0.6, L.GY - top) + S.cel(s);
    }
    function frameTop(L, x, n) {
      var pw = L.pw, top = L.GY - L.PH - (n * L.BH + 60);
      return rect(x - pw / 2 + 6, L.base, pw - 12, 6, 2, C.brown, 0) + S.cel(rect(x - pw / 2 - 28, top - 26, pw + 56, 22, 8, C.brown, 5));
    }
    function blocks(L, x, solid, ghost, fill) {
      var s = '', bw = L.BW, bh = L.BH, n = Math.ceil(Math.max(solid, ghost) - 1e-6);
      for (var i = 0; i < n; i++) {
        var yb = L.base - i * bh - 4, hh = bh - 4, fs = S.clamp(solid - i, 0, 1), fg = S.clamp(ghost - i, 0, 1);
        if (fs > 0.03) s += rect(x - bw / 2, yb - fs * hh, bw, fs * hh, fs > 0.3 ? 5 : 2, fill, 5.5);
        if (fg > fs + 0.03) s += rect(x - bw / 2, yb - fg * hh, bw, (fg - fs) * hh, fs > 0.03 ? 2 : 5, 'none', 5, ' stroke-dasharray="10 7"', C.gray);
      }
      return s;
    }
    /* a piece of the anglers' stack (levels lo..hi) as it sat in the stack, drawn around its own middle */
    function pieceArt(L, lo, hi) {
      var s = '', c = (yAt(L, lo) + yAt(L, hi)) / 2, bw = L.BW;
      for (var i = Math.floor(lo); i < Math.ceil(hi - 1e-6); i++) {
        var a = Math.max(lo, i), b = Math.min(hi, i + 1), y0 = yAt(L, b), y1 = yAt(L, a);
        if (b - a < 0.03) continue;
        s += rect(-bw / 2, y0 - c, bw, Math.max(3, y1 - y0), b - a > 0.3 ? 5 : 2, C.avocado, 5.5);
      }
      return { svg: s, h: yAt(L, lo) - yAt(L, hi), c: c };
    }
    /* a name board standing on the frame's top bar on two short stakes */
    function nameBoard(L, x, top, str) {
      var w = tagW([str], L.tg) + 10, h = L.tg * 1.5, by = top - 26 - 22 - h, s = '';
      s += rect(x - w * 0.3 - 7, by + h - 6, 14, 30, 3, C.brown, 5) + rect(x + w * 0.3 - 7, by + h - 6, 14, 30, 3, C.brown, 5);
      s += S.cel(rect(x - w / 2, by, w, h, 12, C.cream, 7)) + '<rect x="' + N(x - w / 2 + 6) + '" y="' + N(by + 8) + '" width="' + N(w - 12) + '" height="' + N(h - 14) + '" rx="8" fill="none" stroke="' + S.SH.cream + '" stroke-width="3"/>';
      s += path('M' + N(x - w / 2 + 16) + ',' + N(by + 14) + ' l0,0 M' + N(x + w / 2 - 16) + ',' + N(by + 14) + ' l0,0', 'none', 8);
      s += K.text(str, x, by + h / 2 + L.tg * 0.3, { size: L.tg, font: 'label' });
      return s;
    }
    /* a two-line inked imprint (the film's imprint: the word with a cream halo, so ghost outlines stay readable) */
    function imprint(lines, col, fs, x, y, rot) {
      var lh = fs * 0.94, h = lines.length * lh, s = '';
      lines.forEach(function (l, i) { s += K.text(l, 0, N(-h / 2 + lh * i + fs * 0.78), { size: fs, font: 'label', fill: col, stroke: C.cream, strokeW: 6, spacing: 1 }); });
      return K.at(x, y, 1, rot, s);
    }
    /* the payoff stamp: a rubber-stamp box in brick, two lines */
    function bigStamp(x, y, fs, sc) {
      var w = Math.max(tw('BIGGER', fs, 'label'), tw('SHARE', fs, 'label')) + 64, h = fs * 2 + 40, s = '';
      s += '<rect x="' + N(-w / 2) + '" y="' + N(-h / 2) + '" width="' + N(w) + '" height="' + N(h) + '" rx="10" fill="' + C.white + '" fill-opacity=".55" stroke="' + C.brick + '" stroke-width="7" stroke-dasharray="46 6 20 5"/>';
      s += '<rect x="' + N(-w / 2 + 10) + '" y="' + N(-h / 2 + 10) + '" width="' + N(w - 20) + '" height="' + N(h - 20) + '" rx="5" fill="none" stroke="' + C.brick + '" stroke-width="3"/>';
      s += K.text('BIGGER', 0, -4, { size: fs, font: 'label', fill: C.brick, spacing: 2 }) + K.text('SHARE', 0, fs * 0.92, { size: fs, font: 'label', fill: C.brick, spacing: 2 });
      return K.at(x, y, sc, -8, s);
    }
    /* the crate at Kit's feet (a new prop in the film's props' style: tan planks, brown corner posts, ink line,
       cel-shaded), lettered with the same inked imprint as the stack: RECOUNT at the recount, RELEASE STUDY at the
       release study. crateBack is the far wall's top edge over the rim; pieces falling in go between the two. */
    function crateBack(L) { var w = L.CW, top = L.GY - L.CH; return rect(L.cx - w / 2 + 14, top - 14, w - 28, 22, 4, S.SH.brown, 5); }
    function crateFront(L) {
      var x = L.cx, w = L.CW, h = L.CH, y = L.GY, top = y - h, s = '', lbl = st8.crate, port = L.port;
      s += rect(x - w / 2, top, w, h, 5, C.tan, 6);
      s += path('M' + N(x - w / 2 + 20) + ',' + N(top + h * 0.5) + ' H' + N(x + w / 2 - 20), 'none', 4);
      s += path('M' + N(x - w / 2 + 40) + ',' + N(top + h * 0.26) + ' q30,-5 60,0 M' + N(x + w / 2 - 110) + ',' + N(top + h * 0.78) + ' q30,5 60,0', 'none', 3, '', S.SH.tan);
      s += rect(x - w / 2 - 6, top - 8, 28, h + 8, 4, C.brown, 5) + rect(x + w / 2 - 22, top - 8, 28, h + 8, 4, C.brown, 5);
      s += path('M' + N(x - w / 2 + 8) + ',' + N(top + 10) + ' l0,0 M' + N(x - w / 2 + 8) + ',' + N(y - 12) + ' l0,0 M' + N(x + w / 2 - 8) + ',' + N(top + 10) + ' l0,0 M' + N(x + w / 2 - 8) + ',' + N(y - 12) + ' l0,0', 'none', 7);
      var art = S.shadow(x, y, w * 1.05) + S.cel(s);
      var ly = top + h * 0.52 + 2;
      if (lbl === 1) art += imprint(['RECOUNT'], C.orange, port ? 48 : 44, x, ly - (port ? 22 : 20), -3);
      else if (lbl === 2) art += imprint(['RELEASE', 'STUDY'], C.sea, port ? 44 : 40, x, ly, 2);
      var ca = stage.drawing - st8.crateT, sa = stage.drawing - st8.sq;
      if (st8.crateT >= 0 && ca >= 0 && ca < 5 && !S.reduce) art = around(x, y, S.pop(ca, 4), art);            // the crate pops on as Kit lands
      else if (st8.sq >= 0 && sa === 0 && !S.reduce) art = '<g transform="translate(' + N(x) + ' ' + N(y) + ') scale(1.05 .93) translate(' + N(-x) + ' ' + N(-y) + ')">' + art + '</g>';
      var wa = stage.drawing - st8.swapT;                            // the label swaps in a puff, like Kit's stamps
      if (st8.swapT >= 0 && wa >= 0 && wa < 3 && !S.reduce) art += K.puff({ x: x, y: ly, r: (port ? 70 : 72) + wa * 10, seed: 6 });
      if (st8.sq >= 0 && sa >= 0 && sa < 2 && !S.reduce) art += K.puff({ x: x - w * 0.22, y: top - 8, r: 26 + sa * 8, seed: 3 }) + K.puff({ x: x + w * 0.24, y: top - 12, r: 22 + sa * 8, seed: 5 });
      return art;
    }

    /* ---------------- the roller shade on the ANGLERS frame (ported from s11) ---------------- */
    var RING_TH = [0, 90, 180, 270, 335, 250, 150, 205];            // the pull ring whipping round, degrees from straight up
    function rollerBody(L) {
      var x0 = L.XA - L.RH, x1 = L.XA + L.RH, RY = L.RY, RH = L.RH;
      return rect(x0, RY - 20, 2 * RH, 40, 20, C.mustard, 6) +
        path('M' + N(x0 + 30) + ',' + N(RY - 7) + ' q' + N(RH - 30) + ',-8 ' + N(2 * RH - 60) + ',0 M' + N(x0 + 40) + ',' + N(RY + 8) + ' q' + N(RH - 40) + ',6 ' + N(2 * RH - 80) + ',0', 'none', 3.5) +
        rect(x0 - 14, RY - 16, 16, 32, 4, C.brown, 5) + rect(x1 - 2, RY - 16, 16, 32, 4, C.brown, 5);
    }
    function roller(L, d) {                                          // d = drawings since the snap (null or -1 = at rest)
      var x0 = L.XA - L.RH, x1 = L.XA + L.RH, RY = L.RY, s = '', ring = '';
      var spin = d != null && d >= 0 && d < 6, fp = spin ? d % 3 : -1, fx0 = x0 + 8, fx1 = x1 - 8;
      function hem(yy) { return rect(fx0 - 6, yy, fx1 - fx0 + 12, 20, 6, C.brown, 6); }
      if (fp === 0) s += path('M' + N(fx0) + ',' + (RY - 8) + ' L' + N(fx0 + 14) + ',' + (RY - 70) + ' L' + N(fx1 + 14) + ',' + (RY - 70) + ' L' + N(fx1) + ',' + (RY - 8) + ' Z', C.mustard, 6) + '<g transform="translate(14 0)">' + hem(RY - 84) + '</g>';
      if (fp === 2) s += rect(fx0, RY + 4, fx1 - fx0, 62, 3, C.mustard, 6) + hem(RY + 58);
      s += rollerBody(L);
      if (fp === 1) s += path('M' + N(fx0) + ',' + (RY - 21) + ' Q' + N(L.XA) + ',' + (RY - 34) + ' ' + N(fx1) + ',' + (RY - 21) + ' L' + N(fx1) + ',' + (RY + 4) + ' L' + N(fx0) + ',' + (RY + 4) + ' Z', C.mustard, 6) + hem(RY + 2);
      if (spin) s += path('M' + N(x0 - 26) + ',' + (RY - 34) + ' a38,38 0 0 0 0,68 M' + N(x0 - 48) + ',' + (RY - 22) + ' a26,26 0 0 0 0,44 M' + N(x1 + 26) + ',' + (RY - 34) + ' a38,38 0 0 1 0,68', 'none', 7);
      var RPX = x1 - 4, CORD = 60, RING = 14;
      var th = d != null && d >= 0 && d < RING_TH.length ? RING_TH[d] : 180, a = th * Math.PI / 180, ex = RPX + CORD * Math.sin(a), ey = RY - CORD * Math.cos(a);
      ring += path('M' + N(RPX) + ',' + RY + ' L' + N(RPX + (CORD - RING) * Math.sin(a)) + ',' + N(RY - (CORD - RING) * Math.cos(a)), 'none', 5);
      ring += circ(RPX, RY, 6, INK, 0) + circ(ex, ey, RING, 'none', 10) + circ(ex, ey, RING, 'none', 4, C.mustard);
      if (d != null && d >= 0 && d < 5) [CORD - 18, CORD + 20].forEach(function (r) {
        var a0 = a - 95 * Math.PI / 180, a1 = a - 24 * Math.PI / 180;
        ring += path('M' + N(RPX + r * Math.sin(a0)) + ',' + N(RY - r * Math.cos(a0)) + ' A' + r + ',' + r + ' 0 0 1 ' + N(RPX + r * Math.sin(a1)) + ',' + N(RY - r * Math.cos(a1)), 'none', 7);
      });
      return { roller: s, ring: ring, at: [ex, ey] };
    }
    function shadeDown(L, yb) {                                      // the cloth pulled down to its hem slat at yb
      var XA = L.XA, SH = L.pw / 2, x0 = XA - SH, x1 = XA + SH, ys = yb - 18, RY = L.RY, s = '', k = SH / 110;
      var n = 5, sw = (x1 - x0) / n, dip = 24, sc = 'M' + N(x0) + ',' + N(ys + 6) + ' L' + N(x0) + ',' + N(yb);
      for (var i = 0; i < n; i++) sc += ' Q' + N(x0 + sw * (i + 0.5)) + ',' + N(yb + dip * 2) + ' ' + N(x0 + sw * (i + 1)) + ',' + N(yb);
      s += path(sc + ' L' + N(x1) + ',' + N(ys + 6) + ' Z', C.mustard, 5);
      var ch = ys + 4 - RY, f = ch / 452;
      function fy(o) { return N(RY + o * f); }
      function fx(o) { return N(XA + o * k); }
      var folds = 'M' + fx(-60) + ',' + fy(28) + ' Q' + fx(-70) + ',' + fy(176) + ' ' + fx(-56) + ',' + fy(356) + ' M' + fx(4) + ',' + fy(32) + ' Q' + fx(14) + ',' + fy(126) + ' ' + fx(2) + ',' + fy(216) + ' M' + fx(62) + ',' + fy(416) + ' Q' + fx(52) + ',' + fy(296) + ' ' + fx(66) + ',' + fy(176);
      var lights = 'M' + fx(-48) + ',' + fy(48) + ' Q' + fx(-57) + ',' + fy(176) + ' ' + fx(-45) + ',' + fy(328) + ' M' + fx(16) + ',' + fy(48) + ' Q' + fx(25) + ',' + fy(126) + ' ' + fx(14) + ',' + fy(200) + ' M' + fx(74) + ',' + fy(400) + ' Q' + fx(65) + ',' + fy(296) + ' ' + fx(77) + ',' + fy(196);
      s += rect(x0, RY, x1 - x0, ch, 3, C.mustard, 5);
      if (ch > 60) s += path(lights, 'none', 5, '', S.HI.mustard) + path(folds, 'none', 4);
      s += rect(x0 - 6, ys, x1 - x0 + 12, 18, 6, C.brown, 5);
      var ry = yb + dip + 14 + 17;
      s += path('M' + N(XA) + ',' + N(yb - 4) + ' L' + N(XA) + ',' + N(ry - 17), 'none', 5) + circ(XA, yb - 3, 5, INK, 0);
      s += circ(XA, ry, 17, 'none', 13) + circ(XA, ry, 17, 'none', 5, C.mustard);
      return { svg: s + rollerBody(L), ring: [XA, ry] };
    }

    /* ---------------- a piece in flight: off the stack, into the crate or into Kit's hands ---------------- */
    function catchAt(L) {                                            // where Kit holds a caught piece (the middle of her cradling hands)
      var kp = K.kidPoints({ pose: 'cradle', x: L.kd, y: L.GY, scale: L.KS });
      return [(kp.near[0] + kp.far[0]) / 2 - 6, (kp.near[1] + kp.far[1]) / 2];
    }
    /* where the flying piece is: {x, y (its middle), rot, k (scale), inside (behind the crate's front)} */
    function flyPos(L) {
      var f = st8.fly; if (!f) return null;
      var P = pieceArt(L, f.lo, f.hi), x0 = L.XA, y0 = P.c, mx = L.cx, my = L.GY - L.CH - P.h * 0.2, hand = catchAt(L), d = f.d;
      if (d === 0) return { P: P, x: x0 - 6, y: y0 - 16, rot: -3, k: 1.08, lift: true };
      var tx = f.last ? hand[0] : mx, ty = f.last ? hand[1] - P.h / 2 + 4 : my;
      if (d <= 3) {
        var t = d / 4, H = 150;
        return { P: P, x: S.lerp(x0, tx, t), y: S.lerp(y0 - 16, ty, t) - 4 * H * t * (1 - t), rot: S.lerp(-3, f.last ? -8 : -24, t), k: 1, speed: true };
      }
      if (!f.last) return d === 4 ? { P: P, x: mx, y: my + P.h * 0.35, rot: -8, k: 1, inside: true } : null;
      if (d <= 6) return { P: P, x: tx, y: ty + (d === 4 ? 6 : 0), rot: d === 4 ? -6 : -3, k: 1 };      // caught: held three drawings
      if (d === 7) return { P: P, x: S.lerp(tx, mx, 0.6), y: S.lerp(ty, my, 0.6), rot: 6, k: 1 };
      return d === 8 ? { P: P, x: mx, y: my + P.h * 0.35, rot: 3, k: 1, inside: true } : null;
    }
    function flyArt(L, q) {
      var s = '<g transform="translate(' + N(q.x) + ' ' + N(q.y) + ') rotate(' + q.rot + ') scale(' + q.k + ')">' + q.P.svg + '</g>';
      if (q.lift) s += K.impact({ x: L.XA - L.BW * 0.62, y: q.y + 6, r: 24, fill: C.white }) + K.impact({ x: L.XA + L.BW * 0.6, y: q.y - 4, r: 20, fill: C.avocado, spin: 0.5 });
      if (q.speed) s += K.speedLines({ x: q.x + L.BW * 0.62, y: q.y - 8, rot: 0, len: 90, n: 3, gap: 22, w: 5 });
      return s;
    }

    /* ---------------- the stage ---------------- */
    var stage = api.stage(function (st) {
      var L = lay(st), port = L.port, dr = st.drawing, s = S.set.dock(st, { hz: L.hz, dock: L.dock, sun: !port }).svg;
      var aSolid = st8.dispL != null ? st8.dispL : lv(angM()), aGhost = Math.max(L_OLD, aSolid);
      var capL = lv(discM());
      s += gillnet(L, dr);
      var fl = (dr >> 1) % 2;                                          // two gulls over the pier, flapping on twos
      s += K.gull({ x: port ? 250 : 190, y: port ? 200 : 210 + L.dy * 0.35, scale: port ? 0.6 : 0.7, flap: fl }) + K.gull({ x: port ? 360 : 320, y: port ? 245 : 262 + L.dy * 0.35, scale: port ? 0.45 : 0.5, flap: 1 - fl });
      s += banner(L);
      s += port ? boardPhone(L) : board(L);
      s += staff(L);

      /* COMMERCIAL: landed blocks (brick), the dashed "?" cap for dead discards, NOT REVISED on its post */
      s += frameWood(L, L.XC, NC) + blocks(L, L.XC, L_LAND, 0, C.brick);
      var ya = yAt(L, L_LAND), yb2 = yAt(L, L_LAND + capL), bw = L.BW;
      s += rect(L.XC - bw / 2, yb2, bw, Math.max(4, ya - yb2), 5, C.pink, 5, ' fill-opacity=".45" stroke-dasharray="12 8"', C.brick);
      var capH = ya - yb2, qs = S.clamp(78 + capH * 0.3, 78, 124), qIn = capH > qs * 0.8, qy = qIn ? (ya + yb2) / 2 : yb2 - qs * 0.42;
      s += frameTop(L, L.XC, NC);
      s += K.qmark({ x: L.XC, y: qy + qs * 0.36, size: qs, color: C.brick, rot: 6 });
      if (st8.ghost90) {
        var yg = yAt(L, L_LAND + lv(R.commLandings * DISC90 / 100)), ga = age90();
        if (ga > 0) {
          var gy = S.lerp(ya, yg, Math.min(1, ga / 6));
          s += rect(L.XC - bw / 2 - 8, gy, bw + 16, ya - gy, 6, 'none', 6, ' stroke-dasharray="14 10"', C.brick);
          if (ga >= 6) s += hang(L.XC - bw / 2 - 8, gy + 8, { x: L.XC - (port ? 150 : 200), y: gy - 70, w: tagW(['1990s ESTIMATE:', '80 IN 100'], L.tg * 0.8), h: L.tg * 0.8 * 2.4 + 26, band: C.brick, rot: -3, lines: ['1990s ESTIMATE:', '80 IN 100'], size: L.tg * 0.8 });
        }
      }
      var hint = st8.turn && !st8.tried;
      if (!(port && (st8.say || st8.kq || hint))) {
        var rl = port ? ['TOP', 'RESEARCH', 'PRIORITY'] : ['TOP RESEARCH', 'PRIORITY'], rtx = port ? 968 : L.XC + 330, rty = port ? 800 + L.dy : yAt(L, L_LAND) - 16;
        s += hang(L.XC + qs * 0.32, qy - qs * 0.1, { x: rtx, y: rty, w: tagW(rl, L.tg), h: L.tg * (rl.length * 1.15 + 0.05) + 30, band: C.brick, rot: 2, lines: rl, size: L.tg });
      }
      s += nameBoard(L, L.XC, L.topC, 'COMMERCIAL');
      var nrw = tagW(['NOT REVISED'], L.tg);
      s += hang(L.XC, port ? L.base - 2 : L.GY - L.PH + 6, { x: L.XC + (port ? 26 : 30), y: L.GY - L.PH + (port ? 20 : 42), w: nrw, h: L.tg * 1.5 + 20, band: C.brick, rot: -2, lines: ['NOT REVISED'], size: L.tg });

      /* ANGLERS: kept + released that die (avocado); the corrected-away blocks leave gray ghosts behind */
      s += frameWood(L, L.XA, NA) + blocks(L, L.XA, aSolid, aGhost, C.avocado);
      s += frameTop(L, L.XA, NA);
      var showRC = st8.fixed && !st8.hideRC, showST = Math.abs(st8.rm - RM_NEW) < 1e-6 && !st8.hideST;
      if (showRC) s += imprint(['RECOUNT'], C.orange, port ? 48 : 44, L.XA + 4, L.imp[0], -3);
      if (showST) s += imprint(['RELEASE', 'STUDY'], C.sea, port ? 44 : 40, L.XA + 6, L.imp[1], 2);
      // the notches the shade stops at (brick teeth on the frame's right edge)
      [L_FIX, L_ST].forEach(function (l) {
        var yy = yAt(L, l), xr = L.XA + L.pw / 2 + 16;
        s += path('M' + N(xr + 2) + ',' + N(yy - 14) + ' L' + N(xr - 16) + ',' + N(yy) + ' L' + N(xr + 2) + ',' + N(yy + 14) + ' Z', C.brick, 4);
      });
      // the shade: pulled down by the step, snapping up and spinning on release
      var sh = '', ringAt;
      if (st8.pull != null) { var sp = shadeDown(L, S.lerp(L.RY + 30, yAt(L, st8.pullL), st8.pull)); sh += sp.svg; ringAt = sp.ring; }
      else if (st8.spin === 0) { var s0 = shadeDown(L, S.lerp(L.RY + 30, yAt(L, st8.snapL), 0.45)); sh += s0.svg; ringAt = s0.ring; sh += K.speedLines({ x: L.XA - 50, y: L.RY + 40, rot: 90, len: 120, n: 3, gap: 50, w: 5 }); }
      else { var ro = roller(L, st8.spin > 0 ? st8.spin - 1 : null); sh += ro.roller + ro.ring; }
      s += sh;
      s += nameBoard(L, L.XA + (port ? 84 : 70), L.topA, 'ANGLERS');

      /* the stepladder, Kit, and the crate at her feet (the pieces fall in between its far wall and its front) */
      var q = flyPos(L);
      s += ladder(L) + kit(L, st);
      if (st8.crate) s += crateBack(L) + (q && q.inside ? flyArt(L, q) : '') + crateFront(L);
      if (q && !q.inside) s += flyArt(L, q);

      /* the Striper: points at commercial; shrugs as the "?" grows; surprised the first time the reader lands on the 1990s estimate */
      var raised = st8.disc > DISC + 0.05, surpr = st8.surp >= 0 && (S.reduce ? Math.abs(st8.disc - DISC90) < 1e-6 : dr - st8.surp < 12);
      var so = { x: L.SX, y: L.GY + 6, scale: L.SS, flip: true, pose: raised ? 'shrug' : 'point', expr: surpr ? 'surprised' : raised ? 'sheepish' : 'kind', look: raised || surpr ? 'cam' : [1, 0.15], blink: !surpr && (dr % 44) === 7 };
      if (st8.talk >= 0) { so.pose = 'point'; so.expr = 'talk'; so.look = [1, 0.1]; so.mouth = st8.talk % 3 === 2 ? 'closed' : 'open'; }
      else if (st8.ktalk >= 0) so.look = [1, 0.3];
      else if (!surpr) {
        so.squash = S.breath(st);
        if (st8.turn) { var slk = S.lookAt(stage, K.striperPoints(so).eye, so.flip); if (slk) so.look = slk; }
      }
      s += S.shadow(L.SX, L.GY + 6, 250 * L.SS) + K.striper(so);

      s += spotlight(L);
      /* the payoff: BIGGER SHARE lands on the commercial frame; Kit asks, the Striper answers (the film at 2:40) */
      var aDown = lv(angM()) < L_OLD - 0.5;
      if (st8.paid && aDown && st8.pay > 0 && !(port && st8.ghost90)) {          // (on a phone the 1990s tag needs its room)
        var seqS = [1.9, 0.9, 1.07, 1], sc = st8.pay >= 99 ? 1 : seqS[Math.min(3, st8.pay - 1)];
        var bx = L.XC, by = L.topC + (port ? 64 : 70);
        if (st8.pay < 4) s += K.impact({ x: bx - 150, y: by - 30, r: 34, fill: C.white }) + K.impact({ x: bx + 150, y: by + 20, r: 30, fill: C.brick, spin: 0.5 });
        s += bigStamp(bx, by, port ? 48 : 44, sc);
      }
      if (st8.kq) {
        var kh = K.kidPoints({ pose: 'stamp', x: L.kd, y: L.GY, scale: L.KS });
        s += port ? S.say('So commercial didn’t go up?', 140, 625, 264, kh.top[0] + 30, kh.top[1] + 20, { size: 40 })
          : S.say('So commercial didn’t go up?', 196, 470 + L.dy, 340, kh.top[0] + 40, kh.top[1] + 24, { size: 40 });
      }
      if (st8.say) {
        var sp2 = K.striperPoints({ x: L.SX, y: L.GY + 6, scale: L.SS, flip: true, pose: 'point' });
        s += port ? S.say('Nope. The anglers’ side came down.', 800, 560 + L.dy, 470, sp2.nose[0] - 10, sp2.nose[1] + 6, { size: 44 })
          : S.say('Nope. The anglers’ side came down.', 1758, 470 + L.dy, 316, sp2.nose[0] - 10, sp2.nose[1] + 8, { size: 40 });
      }
      /* the hint in the reader's turn, until the slider moves: a tag over the Striper, bobbing on twos, pointing down
         to the slider under the picture */
      if (hint) {
        var hb = (dr >> 1) % 2 ? 6 : 0, hl = ['SLIDE THE', 'BOBBER'], hs = port ? 40 : 36, hw = tagW(hl, hs), hx = port ? 952 : Math.min(L.W - hw / 2 - 14, L.SX + 6), hy = (port ? 790 : 470 + L.dy) + hb;
        s += S.tag({ x: hx, y: hy, w: hw, h: hs * 2.3 + 30, band: C.mustard, fill: C.mustard, rot: -3, lines: hl, size: hs });
        var ay = hy + hs * 1.15 + 30;
        s += path('M' + N(hx - 22) + ',' + N(ay) + ' L' + N(hx) + ',' + N(ay + 26) + ' L' + N(hx + 22) + ',' + N(ay) + ' Z', C.brick, 5);
      }
      return s;
    }, function () {
      var a = angM(), a0 = A_OLD;
      return 'Stripers killed by fishing in 2025, drawn as blocks of 250,000 fish. Anglers: ' + r2(a) + ' million' + (a < a0 - 0.01 ? ', down from ' + r2(a0) + ' million in the old count (the gray ghost blocks; the blocks that came off are in the crate at Kit’s feet)' : '') +
        '. Commercial: ' + r2(R.commLandings) + ' million landed, not revised, plus about ' + Math.round(discM() * 1000) + ',000 thrown back dead (the dashed question mark).';
    });
    function r2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
    var g90 = -1;
    function age90() { return g90 < 0 ? 99 : stage.drawing - g90; }
    /* the spotlight (SITE.spot): the anglers' stack with Kit, her ladder and her crate, and their rows on the board;
       or the commercial side and its rows */
    function spotlight(L) {
      var f = st8.focus; if (!f) return '';
      var btop = L.bgy - L.bleg - L.bh, rs, pb = boardRect(L), x0 = Math.min(L.kd - 120, L.cx - L.CW / 2 - 16);
      if (f === 'anglers') rs = [[x0, L.topA - 110, L.XA + L.pw / 2 + 50 - x0, L.GY - L.topA + 140], L.port ? pb : [L.bx - L.bw / 2 - 16, btop - 16, L.bw + 32, L.bh * 0.58]];
      else { var gx = st8.ghost90 && !L.port ? 150 : 0; rs = [[L.XC - L.pw / 2 - 60 - gx, L.topC - 110, L.pw + 120 + gx + (L.port ? 120 : 330), L.GY - L.topC + 140], L.port ? pb : [L.bx - L.bw / 2 - 16, btop + L.bh * 0.55, L.bw + 32, L.bh * 0.5]]; }
      var d = st8.fz >= 0 ? stage.drawing - st8.fz - 1 : 99;
      return S.spot(L.W, L.H, rs.filter(Boolean), d >= 0 && d < 3 ? [0.33, 0.67, 0.9][d] : 1, 30);
    }

    function ladder(L) {                                             // front view, rungs where Kit stands for each stamp
      var x = L.lx, cap = L.rung[0] - 34 * L.KS / 0.8, k = L.KS / 0.8, s = '';
      var legs = 'M' + N(x - 50 * k) + ',' + L.GY + ' L' + N(x - 32 * k) + ',' + N(cap + 10) + ' M' + N(x + 50 * k) + ',' + L.GY + ' L' + N(x + 32 * k) + ',' + N(cap + 10);
      s += S.shadow(x, L.GY, 130 * k) + path(legs, 'none', 22 * k) + path(legs, 'none', 12 * k, '', C.brown);
      s += S.cel(rect(x - 46 * k, cap, 92 * k, 16, 5, C.brown, 5) + rect(x - 44 * k, L.rung[0], 88 * k, 12, 4, C.tan, 5) + rect(x - 48 * k, L.rung[1], 96 * k, 12, 4, C.tan, 5));
      for (var y = L.rung[1] + 80 * k; y < L.GY - 30; y += 80 * k) s += rect(x - 50 * k, y, 100 * k, 12, 4, C.tan, 5);
      return s;
    }
    /* Kit: waits on the dock, hops onto the ladder to stamp each correction, hops back down, watches the blocks come
       off into her crate and catches the last one */
    function spot(L, at) { return at === 'dock' ? [L.kd, L.GY] : at === 'r1' ? [L.lx, L.rung[1]] : [L.lx, L.rung[0]]; }
    function restColor() { return st8.fixed ? C.sea : C.orange; }
    function kit(L, st) {
      var k = st8.kit, col = k ? k.col : restColor(), at = k ? k.at : 'dock', p0 = spot(L, at);
      var o = { x: p0[0], y: p0[1], scale: L.KS, blink: (st.drawing % 40) === 3 }, fx = '', sh = at === 'dock';
      function raised(c) { return K.stamp({ x: 10, y: 127, scale: 0.8, label: PLATE, color: c }); }
      if (k && k.mode === 'hop') {                                    // an arc, the stamp in both hands
        var a = spot(L, k.from), b = spot(L, k.to), hp = k.p;
        o.x = S.lerp(a[0], b[0], hp); o.y = S.lerp(a[1], b[1], hp) - (hp < 1 ? Math.sin(hp * Math.PI) * 70 : 0); o.rot = hp < 1 ? (b[0] > a[0] ? 8 : -8) : 0;
        o.pose = 'stamp'; o.stampLabel = PLATE; o.stampColor = col; o.expr = 'eager'; o.look = [0.6, -0.3];
        if (hp >= 1) o.squash = 0.07;
        if (hp < 1) fx += K.speedLines({ x: o.x - (b[0] > a[0] ? 70 : -150), y: o.y - 200 * L.KS, len: 110, n: 3, gap: 30, w: 5 });
        sh = hp >= 1 && k.to === 'dock';
      } else if (k && k.mode === 'slam') {                            // one drawing on the blocks: squash, lean in, impact
        var kp = K.kidPoints({ pose: 'stamp', x: 0, y: 0, scale: L.KS }), rel = [(kp.far[0] - kp.near[0]) / 2 / L.KS, ((kp.far[1] - kp.near[1]) / 2 + 92 * L.KS) / L.KS];
        o.pose = 'stamp'; o.hold = K.stamp({ x: rel[0], y: rel[1], scale: 0.8, squash: 0.2, label: PLATE, color: col }); o.squash = 0.1; o.x = L.kx; o.expr = 'eager'; o.look = [0.6, 0.8];
        var iy = L.imp[at === 'r1' ? 1 : 0];
        fx += K.impact({ x: L.XA - L.BW * 0.66, y: iy + 10, r: 30, fill: C.white }) + K.impact({ x: L.XA + L.BW * 0.66, y: iy + 4, r: 26, fill: col });
        fx += K.speedLines({ x: L.XA + 40, y: iy - 90, rot: -90, len: 80, n: 2, gap: 70, w: 5 });
      } else if (k && (k.mode === 'windup' || k.mode === 'up')) {      // the stamp held high, clear of her face and the blocks
        o.pose = 'cheer'; o.hold = raised(col); o.look = [0.5, 0.9]; o.expr = k.mode === 'up' ? 'grin' : 'eager';
        if (k.puff >= 0) { o.expr = 'eager'; }
        if (k.mode === 'up' && k.d === 0) o.y -= 8;
      } else if (k && k.mode === 'watch') {                           // on the dock, watching the blocks come off
        o.pose = 'stamp'; o.stampLabel = PLATE; o.stampColor = col; o.expr = 'eager'; o.look = [0.9, -0.6];
      } else if (k && k.mode === 'catch') {                           // the last block in both hands
        o.pose = 'cradle'; o.expr = k.e; o.look = [0.4, 0.7];
        if (k.e === 'wide') o.squash = 0.06;
      } else {                                                        // on the dock, stamp in hand
        o.pose = 'stamp'; o.stampLabel = PLATE; o.stampColor = col; o.look = [0.6, -0.6];
        o.expr = st8.paid && lv(angM()) < L_OLD - 0.5 ? 'grin' : 'eager';
        if (st8.disc > DISC + 0.05) { o.expr = 'wide'; o.look = [1, 0]; }
        if (st8.pay > 0 && st8.pay < 6) o.expr = 'wide';
        if (st8.ktalk >= 0) { o.expr = 'talk'; o.mouth = st8.ktalk % 3 === 2 ? 'closed' : 'open'; o.look = [1, -0.2]; }
        else if (st8.kq) o.look = [1, -0.1];
        else if (st8.turn) { var lk = S.lookAt(stage, K.kidPoints(o).eye, o.flip); if (lk) o.look = lk; }
      }
      var s = (sh ? S.shadow(o.x, L.GY, 170 * L.KS) : '') + K.kid(o) + fx;
      if (k && k.puff >= 0) {                                         // swap stamps in a puff at the raised stamp
        var pp = K.kidPoints({ pose: 'cheer', x: o.x, y: o.y, scale: L.KS }).near;
        s += K.puff({ x: pp[0] + 24 * L.KS, y: pp[1] + 45 * L.KS, r: 46 + k.puff * 8, seed: 4 });
      }
      return s;
    }

    /* ---------------- moments ---------------- */
    function run(seq, done) {
      var total = 0; seq.forEach(function (x) { total += x.n; });
      st8.busy = true;
      stage.play(total, function (d) {
        var t = d;
        for (var i = 0; i < seq.length; i++) { if (t < seq[i].n || i === seq.length - 1) { seq[i].f(Math.min(t, seq[i].n - 1)); break; } t -= seq[i].n; }
      }, function () { settle(); stage.render(); show(); if (done) done(); });
    }
    function settle() {                                              // clear every in-between state
      st8.busy = false; st8.kit = null; st8.dispL = null; st8.spin = -1; st8.pull = null; st8.fly = null;
      st8.hideRC = false; st8.hideST = false; st8.talk = -1; st8.ktalk = -1; st8.prev = null; st8.cardState = null; if (st8.paid) st8.pay = 99;
    }
    /* the pieces a correction takes off the stack, top down, one block (or the part of one) at a time; a sliver under
       a third of a block goes with the piece above it */
    function pieces(from, to) {
      var out = [], hi = from;
      while (hi > to + 1e-6) { var lo = Math.max(to, Math.ceil(hi - 1e-6) - 1); out.push([lo, hi]); hi = lo; }
      for (var i = out.length - 1; i > 0; i--) if (out[i][1] - out[i][0] < 0.34) { out[i - 1][0] = out[i][0]; out.splice(i, 1); }
      return out;
    }
    /* a correction (b = 1 the recount, 2 the release study): the shade pulls down to its notch and snaps up, Kit
       stamps the band, hops down, the crate lands at her feet (or relabels), and the blocks lift off one at a time
       on twos with a small pop and drop into it. Kit catches the last one and drops it in. */
    function go(b) {
      if (st8.busy) { stage.animate(0); settle(); }
      var P = { fixed: st8.fixed, rm: st8.rm }, T = PRE[b], Lp = lv(angM(P)), Lt = lv(angM(T)), k1 = b === 1;
      var col = k1 ? C.orange : C.sea, at = k1 ? 'r0' : 'r1', ps = pieces(Lp, Lt);
      st8.prev = P; st8.fixed = T.fixed; st8.rm = T.rm; st8.disc = DISC; st8.say = false; st8.kq = false; st8.cardState = P;
      if (k1) st8.hideRC = true; else st8.hideST = true;
      st8.dispL = Lp; show();
      var seq = [];
      seq.push({ n: 3, f: function (d) { st8.pull = (d + 1) / 3; st8.pullL = Lt; } });
      seq.push({ n: 7, f: function (d) { st8.pull = null; st8.spin = d; st8.snapL = Lt; } });
      seq.push({ n: 2, f: function (d) { st8.spin = -1; st8.kit = { mode: 'hop', from: 'dock', to: at, p: (d + 1) / 2, col: col, at: at }; } });
      seq.push({ n: 2, f: function () { st8.kit = { mode: 'windup', at: at, col: col, puff: -1 }; } });
      seq.push({ n: 1, f: function () {
        st8.kit = { mode: 'slam', at: at, col: col };
        if (k1) { st8.hideRC = false; st8.wr.kept = st8.wr.rel = stage.drawing; } else { st8.hideST = false; st8.wr.rm = stage.drawing; }
        st8.cardState = null; show();
      } });
      seq.push({ n: 2, f: function (d) { st8.kit = { mode: 'up', at: at, col: col, d: d, puff: -1 }; } });
      seq.push({ n: 2, f: function (d) {
        st8.kit = { mode: 'hop', from: at, to: 'dock', p: (d + 1) / 2, col: col, at: 'dock' };
        if (d === 1) { if (k1) { st8.crate = 1; st8.crateT = stage.drawing; } else { st8.crate = 2; st8.swapT = stage.drawing; } }
      } });
      ps.forEach(function (pc, i) {
        var last = i === ps.length - 1;
        seq.push({ n: last ? 10 : 6, f: function (d) {
          st8.fly = { lo: pc[0], hi: pc[1], d: d, last: last }; st8.dispL = pc[0];
          if (last && d >= 4 && d <= 7) st8.kit = { mode: 'catch', at: 'dock', col: col, e: d === 4 ? 'wide' : 'grin' };
          else st8.kit = last && d > 7 ? null : { mode: 'watch', at: 'dock', col: col };
          if ((!last && d === 5) || (last && d === 9)) { st8.fly = null; st8.sq = stage.drawing; }
        } });
      });
      run(seq);
    }
    /* commercial didn't go up: BIGGER SHARE lands, Kit asks and the Striper answers, in the film's words */
    function payoff() {
      if (st8.busy) { stage.animate(0); settle(); }
      run([{ n: 6, f: function (d) { st8.paid = true; st8.pay = d + 1; } },
        { n: 14, f: function (d) { st8.pay = 99; st8.kq = true; st8.ktalk = d < 12 ? d : -1; } },
        { n: 16, f: function (d) { st8.ktalk = -1; st8.say = true; st8.talk = d < 14 ? d : -1; } }]);
    }

    /* ---------------- the walkthrough ---------------- */
    var STEPS = [
      { focus: null, cls: 'first', h: '<p><b>Every striper that dies from fishing counts:</b> the fish kept, and released fish that don’t survive. Anglers are on the left, commercial fishing on the right. All the numbers are for 2025, coastwide.</p>' },
      { focus: null, h: '<p>Each block is <b class="num">250,000</b> stripers, the same in both stacks.</p>' },
      { focus: 'anglers', h: '<p><b>Anglers, in the old count:</b> <b class="num">' + mil(A_OLD) + '</b> stripers killed. That’s the fish they kept, plus the released fish the assessment assumes die, 9 in every 100.</p>' },
      { focus: 'comm', h: '<p><b>Commercial:</b> about <b class="num">' + mil(C_NOW) + '</b> killed, fish landed plus fish thrown back dead. The recount didn’t touch these numbers.</p>' },
      { focus: 'anglers', h: '<p><b>The recount</b> found fewer stripers kept and fewer released. That trims the anglers’ side to <b class="num">' + mil(A_FIX) + '</b>.</p>' },
      { focus: 'anglers', h: '<p><b>A new study</b> by Micah Dean of the Massachusetts Division of Marine Fisheries found that about half as many released stripers die as the old 9 in 100 assumed, and the rate depends on fish size.</p>' },
      { focus: 'anglers', h: '<p>At about 4.5 in 100, anglers’ kills drop to <b class="num">' + mil(A_ST) + '</b>, if the assessment uses it.</p>' },
      { focus: null, h: '<p><b>Same commercial count, smaller anglers’ count.</b> So commercial fishing is a bigger part of the stripers killed than the old count showed.</p>' },
      { focus: 'comm', h: '<p><b>And the question mark.</b> The commercial discard figure comes from tagged fish that fishermen report. In the 1990s it ran as high as <b class="num">80 for every 100</b> landed. Scientists made it a top research priority.</p>' },
      { focus: null, cls: 'turn', h: '<span class="go">Your turn</span><p>The commercial discard figure is uncertain. Slide it from today’s estimate up to the 1990s one and watch the commercial stack.</p>' }
    ];
    var PLAY = STEPS.length - 1, OUTRO = STEPS.length;
    // the phone's board at each step: only the line that changes (none where nothing on it does)
    var PB = [[], [], ['rm'], ['disc'], ['kept', 'rel'], ['rm'], ['rm'], [], ['disc'], ['disc']];
    STEPS.forEach(function (d) { api.step(d.h, d.cls); });
    function focus(f) { if (f !== st8.focus) { st8.focus = f; st8.fz = stage.drawing; } }
    function board_(n, pop) {
      var ids = PB[Math.min(n, PB.length - 1)];
      if (ids.join() !== st8.pb.join()) { st8.pb = ids.slice(); st8.pbT = pop && ids.length ? stage.drawing + 1 : -99; }
    }
    /* the finished state of step n, drawn at once (a jump, a scroll back, or reduced motion); quiet: set it up
       without drawing, because the next step's entrance draws it */
    function snap(n, quiet) {
      if (st8.busy) { stage.animate(0); }
      settle();
      st8.fixed = n >= 4; st8.rm = n >= 6 ? RM_NEW : RM_OLD; st8.disc = DISC;
      st8.paid = n >= 7; st8.pay = n >= 7 ? 99 : 0; st8.say = st8.kq = n === 7;
      st8.ghost90 = n === 8; g90 = n === 8 ? stage.drawing - 20 : -1;
      st8.crate = n >= 6 ? 2 : n >= 4 ? 1 : 0; st8.crateT = st8.swapT = st8.sq = -99; st8.surp = -99; st8.wr = {};
      st8.turn = n >= PLAY; if (n < PLAY) st8.tried = false;
      st8.focus = STEPS[n] ? STEPS[n].focus : null; st8.fz = -99;
      st8.pb = PB[Math.min(n, PB.length - 1)].slice(); st8.pbT = -99;
      disc.set(DISC); disc.el.disabled = !st8.turn;
      api.playing(st8.turn); show();
      if (!quiet) stage.render();
    }
    /* step n's entrance, played from the finished state of step n - 1 */
    function enter(n) {
      if (STEPS[n]) focus(STEPS[n].focus);
      board_(n, true);
      if (n === 4) go(1);
      else if (n === 6) go(2);
      else if (n === 7) payoff();
      else if (n === 8) { st8.say = st8.kq = false; st8.ghost90 = true; g90 = stage.drawing; stage.animate(900); }
      else if (n === PLAY) { st8.turn = true; st8.ghost90 = false; st8.say = st8.kq = false; disc.el.disabled = false; api.playing(true); stage.animate(300); }
      else stage.animate(300);
    }
    api.onStep(function (n, prev) {
      if (n >= PLAY && prev >= PLAY) { if (n === OUTRO) closing(); return; }
      if (prev >= 0 && n === prev + 1 && !S.reduce) { snap(prev, true); enter(n); }
      else snap(n);
      if (n === OUTRO) closing();
    });
    function closing() { S.reward(api); }

    /* ---------------- under the picture: anglers + commercial = killed by fishing, and the reader's slider ---------------- */
    var css = S.el('style', null, document.head);
    css.textContent =
      '#removals .eq{display:flex;align-items:stretch;justify-content:center;gap:clamp(6px,.9vw,14px)}' +
      '#removals .chip{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:clamp(100px,10vw,170px);padding:8px 14px 6px;background:var(--white);border:3px solid var(--ink);border-radius:10px;box-shadow:4px 4px 0 var(--sh-tan)}' +
      '#removals .chip b{font:700 clamp(24px,2.3vw,38px)/1 var(--f-mono);font-variant-numeric:tabular-nums}' +
      '#removals .chip small{font:400 clamp(13px,1vw,16px)/1.15 var(--f-label);color:var(--muted);margin-top:5px;white-space:nowrap}' +
      '#removals .chip.ang{border-color:var(--ink);box-shadow:inset 0 -6px 0 var(--avocado),4px 4px 0 var(--sh-tan)}' +
      '#removals .chip.com{box-shadow:inset 0 -6px 0 var(--brick),4px 4px 0 var(--sh-tan)}' +
      '#removals .chip.pink{background:#f7d9d0}' +
      '#removals .chip.pop{animation:rmPop .3s steps(3,end)}@keyframes rmPop{0%{transform:scale(1.12)}60%{transform:scale(.97)}100%{transform:none}}' +
      '#removals .op{align-self:center;font:400 clamp(28px,2.6vw,44px)/1 var(--f-title)}' +
      '#removals .eqyr{display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:clamp(78px,7vw,112px);padding:6px 10px;border-radius:10px;border:3px solid var(--ink);background:var(--ink);color:var(--cream);transform:rotate(-2deg);box-shadow:4px 4px 0 var(--sh-tan)}' +
      '#removals .eqyr b{font:400 clamp(22px,2vw,32px)/1 var(--f-label);color:var(--mustard)}#removals .eqyr small{font:700 clamp(10px,.8vw,12px)/1.1 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;margin-top:3px}' +
      '#removals .sc-play{justify-content:center}#removals .sc-play .ctl{flex:1;max-width:760px}#removals .sc-play .rod{margin-top:20px}#removals .ticks span:last-child{transform:translateX(-88%)}#removals .ticks span:first-child{transform:translateX(-12%)}' +
      '#removals .pov .povtxt+.povtxt{margin-top:8px}' +
      '@media (max-aspect-ratio: 1/1), (max-width: 820px){#removals .eq{gap:4px}#removals .chip{min-width:0;flex:1;padding:5px 4px 4px}#removals .chip b{font-size:18px}#removals .chip small{font-size:11px;white-space:normal;text-align:center}#removals .op{font-size:22px}#removals .eqyr{min-width:52px;padding:4px 5px}#removals .eqyr b{font-size:17px}#removals .eqyr small{font-size:8.5px}#removals.playing .eq{display:none}#removals .pov::after{position:static;display:block;margin-top:4px}}' +
      '@media (prefers-reduced-motion: reduce){#removals .chip.pop{animation:none}}';
    var eq = S.el('div', { class: 'eq', 'aria-live': 'polite' }, api.bar);
    S.el('span', { class: 'eqyr' }, eq, '<b>2025</b><small>coastwide</small>');
    var cA = S.el('span', { class: 'chip ang' }, eq, '<b></b><small></small>'); S.el('span', { class: 'op', 'aria-hidden': 'true' }, eq, '+');
    var cC = S.el('span', { class: 'chip com' }, eq, '<b></b><small></small>'); S.el('span', { class: 'op', 'aria-hidden': 'true' }, eq, '=');
    var cT = S.el('span', { class: 'chip', 'data-big': '' }, eq, '<b></b><small></small>');
    function chip(c, v, sm, extra) {
      var b = c.querySelector('b');                                  // (compared with the value it is rolling to, so a quick change back still lands)
      if (b._to !== v) { b._to = v; if (/\d/.test(b.textContent)) S.countTo(b, v); else b.textContent = v; if (!S.reduce) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } }
      c.querySelector('small').innerHTML = K.esc(sm).replace(/\bwas (\d[\d,.]*M?)/, 'was <s class="was">$1</s>');     // the old figure, struck
      c.classList.toggle('pink', !!extra);
    }
    function r2(v) { return Math.round(v * 100) / 100; }
    function show() {
      // each part is rounded first and the total is built from the rounded parts, so the equation always adds up
      var a = r2(angM(st8.cardState || st8)), a0 = r2(A_OLD), c = r2(comM(st8)), c0 = r2(C_NOW), mine = Math.abs(st8.disc - DISC) > 1e-6;
      var t = r2(a + c), t0 = r2(a0 + c0);
      chip(cA, S.m(a, 2), Math.abs(a - a0) > 0.005 ? 'anglers, was ' + S.m(a0, 2) : 'killed by anglers');
      chip(cC, S.m(c, 2), mine ? 'commercial, your figure' : 'killed commercially', mine);
      chip(cT, S.m(t, 2), Math.abs(t - t0) > 0.005 ? 'all fishing, was ' + S.m(t0, 2) : 'killed by all fishing');
    }
    var playBox = S.el('div', { class: 'sc-play' }, api.bar);
    var disc = S.slider(playBox, { label: 'Commercial fish thrown back dead, for every 100 landed', min: 0, max: DISC90, step: 1, value: DISC, fmt: function (v) { return fmtP(v); },
      ticks: [{ v: DISC, t: fmtP(DISC) + ': today', hot: true }, { v: DISC90, t: '1990s estimate' }],        // (no 80 here: the closing's Chesapeake 8 in 10 shares this screen)
      snaps: [{ v: DISC, r: 0.7 }, { v: DISC90, onSnap: at90 }],
      onInput: function (v) {
        if (!st8.turn) return;
        if (st8.busy) { stage.animate(0); settle(); }
        var was = st8.disc, write = Math.abs(was - DISC) < 1e-6 && Math.abs(v - DISC) > 1e-6;
        st8.disc = v; st8.tried = true;
        if (write) st8.wr.disc = stage.drawing + 1;                  // the reader's figure is written in on the board
        stage.animate(write || wAge('disc') < 8 ? 700 : 250); show();
      } });
    // the first time the reader lets go on the 1990s estimate, the Striper looks surprised (once per visit)
    var surprised = false;
    function at90() {
      if (surprised || !st8.turn) return;
      surprised = true; st8.surp = stage.drawing + 1; stage.animate(1000);
    }

    api.take('Both corrections shrink the anglers’ side. Commercial numbers weren’t revised, so commercial fishing is now a bigger share of the stripers killed. How much bigger depends partly on the commercial discard estimate, which the assessment scientists have made a top research priority. Anglers still account for more of the stripers killed, but commercial’s slice is bigger than the old count showed.');
    api.pov('ASGA notes that about 8 in 10 commercially harvested stripers, counted by number of fish, come from the Chesapeake Bay, the nursery for most of the coast’s stripers. ASGA wants commercial dead discards studied as rigorously as recreational release deaths, and wants the big spawning females protected.');
    api.more('Where these numbers come from',
      '<p>2025, coastwide. Anglers kept ' + mil(R.kept) + ' stripers and released ' + mil(R.released) + ' (corrected; the old count had ' + mil(R.keptOld) + ' and ' + (Math.round(R.releasedOld * 10) / 10) + ' million). Commercial fishermen landed ' + mil(R.commLandings) + '. Commercial numbers were not revised.</p>' +
      '<p>Release deaths: the assessment has assumed 9 in 100 released stripers die. A new study by Micah Dean and colleagues at the Massachusetts Division of Marine Fisheries found about half that on average, and the real rate depends on fish size. This page uses about 4.5 in 100. The benchmark assessment is weighing the study now.</p>' +
      '<p>Commercial dead discards: the 2.8 in 100 figure is estimated from tagged fish that commercial fishermen report. In the 1990s the same kind of estimate put commercial dead discards as high as 80 for every 100 landed. The assessment scientists made it their top research priority at the last assessment.</p>' +
      '<p>The totals under the picture are our own sums of these 2025 inputs: fish kept, plus released fish that die, plus commercial landings, plus commercial fish thrown back dead. They are not an official removals figure. The stock assessment counts the same pieces but works state by state and by fish size, so its own totals can differ somewhat.</p>' +
      '<p>The two stacks use the same blocks: each one stands for 250,000 stripers.</p>' +
      '<p class="src">Sources: anglers’ kept and released fish from ' + FRAME.link('mrip', 'NOAA’s Marine Recreational Information Program (MRIP)') + ' corrected estimates, posted Aug 31, 2026; the release study, ' + FRAME.link('dmf', 'M. Dean and others, Massachusetts Division of Marine Fisheries') + ' (preprint, 2026); commercial landings and the commercial discard figures as presented by ASGA on Sept 22, 2026; the Chesapeake note from ASGA’s Sept 22, 2026 presentation (slide 12).</p>');

    // the idle heartbeat (SITE.idle): the boil, the blinks, the gulls, the net and the hint's bob between moments
    S.idle(api.stageHost, function () { stage.drawing++; stage.render(); }, function () { return !!stage.anim; });

    snap(0);
    document.addEventListener('site:fonts', function () { stage.render(); });
  }
});
