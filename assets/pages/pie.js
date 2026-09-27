/* 4. Fewer caught means fewer fish: the reverse math (the film's s08 to s10). The centerpiece.
   A scrolly page, built on the lessons of the count, calendar and ghost pages (Luyen's reviews, Sep 26):
   a walkthrough, one idea per step, plain round numbers (per 100, never a percentage),
   an equation under the picture, then one gesture for the reader.
   The counterintuitive idea: nobody counts the stripers in the ocean. An assessment works the school out
   backward from the fish taken out, at a fishing rate (about 1 in 5) that comes from tags and ages. So a
   recount that lowers the catch doesn't leave more fish in the water; it says the school was smaller all
   along. No spotlight on this page (Luyen, Sep 26): its moments are motion, the fish hopping back, the
   bubble popping, the pie shrinking, and a scrim hid them.
   Steps (example numbers, per 100 fish taken out):
     1. What we picture: Kit's thought bubble, a pond where somebody counted 500 stripers; anglers caught
        100 (the cooler), so 400 are left. The equation reads 500 - 100 = 400.
     2. The recount says anglers caught 58, not 100: four fish hop from the cooler back into the pond,
        442 left, Kit cheers.
     3. The Striper shakes his head: "Nobody ever counted those." The bubble pops; the 500 is struck out.
     4. The picnic table: the lifted slice is the fish taken out (100) and the gauge is the fishing rate
        (1 in 5). The equation turns into 100 x 5 = ?
     5. Working backward: the other four slices count off, 100 each, and the school comes to 500.
     6. The recount: the slice shrinks to 58 (the whole record's figure, 58 for every 100); the gauge
        twitches and holds at 1 in 5.
     7. Work it backward again: the pie shrinks to 5 x 58 = 290 inside the ghost of the old one, Kit stabs
        the ghost rim, SMALLER ALL ALONG is stamped, and the Striper says "Sharper tool. Not extra fish."
   Then the reader's turn: push the slice smaller or pull it bigger, and the pie follows.
   Numbers: an example in round numbers. The 58 is the recount's figure across the whole record (trips,
   kept fish and released fish each came to about 58 for every 100). */
SITE.register({
  id: 'pie', short: 'Fewer caught, fewer fish', title: 'Fewer caught means fewer fish', scrolly: true,
  build: function (api) {
    var S = SITE, K = S.K, C = S.C, INK = C.ink, N = S.N, path = S.path;
    var OLD = 100, NEW = 58, RATE = 5, COUNTED = 500;
    // scene: 'pond' or 'pie'. Tweened values: caught (the cooler), slice (fish taken out), pieN (the school / 5)
    var st8 = { scene: 'pond', bubble: true, struck: false, said: false, cheer: false, wedges: 0, school: false, x5: false, card: false,
      stamp: false, spoke: false, turn: false, tried: false };
    var T = { clock: 100, raf: 0, last: 0, until: 0 }, cues = [];
    var A = { hop: -99, pop: -99, shake: -99, tw: -99, stab: -99, stamp: -99, wd: -99, say: -99 };
    var TW = { caught: { f: OLD, t: OLD, a: -99, l: 8 }, slice: { f: OLD, t: OLD, a: -99, l: 10 }, pieN: { f: OLD, t: OLD, a: -99, l: 10 } };
    function age(k) { return T.clock - A[k]; }
    function val(k) { var w = TW[k], p = S.clamp((T.clock - w.a) / w.l, 0, 1); return w.f + (w.t - w.f) * S.ease.inOut(p); }
    function tween(k, to, delay) { var w = TW[k]; w.f = val(k); w.t = to; w.a = T.clock + 1 + (delay || 0); }
    function setNow(k, v) { var w = TW[k]; w.f = w.t = v; w.a = -99; }

    /* ---------------- shared bits ---------------- */
    function lay(st) {
      var port = st.port, dy = st.h - (port ? 1250 : 1080);
      return port ? { port: true, dy: dy, hz: 440 + dy, dock: 520 + dy, TX: 540, TY: 1110 + dy, TOP: 380, TW: 860, PS: 0.86, GX: 905, GY: 390 + dy, GS: 0.72 }
        : { port: false, dy: dy, hz: 600 + dy, dock: 690 + dy, TX: 960, TY: 1000 + dy, TOP: 430, TW: 900, PS: 1.04, GX: 1700, GY: 470 + dy, GS: 0.95 };
    }
    /* the table scene sits closer in: the pie and table about 40% bigger, the horizon lower, everyone moved out */
    function layPie(st) {
      var port = st.port, dy = st.h - (port ? 1250 : 1080), L;
      if (port) L = { port: true, dy: dy, hz: 380 + dy, dock: 450 + dy, TX: 540, TY: 1150 + dy, TOP: 480, TW: 1060, PS: 1.12, GX: 915, GY: 300 + dy, GS: 0.7,
        KX: 96, KY: 1240 + dy, KS: 0.48, SX: 992, SY: 1235 + dy, SS: 0.44, sgY: 110 + dy * 0.35, fish: [-440, 440] };
      else L = { port: false, dy: dy, hz: 470 + dy, dock: 540 + dy, TX: 940, TY: 1045 + dy, TOP: 560, TW: 1260, PS: 1.45, GX: 1745, GY: 360 + dy, GS: 1,
        KX: 190, KY: 1075 + dy, KS: 0.8, SX: 1640, SY: 1055 + dy, SS: 0.74, sgY: 105 + dy * 0.35, fish: [-560, -470, 470] };
      return L;
    }
    function gauge(r, ang) {
      var g = '', rad = Math.PI / 180, d = '';
      g += '<circle r="' + (r + 16) + '" fill="' + C.brown + '" stroke="' + INK + '" stroke-width="7"/><circle r="' + r + '" fill="' + C.cream + '" stroke="' + INK + '" stroke-width="5"/>';
      g += '<path d="M' + N(-r * 0.2) + ',' + N(r * 0.96) + ' A' + r + ' ' + r + ' 0 0 1 ' + N(-r * 0.96) + ',' + N(-r * 0.2) + '" fill="none" stroke="' + S.SH.cream + '" stroke-width="10"/>';
      for (var a = -210; a <= 30; a += 24) { if (a === -90) continue; d += 'M' + N(Math.cos(a * rad) * r * 0.78) + ',' + N(Math.sin(a * rad) * r * 0.78) + ' L' + N(Math.cos(a * rad) * r * 0.9) + ',' + N(Math.sin(a * rad) * r * 0.9) + ' '; }
      g += path(d, 'none', 4) + path('M0,' + N(-r * 0.74) + ' L0,' + N(-r * 0.95), 'none', 9, '', C.brick);
      g += K.text('1 IN 5', 0, -r * 0.43, { size: 40, fill: C.brick }) + K.text('FISHING RATE', 0, r * 0.55, { size: 26 });
      var na = ang * rad, nl = r * 0.36;
      g += '<path d="M' + N(Math.cos(na + 1.57) * 10) + ',' + N(Math.sin(na + 1.57) * 10) + ' L' + N(Math.cos(na) * nl) + ',' + N(Math.sin(na) * nl) + ' L' + N(Math.cos(na - 1.57) * 10) + ',' + N(Math.sin(na - 1.57) * 10) + ' Z" fill="' + INK + '"/><circle r="12" fill="' + INK + '"/>';
      return g;
    }
    /* a tag hanging on a string from (ax, ay) */
    function hang(ax, ay, o) {
      return path('M' + N(ax) + ',' + N(ay) + ' L' + N(o.x) + ',' + N(o.y - (o.h || 124) / 2 + 6), 'none', 4) + '<circle cx="' + N(ax) + '" cy="' + N(ay) + '" r="7" fill="' + C.cream + '" stroke="' + INK + '" stroke-width="4"/>' + S.tag(o);
    }
    function sky(st, L) {
      var s = S.set.dock(st, { hz: L.hz, dock: L.dock }).svg;
      s += K.lighthouse({ x: L.port ? 990 : 1830, y: L.hz + 6, h: L.port ? 120 : 160 });
      var f = (st.drawing >> 1) % 2;
      s += K.gull({ x: L.port ? 260 : 520, y: L.port ? 250 + L.dy * 0.3 : 230 + L.dy * 0.4, scale: 0.7, flap: f }) + K.gull({ x: L.port ? 380 : 700, y: L.port ? 300 + L.dy * 0.3 : 290 + L.dy * 0.4, scale: 0.5, flap: 1 - f });
      return s;
    }
    function exampleTag(st, L, y) { return K.tag('EXAMPLE NUMBERS', L.port ? 540 : st.w - 250, y, { size: L.port ? 26 : 28, rot: L.port ? 0 : 3, fill: C.cream }); }
    /* ---------------- the pond Kit pictures ---------------- */
    function pondLay(st) {
      var L = lay(st), port = L.port, fl = L.dock + (port ? 560 : 290);
      return { L: L, port: port, fl: fl, B: { x: port ? 540 : 1000, y: port ? 330 + L.dy * 0.5 : 330 + L.dy * 0.55, w: port ? 940 : 980, h: 520 },
        KX: port ? 190 : 470, KY: port ? st.h - 40 : fl, KS: port ? 0.62 : 0.86, CX: port ? 770 : 1330, CY: port ? st.h - 40 : fl,
        SX: port ? 980 : 1710, SY: port ? st.h - 30 : fl + 10, SS: port ? 0.5 : 0.8 };
    }
    function pondSlot(P, i) {       // a fish in the pond, in the bubble's own units
      var c = i % 10, r = Math.floor(i / 10);
      return [(c - 4.5) * P.B.w * 0.066 + (r % 2 ? 14 : -14), 40 + (r - 2) * P.B.h * 0.1 + (TBR.hash(i * 3.1) - 0.5) * 10];
    }
    function coolerSlot(P, j) { return [P.CX - 78 + (j % 4) * 52, P.CY - (P.port ? 150 : 175) - Math.floor(j / 4) * 32]; }
    var HOPS = 4;                   // 100 caught becomes 58: four of the cooler's ten fish (10 stripers each) hop back
    function hopAge(h) { return age('hop') - h * 5; }
    function pondScene(st) {
      var P = pondLay(st), L = P.L, B = P.B, port = P.port, s = sky(st, L), caught = Math.round(val('caught')), left = COUNTED - caught;
      var landed = 0, flying = [];
      for (var h = 0; h < HOPS; h++) { var ha = hopAge(h); if (A.hop < 0 || ha < 0) continue; if (ha >= 6) landed++; else flying.push([h, ha]); }
      var started = A.hop > 0 ? Math.min(HOPS, landed + flying.length) : 0;
      if (TW.caught.t === NEW && A.hop < 0) { landed = HOPS; started = HOPS; }        // snapped to the recount
      // the pond Kit pictures, inside her thought bubble; it pops when the Striper sets her straight
      var pa = age('pop'), showB = st8.bubble || (pa >= 0 && pa < 6);
      if (showB) {
        var inner = '<ellipse cx="0" cy="40" rx="' + N(B.w * 0.4) + '" ry="' + N(B.h * 0.3) + '" fill="' + C.sea + '" stroke="' + INK + '" stroke-width="6"/>' +
          '<ellipse cx="0" cy="' + N(40 + B.h * 0.1) + '" rx="' + N(B.w * 0.34) + '" ry="' + N(B.h * 0.16) + '" fill="' + C.seaDeep + '"/>';
        for (var i = 0; i < 40 + landed; i++) { var q = pondSlot(P, i); inner += K.fishIcon({ x: q[0], y: q[1], size: port ? 0.62 : 0.66, flip: i % 3 === 0 }); }
        inner += K.sign({ x: 0, y: -B.h * 0.33 + 40, w: port ? 600 : 640, h: 70, post: 'none', dashed: true, fill: C.cream, label: 'SOMEBODY COUNTED ' + COUNTED, size: 36 });
        inner += K.text('LEFT IN THE POND: ' + left, 0, B.h * 0.36, { size: 40, fill: C.cream, stroke: INK, strokeW: 8 });
        var bk = st8.bubble ? 1 : [1.08, 0.7, 0.3, 0, 0, 0][pa];
        if (bk > 0) s += '<g transform="translate(' + N(B.x) + ' ' + N(B.y) + ') scale(' + bk + ') translate(' + N(-B.x) + ' ' + N(-B.y) + ')">' +
          K.thought({ x: B.x, y: B.y, w: B.w, h: B.h, tail: port ? [-0.5, 1] : [-0.75, 0.9], stage: 3, inner: inner }) + '</g>';
        // a splash where each fish lands back in the pond
        if (st8.bubble && A.hop > 0) for (var hh = 0; hh < HOPS; hh++) {
          var sa2 = hopAge(hh) - 6; if (sa2 < 0 || sa2 >= 5) continue;
          var sq2 = pondSlot(P, 40 + hh), rx = 22 + sa2 * 12;
          s += '<ellipse cx="' + N(B.x + sq2[0]) + '" cy="' + N(B.y + sq2[1] + 12) + '" rx="' + rx + '" ry="' + N(rx * 0.4) + '" fill="none" stroke="' + C.white + '" stroke-width="' + (6 - sa2) + '" opacity="' + (1 - sa2 * 0.18).toFixed(2) + '"/>' +
            (sa2 < 2 ? K.sparkle({ x: B.x + sq2[0] + 26, y: B.y + sq2[1] - 26, r: 18 }) : '');
        }
        if (!st8.bubble && pa >= 1) [[-0.3, -0.2, 70], [0.25, -0.15, 80], [0, 0.2, 90], [-0.35, 0.25, 60], [0.35, 0.22, 64]].forEach(function (p, k) {
          s += K.puff({ x: B.x + p[0] * B.w, y: B.y + p[1] * B.h, r: p[2] + pa * 14, seed: k + 3 });
        });
      }
      // the cooler of caught fish (each pink fish is 10 stripers)
      s += S.shadow(P.CX, P.CY, 300) + S.cel(K.cooler({ x: P.CX, y: P.CY, scale: port ? 0.7 : 0.82, open: 0, label: 'CAUGHT' }));
      for (var j = 0; j < 10 - started; j++) { var cs = coolerSlot(P, j); s += K.fishIcon({ x: cs[0], y: cs[1], size: 0.78, fill: C.pink, flip: j % 2 === 0 }); }
      flying.forEach(function (f) {
        var a = coolerSlot(P, 9 - f[0]), bq = pondSlot(P, 40 + f[0]), b = [B.x + bq[0], B.y + bq[1]], p = S.ease.inOut(f[1] / 6);
        var x = a[0] + (b[0] - a[0]) * p, y = a[1] + (b[1] - a[1]) * p - 260 * 4 * p * (1 - p);
        s += K.speedLines({ x: x + 60, y: y + 30, rot: -150, len: 70, n: 3, gap: 16, w: 5 }) + K.fishIcon({ x: x, y: y, size: 0.8, fill: C.pink, rot: -20 + 40 * p });
      });
      s += hang(P.CX + 90, P.CY - (port ? 250 : 290), { x: P.CX + (port ? 60 : 150), y: P.CY - (port ? 360 : 420), w: 300, h: 110, band: C.orange, rot: 3, lines: ['CAUGHT:', { t: String(caught), size: 52 }], size: 32 });
      s += exampleTag(st, L, port ? 60 : 70 + L.dy * 0.3);
      // Kit thinks, cheers at the fish going back, then looks up at the pop; the Striper shakes his head
      var kp = st8.cheer && st8.bubble ? 'cheer' : 'think', ke = st8.cheer && st8.bubble ? 'grin' : !st8.bubble ? 'wide' : 'think';
      s += S.shadow(P.KX, P.KY, 170) + K.kid({ x: P.KX, y: P.KY, scale: P.KS, pose: kp, expr: ke, blink: (st.drawing % 40) === 0 });
      var sa = age('shake'), shaking = sa >= 0 && sa < 20;
      s += S.shadow(P.SX, P.SY, 180) + K.striper({ x: P.SX, y: P.SY, scale: P.SS, flip: true, pose: shaking ? 'shake' : 'neutral', frame: shaking ? (sa >> 1) % 2 : 0, expr: shaking || st8.said ? 'kind' : 'neutral', mouth: shaking && sa < 14 ? (sa % 3 === 2 ? 'closed' : 'open') : false });
      if (st8.said) s += S.say('Nobody ever counted those.', port ? 760 : P.SX - 120, port ? st.h - 450 : P.SY - 520 * P.SS - 90, port ? 440 : 470, port ? 960 : P.SX - 30, P.SY - 430 * P.SS, { size: port ? 38 : 42 });
      return s;
    }

    /* ---------------- the picnic table: the pie, the gauge, the School peeking ---------------- */
    var RAD = Math.PI / 180;
    function E(a, rr) { return [Math.cos(a * RAD) * rr, Math.sin(a * RAD) * rr * 0.52]; }
    function pieScene(st) {
      var L = layPie(st), s = sky(st, L), port = L.port, sl = val('slice'), pn = val('pieN'), slR = sl / OLD, pnR = pn / OLD;
      var PS = L.PS, PX = L.TX, PY = L.TY - 250 * (PS / 1.04), cs = Math.sqrt(pnR);
      // the sign, with the SMALLER ALL ALONG stamp once the idea lands
      var sgX = port ? 540 : 960, sgY = L.sgY, sa = age('stamp');
      s += S.tag({ x: sgX, y: sgY, w: port ? 900 : 1000, h: 150, band: C.brick, lines: ['STOCK ASSESSMENT:', { t: 'WORKING OUT THE SCHOOL FROM THE CATCH', size: port ? 30 : 34 }], size: port ? 48 : 54 });
      if (st8.stamp && pn < OLD - 0.5) {
        var sp = sa >= 0 && sa < 4 ? [1.9, 0.86, 1.08, 1][sa] : 1;
        s += K.stampMark({ x: sgX + (port ? 150 : 0), y: sgY + (port ? 96 : 132), label: 'SMALLER ALL ALONG', color: C.sea, size: port ? 40 : 48, rot: -5, scale: sp });
      }
      s += port ? exampleTag(st, L, sgY + 160) : K.tag('EXAMPLE NUMBERS', 250, 70 + L.dy * 0.3, { size: 28, rot: -3, fill: C.cream });
      // the School peeks over the table's far edge
      var back = L.TY - L.TOP;
      L.fish.forEach(function (fx, si) { s += K.schoolie({ x: L.TX + fx, y: back + (port ? 96 : 112), scale: port ? 0.56 : 0.66, tie: si, pose: 'peek', mouth: 'closed', blink: ((st.drawing + si * 7) % 36) === 0 }); });
      // the table and the pie (the lifted slice is the fish taken out; the whole pie is the school)
      s += S.shadow(L.TX, L.TY + 60, L.TW) + K.picnicTable({ x: L.TX, y: L.TY, w: L.TW, h: 64, top: L.TOP, legH: 36 });
      var GRC = [PX, PY + 23 * PS], GRR = [282 * PS, (282 * 0.52 + 23) * PS];
      if (pnR < 0.995) {
        var ringE = '<ellipse cx="' + N(GRC[0]) + '" cy="' + N(GRC[1]) + '" rx="' + N(GRR[0]) + '" ry="' + N(GRR[1]) + '" fill="none"';
        s += ringE + ' stroke="' + C.cream + '" stroke-width="15"/>' + ringE + ' stroke="' + C.gray + '" stroke-width="8" stroke-dasharray="15 12"/>';
      }
      s += S.cel(K.pie({ x: PX, y: PY, scale: PS, lift: 1, slice: Math.sqrt(slR), ghostSlice: slR < 0.995, crust: cs }));
      // the other four slices, counted off: each is the same size as the slice taken out
      var wa = age('wd');
      [126, 198, 270, 342].forEach(function (a, i) {
        if (i >= st8.wedges) return;
        var p = E(a, 260 * 0.6 * cs), k = A.wd > 0 && wa - i * 5 >= 0 && wa - i * 5 < 5 ? S.pop(wa - i * 5, 4) : 1;
        s += K.at(PX + p[0] * PS, PY + p[1] * PS, k * (port ? 0.95 : 1), 0, K.tag(String(Math.round(pn)), 0, 0, { size: (port ? 40 : 44) * Math.max(0.8, cs), fill: C.cream }));
      });
      // where the lifted slice sits: the pie-local mid of the 18..90 degree wedge, lifted 190
      var mid = [Math.cos(54 * RAD) * 260 * 0.45, Math.sin(54 * RAD) * 260 * 0.45 * 0.52];
      var sx = PX + mid[0] * 1.3 * PS, sy = PY + (mid[1] - 190) * PS;
      if (st8.turn) s += S.grab('slice', '<circle cx="' + N(sx) + '" cy="' + N(sy) + '" r="' + N(140 * PS) + '" fill="transparent"/>', sx, sy, 0);
      // x 5: an arrow from the slice to the whole pie
      if (st8.x5) {
        var ax0 = sx - 120 * PS, ay0 = sy + 20 * PS, ax1 = PX - 180 * PS, ay1 = PY - 40 * PS;
        s += path('M' + N(ax0) + ',' + N(ay0) + ' Q' + N((ax0 + ax1) / 2 - 60) + ',' + N(ay0 - 110 * PS) + ' ' + N(ax1) + ',' + N(ay1), 'none', 9, '', C.mustard);
        s += path('M' + N(ax1 - 24) + ',' + N(ay1 - 22) + ' L' + N(ax1) + ',' + N(ay1) + ' L' + N(ax1 + 30) + ',' + N(ay1 - 12), 'none', 9, '', C.mustard);
        s += K.tag('× 5', (ax0 + ax1) / 2 - 40, ay0 - 95 * PS, { size: port ? 50 : 58, rot: -6, fill: C.mustard });
      }
      // the tags on strings: the fish taken out hang from the slice, the school from the rim
      var ly = PY - 300 * PS;
      s += hang(sx + 40, sy - 70 * PS, { x: sx + (port ? 60 : 330), y: ly, w: port ? 330 : 360, h: 124, band: C.orange, rot: 2, lines: ['FISH TAKEN OUT:', { t: String(Math.round(sl)), size: 56 }], size: 32 });
      if (st8.school) {
        var shown = Math.round(pn) * Math.min(RATE, 1 + st8.wedges), rimX = PX - 270 * PS * cs, rimY = PY + 10 * PS;
        s += hang(rimX, rimY, { x: port ? 190 : PX - 560, y: port ? ly + 60 : ly + 40, w: port ? 330 : 380, h: 124, band: C.sky, rot: -2, lines: ['ESTIMATED SCHOOL:', { t: String(shown), size: 56 }], size: 32 });
      }
      // the gauge: the needle twitches but settles on 1 IN 5
      var ta = age('tw'), ang = -90 + (ta >= 0 && ta < 8 ? 26 * Math.sin((8 - ta) * 2.3) * (8 - ta) / 8 : 0), gb = L.dock + (port ? 40 : 60);
      s += S.shadow(L.GX, gb, 60) + '<rect x="' + (L.GX - 12) + '" y="' + L.GY + '" width="24" height="' + N(gb - L.GY) + '" fill="' + C.brown + '" stroke="' + INK + '" stroke-width="7"/>';
      s += '<g transform="translate(' + L.GX + ' ' + L.GY + ') scale(' + L.GS + ')">' + S.cel(gauge(118, ang)) + '</g>';
      if (sa >= 0 && sa < 5) s += K.sparkle({ x: L.GX + 80 * L.GS, y: L.GY - 140 * L.GS, r: 30 });
      // Kit with her fork (the stab at the ghost rim), the Striper holding up the x 5 card
      var KS = L.KS, KX0 = L.KX, KY = L.KY, ka = age('stab');
      if (ka >= 0 && ka < 16 && !port) {
        var fr = ka < 4 ? 0 : 1, tn = K.kidPoints({ pose: 'stab', frame: 1, scale: KS }).tines;
        var tx = GRC[0] - GRR[0] * 0.78, ty = GRC[1] + GRR[1] * 0.35;
        s += K.kid({ x: fr ? tx - tn[0] : KX0, y: fr ? ty - tn[1] : KY, scale: KS, pose: 'stab', frame: fr, expr: 'eager' });
      } else s += S.shadow(KX0, KY, 150) + K.kid({ x: KX0, y: KY, scale: KS, pose: 'fork', expr: pnR < 0.995 ? 'wide' : 'eager', blink: (st.drawing % 44) === 3 });
      var SX = L.SX, SY = L.SY, SS = L.SS, say = age('say'), talking = st8.spoke && say >= 0 && say < 14;
      s += S.shadow(SX, SY, 170) + K.striper({ x: SX, y: SY, scale: SS, flip: true, pose: st8.card ? 'hold' : 'neutral', hold: st8.card ? 'card' : undefined, holdText: st8.card ? '× 5' : undefined, expr: st8.spoke ? 'wink' : 'kind', mouth: talking ? (say % 3 === 2 ? 'closed' : 'open') : false });
      if (st8.spoke) s += S.say('Sharper tool. Not extra fish.', port ? 800 : SX + 40, port ? L.TY - 330 : SY - 520, port ? 380 : 360, port ? 960 : SX + 20, SY - 400 * SS, { size: port ? 36 : 40 });
      return s;
    }

    var stage = api.stage(function (st) { return st8.scene === 'pond' ? pondScene(st) : pieScene(st); }, label);
    function label() {
      if (st8.scene === 'pond') { var c = Math.round(TW.caught.t); return 'Kit pictures a pond where somebody counted ' + COUNTED + ' stripers. ' + c + ' caught, ' + (COUNTED - c) + ' left.' + (st8.bubble ? '' : ' Nobody ever counted those; the pond was never real.'); }
      var n = Math.round(TW.slice.t), p = Math.round(TW.pieN.t);
      return 'A pie on a picnic table. The lifted slice is ' + n + ' fish taken out. The fishing rate is 1 in 5, so the estimated school is 5 times ' + p + ', ' + p * RATE + ' stripers.';
    }

    /* ---------------- the clock: moments run on twos, 12 drawings a second; cues fire on their drawing ---------------- */
    function cue(at, fn) { cues.push({ at: at, fn: fn }); cues.sort(function (a, b) { return a.at - b.at; }); }
    function fire() { while (cues.length && cues[0].at <= T.clock) cues.shift().fn(); }
    function want(n) {
      T.until = Math.max(T.until, T.clock + n);
      if (S.reduce) { while (cues.length) { T.clock = Math.max(T.clock, cues[0].at); fire(); } T.clock = T.until + 40; T.until = T.clock; stage.drawing++; stage.render(); show(); return; }
      if (!T.raf) { T.last = performance.now(); T.raf = requestAnimationFrame(tick); }
    }
    function tick(now) {
      if (now - T.last >= 1000 / 12 - 2) { T.last = now; T.clock++; fire(); stage.drawing++; stage.render(); show(); }
      if (T.clock < T.until || cues.length) T.raf = requestAnimationFrame(tick); else T.raf = 0;
    }

    /* ---------------- the walkthrough ---------------- */
    var STEPS = [
      { cls: 'first', h: '<p>Here’s how most of us picture it. Somebody counted the stripers: say <b class="num">500</b>. Anglers caught <b class="num">100</b> of them, so <b class="num">400</b> are left.</p>' },
      { h: '<p>Now the recount says anglers caught <b class="num">58</b>, not 100. In this picture, that leaves <b class="num">442</b>. More fish in the water. Good news?</p>' },
      { h: '<p><b>Nobody ever counted those.</b> No one can count the stripers in the ocean. The 500 was never a count. It was worked out from the catch.</p>' },
      { h: '<p>Here’s what scientists can measure. The <b>fish taken out</b> each year, from the surveys: 100 in this example. And the <b>fishing rate</b>, the share of the stripers that fishing kills each year, which they estimate from tagged fish and the ages of fish caught. In this example it’s <b>about 1 in 5</b>.</p>' },
      { h: '<p>So they work backward. If 100 fish taken out is 1 in 5, the school is five slices of 100: <b class="num">5 × 100 = 500</b>. That’s where Kit’s 500 came from.</p>' },
      { h: '<p>Now the recount. Across the whole record it finds about <b class="num">58</b> fish taken out for every 100 in the old count. The tags and ages didn’t change, so the rate is still <b>1 in 5</b>.</p>' },
      { h: '<p>Work it backward again: <b class="num">5 × 58 = 290</b>. The school was never 500. There were <b>fewer stripers out there all along</b>.</p>' },
      { cls: 'turn', h: '<span class="go">Your turn</span><p>Slide the bobber under the picture to change the fish taken out. The rate stays 1 in 5, so the whole pie follows the slice.</p>' }
    ];
    var PLAY = STEPS.length - 1, OUTRO = STEPS.length;
    STEPS.forEach(function (d) { api.step(d.h, d.cls); });

    /* the finished state of step n, drawn at once (a jump, a scroll back, or reduced motion) */
    function snap(n) {
      if (T.raf) { cancelAnimationFrame(T.raf); T.raf = 0; }
      cues = []; Object.keys(A).forEach(function (k) { A[k] = -99; });
      st8.scene = n >= 3 ? 'pie' : 'pond';
      setNow('caught', n >= 1 ? NEW : OLD);
      st8.bubble = n < 2; st8.struck = n >= 2; st8.said = n === 2; st8.cheer = n === 1;
      st8.wedges = n >= 4 ? 4 : 0; st8.school = n >= 4; st8.x5 = n >= 4; st8.card = n >= 4;
      setNow('slice', n >= 5 ? NEW : OLD); setNow('pieN', n >= 6 ? NEW : OLD);
      st8.stamp = n >= 6; st8.spoke = n >= 6 && n < PLAY;
      st8.turn = n >= PLAY; if (n < PLAY) st8.tried = false;
      key.set(Math.round(TW.slice.t)); key.el.disabled = !st8.turn;
      api.playing(st8.turn); show();
      stage.drawing++; stage.render();
    }
    /* step n's entrance, played from the finished state of step n - 1 */
    function enter(n) {
      var c = T.clock + 1;
      if (n === 1) { tween('caught', NEW, 2); TW.caught.l = 22; A.hop = c + 2; cue(c + 14, function () { st8.cheer = true; }); want(40); }
      else if (n === 2) {
        A.shake = c; cue(c + 2, function () { st8.said = true; });
        cue(c + 18, function () { st8.bubble = false; A.pop = T.clock; st8.struck = true; show(); });
        want(30);
      }
      else if (n === 3) { st8.scene = 'pie'; st8.said = false; stage.animate(300); }
      else if (n === 4) {
        st8.x5 = true; st8.card = true; st8.school = true; A.wd = c + 4;
        for (var i = 1; i <= 4; i++) (function (i) { cue(c + 4 + (i - 1) * 5, function () { st8.wedges = i; show(); }); })(i);
        want(30);
      }
      else if (n === 5) { tween('slice', NEW, 2); A.tw = c + 4; want(20); }
      else if (n === 6) {
        tween('pieN', NEW, 2);
        cue(c + 12, function () { A.stab = T.clock; });
        cue(c + 18, function () { st8.stamp = true; A.stamp = T.clock; });
        cue(c + 20, function () { st8.spoke = true; A.say = T.clock; });
        want(44);
      }
      else if (n === PLAY) { st8.turn = true; st8.spoke = false; key.el.disabled = false; api.playing(true); }
      show(); stage.render();
    }
    api.onStep(function (n, prev) {
      if (n >= PLAY && prev >= PLAY) { if (n === OUTRO) closing(); return; }
      if (prev >= 0 && n === prev + 1 && !S.reduce) { snap(prev); enter(n); }
      else snap(n);
      if (n === OUTRO) closing();
    });
    function closing() {
      api.gotIt();
      var nx = api.nav && api.nav.querySelector('.btn'); if (nx && !S.reduce) { nx.classList.remove('pie-nudge'); void nx.offsetWidth; nx.classList.add('pie-nudge'); }
    }

    /* ---------------- the equation under the picture: the wrong math, then the real one ---------------- */
    var css = document.createElement('style');
    css.textContent =
      '#pie .eq{display:flex;align-items:stretch;justify-content:center;gap:clamp(6px,.9vw,14px)}' +
      '#pie .chip{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:clamp(92px,9vw,156px);padding:8px 14px 6px;background:var(--white);border:3px solid var(--ink);border-radius:10px;box-shadow:4px 4px 0 var(--sh-tan);transition:background .1s}' +
      '#pie .chip b{font:700 clamp(26px,2.5vw,42px)/1 var(--f-mono);font-variant-numeric:tabular-nums}' +
      '#pie .chip small{font:400 clamp(14px,1.05vw,17px)/1.15 var(--f-label);color:var(--muted);margin-top:5px;white-space:nowrap}' +
      '#pie .chip.hot{background:var(--sea);color:var(--cream)}#pie .chip.hot small{color:var(--cream)}' +
      '#pie .chip.rate{background:var(--cream)}#pie .chip.rate b{color:var(--brick)}' +
      '#pie .chip.x{background:#eee6d4;color:var(--gray)}#pie .chip.x small{color:var(--brick)}' +
      '#pie .chip.x::after{content:"";position:absolute;left:8%;right:8%;top:50%;height:6px;margin-top:-3px;background:var(--brick);border-radius:3px;transform:rotate(-12deg)}' +
      '#pie .chip.pop{animation:piePop .3s steps(3,end)}' +
      '@keyframes piePop{0%{transform:scale(1.14)}60%{transform:scale(.97)}100%{transform:none}}' +
      '#pie .op{align-self:center;font:400 clamp(30px,2.8vw,46px)/1 var(--f-title)}' +
      '#pie .sc-play{justify-content:center}#pie .sc-play .ctl{flex:1;max-width:760px}#pie .sc-play .rod{margin-top:20px}#pie .ticks span:last-child{transform:translateX(-88%)}' +
      '#pie .eqlab{align-self:center;font:400 clamp(14px,1.05vw,17px)/1.15 var(--f-label);color:var(--brick);max-width:9em;text-align:right}' +
      '#pie .navrow .btn.pie-nudge{animation:pieNudge 1.2s steps(6,end) 3}' +
      '@keyframes pieNudge{0%,100%{transform:translateY(0)}20%{transform:translateY(-6px)}40%{transform:translateY(0)}60%{transform:translateY(-3px)}}' +
      '@media (max-aspect-ratio: 1/1), (max-width: 820px){' +
        '#pie .eq{gap:4px}#pie .chip{min-width:0;flex:1;padding:5px 4px 4px;box-shadow:3px 3px 0 var(--sh-tan)}#pie .chip b{font-size:20px}#pie .chip small{font-size:11.5px;white-space:normal;text-align:center}' +
        '#pie .op{font-size:22px}#pie .eqlab{display:none}#pie.playing .eq{display:none}' +
      '}' +
      '@media (prefers-reduced-motion: reduce){#pie .chip.pop,#pie .navrow .btn.pie-nudge{animation:none}}';
    document.head.appendChild(css);
    var eq = S.el('div', { class: 'eq', 'aria-live': 'polite' }, api.bar);
    var lab = S.el('span', { class: 'eqlab' }, eq);
    var c1 = S.el('span', { class: 'chip' }, eq, '<b></b><small></small>'), op1 = S.el('span', { class: 'op', 'aria-hidden': 'true' }, eq);
    var c2 = S.el('span', { class: 'chip' }, eq, '<b></b><small></small>'), op2 = S.el('span', { class: 'op', 'aria-hidden': 'true' }, eq, '=');
    var c3 = S.el('span', { class: 'chip' }, eq, '<b></b><small></small>');
    function chip(c, v, sm, cls) {
      var b = c.querySelector('b'), txt = String(v);
      if (b.textContent !== txt) { if (/\d/.test(b.textContent) && /\d/.test(txt)) S.countTo(b, txt); else b.textContent = txt; if (!S.reduce && b.textContent) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } }
      c.querySelector('small').textContent = sm;
      c.className = 'chip' + (cls ? ' ' + cls : '');
    }
    var shownKey = '';
    function show() {
      var k;
      if (st8.scene === 'pond') {
        var cg = Math.round(TW.caught.t);
        k = 'p' + cg + st8.struck;
        if (k === shownKey) return; shownKey = k;
        lab.textContent = st8.struck ? 'What we picture' : 'What we picture';
        op1.textContent = '−';
        chip(c1, COUNTED, st8.struck ? 'never counted' : 'counted', st8.struck ? 'x' : '');
        chip(c2, cg, 'caught', '');
        chip(c3, COUNTED - cg, 'left', cg === NEW && !st8.struck ? 'hot' : '');
      } else {
        var n = Math.round(TW.slice.t), p = Math.round(TW.pieN.t), known = st8.school && st8.wedges >= 4 && p === n;
        var sch = st8.school ? p * Math.min(RATE, 1 + st8.wedges) : null;
        k = 'q' + n + '.' + p + '.' + st8.wedges + st8.school;
        if (k === shownKey) return; shownKey = k;
        lab.textContent = 'How an assessment works';
        op1.textContent = '×';
        chip(c1, n, 'fish taken out', n < OLD ? 'hot' : '');
        chip(c2, RATE, '1 in 5 rate', 'rate');
        chip(c3, known ? p * RATE : st8.school && n === p ? sch : '?', known && p < OLD ? 'school, was ' + OLD * RATE : 'estimated school', known && p < OLD ? 'hot' : '');
      }
    }

    /* the reader's control: a rod-and-bobber slider under the equation, on the reader's turn */
    var playBox = S.el('div', { class: 'sc-play' }, api.bar);
    var key = S.slider(playBox, { label: 'Fish taken out, for every 100 in the old count', min: 20, max: 100, step: 1, value: 100, fmt: String,
      ticks: [{ v: 58, t: '58: the recount', hot: true }, { v: 100, t: '100: the old count' }], onInput: function (v) { if (st8.turn) setN(v); } });
    function setN(v) {
      v = Math.round(S.clamp(v, 20, 100));
      if (v === Math.round(TW.slice.t)) return;
      st8.tried = true; setNow('slice', v); setNow('pieN', v); st8.stamp = v < OLD;
      if (key.value !== v) key.set(v);
      A.tw = T.clock; show(); want(10);
    }

    /* ---------------- the close ---------------- */
    api.take('The recount doesn’t put fish back in the water. It says there were fewer stripers out there all along. If the fishing rate holds, a smaller catch means a smaller school.');
    api.more('How close is this to a real assessment?',
      '<p>“Fish taken out” means every striper removed by fishing in a year: the fish kept, and released fish that die. It’s far fewer than the fish caught, because most released fish survive.</p>' +
      '<p>The 1 in 5 comes from NOAA’s 2023 teaching example for managers: 6.9 million fish taken out of 34.5 million. In a real assessment the rate isn’t assumed. The model estimates it for each year from the ages of fish caught, tagging studies and surveys.</p>' +
      '<p>Real assessments are more detailed than one slice of pie. They follow each year class of fish through time and weigh several sources of evidence. But they work backward from the fish removed in the same way.</p>' +
      '<p>The numbers here are an example in round numbers. The 58 is the recount’s figure across the whole record: trips, kept fish and released fish each came to about 58 for every 100 in the old count. Commercial fishing, which wasn’t recounted, also takes stripers, so in a real assessment the school would shrink by somewhat less than the anglers’ catch.</p>');

    // the reader's turn: push the slice smaller (toward the pie's centre) or pull it bigger
    var drag0 = null;
    stage.drag({
      start: function (name, pt) { if (name !== 'slice' || !st8.turn) return false; drag0 = { x: pt.x, y: pt.y, n: Math.round(TW.slice.t) }; },
      move: function (name, pt) { if (drag0) setN(drag0.n - ((drag0.x - pt.x) * 0.6 + (pt.y - drag0.y) * 0.8) / 4); },
      end: function () { drag0 = null; }
    });

    snap(0);
    document.addEventListener('site:fonts', function () { stage.render(); });
  }
});
