/* 2. How we learned NOAA overcounted trips: the fuzzy calendar (the film's s05 and s06, 1:00 to 1:31).
   A scrolly page, like the count. Luyen's notes (Sep 26, rounds 1 and 2): real data only, no token baskets,
   show the old two-month form against the new one-month form, and keep the reader's turn to one gesture.
   The wall is one year of calendar pages, two rows of six on rails, under two-month tabs. A mustard frame
   marks the two months the old mail form asked about. When NOAA's 2024 test arrives, the new form joins the
   old one on the desk, side by side, and a sea-blue window opens around each month inside the frame: first
   March (the spotlight on March and on the new form's TRIPS IN MAR? line), then April. Each form shows its
   count for the two months as ten trip tokens (10 trips each) and a badge: the old form is always 100, and
   the new form shows what the test found (Mar-Apr 56, Jul-Aug 92); the trips it doesn't count stay gray
   ghosts, which hands off to the Ghost trips page. One example trip from late February hops into March
   under the old form (MEMORY DRIFT: a picture of telescoping, not a measurement).
   The reader's turn: slide the frame (or press any pair of months) and the desk shows both forms' counts. */
SITE.register({
  id: 'calendar', short: 'The fuzzy calendar', title: 'How we learned NOAA overcounted trips', scrolly: true,
  build: function (api) {
    var S = SITE, K = S.K, C = S.C, INK = C.ink, N = S.N, path = S.path, WV = RC.waves;
    var MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var MS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], ML = MS.map(function (m, i) { return (MS[i + 1] || 366) - m; });
    var TABS = ['JAN-FEB', 'MAR-APR', 'MAY-JUN', 'JUL-AUG', 'SEP-OCT', 'NOV-DEC'];
    var INV = TABS.map(function (t, i) { return new Array(i + 2).join('​'); });   // tab keys; the lettering is drawn larger here
    var RUN = { 1: 'SPRING RUN', 5: 'FALL RUN' };
    var ZONE = '#E9C09B';                   // calendar paper under the pink drift wash (a ghost's backing)
    var HOP = [0.16, 0.5, 0.84];            // a hop: three drawings in the air, then the landing drawing
    var DRIFT = 20;                         // the fuzzy edge's width in days: a picture, not a measurement
    var EX = { home: 55, inside: 64 };      // the example trip: the last weekend of February, remembered as March 5
    function per100(w) { return Math.round(100 + WV[w].fix); }     // corrected striper trips for every 100 in the old count
    // split: 0 the old form's frame only; 1 March's window open; 2 both windows. pair: the new form is on the desk.
    var st8 = { w: 1, split: 0, pair: false, known: {}, drift: false, ex: 'none', test: false, focus: null, hl: null, play: false, say: false,
      drag: null, dx: 0, dragged: false, settleFrom: 0 };
    var T = { clock: 100, raf: 0, last: 0, until: 0 }, cues = [];
    // moments, as the clock drawing they start on
    var A = { snap: -99, slide: -99, slideFrom: null, ex: -99, exDir: '', oops: -99, mail: -99, stamp: -99, stampW: -1, v: -99, fz: -99, say: -99, pair: -99, win1: -99, win2: -99, settle: -99, thump: -99 };
    var V = { from: 0, to: 0 };             // the new form's count in tokens (10 = the old form's 100)

    /* ---------------- layout: laptop 1920 x 1080..1320, phone 1080 x 1250 ---------------- */
    function lay(st) {
      var port = st.port, W = st.w, H = st.h, L = { port: port, W: W, H: H, ex: H - (port ? 1250 : 1080) };
      if (port && st8.pair) return camLay(L);
      if (port) { L.x0 = 20; L.x1 = 1060; L.gi = 8; L.gp = 28; L.top = 14; L.band = H - 540; L.cols = 2; L.mon = 46; L.tab = 44; }
      else {
        // a taller laptop stage gives about half its extra height to the desk band, so the cast grows with it
        L.k = 1 + Math.min(Math.max(L.ex, 0), 240) * 0.55 / 440;
        L.x0 = 48; L.x1 = 1632; L.gi = 10; L.gp = 46; L.top = 14 + L.ex * 0.15; L.band = H - 440 * L.k; L.cols = 3; L.mon = 40; L.tab = 38;
      }
      L.tabH = 66; L.rail = 12; L.hang = 10; L.rowGap = 8; L.r = 30;
      L.pw = (L.x1 - L.x0 - 3 * L.gi - 2 * L.gp) / 6;
      L.ph = (L.band - 10 - L.top - L.rowGap) / 2 - L.tabH - L.rail - L.hang;
      L.hd = Math.min(86, L.ph * 0.26);
      L.px = []; var x = L.x0;
      for (var c = 0; c < 6; c++) { if (c) x += L.pw + (c % 2 ? L.gi : L.gp); L.px.push(x); }
      L.rows = [0, 1].map(function (r) {
        var y = L.top + r * (L.tabH + L.rail + L.hang + L.ph + L.rowGap), pt = y + L.tabH + L.rail + L.hang;
        return { railY: y + L.tabH, pt: pt, pb: pt + L.ph, gt: pt + 8 + L.hd + 8 };
      });
      L.dayX = function (mi, day) { return L.px[mi % 6] + 10 + (day - MS[mi]) / ML[mi] * (L.pw - 20); };
      // the desk band: [x, ground, scale] for the cast; the desk; the two forms (alone, the old one sits mid-desk)
      if (port) {
        L.kit = [100, H - 8, 0.55]; L.hou = [236, H - 80, 0.5]; L.str = [990, H - 2, 0.55];
        L.dk = { x0: 272, x1: 1012, yf: H - 200, g: H - 20 };
        L.fm = { w: 340, s: 1, rows: 2, oldX: 372, newX: 734, soloX: 620, ts: 36, hs: 30, R: 19, br: 36 };
        L.oops = [880, L.band + 110]; L.lamp = [112, L.band + 70];
      } else {
        var k = L.k, k2 = 1 + (k - 1) * 0.8;
        L.kit = [124, H - 22 * k, 0.75 * k2]; L.hou = [380, H - 40 * k, 0.6 * k2]; L.str = [1790, H - 34 * k, Math.min(0.96, 0.85 * k2)];
        L.dk = { x0: 460, x1: 1620, yf: H - 175 * k, g: H - 30 * k };
        L.fm = { w: 430, s: Math.min(1.24, 1.12 * k2), rows: 1, oldX: 736, newX: 1316, soloX: 1040, ts: 32, hs: 28, R: 17, br: 32 };
        L.oops = [1500, L.band + 60];
      }
      var G = geo(L.fm); L.fm.h = G.h;
      L.fm.y = L.dk.yf - 14 - L.fm.h * L.fm.s;
      return L;
    }
    /* the phone camera from step 3 on (director 9): the year's calendar pages shrink to one strip of twelve along
       the top, and the two forms fill the stage width below it, so the counts on their coins read at about 24 px */
    function camLay(L) {
      var H = L.H;
      L.cam = true; L.x0 = 22; L.x1 = 1058; L.gi = 4; L.gp = 24; L.fpad = 10; L.top = 8; L.cols = 2; L.mon = 34; L.tab = 30;
      L.tabH = 66; L.rail = 10; L.hang = 8; L.rowGap = 0; L.r = 30;
      L.pw = (L.x1 - L.x0 - 6 * L.gi - 5 * L.gp) / 12; L.ph = 200; L.hd = Math.min(86, L.ph * 0.26);
      L.px = []; var x = L.x0;
      for (var c = 0; c < 12; c++) { if (c) x += L.pw + (c % 2 ? L.gi : L.gp); L.px.push(x); }
      var ry = L.top, pt = ry + L.tabH + L.rail + L.hang, R = { railY: ry + L.tabH, pt: pt, pb: pt + L.ph, gt: pt + 8 + L.hd + 8 };
      L.rows = [R, R]; L.band = R.pb + 20;
      L.dayX = function (mi, day) { return L.px[mi] + 6 + (day - MS[mi]) / ML[mi] * (L.pw - 12); };
      L.kit = [100, H - 6, 0.56]; L.hou = [236, H - 80, 0.5]; L.str = [990, H - 2, 0.56];
      L.dk = { x0: 12, x1: 1068, yf: 824, g: H - 20 };
      L.fm = { w: 500, s: 1, rows: 2, oldX: 282, newX: 798, soloX: 540, ts: 42, hs: 36, R: 27, br: 78 };
      L.oops = [880, L.band + 110]; L.lamp = null;
      var G = geo(L.fm); L.fm.h = G.h;
      L.fm.y = L.dk.yf - 14 - L.fm.h * L.fm.s;
      return L;
    }
    function pxm(L, mi) { return L.cam ? L.px[mi] : L.px[mi % 6]; }
    function fbox(L, w) {
      var r = L.cam ? 0 : Math.floor(w / 3), c0 = L.cam ? w * 2 : (w % 3) * 2, R = L.rows[r], pad = L.fpad || 14;
      return { r: r, c0: c0, x0: L.px[c0] - pad, x1: L.px[c0 + 1] + L.pw + pad, y0: R.pt - 12, y1: R.pb + 12, mid: (L.px[c0] + L.pw + L.px[c0 + 1]) / 2 };
    }
    function waveAt(L, x, y) {
      if (L.cam) { var bw = 0, bdd = 1e9; for (var w = 0; w < 6; w++) { var bb = fbox(L, w), dd = Math.abs(x - (bb.x0 + bb.x1) / 2); if (dd < bdd) { bdd = dd; bw = w; } } return bw; }
      var r = y < (L.rows[0].pb + L.rows[1].railY - L.tabH) / 2 ? 0 : 1, best = 0, bd = 1e9;
      for (var p = 0; p < 3; p++) { var b = fbox(L, r * 3 + p), d = Math.abs(x - (b.x0 + b.x1) / 2); if (d < bd) { bd = d; best = p; } }
      return r * 3 + best;
    }
    /* the fuzzy edge: the days [a - DRIFT, a) before the frame, one band per row, running on to the frame
       (or off the end of the row toward it); it wraps across New Year */
    function zoneOf(L, w) {
      var a = WV[w].days[0], b = fbox(L, w), segs = {}, parts = [], s0 = a - DRIFT;
      if (s0 < 1) { parts.push([s0 + 365, 366]); s0 = 1; }
      if (s0 < a) parts.push([s0, a]);
      parts.forEach(function (pr) {
        for (var mi = 0; mi < 12; mi++) {
          var lo = Math.max(pr[0], MS[mi]), hi = Math.min(pr[1], MS[mi] + ML[mi]);
          if (hi > lo) {
            var r = L.cam ? 0 : Math.floor(mi / 6), g = segs[r] || (segs[r] = { r: r, x0: 1e9, x1: -1e9 });
            g.x0 = Math.min(g.x0, L.dayX(mi, lo)); g.x1 = Math.max(g.x1, hi >= MS[mi] + ML[mi] ? pxm(L, mi) + L.pw : L.dayX(mi, hi));
          }
        }
      });
      return Object.keys(segs).map(function (k) { var g = segs[k]; g.x1 = g.r === b.r && g.x0 < b.x0 ? b.x0 + 6 : L.x1 + 16; return g; });
    }
    /* the forms on the desk: where each sits, mid-slide when the new form arrives */
    function forms(L) {
      var F = L.fm, p = st8.pair ? S.clamp(age('pair') / 4, 0, 1) : 0, e = S.ease.out(p);
      var sw = F.w * F.s, sh = F.h * F.s;
      var old = { x: st8.pair ? S.lerp(F.soloX, F.oldX, e) : F.soloX, y: F.y }, neu = st8.pair ? { x: F.newX, y: F.y, pop: S.pop(age('pair'), 5) } : null;
      function rect(f) { return [f.x - sw / 2 - 16, f.y - 16, sw + 32, sh + 24 + 40 * F.s]; }
      var rs = [rect(old)]; if (neu) rs.push(rect(neu));
      return { old: old, neu: neu, rects: rs, box: neu ? [rs[0][0], rs[0][1], rs[1][0] + rs[1][2] - rs[0][0], rs[0][3]] : rs[0] };
    }
    /* a line of the new form (0: the first month, 1: the second), in stage units, for the spotlight */
    function lineRect(L, i) {
      var F = L.fm, f = forms(L).neu; if (!f) return null;
      var y = F.y + rowY(F, i) * F.s, hh = (F.R + 12) * F.s;
      return [f.x - F.w * F.s / 2 - 12, y - hh, F.w * F.s + 24, 2 * hh];
    }
    /* the new form's month rows (0: the first month, 1: the second), level with the old form's token rows */
    function rowY(F, i) { var G = geo(F); return F.rows === 2 ? G.ty0 + i * (G.step + 2) : G.ty0 + (i - 1) * (2 * F.R + 12); }
    function lineY(F, i) { return (F.rows === 2 ? 92 : 84) + i * (F.ts + 8); }
    /* a form's rows: the header, two question lines, the tokens (one row of ten, or two of five), then the total */
    function geo(F) {
      var R = F.R, step = 2 * R + 6, rows = F.rows === 2 ? 2 : 1, ty0 = lineY(F, 1) + 22 + R, tEnd = ty0 + (rows - 1) * (step + 2) + R, by = tEnd + 8 + F.br;
      return { R: R, step: step, per: rows === 2 ? 5 : 10, gap: rows === 2 ? 0 : 12, ty0: ty0, by: by, h: by + F.br + 8 };
    }

    /* ---------------- drawing helpers ---------------- */
    function rr(x, y, w, h, r) {
      return 'M' + N(x + r) + ',' + N(y) + ' H' + N(x + w - r) + ' Q' + N(x + w) + ',' + N(y) + ' ' + N(x + w) + ',' + N(y + r) + ' V' + N(y + h - r) +
        ' Q' + N(x + w) + ',' + N(y + h) + ' ' + N(x + w - r) + ',' + N(y + h) + ' H' + N(x + r) + ' Q' + N(x) + ',' + N(y + h) + ' ' + N(x) + ',' + N(y + h - r) +
        ' V' + N(y + r) + ' Q' + N(x) + ',' + N(y) + ' ' + N(x + r) + ',' + N(y) + ' Z';
    }
    function ring(x0, y0, x1, y1, bw, fill, rad, shadow) {
      var d = rr(x0, y0, x1 - x0, y1 - y0, rad) + ' ' + rr(x0 + bw, y0 + bw, x1 - x0 - 2 * bw, y1 - y0 - 2 * bw, Math.max(3, rad - bw / 2));
      return (shadow === false ? '' : '<path d="' + d + '" fill="' + INK + '" fill-rule="evenodd" opacity=".15" transform="translate(7 9)"/>') +
        S.cel('<path d="' + d + '" fill="' + fill + '" fill-rule="evenodd" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>');
    }
    /* one trip token: 'solid', 'stray' (the film's gray dashed rim and halo) or 'ghost' (where it really was) */
    function chip(x, y, mode, sq, back, R) {
      R = R || 30; var s;
      if (mode === 'ghost') s = '<circle r="' + R + '" fill="' + (back || C.paper) + '"/>' + K.tripToken({ r: R, kind: 'boat', ghost: true });
      else if (mode === 'stray') s = K.tripToken({ r: R, kind: 'boat', stray: true }) + '<circle r="' + (R + 8) + '" fill="none" stroke="' + C.gray + '" stroke-width="5" stroke-dasharray="9 7"/>';
      else s = K.tripToken({ r: R, kind: 'boat' });
      if (sq) s = '<g transform="translate(0 ' + R + ') scale(' + (1 + sq * 0.8).toFixed(3) + ' ' + (1 - sq).toFixed(3) + ') translate(0 ' + (-R) + ')">' + s + '</g>';
      return '<g transform="translate(' + N(x) + ' ' + N(y) + ')">' + s + '</g>';
    }
    function arcPt(a, b, p) {
      var lift = 110 + 0.16 * Math.abs(b.x - a.x);
      return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p - lift * 4 * p * (1 - p) };
    }
    function trail(a, b, p) {
      var d = 'M' + N(a.x) + ',' + N(a.y);
      for (var i = 1; i <= 10; i++) { var q = arcPt(a, b, p * i / 10); d += ' L' + N(q.x) + ',' + N(q.y); }
      return path(d, 'none', 5, ' stroke-dasharray="4 12"');
    }
    function hang(ax, ay, o) {   // a tag on a string from a pin
      return path('M' + N(ax) + ',' + N(ay) + ' L' + N(o.x) + ',' + N(o.y - (o.h || 110) / 2 + 6), 'none', 4) + '<circle cx="' + N(ax) + '" cy="' + N(ay) + '" r="7" fill="' + C.cream + '" stroke="' + INK + '" stroke-width="4"/>' +
        '<g opacity=".15" transform="translate(6 8)">' + S.tag(Object.assign({}, o, { fill: INK, band: null, lines: [' '] })) + '</g>' + S.tag(o);
    }
    function lampShade(lx, ly) {
      return path('M' + (lx - 70) + ',' + ly + ' Q' + (lx - 66) + ',' + (ly - 58) + ' ' + lx + ',' + (ly - 62) + ' Q' + (lx + 66) + ',' + (ly - 58) + ' ' + (lx + 70) + ',' + ly + ' Z', C.mustard, 7) +
        path('M' + (lx - 58) + ',' + (ly - 8) + ' Q' + (lx - 52) + ',' + (ly - 44) + ' ' + (lx - 10) + ',' + (ly - 54), 'none', 8, '', S.SH.mustard) +
        '<ellipse cx="' + lx + '" cy="' + (ly + 2) + '" rx="44" ry="10" fill="' + C.white + '" stroke="' + INK + '" stroke-width="5"/>' +
        path('M' + (lx - 30) + ',' + (ly + 22) + ' l-14,26 M' + lx + ',' + (ly + 28) + ' l0,30 M' + (lx + 30) + ',' + (ly + 22) + ' l14,26', 'none', 5);
    }
    function age(k) { return T.clock - A[k]; }

    /* ---------------- the wall: rails, tabs, pages, the fuzzy edge, the example trip and the frame ---------------- */
    function frameAt(L) {
      // where the frame is drawn: its months' box, nudged by a drag, or sliding in from the last pair of months
      var b = fbox(L, st8.w), ox = st8.dx, oy = 0, sa = age('slide');
      if (A.slideFrom != null && sa >= 0 && sa < 4) {
        var f = fbox(L, A.slideFrom), p = [0.3, 0.68, 0.93, 1][sa];
        ox += (f.x0 - b.x0) * (1 - p); oy += (f.y0 - b.y0) * (1 - p);
      }
      return { b: b, ox: ox, oy: oy, x0: b.x0 + ox, x1: b.x1 + ox, y0: b.y0 + oy, y1: b.y1 + oy, mid: b.mid + ox, railY: L.rows[b.r].railY + oy, moving: sa >= 0 && sa < 4 };
    }
    function logArt(L) {
      var s = '', pages = '', strings = '', letters = '';
      for (var r = 0; r < 2; r++) {
        var R = L.rows[r];
        for (var p = 0; p < 3; p++) {
          var w = r * 3 + p, b = fbox(L, w), cx = (b.x0 + b.x1) / 2;
          s += K.calendarTabs({ x: cx, y: R.railY + 2, w: b.x1 - b.x0 - 6, tabs: [INV[w]], active: w === st8.w ? INV[w] : '' });
          letters += K.text(TABS[w], cx, R.railY - 21, { size: L.tab });
        }
        if (L.cam && r) continue;
        s += '<rect x="' + N(L.x0 - 24) + '" y="' + N(R.railY) + '" width="' + N(L.x1 - L.x0 + 48) + '" height="' + L.rail + '" rx="5" fill="' + C.brown + '" stroke="' + INK + '" stroke-width="5"/>' +
          path('M' + N(L.x0 - 18) + ',' + N(R.railY + 3) + ' H' + N(L.x1 + 18), 'none', 3, '', S.HI.brown);
      }
      for (var mi = 0; mi < 12; mi++) {
        var R2 = L.rows[Math.floor(mi / 6)], px = pxm(L, mi) + L.pw / 2, q = L.pw / 4;
        strings += path('M' + N(px - q) + ',' + N(R2.railY + L.rail) + ' V' + N(R2.pt + 8) + ' M' + N(px + q) + ',' + N(R2.railY + L.rail) + ' V' + N(R2.pt + 8), 'none', 4);
        pages += K.calendar({ x: px, y: R2.pt, w: L.pw, h: L.ph, rows: 5 });
        letters += K.text(MON[mi], px, R2.pt + 8 + L.hd / 2 + K.fs('label', L.mon) * 0.36, { size: L.mon, fill: C.cream });
      }
      s += strings + '<g opacity=".13" transform="translate(6 8)">' + pages.replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="' + INK + '"') + '</g>' + S.cel(pages) + letters;
      var F = frameAt(L);

      // the fuzzy edge before the frame: the old form's trouble
      var zs = st8.drift && !F.moving && st8.drag == null ? zoneOf(L, st8.w) : [];
      zs.forEach(function (g) {
        var R = L.rows[g.r], y0 = R.gt - 6, y1 = R.pb - 3, zz = '', n = Math.ceil((y1 - y0) / 18);
        for (var i = 0; i <= n; i++) zz += ' L' + N(g.x0 + (i % 2 ? -7 : 5)) + ',' + N(Math.min(y1, y0 + i * 18));
        s += '<path d="M' + N(g.x0 - 30) + ',' + N(y0) + zz.replace(/L([\d.]+),/g, function (all, x) { return 'L' + N(+x - 30) + ','; }) + ' L' + N(g.x0) + ',' + N(y1) + ' L' + N(g.x0) + ',' + N(y0) + ' Z" fill="' + C.pink + '" opacity=".2"/>';
        s += '<path d="M' + N(g.x0 + 5) + ',' + N(y0) + zz + ' L' + N(g.x1) + ',' + N(y1) + ' L' + N(g.x1) + ',' + N(y0) + ' Z" fill="' + C.pink + '" opacity=".38"/>';
        s += path('M' + N(g.x0 + 5) + ',' + N(y0) + zz, 'none', 4, ' stroke-dasharray="6 9" opacity=".7"', S.SH.pink);
      });

      // the example trip: at home on the last weekend of February, or remembered as early March
      var fly = '';
      if (st8.ex !== 'none') {
        var TR = L.cam ? 17 : L.port ? 34 : 38, ch = function (x, y, m, sq, bk) { return chip(x, y, m, sq, bk, TR); };
        var R0 = L.rows[0], yy = R0.pb - 12 - TR, home = { x: L.dayX(1, EX.home), y: yy }, ins = { x: L.dayX(2, EX.inside), y: yy }, ea = age('ex');
        var back = zs.length ? ZONE : C.paper;
        if (st8.ex === 'in') {
          s += ch(home.x, home.y, 'ghost', 0, back);
          if (A.exDir === 'in' && ea >= 0 && ea < 3) { var qi = arcPt(home, ins, HOP[ea]); fly += trail(home, ins, HOP[ea]) + ch(qi.x, qi.y, ea >= 1 ? 'stray' : 'solid', -0.12); }
          else if (A.exDir === 'in' && ea < 0) s += ch(home.x, home.y, 'solid');
          else s += ch(ins.x, ins.y, 'stray', A.exDir === 'in' ? (ea === 3 ? 0.28 : ea === 4 ? -0.08 : 0) : 0);
        } else {
          if (A.exDir === 'out' && ea >= 0 && ea < 3) { var qo = arcPt(ins, home, HOP[ea]); s += ch(home.x, home.y, 'ghost', 0, back); fly += trail(ins, home, HOP[ea]) + ch(qo.x, qo.y, ea >= 2 ? 'solid' : 'stray', -0.12); }
          else s += ch(home.x, home.y, 'solid', A.exDir === 'out' ? (ea === 3 ? 0.28 : ea === 4 ? -0.08 : 0) : 0);
        }
      }

      // the frame: the old form's two months in mustard; inside it, a sea window round each month for the new form
      var x0 = F.x0, x1 = F.x1, y0 = F.y0, y1 = F.y1, fr = '';
      [x0 + 44, x1 - 44].forEach(function (hx) {
        fr += path('M' + N(hx) + ',' + N(F.railY + 6) + ' V' + N(y0 + 8), 'none', 5) + '<circle cx="' + N(hx) + '" cy="' + N(F.railY + 6) + '" r="10" fill="' + C.silver + '" stroke="' + INK + '" stroke-width="4"/>';
      });
      fr += ring(x0, y0, x1, y1, 16, C.mustard, 16);
      [0, 1].forEach(function (i) {
        if (st8.split <= i) return;
        var px = L.px[F.b.c0 + i] + F.ox, wx0 = px - (L.cam ? 3 : 4), wx1 = px + L.pw + (L.cam ? 3 : 4), wy0 = F.y0 + 10, wy1 = F.y1 - 10, pa = age(i ? 'win2' : 'win1'), k = pa >= 0 && pa < 6 ? S.pop(pa, 5) : 1;
        var cx = (wx0 + wx1) / 2, cy = (wy0 + wy1) / 2;
        fr += '<g transform="translate(' + N(cx) + ' ' + N(cy) + ') scale(' + k + ') translate(' + N(-cx) + ' ' + N(-cy) + ')">' + ring(wx0, wy0, wx1, wy1, 10, C.sea, 10, false) + '</g>';
      });
      var ta = age('snap');
      if (ta >= 0 && ta < 3 && !F.moving) {   // arriving on two months: 70s look-here ticks off the corners
        fr += path('M' + N(x0 - 8) + ',' + N(y0 - 4) + ' l-26,-22 M' + N(x0 - 16) + ',' + N(y0 + 26) + ' l-32,0 M' + N(x1 + 8) + ',' + N(y0 - 4) + ' l26,-22 M' + N(x1 + 16) + ',' + N(y0 + 26) + ' l32,0', 'none', 6);
      }
      s += fr + fly;

      // SPRING RUN / FALL RUN, stamped on the wall when the new form's count for a striper run shows
      var ds = age('stamp');
      if (st8.known[st8.w] && RUN[st8.w] && A.stampW === st8.w && ds >= 0 && !F.moving) {
        var sx = F.mid, sy = (y0 + y1) / 2 + (L.cam ? 18 : 30), lab = RUN[st8.w], ss = L.cam ? 0.66 : L.port ? 1.05 : 1.15;
        if (ds >= 1) s += K.stampMark({ x: sx, y: sy, label: lab, color: C.brick, size: 54 * ss, rot: -8 });
        if (ds === 1) s += K.impact({ x: sx + 200 * ss, y: sy - 50, r: 40, fill: C.white, n: 7 });
        if (ds < 3) s += K.stamp({ x: sx, y: sy + 40 - [190, 0, 100][ds], scale: 0.95 * ss, label: lab, color: C.brick, squash: ds === 1 ? 0.2 : 0 });
        if (ds >= 2 && ds < 6) s += K.sparkle({ x: sx + 220 * ss, y: sy - 70, r: 30 });
      }
      // January and February: almost no one fishes for stripers
      if (st8.play && st8.w === 0 && !F.moving) s += L.cam ? K.tag('FEW STRIPER TRIPS', N(S.clamp(F.mid, 150, L.W - 150)), N(y1 + 26), { size: 26, fill: C.white, rot: -2 })
        : K.tag('FEW STRIPER TRIPS', N(F.mid), N(y1 - (L.port ? 60 : 50)), { size: L.port ? 40 : 34, fill: C.white, rot: -2 });
      // MEMORY DRIFT, lettered above the pink zone and kept inside the stage
      if (zs.length) {
        var g = zs.reduce(function (p, q) { return (q.x1 - q.x0) > (p.x1 - p.x0) ? q : p; }), gx1 = Math.min(g.x1, L.x1), tw = L.port ? 204 : 12 * 36 * 0.55 + 40;
        var lx = S.clamp((g.x0 + gx1) / 2, 10 + tw / 2, L.W - 10 - tw / 2), ly = L.rows[g.r].gt + (L.port ? 50 : 26);
        s += L.port ? S.tag({ x: lx, y: ly, w: tw, h: 104, lines: ['MEMORY', 'DRIFT'], size: 44, fill: C.pink, rot: -2 })
          : K.tag('MEMORY DRIFT', N(lx), N(ly), { size: 36, fill: C.pink, rot: -2 });
      }
      // the reader's turn: the drag hint until the frame has been moved, and a grab area on every pair of months
      if (st8.play) {
        if (!st8.dragged) {
          var hy = L.cam ? y1 + 28 : L.rows[F.b.r].gt + (L.port ? 32 : 26), hx = L.cam ? S.clamp((x0 + x1) / 2, 130, L.W - 130) : (x0 + x1) / 2 + (L.port ? 0 : 20), ay = L.rows[F.b.r].pt + 8 + L.hd / 2;
          s += K.tag(L.port ? 'DRAG ME' : 'DRAG THE FRAME', N(hx), N(hy), { size: L.cam ? 32 : L.port ? 44 : 36, fill: C.mustard, rot: 2 });
          var bob = (stage.drawing >> 1) % 2 ? 6 : 0;
          [[x0 - 8 - bob, -1], [x1 + 8 + bob, 1]].forEach(function (e) {
            s += '<path d="M' + N(e[0]) + ',' + N(ay - 20) + ' l' + (e[1] * 22) + ',20 l' + (-e[1] * 22) + ',20 Z" fill="' + C.brick + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>';
          });
        }
        for (var w2 = 0; w2 < 6; w2++) {
          var bb = fbox(L, w2), R3 = L.rows[bb.r];
          s += S.grab('pair:' + w2, '<rect x="' + N(bb.x0 - 8) + '" y="' + N(R3.railY - L.tabH) + '" width="' + N(bb.x1 - bb.x0 + 16) + '" height="' + N(bb.y1 - R3.railY + L.tabH) + '" fill="transparent"/>', 0, 0, 0);
        }
      }
      return s;
    }

    /* ---------------- the desk: the two forms and the cast ---------------- */
    function vNow() { var p = S.clamp(age('v') / 6, 0, 1); return V.from + (V.to - V.from) * S.ease.inOut(p); }
    function vTarget() { return st8.known[st8.w] ? (100 + WV[st8.w].fix) / 10 : 0; }
    function retarget(delay) { V.from = vNow(); V.to = vTarget(); A.v = T.clock + 1 + (delay || 0); if (V.to > 0 && Math.abs(V.to - V.from) > 0.01) A.thump = A.v + 6; }
    /* one form: a header band (OLD FORM / NEW FORM), its question, ten tokens and the count in a badge */
    function formArt(L, f, isNew) {
      var F = L.fm, sc = F.s, w = F.w, h = F.h, wv = st8.w, M1 = MON[wv * 2], M2 = MON[wv * 2 + 1], s = '';
      var col = isNew ? C.sea : C.gray, known = !isNew || st8.known[wv], v = isNew ? vNow() : 10, hb = 44;
      s += '<rect x="' + (-w / 2 + 7) + '" y="9" width="' + w + '" height="' + h + '" rx="8" fill="' + INK + '" opacity=".15"/>';
      var paper = '<rect x="' + (-w / 2) + '" y="0" width="' + w + '" height="' + h + '" rx="8" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="6"/>' +
        '<rect x="' + (-w / 2 + 6) + '" y="' + (h - 28) + '" width="' + (w - 12) + '" height="22" rx="4" fill="' + S.HALF.paper + '"/>' +
        '<path d="M' + (-w / 2 + 3) + ',' + hb + ' V11 Q' + (-w / 2 + 3) + ',3 ' + (-w / 2 + 11) + ',3 H' + (w / 2 - 11) + ' Q' + (w / 2 - 3) + ',3 ' + (w / 2 - 3) + ',11 V' + hb + ' Z" fill="' + col + '"/>' +
        path('M' + (-w / 2) + ',' + hb + ' H' + (w / 2), 'none', 5);
      s += S.cel(paper) + K.text(isNew ? (known ? 'CORRECTED: ONE MONTH' : 'NEW FORM: ONE MONTH') : 'OLD FORM: TWO MONTHS', 0, hb / 2 + F.hs * 0.34, { size: F.hs, fill: C.cream });
      // one token is 10 trips; the trips a form doesn't count stay gray ghosts
      var G = geo(F), R = G.R, step = G.step;
      function token(x, y, fill, id) {
        var tok = '';
        if (fill < 1) tok += '<circle r="' + R + '" fill="' + C.paper + '"/>' + K.tripToken({ r: R, kind: 'boat', ghost: true });
        if (fill > 0.02) {
          var solid = K.tripToken({ r: R, kind: 'boat' });
          if (fill < 1) solid = '<clipPath id="calTk' + id + '"><rect x="' + (-R - 6) + '" y="' + (-R - 6) + '" width="' + N((2 * R + 6) * fill + 6) + '" height="' + (2 * R + 12) + '"/></clipPath><g clip-path="url(#calTk' + id + ')">' + solid + '</g>';
          tok += solid;
        }
        return '<g transform="translate(' + N(x) + ' ' + N(y) + ')">' + tok + '</g>';
      }
      if (!isNew) {
        // the old form: one question about both months, and all its trips in one pile
        ['HOW MANY TRIPS IN', TABS[wv] + '?'].forEach(function (ln, i) { s += K.text(ln, -w / 2 + 24, lineY(F, i), { size: F.ts, font: 'hand', anchor: 'start' }); });
        for (var i = 0; i < 10; i++) {
          var c = i % G.per, r = Math.floor(i / G.per);
          s += token(-w / 2 + 24 + R + c * step + (c >= 5 ? G.gap : 0), G.ty0 + r * (step + 2), S.clamp(v - i, 0, 1), 'o' + i);
        }
      } else {
        // the new form: one row per month. The corrected estimates come in two-month periods, so the
        // picture splits each period's trips evenly between its two months (the more says so)
        s += K.text('TRIPS IN...', -w / 2 + 24, lineY(F, F.rows === 2 ? 1 : 0), { size: F.ts, font: 'hand', anchor: 'start' });
        [M1, M2].forEach(function (m, i) {
          var y = rowY(F, i), lw = F.rows === 2 ? 88 : 82, hl = (st8.hl === 'a' && i === 0) || (st8.hl === 'b' && i === 1);
          if (hl) s += '<rect x="' + (-w / 2 + 12) + '" y="' + N(y - R - 7) + '" width="' + (w - 24) + '" height="' + N(2 * R + 14) + '" rx="8" fill="' + C.mustard + '" opacity=".75"/>';
          s += K.text(m + '?', -w / 2 + 24, y + F.ts * 0.35, { size: F.ts, font: 'hand', anchor: 'start' });
          for (var j = 0; j < 5; j++) s += token(-w / 2 + 24 + lw + R + j * step, y, S.clamp(v / 2 - j, 0, 1), 'n' + i + j);
        });
      }
      // the total for the two months, in a badge on the corner
      var br = F.br, bx = w / 2 - 14 - br, by = G.by, num = known ? String(Math.round(v * 10)) : '?';
      s += K.text(isNew ? M1 + ' + ' + M2 + ' =' : TABS[wv] + ' =', bx - br - 12, by + F.hs * 0.36, { size: F.hs * 1.1, anchor: 'end' });
      var ta = isNew ? age('thump') : -1, th = ta >= 0 && ta < 4 ? [1.35, 0.9, 1.06, 1][ta] : 1;
      var coin = '<circle cx="' + N(bx + 4) + '" cy="' + N(by + 6) + '" r="' + br + '" fill="' + INK + '" opacity=".15"/>' +
        '<circle cx="' + N(bx) + '" cy="' + N(by) + '" r="' + br + '" fill="' + (isNew ? C.sea : C.mustard) + '" stroke="' + INK + '" stroke-width="6"/>' +
        K.text(num, bx, by + K.fs('label', br * 1.05) * 0.36, { size: br * (num.length > 2 ? 0.9 : 1.05), fill: isNew ? C.cream : INK });
      s += th !== 1 ? '<g transform="translate(' + N(bx) + ' ' + N(by) + ') scale(' + th + ') translate(' + N(-bx) + ' ' + N(-by) + ')">' + coin + '</g>' : coin;
      if (ta >= 0 && ta < 6) s += K.sparkle({ x: bx + br * 0.95, y: by - br * 0.95, r: 30 }) + K.sparkle({ x: bx - br * 1.05, y: by - br * 0.7, r: 20 });
      var k = isNew && f.pop != null ? f.pop : 1;
      return '<g transform="translate(' + N(f.x) + ' ' + N(f.y + (1 - k) * 60) + ') rotate(' + (isNew ? 1.2 : -1.2) + ') scale(' + N(sc * k * 1000) / 1000 + ')">' + s + '</g>';
    }
    function bandArt(L) {
      var s = '', port = L.port, D = L.dk, F = frameAt(L), fcx = (F.x0 + F.x1) / 2, fcy = (F.y0 + F.y1) / 2, fm = forms(L);
      var known = st8.known[st8.w], c = T.clock;
      var sx = L.str, so = { x: sx[0], y: sx[1], scale: sx[2], flip: true, blink: c % 43 === 20 };
      if (known && st8.pair) { so.pose = 'thumbsUp'; so.expr = 'happy'; }
      else if (st8.drift) { so.pose = 'scratch'; so.expr = 'puzzled'; }
      else { so.pose = 'neutral'; so.expr = 'hopeful'; so.look = 'upFwd'; }
      var talk = st8.say && age('say') >= 0 && age('say') < 16;
      if (talk) { so.mouth = age('say') % 3 === 2 ? 'closed' : 'open'; so.blink = false; }
      else { so.squash = S.breath(stage); if (st8.play) { var slk = S.lookAt(stage, K.striperPoints(so).eye, so.flip); if (slk) so.look = slk; } }
      var striper = S.shadow(sx[0], sx[1], 210 * sx[2] / 0.85) + K.striper(so);
      // the desk (props get cel shade and a contact shadow)
      var yb = D.yf - (port ? 44 : 50), ins = 34, ap = 34, dk = '';
      dk += '<rect x="' + (D.x0 + ins + 10) + '" y="' + N(yb) + '" width="24" height="' + N(D.g - 40 - yb) + '" fill="' + S.SH.brown + '" stroke="' + INK + '" stroke-width="6"/>' +
        '<rect x="' + (D.x1 - ins - 34) + '" y="' + N(yb) + '" width="24" height="' + N(D.g - 40 - yb) + '" fill="' + S.SH.brown + '" stroke="' + INK + '" stroke-width="6"/>';
      [D.x0 + 16, D.x1 - 44].forEach(function (x) { dk += '<rect x="' + x + '" y="' + N(D.yf + ap - 6) + '" width="28" height="' + N(D.g - D.yf - ap + 6) + '" rx="4" fill="' + C.brown + '" stroke="' + INK + '" stroke-width="6"/>'; });
      dk += path('M' + D.x0 + ',' + N(D.yf) + ' L' + D.x1 + ',' + N(D.yf) + ' L' + (D.x1 - ins) + ',' + N(yb) + ' L' + (D.x0 + ins) + ',' + N(yb) + ' Z', C.tan, 7);
      dk += path('M' + (D.x0 + 120) + ',' + N(yb + 16) + ' q60,-6 120,0 M' + (D.x1 - 300) + ',' + N(D.yf - 14) + ' q70,-6 140,0', 'none', 3.5, '', S.SH.tan);
      dk += '<rect x="' + D.x0 + '" y="' + N(D.yf) + '" width="' + (D.x1 - D.x0) + '" height="' + ap + '" rx="5" fill="' + C.brown + '" stroke="' + INK + '" stroke-width="7"/>' + path('M' + (D.x0 + 8) + ',' + N(D.yf + 6) + ' H' + (D.x1 - 8), 'none', 3, '', S.HI.brown);
      s += S.shadow((D.x0 + D.x1) / 2, D.g - 2, D.x1 - D.x0 + 60) + S.cel(dk);
      s += formArt(L, fm.old, false);
      if (fm.neu) s += formArt(L, fm.neu, true);
      if (port && L.lamp) s += lampShade(L.lamp[0], L.lamp[1]);
      var exIn = A.exDir === 'in' && age('ex') >= -1 && age('ex') < 6;

      // the mail-survey man: the letter arrives, he reads the form, and thinks while a trip slides in
      var hp = 'read', hf = 0, hx = L.hou;
      if (age('mail') >= 0 && age('mail') < 8) { hp = 'mail'; hf = age('mail') >> 2 & 1; }
      else if (exIn) { hp = 'think'; hf = (c >> 1) & 1; }
      // (on the phone the two forms fill the desk, so he steps out once the new form arrives)
      if (!(port && st8.pair)) s += S.shadow(hx[0], hx[1], 190 * hx[2] / 0.6) + K.householder({ x: hx[0], y: hx[1], scale: hx[2], pose: hp, frame: hf, blink: c % 37 === 5 });

      // Kit points at the frame; a take when the trip slides in, a cheer when a striper run is stamped
      var kx = L.kit, aim = S.clamp(Math.atan2(fcy - (kx[1] - 330 * kx[2]), fcx - kx[0]) * 180 / Math.PI, -52, 15), ko = { x: kx[0], y: kx[1], scale: kx[2], blink: c % 41 === 9 };
      var ds = age('stamp');
      if (A.stampW === st8.w && ds >= 2 && ds < 20) { ko.pose = 'cheer'; ko.expr = 'grin'; }
      else if (exIn) { ko.pose = 'cheeks'; ko.expr = 'wide'; }
      else {
        ko.pose = 'point'; ko.aim = aim; ko.expr = known ? 'grin' : st8.drift ? 'worried' : 'eager';
        var klk = st8.play && S.lookAt(stage, K.kidPoints(ko).eye, ko.flip); if (klk) ko.look = klk;
      }
      s += S.shadow(kx[0], kx[1], 200 * kx[2] / 0.75) + K.kid(ko);
      s += striper;
      // OOPS pops when the trip lands inside the old form's two months
      if (st8.ex === 'in' && A.oops > 0 && age('oops') >= 0 && age('oops') < 40) s += K.at(L.oops[0], L.oops[1], S.pop(age('oops'), 4), -7, K.tag('OOPS', 0, 0, { size: port ? 56 : 60, fill: C.white }));
      if (st8.say) {
        var np = K.striperPoints({ x: sx[0], y: sx[1], scale: sx[2], flip: true, pose: so.pose }).nose;
        s += L.cam ? S.say('Now add that up since the 1980s.', 700, 930, 330, np[0] - 10, np[1] - 40, { size: 38 })
          : port ? S.say('Now add that up since the 1980s.', 900, L.band + 40, 300, np[0] - 10, np[1] - 40, { size: 38 })
          : S.say('Now add that up since the 1980s.', 1776, np[1] - 290, 290, np[0] - 10, np[1] - 60, { size: 38 });
      }
      return s;
    }
    /* the spotlight: everything but the step's subject sits under a dark scrim */
    function focusRects(L) {
      var f = st8.focus; if (!f) return null;
      var b = fbox(L, st8.w), R = L.rows[b.r], fm = forms(L);
      var fr = [b.x0 - 22, R.railY - L.tabH - 10, b.x1 - b.x0 + 44, b.y1 - R.railY + L.tabH + 30];
      if (f === 'frame') return [fr, fm.box];
      if (f === 'desk') return [fm.box];
      if (f === 'drift') { var x0 = L.px[1] - 22; return [[x0, fr[1], fr[0] + fr[2] - x0, fr[3]], fm.rects[0]]; }
      if (f === 'm1' || f === 'm2') {
        var i = f === 'm1' ? 0 : 1, px = L.px[b.c0 + i];
        return [[px - 20, R.pt - 22, L.pw + 40, L.ph + 44], lineRect(L, i)].filter(Boolean);
      }
      return null;
    }
    function spotlight(L) {
      var rs = focusRects(L); if (!rs) return '';
      var fz = age('fz');
      return S.spot(L.W, L.H, rs, fz >= 0 && fz < 3 ? [0.33, 0.67, 0.9][fz] : 1, 26);
    }

    var stage = api.stage(function (st) {
      var L = lay(st), port = L.port, set = S.set.room(st, port ? { lamp: false } : {}), FL = set.floor;
      var s = '<rect x="-900" y="-20" width="' + (L.W + 1800) + '" height="' + (L.H + 40) + '" fill="' + C.cream + '"/>' +
        '<rect x="-900" y="' + (FL - 64) + '" width="' + (L.W + 1800) + '" height="64" fill="' + S.HALF.cream + '"/>' +
        '<rect x="-900" y="' + FL + '" width="' + (L.W + 1800) + '" height="' + (L.H - FL + 20) + '" fill="' + C.tan + '"/>' +
        path('M-900,' + (FL - 64) + ' H' + (L.W + 900), 'none', 4, '', C.brown) + path('M-900,' + FL + ' H' + (L.W + 900), 'none', 7) + set.svg;
      if (st8.drag == null) { var sa = age('settle'); st8.dx = sa >= 0 && sa < 3 ? st8.settleFrom * [0.35, -0.1, 0][sa] : 0; }
      if (port && L.lamp) {
        // on the phone the calendar fills the wall, so the lamp hangs lower, over the desk's near end
        var lx = L.lamp[0], ly = L.lamp[1];
        s += '<path d="M' + (lx - 70) + ',' + ly + ' L' + (lx + 70) + ',' + ly + ' L' + (lx + 330) + ',' + N(set.floor) + ' L' + (lx - 330) + ',' + N(set.floor) + ' Z" fill="' + S.HI.mustard + '" opacity=".30"/>';
        s += path('M' + lx + ',-10 L' + lx + ',' + (ly - 60), 'none', 5);
      } else if (st8.test) {
        s += hang(1776, 212 + L.ex * 0.3, { x: 1776, y: 300 + L.ex * 0.35, w: 262, h: 132, band: C.sea, rot: 2, lines: st8.known[1] ? ['CORRECTED', '2016-2025'] : ['NOAA’S 2024', 'TEST'], size: 40 });
      }
      s += logArt(L) + bandArt(L) + spotlight(L);
      return s;
    }, label);
    function label() {
      if (st8.play) return 'The frame on the calendar: pick two months. Left and right arrows move it.';
      var w = WV[st8.w], kn = st8.known[st8.w];
      return 'One year of calendar pages, with a frame on ' + w.months + '. ' + (st8.pair ? 'The old two-month form and the one-month form sit side by side on the desk. ' : 'The old two-month form rests on the desk. ') +
        (kn ? 'For every 100 striper trips in the old count for these two months, the corrected count has ' + per100(st8.w) + '.' : 'The old count is 100.');
    }
    var live = S.el('p', { class: 'sr', 'aria-live': 'polite' }, api.bar);
    function keyable() {
      var sv = stage.svg;
      if (st8.play) {
        sv.setAttribute('role', 'slider'); sv.setAttribute('tabindex', '0');
        sv.setAttribute('aria-valuemin', '1'); sv.setAttribute('aria-valuemax', '6'); sv.setAttribute('aria-valuenow', String(st8.w + 1));
        sv.setAttribute('aria-valuetext', WV[st8.w].months + ': for every 100 trips on the old form, the new form counted ' + per100(st8.w));
      } else { sv.setAttribute('role', 'img'); sv.removeAttribute('tabindex'); ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'].forEach(function (a) { sv.removeAttribute(a); }); }
    }
    stage.svg.addEventListener('keydown', function (e) {
      if (!st8.play) return;
      var k = e.key, w = st8.w, to = k === 'ArrowLeft' || k === 'ArrowDown' ? w - 1 : k === 'ArrowRight' || k === 'ArrowUp' ? w + 1 : k === 'Home' ? 0 : k === 'End' ? 5 : null;
      if (to == null) return;
      e.preventDefault(); st8.dragged = true; setWave(S.clamp(to, 0, 5)); keyable();
    });

    /* ---------------- the clock: every moment runs on twos, 12 drawings a second; cues fire on their drawing ---------------- */
    function cue(at, fn) { cues.push({ at: at, fn: fn }); cues.sort(function (a, b) { return a.at - b.at; }); }
    function fire() { while (cues.length && cues[0].at <= T.clock) cues.shift().fn(); }
    function want(n) {
      T.until = Math.max(T.until, T.clock + n);
      if (S.reduce) { while (cues.length) { T.clock = Math.max(T.clock, cues[0].at); fire(); } T.clock = T.until + 30; T.until = T.clock; stage.drawing++; stage.render(); return; }
      if (!T.raf) { T.last = performance.now(); T.raf = requestAnimationFrame(tick); }
    }
    function tick(now) {
      if (now - T.last >= 1000 / 12 - 2) { T.last = now; T.clock++; fire(); stage.drawing++; stage.render(); }
      if (T.clock < T.until || cues.length) T.raf = requestAnimationFrame(tick); else T.raf = 0;
    }

    /* ---------------- moving the frame ---------------- */
    function setWave(w, dragging) {
      if (w === st8.w) return;
      var from = st8.w; st8.w = w;
      if (!dragging) { A.slide = T.clock + 1; A.slideFrom = from; A.snap = T.clock + 5; }
      else { A.slide = -99; A.snap = T.clock + 1; }
      if (st8.known[w] && RUN[w]) { A.stampW = w; A.stamp = T.clock + (dragging ? 8 : 12); } else A.stampW = -1;
      retarget(dragging ? 0 : 4);
      live.textContent = st8.play ? WV[w].months + ': the old form counted 100, the new form ' + per100(w) + '.' : label();
      keyable();
      want(24);
    }

    /* ---------------- the walkthrough ---------------- */
    var STEPS = [
      { focus: 'frame', cls: 'first', h: '<p>NOAA’s mail survey asked a sample of households about <b>two months at a time</b>: how many saltwater fishing trips did you take in March and April?</p>' },
      { focus: 'drift', h: '<p><b>Two months is a lot to remember.</b> A trip on the last weekend of February can easily get counted as early March. Survey researchers call this telescoping, and it makes a count come out too high.</p>' },
      { focus: 'frame', h: '<p><b>In 2024, NOAA tested a new form</b> side by side with the old one in 17 states. The new form asks about <b>one month at a time</b>: first trips in March, then trips in April.</p>' },
      { focus: 'frame', h: '<p><b>Asking one month at a time counted far fewer trips</b>, and NOAA corrected its numbers. For every 100 striper trips the old count had in March and April, the corrected count has <b class="num">' + per100(1) + '</b>.</p>' },
      { focus: null, h: '<p><b>Summer barely moved:</b> <b class="num">' + per100(3) + '</b> trips for every 100 in July and August. <b>The fall run dropped like spring:</b> <b class="num">' + per100(5) + '</b> for every 100 in November and December. The two runs held over a third of the year’s striper trips.</p>' },
      { focus: null, cls: 'turn', h: '<span class="go">Your turn</span><p>Slide the frame to any two months, or press them. The desk shows the old and corrected counts for those months, with the old count set at 100.</p>' }
    ];
    var PLAY = STEPS.length - 1, OUTRO = STEPS.length;
    STEPS.forEach(function (d) { api.step(d.h, d.cls); });

    /* the finished state of step n, drawn at once (a jump, a scroll back, or reduced motion) */
    function snap(n, quiet) {
      if (T.raf) { cancelAnimationFrame(T.raf); T.raf = 0; }
      cues = [];
      Object.keys(A).forEach(function (k) { if (typeof A[k] === 'number') A[k] = -99; });
      A.slideFrom = null; A.exDir = ''; A.stampW = -1;
      st8.w = n >= 4 ? 3 : 1; st8.split = n >= 2 ? 2 : 0; st8.pair = n >= 2; st8.hl = null;
      st8.known = {}; if (n >= 3) st8.known[1] = true; if (n >= 4) WV.forEach(function (w, i) { st8.known[i] = true; });
      st8.drift = n === 1; st8.ex = n === 1 ? 'in' : n === 2 || n === 3 ? 'home' : 'none';
      st8.test = n >= 2; st8.focus = STEPS[n] ? STEPS[n].focus : null; st8.play = n >= PLAY; st8.say = n >= OUTRO;
      st8.dx = 0; st8.drag = null;
      if (n === 3) { A.stampW = 1; A.stamp = T.clock - 30; }
      V.from = V.to = vTarget();
      api.playing(st8.play); live.textContent = label(); keyable();
      if (!quiet) { stage.drawing++; stage.render(); }
    }
    /* step n's entrance, played from the finished state of step n - 1 */
    function enter(n) {
      var c = T.clock + 1;
      function focus(f) { if (f !== st8.focus) { st8.focus = f; A.fz = T.clock; } }
      if (STEPS[n] && n !== 2) focus(STEPS[n].focus);
      if (n === 1) { st8.drift = true; st8.ex = 'in'; A.ex = c + 3; A.exDir = 'in'; A.oops = c + 7; want(50); }
      else if (n === 2) {
        // the new form joins the old one on the desk; then March, then April, each with its own question
        st8.test = true; st8.drift = false; st8.ex = 'home'; A.ex = c; A.exDir = 'out'; st8.pair = true; A.pair = c; focus('desk');
        cue(c + 6, function () { st8.split = 1; A.win1 = T.clock; st8.hl = 'a'; focus('m1'); });
        cue(c + 26, function () { st8.split = 2; A.win2 = T.clock; st8.hl = 'b'; focus('m2'); });
        cue(c + 46, function () { st8.hl = null; focus('frame'); });
        want(52);
      }
      else if (n === 3) { st8.known[1] = true; retarget(2); A.stampW = 1; A.stamp = c + 10; want(34); }
      else if (n === 4) {
        // summer first, then the frame moves on to the fall run and stamps it, like the spring run
        WV.forEach(function (w, i) { st8.known[i] = true; }); st8.ex = 'none'; setWave(3);
        cue(c + 36, function () { setWave(5); });
      }
      else if (n === PLAY) { st8.play = true; api.playing(true); keyable(); }
      live.textContent = label();
      stage.render();
    }
    api.onStep(function (n, prev) {
      if (n >= PLAY && prev >= PLAY) {
        // between the last step and the closing card: keep whatever the reader set up
        st8.say = n === OUTRO; if (st8.say) { A.say = T.clock + 1; S.reward(api); want(20); }
        stage.render(); return;
      }
      if (prev >= 0 && n === prev + 1 && !S.reduce) { snap(prev, true); enter(n); }
      else snap(n);
      if (n === OUTRO) { A.say = T.clock + 1; S.reward(api); want(20); }
    });

    /* ---------------- the close ---------------- */
    api.take('The corrected count has fewer striper trips in every season, and far fewer in spring and late fall, the striper runs. NOAA’s corrected numbers reach back to the early 1980s.');
    api.more('The test and the corrected numbers',
      '<p>In 2024 NOAA ran the old two-month form and a new one-month form side by side in 17 states. The new form mailed every month, asked about one month at a time and asked the questions in a different order, and it counted fewer trips. The numbers on this page come from the corrected estimates NOAA posted on August 31, 2026: striper trips from shore and private boats on the Atlantic coast, 2016 to 2025 combined, for each two-month period, with the old count set at 100. The estimates come in two-month periods, so the picture splits each period’s trips evenly between its two months.</p>' +
      '<p>Why trust the corrected count? Both forms went out side by side, in the same 17 states in the same year, so the one thing that differed was the form. And asking about one month leaves less room for memory to drift.</p>' +
      '<p>For every 100 striper trips in the old count, the corrected count has: January and February ' + per100(0) + ', March and April ' + per100(1) + ', May and June ' + per100(2) + ', July and August ' + per100(3) + ', September and October ' + per100(4) + ', November and December ' + per100(5) + '.</p>' +
      '<p>The numbers show how much lower the corrected count came in, not why. The usual explanation is telescoping: people remember trips from just before the period as inside it, and a longer period gives memory more room to drift. The fuzzy edge in the picture illustrates that idea; it isn’t a measurement.</p>' +
      '<p>January and February came in lowest, but they hold under 1 in every 100 of the year’s striper fishing trips.</p>' +
      '<p class="src">Source: ' + FRAME.link('mrip', 'NOAA’s Marine Recreational Information Program (MRIP)') + ' corrected estimates, posted Aug 31, 2026 (striped bass trips by two-month period, shore and private boat, Atlantic coast, 2016 to 2025 combined), as compiled by ASGA. The side-by-side test: ' + FRAME.link('fes', 'NOAA’s 2024 one-month mail survey test') + ' in 17 states.</p>');

    /* ---------------- dragging the frame (the reader's turn) ---------------- */
    function dragTo(pt) {
      var L = lay(stage), w = waveAt(L, pt.x - st8.drag.off, pt.y);
      if (w !== st8.w) setWave(w, true);
      var b = fbox(L, st8.w);
      st8.dx = S.clamp(pt.x - st8.drag.off - (b.x0 + b.x1) / 2, -80, 80) * 0.55;
      stage.render();
    }
    stage.drag({
      start: function (name, pt) {
        if (!st8.play || name.indexOf('pair:') !== 0) return false;
        var L = lay(stage), w = +name.slice(5), b = fbox(L, st8.w);
        st8.drag = { off: w === st8.w ? pt.x - (b.x0 + b.x1) / 2 : 0 };
        if (w !== st8.w) setWave(w, true);
        dragTo(pt);
      },
      move: function (name, pt) { if (st8.drag) dragTo(pt); },
      end: function () {
        if (!st8.drag) return;
        st8.drag = null; st8.dragged = true; st8.settleFrom = st8.dx; A.settle = T.clock + 1; A.snap = T.clock + 1;
        S.buzz(8); want(6);
      }
    });

    // the opening: the letter arrives once the picture is in view
    var opened = false;
    function intro() { if (opened) return; opened = true; A.mail = T.clock + 2; want(12); }
    // the idle heartbeat (SITE.idle): the boil, the blinks and the DRAG ME arrows keep going between moments
    S.idle(api.stageHost, function () { T.clock++; stage.drawing++; stage.render(); }, function () { return !!T.raf || st8.drag != null; });
    snap(0);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting) intro(); }, { threshold: 0.35 }).observe(api.stageHost);
    else intro();
    document.addEventListener('site:fonts', function () { stage.render(); });
  }
});
