/* 3. Ghost trips: the whole record, old vs corrected (the film's s07, 1:31 to 1:43).
   A scrolly page, like the count and the calendar (Luyen's reviews, Sep 26): a walkthrough with a spotlight,
   plain numbers (old against corrected, never a percentage), then one gesture for the reader.
   The s07 ledger scroll stands on the beach. The Striper pulls its roll to the right and the record unrolls
   from 1982: the old estimate (gray dashed), the corrected one (sea) and the hatched gap between them, the
   ghosts. For every tenth of the total a ghost boat (a ghost fish for released fish) peels off the gap and
   sails out to the horizon, and the tally board slides down its notched stake as the count climbs. Kit
   watches the fleet through binoculars. At 2025 CORRECTED is stamped on the scroll, the Striper does a take
   and Kit says her line. Steps: the record; the gap is ghost trips (to 1995, the first boat); a boat for every
   27 million (to 1999); 1999 in numbers; on to 2025 (272 million); fish too (the ledger flips to released
   fish, 421 million). Then the reader's turn: the Striper rolls the record back up and hands over the roll.
   Numbers: read from ASGA's charts of NOAA's old and corrected estimates, rounded. The running count on the
   post starts in 1990 (the totals are "since the 1990s", decision 5) and is scaled to land on the reported
   totals (272M trips, 51M kept, 421M released). */
SITE.register({
  id: 'ghosts', short: 'Ghost trips', title: '272 million trips that never happened', scrolly: true,
  build: function (api) {
    var S = SITE, K = S.K, C = S.C, INK = C.ink, N = S.N, path = S.path, Y = RC.years, SER = RC.series, NY = Y.length - 1;
    var MET = {
      trips: { max: 30, sign: 'STRIPER TRIPS', tally: 'GHOST TRIPS', say: 'That’s a lot of trips nobody took.', icon: 'boat', noun: 'ghost trips' },
      kept: { max: 6, sign: 'STRIPERS KEPT', tally: 'GHOST FISH KEPT', say: 'That’s a lot of fish nobody kept.', icon: 'fish', noun: 'ghost fish kept' },
      released: { max: 60, sign: 'STRIPERS RELEASED', tally: 'GHOST RELEASES', say: 'That’s a lot of fish nobody caught.', icon: 'fish', noun: 'ghost releases' }
    };
    // the running ghost count per series, from 1990 (COUNT0), scaled to land on the reported total; the year
    // each tenth is reached
    var DATA = {}, COUNT0 = Y.indexOf(1990);
    Object.keys(MET).forEach(function (m) {
      var d = SER[m], sum = 0, cum = [], launch = [];
      d.old.forEach(function (v, i) { if (i >= COUNT0) sum += v - d.fixed[i]; cum.push(sum); });
      cum = cum.map(function (c) { return c * d.total / sum; });
      for (var b = 1; b <= 10; b++) for (var i = 0; i < cum.length; i++) if (cum[i] >= b * d.total / 10 - 1e-6) { launch.push(i); break; }
      DATA[m] = { old: d.old, fixed: d.fixed, cum: cum, total: d.total, launch: launch };
    });
    function D() { return DATA[st8.m]; }
    function ghostsAt(k) { var l = D().launch, n = 0; while (n < 10 && l[n] <= k) n++; return n; }
    function fmtM(v) { return (v < 9.95 ? v.toFixed(1) : Math.round(v).toFixed(0)) + 'M'; }

    /* kf: how far the roll is unrolled, in years since 1982 (fractional while dragging); k: the year shown.
       T counts the page's own drawings (12 a second). ves: the ghost fleet, one per tenth of the total. */
    // play: 0, or the Striper at work: 'walk' (to the roll), 'pull' (to tgt), 'rewind' (back to 1982). turn: the reader's turn.
    var st8 = { m: 'trips', kf: 0, k: 0, T: 0, tried: false, play: 0, tgt: 0, rewAt: 0, turn: false, focus: null, fz: -99, sx: null, drop: 0, tv: 0, ves: [], pay: -1, flip: -1, was: null, drag: null };
    var LL = null;

    /* ---------------- layout, per orientation ---------------- */
    function lay(st) {
      var port = st.port, H = st.h, HZ = Math.round(H * (port ? 0.36 : 0.44)), L;
      if (!port) L = {
        x0: 110, fw: 300, RX1: 1290, PB: H - 98, GY: H - 34, KX: 1772, KS: 0.8, SS: 0.78, reach: 170,
        sign: { x: 350, w: 640, cy: Math.round(HZ * 0.38), fs: [72, 46, 40] }, tally: { x: 1690, y: HZ + 70, ts: Math.min(1.5, (HZ + 40) / 410), notch: 26, w: 300 },
        slots: { x0: 390, dx: 196, fy: 38, by: 14, fs: 0.72, bs: 0.56 }, axis: 52, tag: 52, stamp: 50, say: 44, sayW: 400, hint: 46, launch: 0.7, suit: [1612, 0.5]
      };
      else L = {
        x0: 40, fw: 250, RX1: 1044, PB: 930, GY: H - 14, KX: 122, KS: 0.58, SS: 0.6, reach: -30,
        sign: { x: 306, w: 560, cy: 132, fs: [62, 46, 44] }, tally: { x: 876, y: HZ + 34, ts: 1.1, notch: 22, w: 340 },
        slots: { x0: 236, dx: 118, fy: 32, by: 11, fs: 0.56, bs: 0.44 }, axis: 54, tag: 54, stamp: 50, say: 46, sayW: 500, hint: 50, launch: 0.56, suit: [1034, 0.4]
      };
      L.port = port; L.W = st.w; L.H = H; L.HZ = HZ;
      L.PT = port ? HZ + 52 : HZ + 60;
      L.EX = L.x0 + L.fw / 2; L.gapR = 44; L.X0 = L.x0 + L.fw - L.gapR; L.X1 = L.RX1 - L.gapR; L.dx = (L.X1 - L.X0) / NY;
      L.YT = L.PT + 46; L.YB = L.PB - 82;
      L.home = port ? 952 : L.RX1 + L.reach;
      return L;
    }
    function X(L, i) { return L.X0 + i * L.dx; }
    function Yv(L, v) { return L.YB - v / MET[st8.m].max * (L.YB - L.YT); }
    function rollX(L) { return X(L, st8.kf) + L.gapR; }
    function slot(L, b) { var sl = L.slots, back = b & 1; return { x: sl.x0 + (b >> 1) * sl.dx + (back ? sl.dx / 2 : 0), y: L.HZ + (back ? sl.by : sl.fy), s: back ? sl.bs : sl.fs, back: back }; }
    function gapPt(L, k) { var d = D(); return [X(L, k), (Yv(L, d.old[k]) + Yv(L, d.fixed[k])) / 2]; }
    // where the Striper stands: at home, or holding the roll while he pulls it
    function strTarget(L) {
      if (!st8.play) return L.home;
      var rx = rollX(L);
      return L.port ? S.clamp(rx + L.reach, 330, L.home) : rx + L.reach;
    }

    /* ---------------- little drawings made for this page ---------------- */
    // the ghost fish: the film's fish icon redrawn in the ghost boat's style (cream, gray dashed, a scalloped
    // hem like a bedsheet ghost, the boat's two ink eyes and round mouth). Origin: the water line under it.
    function ghostFish(x, y, sc, flip, rot) {
      var d = 'M62,0 Q48,-30 8,-29 Q-28,-27 -46,-8 L-72,-28 Q-63,0 -72,28 L-46,8 Q-40,15 -31,10 Q-23,21 -13,12 Q-4,22 6,13 Q15,23 25,13 Q35,21 44,10 Q56,8 62,0 Z';
      var s = path(d, C.cream, 6, ' stroke-dasharray="14 9"', C.gray) + path('M4,-20 Q-5,0 3,16', 'none', 4, ' stroke-dasharray="7 7"', C.gray);
      s += '<ellipse cx="22" cy="-10" rx="6" ry="9" fill="' + INK + '"/><ellipse cx="41" cy="-10" rx="5.5" ry="8.5" fill="' + INK + '"/><ellipse cx="32" cy="8" rx="5.5" ry="4.5" fill="' + INK + '"/>';
      return '<g transform="translate(' + N(x) + ' ' + N(y - 30 * sc) + ') rotate(' + (rot || 0) + ') scale(' + (flip ? -sc : sc) + ' ' + sc + ')">' + s + '</g>';
    }
    function vessel(icon, x, y, sc, flip, rot) {
      return icon === 'boat' ? K.ghostBoat({ x: x, y: y, scale: sc, flip: flip, rot: rot }) : ghostFish(x, y, sc, flip, rot);
    }
    // a speech balloon whose tail leaves from whichever side faces the speaker
    function balloon(str, x, y, w, tx, ty, fs) {
      var lines = K.wrap(str, Math.floor(w / (fs * 0.48))), h = lines.length * fs * 1.18 + 36, bx = x - w / 2, by = y - h / 2, s = '', b0, b1;
      if (tx < bx || tx > bx + w) {                               // a side tail
        var sx = tx < bx ? bx : bx + w, sy = S.clamp(ty, by + 34, by + h - 34);
        b0 = [sx, sy - 24]; b1 = [sx, sy + 24];
      } else { var ey = ty < y ? by : by + h, ex = S.clamp(tx, bx + 64, bx + w - 64); b0 = [ex - 26, ey]; b1 = [ex + 26, ey]; }
      s += '<path d="M' + N(b0[0]) + ',' + N(b0[1]) + ' L' + N(tx) + ',' + N(ty) + ' L' + N(b1[0]) + ',' + N(b1[1]) + ' Z" fill="' + C.white + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
      s += '<rect x="' + N(bx) + '" y="' + N(by) + '" width="' + w + '" height="' + N(h) + '" rx="40" fill="' + C.white + '" stroke="' + INK + '" stroke-width="6"/>';
      s += '<path d="M' + N(b0[0] + (b0[0] === b1[0] ? 0 : 5)) + ',' + N(b0[1] + (b0[0] === b1[0] ? 5 : 0)) + ' L' + N(b1[0] - (b0[0] === b1[0] ? 0 : 5)) + ',' + N(b1[1] - (b0[0] === b1[0] ? 5 : 0)) + '" stroke="' + C.white + '" stroke-width="10"/>';
      lines.forEach(function (ln, i) { s += K.text(ln, x, by + 18 + fs + i * fs * 1.18, { size: fs, font: 'hand' }); });
      return s;
    }
    // a tag on a string from a pin (ax, ay) to its nearest edge
    function pinTag(str, ax, ay, x, y, fs, fill, rot) {
      var w = str.length * fs * 0.55 + 40, h = fs * 1.5, ey = ay < y ? y - h / 2 + 4 : y + h / 2 - 4;
      return path('M' + N(ax) + ',' + N(ay) + ' L' + N(S.clamp(ax, x - w / 2 + 20, x + w / 2 - 20)) + ',' + N(ey), 'none', 5) +
        '<circle cx="' + N(ax) + '" cy="' + N(ay) + '" r="8" fill="' + C.cream + '" stroke="' + INK + '" stroke-width="4"/>' +
        '<g transform="translate(6 7)" opacity=".15">' + '<rect x="' + N(x - w / 2) + '" y="' + N(y - h / 2) + '" width="' + N(w) + '" height="' + N(h) + '" rx="10" transform="rotate(' + (rot || 0) + ' ' + N(x) + ' ' + N(y) + ')"/></g>' +
        K.tag(str, N(x), N(y), { size: fs, fill: fill || C.cream, rot: rot || 0 });
    }
    /* the free space on the ledger: a w x h box near prefX that sits clear above the old line or clear below
       the corrected one, and clear of the boxes already placed */
    function findSpot(L, w, h, prefX, avoid, o) {
      var d = D(), pad = 14, modes = o.modes || ['above', 'below'];
      for (var n = 0; n < 90; n++) {
        var cx = prefX + (n % 2 ? 1 : -1) * Math.ceil(n / 2) * L.dx * 0.5, xa = cx - w / 2, xb = cx + w / 2;
        if (xa < (o.xmin || L.X0 - 10) || xb > (o.xmax || L.X1 + 16)) continue;
        var hi = Infinity, lo = -Infinity;
        for (var i = 0; i <= NY; i++) {
          var xi = X(L, i), xn = X(L, Math.min(NY, i + 1));
          if (xn < xa - 6 || xi > xb + 6) continue;
          hi = Math.min(hi, Yv(L, d.old[i])); lo = Math.max(lo, Yv(L, d.fixed[i]));
        }
        for (var mi = 0; mi < modes.length; mi++) {
          var ya, yb;
          var ymin = o.ymin || L.YT - 16;
          if (modes[mi] === 'above') { yb = o.top ? Math.min(hi - pad, ymin + 4 + h) : hi - pad; ya = yb - h; if (ya < ymin) continue; }
          else { ya = lo + pad; yb = ya + h; if (yb > L.YB - 10) continue; }
          var hit = avoid.some(function (r) { return !(xb < r[0] || xa > r[2] || yb < r[1] || ya > r[3]); });
          if (!hit) return { x: cx, y: (ya + yb) / 2, box: [xa, ya, xb, yb] };
        }
      }
      return null;
    }

    /* ---------------- the stage ---------------- */
    var stage = api.stage(function (st) {
      var L = LL = lay(st), M = MET[st8.m], d = D(), port = L.port, T = st8.T;
      if (st8.sx == null) st8.sx = L.home;
      var set = S.set.beach(st, { clouds: false, sun: !port }), s = set.svg;
      s += '<defs><pattern id="ghh" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="18" height="18" fill="' + C.silver + '"/><path d="M0,0 V18" stroke="' + C.gray + '" stroke-width="5"/></pattern></defs>';
      s += port ? S.cloud(640, 250, 0.62) : S.cloud(760, L.HZ * 0.3, 0.9) + S.cloud(1300, L.HZ * 0.6, 0.62);
      var pd = st8.pay, fin = pd >= 999, rx = rollX(L), kf = st8.kf;

      /* the step's subject pops with a small overshoot when its step arrives (director 10, in place of a spotlight) */
      var pk = popK(), pSign = st8.focus === 'scroll' ? pk : 1, pScroll = st8.focus === 'scroll' || st8.focus === 'ledger' ? 1 + (pk - 1) * 0.5 : 1, pFleet = st8.focus === 'fleet' ? pk : 1;
      /* the fleet on the horizon (behind everything on the beach) */
      var flying = false, fleet = '', air = '';
      var puffAt = function (b) { var rank = 0, x0 = slot(L, b).x; for (var j = 0; j < 10; j++) if (slot(L, j).x < x0) rank++; return 50 + rank * 2; };
      st8.ves.forEach(function (v, b) {
        if (!v) return;
        var sl = slot(L, b), age = T - v.t, bob = ((T >> 1) + b) % 2 ? -4 : 0;
        if (v.gone >= 0 || (pd >= 0 && !S.reduce && pd >= puffAt(b))) {            // puffing away
          var pa = v.gone >= 0 ? T - v.gone : pd - puffAt(b);
          if (pa < 4) {
            var px = v.moored || age >= 16 ? sl.x : gapPt(L, v.k)[0], py = v.moored || age >= 16 ? sl.y : gapPt(L, v.k)[1];
            var p1 = (pa < 2 ? vessel(M.icon, px, py, sl.s * (1 - pa * 0.4), false) : '') + K.puff({ x: px, y: py - 30 * sl.s, r: 26 + 18 * pa, seed: b + 2 });
            if (v.moored || age >= 16) fleet += p1; else air += p1;
          }
          return;
        }
        if (v.moored || age >= 16) {                                                  // riding on the horizon
          var pop = v.moored && age < 4 ? S.pop(age, 4) : 1;
          var one = path('M' + N(sl.x - 44 * sl.s) + ',' + N(sl.y + 3) + ' q' + N(22 * sl.s) + ',-7 ' + N(44 * sl.s) + ',0 t' + N(44 * sl.s) + ',0', 'none', 4, '', C.cream) +
            vessel(M.icon, sl.x, sl.y + bob * sl.s, sl.s * pop, false, M.icon === 'fish' ? (bob ? -5 : 4) : 0);
          fleet = sl.back ? one + fleet : fleet + one;
          return;
        }
        flying = true;
        var P0 = gapPt(L, v.k), sc0 = L.launch;
        if (age < 4) {                                                                // peels off the gap with overshoot
          air += (age < 2 ? K.puff({ x: P0[0], y: P0[1], r: 24 + age * 10, seed: b }) : '') + vessel(M.icon, P0[0], P0[1] + 30 * sc0, sc0 * S.pop(age, 4), false);
        } else {                                                                      // and sails out to its place in the fleet
          var p = K.ease.inOut((age - 4) / 12), P1 = [sl.x, sl.y], Cq = [P0[0] + (P1[0] - P0[0]) * 0.35, Math.min(P0[1], P1[1]) - (port ? 170 : 230)];
          var bx = (1 - p) * (1 - p) * P0[0] + 2 * (1 - p) * p * Cq[0] + p * p * P1[0], by = (1 - p) * (1 - p) * (P0[1] + 30 * sc0) + 2 * (1 - p) * p * Cq[1] + p * p * P1[1];
          var tx = 2 * (1 - p) * (Cq[0] - P0[0]) + 2 * p * (P1[0] - Cq[0]), ty = 2 * (1 - p) * (Cq[1] - P0[1]) + 2 * p * (P1[1] - Cq[1]), ang = Math.atan2(ty, tx) * 180 / Math.PI;
          var sc = S.lerp(sc0, sl.s, p), fl = tx < 0;
          if (p < 0.85 && (by < L.PT - 10 || bx > rollX(L) + 40)) air += K.speedLines({ x: bx - Math.cos(ang * Math.PI / 180) * 70 * sc, y: by - 40 * sc - Math.sin(ang * Math.PI / 180) * 70 * sc, rot: ang, len: 110 * sc + 30, n: 3, gap: 22 * sc + 6, w: 5 });
          air += vessel(M.icon, bx, by, sc, fl, S.clamp(fl ? ang - 180 : ang, -20, 20) * 0.5);
        }
      });
      s += popG(fleet, L.slots.x0 + 2.25 * L.slots.dx, L.HZ, pFleet);

      /* the tally board on its notched stake, planted in the shallows */
      var TB = L.tally, nH = 150 + 10 * TB.notch, bcy = TB.y + TB.ts * (-nH + 40 + st8.drop * TB.notch), tb0 = s.length;
      s += '<ellipse cx="' + N(TB.x) + '" cy="' + N(TB.y - 2) + '" rx="' + N(34 * TB.ts) + '" ry="' + N(9 * TB.ts) + '" fill="' + C.skyDeep + '" stroke="' + INK + '" stroke-width="4"/>';
      s += S.cel(K.tallyBoard({ x: TB.x, y: TB.y, notches: 10, notch: TB.notch, drop: st8.drop, w: TB.w, label: ' ', scale: TB.ts }));
      // before 1990 the board waits: COUNT STARTS 1990
      var pre = st8.k < COUNT0 && st8.tv < 0.05;
      s += '<g transform="translate(' + N(TB.x) + ' ' + N(bcy) + ') scale(' + TB.ts + ')">' + K.text(pre ? 'COUNT STARTS' : M.tally, 0, -13, { size: port ? 40 : 34, font: 'label', fill: S.SH.gray }) +
        K.text(pre ? '1990' : fmtM(st8.tv), 0, 35, { size: 56, font: 'label', fill: INK }) + '</g>';
      s += path('M' + N(TB.x - 36 * TB.ts) + ',' + N(TB.y + 6) + ' q12,-6 24,0 M' + N(TB.x + 16 * TB.ts) + ',' + N(TB.y + 8) + ' q12,-6 24,0', 'none', 4, '', C.cream);
      if (pFleet !== 1) s = s.slice(0, tb0) + popG(s.slice(tb0), TB.x, TB.y, pFleet);

      /* the title sign, on a pole behind the scroll: what the ledger records, and its key */
      var SG = L.sign, f = SG.fs, fl0 = f[0] * 0.86, fl1 = f[1] * 0.86, fl2 = f[2] * 0.86;
      var yT = 22 + 0.74 * fl0, yS = yT + 12 + 0.74 * fl1, yA = yS + 26 + 0.74 * fl2, yB = yA + 16 + 0.74 * fl2, sh = yB + 24;
      var sTop = SG.cy - sh / 2, flipY = st8.flip >= 0 ? [0.55, 0.08, 0.55, 1][st8.flip] : 1, lbl = st8.flip >= 0 && st8.flip < 1 && st8.was ? MET[st8.was].sign : M.sign;
      s += '<rect x="' + N(L.EX - 13) + '" y="' + N(sTop + sh - 10) + '" width="26" height="' + N(L.PB - sTop - sh + 10) + '" fill="' + C.brown + '" stroke="' + INK + '" stroke-width="7"/>';
      var sg = '<rect x="' + N(-SG.w / 2 + 6) + '" y="' + N(-sh / 2 + 8) + '" width="' + SG.w + '" height="' + N(sh) + '" rx="12" fill="' + INK + '" opacity=".15"/>' + S.cel(K.sign({ x: 0, y: sh / 2, w: SG.w, h: sh, post: 'none', fill: C.cream }));
      if (flipY > 0.3) {
        var cxL = function (str, fs) { return str.length * fs * 0.56; };
        sg += K.text(lbl, 0, -sh / 2 + yT, { size: f[0], font: 'label' }) + K.text('MILLIONS A YEAR', 0, -sh / 2 + yS, { size: f[1], font: 'label', fill: S.SH.gray });
        var wA = 60 + 12 + cxL('OLD', fl2) + 34 + 60 + 12 + cxL('CORRECTED', fl2), ax = -wA / 2, ay = -sh / 2 + yA;
        sg += path('M' + N(ax) + ',' + N(ay - fl2 * 0.34) + ' h60', 'none', 9, ' stroke-dasharray="16 10"', C.gray) + K.text('OLD', ax + 72, ay, { size: f[2], anchor: 'start', fill: S.SH.gray });
        ax += 72 + cxL('OLD', fl2) + 34;
        sg += path('M' + N(ax) + ',' + N(ay - fl2 * 0.34) + ' h60', 'none', 10, '', C.sea) + K.text('CORRECTED', ax + 72, ay, { size: f[2], anchor: 'start', fill: C.seaDeep });
        var wB = 64 + 14 + cxL('GHOSTS: THE GAP', fl2), bx0 = -wB / 2, by0 = -sh / 2 + yB;
        sg += '<rect x="' + N(bx0) + '" y="' + N(by0 - fl2 * 0.78) + '" width="64" height="' + N(fl2 * 0.86) + '" rx="4" fill="url(#ghh)" stroke="' + C.gray + '" stroke-width="4"/>' + K.text('GHOSTS: THE GAP', bx0 + 78, by0, { size: f[2], anchor: 'start', fill: S.SH.gray });
      }
      s += '<g transform="translate(' + N(SG.x) + ' ' + N(SG.cy) + ') scale(' + pSign + ' ' + N(flipY * pSign * 1000) / 1000 + ')">' + sg + '</g>';

      /* the ledger scroll on its easel: the fixed end at the left, the roll pulled out to the right */
      var EG = L.GY - 4, legH = EG - L.PB;
      s += S.longShadow(L.EX, EG, 300, 260, 'sand') + S.shadow(L.EX, EG, 470, 'sand');
      // the scroll is clipped at its pulled roll, so none of its rows show on the sand beyond the paper
      s += '<clipPath id="ghclip"><rect x="-100" y="' + N(L.PT - 40) + '" width="' + N(rx + 130) + '" height="' + N(L.PB - L.PT + 70) + '"/><rect x="-100" y="' + N(L.PB + 30) + '" width="' + (L.W + 200) + '" height="400"/></clipPath>';
      s += popG('<g clip-path="url(#ghclip)">' + S.cel(K.ledgerScroll({ x: L.EX, y: EG, w: L.fw, h: L.PB - L.PT, legH: legH, unroll: (rx - L.x0 - L.fw) / (L.RX1 - L.x0 - L.fw), extra: L.RX1 - L.x0 - L.fw, flip: true })) + '</g>' +
        chart(L, d, M, rx), (L.x0 + L.RX1) / 2, (L.PT + L.PB) / 2, pScroll);

      /* the invitation: pull the roll */
      if (st8.turn && !st8.tried && !st8.play && kf < 28) {
        var hx = rx + (port ? 250 : 260), hy = L.PT + (L.PB - L.PT) * 0.42, nudge = (T >> 2) % 2 ? 10 : 0;
        s += path('M' + N(rx + 34 + nudge) + ',' + N(hy + 56) + ' h' + (port ? 70 : 90), 'none', 7, ' stroke-dasharray="14 12"', C.brick);
        s += path('M' + N(rx + (port ? 94 : 114) + nudge) + ',' + N(hy + 40) + ' l18,16 l-18,16', 'none', 7, '', C.brick);
        s += K.tag('PULL THE ROLL', N(hx + nudge * 0.5), N(hy - 10), { size: L.hint, rot: -4, fill: C.mustard });
      }

      /* ghosts in flight pass over the scroll */
      s += air;

      /* the Striper: points at the roll to start, pulls it on Play, then the take at the end */
      s += S.shadow(L.suit[0], L.GY, 190 * L.suit[1], 'sand') + S.cel(K.suitcase({ x: L.suit[0], y: L.GY - 124 * L.suit[1], scale: L.suit[1] }));
      s += striper(L, rx);
      /* Kit watches the fleet through her binoculars, then lowers them for her line */
      var kflip = !port, ko = { x: L.KX, y: L.GY, scale: L.KS, flip: kflip, pose: 'binoculars', tilt: flying ? (kflip ? 7 : -7) : 0 };
      var talking = pd >= 26 || fin;
      if (talking) {
        ko.pose = 'neutral'; ko.hold = K.binoculars({ scale: 0.7 }); ko.tilt = 0; ko.look = port ? [0.8, -0.1] : [0.4, -0.2];
        ko.expr = pd < 28 && !fin ? 'wide' : 'talk'; ko.mouth = !fin && pd >= 28 && pd < 46 ? ['open', 'mid', 'open', 'closed'][(pd >> 1) % 4] : 'closed';
        if (fin || pd >= 46) { ko.expr = 'kind'; ko.mouth = false; }
        ko.blink = (T % 40) === 7;
      }
      s += S.shadow(L.KX, L.GY, 190 * L.KS / 0.8, 'sand') + K.kid(ko);
      if (talking && (fin || pd >= 28)) {
        var mo = K.kidPoints(ko).mouth, bw = L.sayW;
        if (!port) { var bh = 2 * L.say * 1.18 + 36, bb = Math.min(mo[1] - 70, L.GY - L.SS * 540); s += balloon(M.say, 1516, bb - bh / 2, bw, Math.min(mo[0] - 58, 1516 + bw / 2 - 30), mo[1] - 8, L.say); }
        else s += balloon(M.say, 560, L.GY - 150, bw, mo[0] + 30, mo[1], L.say);
      }

      /* the CORRECTED stamp comes down on the scroll */
      if (pd >= 12 && pd < 17 && !S.reduce && LL.stamp) {
        var sp = LL.stamp, sdy = [-230, -70, 0, -90, -240][pd - 12], sq = pd === 14 ? 0.2 : 0;
        if (pd === 14) s += K.impact({ x: sp.x - 190, y: sp.y + 30, r: 44, fill: C.white, n: 7 }) + K.puff({ x: sp.x + 190, y: sp.y + 30, r: 34, seed: 5 });
        if (pd === 12) s += K.speedLines({ x: sp.x, y: sp.y - 330, rot: -90, len: 150, n: 3, gap: 70, w: 7 });
        s += S.cel(K.stamp({ x: sp.x, y: sp.y + (port ? 44 : 40) + sdy, scale: port ? 2.0 : 1.85, rot: -6, label: 'CORRECTED', color: C.sea, squash: sq }));
      }

      // the roll's handle, grabbable on top of everything
      if (st8.turn) s += S.grab('roll', '<rect x="' + N(rx - 70) + '" y="' + N(L.PT - 50) + '" width="140" height="' + N(L.PB - L.PT + 100) + '" rx="30" fill="transparent"/>', rx, 0, 0);
      return s;
    }, function () {
      var d = D(), k = st8.k, M = MET[st8.m];
      return 'A ledger scroll on the beach, unrolled from 1982 to ' + Y[k] + '. ' + M.sign.charAt(0) + M.sign.slice(1).toLowerCase() + ' that year: old estimate ' + S.m(d.old[k]) +
        ', corrected ' + S.m(d.fixed[k]) + '. ' + (k < COUNT0 ? 'The running count starts in 1990. ' : M.noun.charAt(0).toUpperCase() + M.noun.slice(1) + ' since 1990: ' + fmtM(d.cum[k]) + '. ') + ghostsAt(k) + ' of 10 ghost ' + (M.icon === 'boat' ? 'boats' : 'fish') + ' have sailed off.';
    });

    /* the record drawn on the paper, revealed up to the roll */
    function chart(L, d, M, rx) {
      var s = '', kf = st8.kf, ki = Math.floor(kf + 1e-6), fr = kf - ki, cx0 = L.x0 + 26, i;
      // fresh paper over the scroll's scribbled rows, its margin and column of fish redrawn, then the pulled
      // roll redrawn on top of its edge
      s += '<rect x="' + N(cx0) + '" y="' + N(L.PT + 5) + '" width="' + N(Math.max(0, rx - 22 - cx0)) + '" height="' + N(L.PB - L.PT - 10) + '" fill="' + C.paper + '"/>';
      s += path('M' + N(L.x0 + 110) + ',' + N(L.PT + 16) + ' V' + N(L.PB - 16), 'none', 3, '', C.brick);
      for (i = 0; i < 6; i++) s += K.fishIcon({ x: L.x0 + 64, y: L.PT + 38 + i * 44, size: 0.34, flip: true });
      s += S.cel('<rect x="' + N(rx - 22) + '" y="' + N(L.PT - 18) + '" width="44" height="' + N(L.PB - L.PT + 36) + '" rx="18" fill="' + C.paper + '" stroke="' + INK + '" stroke-width="7"/>' +
        '<ellipse cx="' + N(rx) + '" cy="' + N(L.PT - 6) + '" rx="14" ry="8" fill="none" stroke="' + INK + '" stroke-width="3.4"/>' + path('M' + N(rx - 6) + ',' + N(L.PT - 6) + ' a6,4 0 1,1 12,0', 'none', 3));
      var re = rx - 30, g = '';
      [0.5, 1].forEach(function (q) { g += 'M' + N(L.X0 - 14) + ',' + N(Yv(L, M.max * q)) + ' H' + N(re) + ' '; });
      s += path(g, 'none', 3, ' opacity=".35" stroke-dasharray="3 11"');
      [0, 0.5, 1].forEach(function (q) { s += K.text(String(M.max * q), L.X0 - 26, Yv(L, M.max * q) + L.axis * 0.3, { size: L.axis, font: 'hand', anchor: 'end' }); });
      var tk = '';
      for (i = 0; i <= ki; i++) tk += 'M' + N(X(L, i)) + ',' + N(L.YB) + ' v' + (Y[i] % 5 === 0 ? 18 : 9) + ' ';
      s += path('M' + N(L.X0 - 14) + ',' + N(L.YB) + ' H' + N(re), 'none', 5) + path(tk, 'none', 4);
      [1985, 1995, 2005, 2015, 2025].forEach(function (yy) {
        var j = yy - 1982; if (yy === 2025 ? j > kf + 1e-6 : X(L, j) + L.axis * 0.95 > rx - 24) return;   // each year label shows once the roll has passed it
        s += K.text(String(yy), yy === 2025 ? X(L, j) + 16 : X(L, j), L.YB + 22 + L.axis * 0.72, { size: L.axis, font: 'hand', anchor: yy === 2025 ? 'end' : 'middle' });
      });
      var top = [], bot = [];
      for (i = 0; i <= ki; i++) { top.push([X(L, i), Yv(L, d.old[i])]); bot.push([X(L, i), Yv(L, d.fixed[i])]); }
      if (fr > 0.001 && ki < NY) { top.push([X(L, kf), Yv(L, S.lerp(d.old[ki], d.old[ki + 1], fr))]); bot.push([X(L, kf), Yv(L, S.lerp(d.fixed[ki], d.fixed[ki + 1], fr))]); }
      var P = function (a) { return a.map(function (p) { return N(p[0]) + ',' + N(p[1]); }).join(' '); };
      if (top.length > 1) s += '<polygon points="' + P(top.concat(bot.slice().reverse())) + '" fill="url(#ghh)" stroke="' + C.gray + '" stroke-width="2" opacity=".9"/>';
      s += '<polyline points="' + P(top) + '" fill="none" stroke="' + C.gray + '" stroke-width="9" stroke-dasharray="18 12" stroke-linejoin="round"/>';
      s += '<polyline points="' + P(bot) + '" fill="none" stroke="' + C.sea + '" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/>';
      var lt = top[top.length - 1], lb = bot[bot.length - 1];
      s += '<circle cx="' + N(lt[0]) + '" cy="' + N(lt[1]) + '" r="11" fill="' + C.cream + '" stroke="' + C.gray + '" stroke-width="6"/>';
      s += '<circle cx="' + N(lb[0]) + '" cy="' + N(lb[1]) + '" r="13" fill="' + C.sea + '" stroke="' + INK + '" stroke-width="5"/>';
      // the famous years, tagged on strings where the paper is clear, and the CORRECTED stamp
      var TS = L.tag * 0.86, tw = function (str) { return str.length * TS * 0.55 + 40; }, th = TS * 1.5, sp99 = null, t99 = '';
      var ot = function (k) { return Y[k] + ': ' + S.m(d.old[k]) + ' → ' + S.m(d.fixed[k]); };
      if (st8.m === 'trips') { t99 = ot(17); sp99 = findSpot(L, tw(t99), th, X(L, 17) - tw(t99) / 2 + 24, [], { modes: ['above'] }); }
      var t25 = ot(NY), sp25 = findSpot(L, tw(t25), th, X(L, NY) - tw(t25) / 2 + 20, sp99 ? [sp99.box] : [], { xmax: L.X1 + 30 });
      var sw = 9 * L.stamp * 0.62 + 40, shh = L.stamp * 1.6 + sw * 0.08, stamped = (st8.pay >= 14 && st8.k === NY) || st8.pay >= 999;
      // the stamp may use the paper's top margin too
      var ssp = findSpot(L, sw + 10, shh, X(L, 8), [sp99, sp25].filter(Boolean).map(function (q) { return q.box; }), { top: true, ymin: L.PT + 12 });
      if (!ssp) { ssp = findSpot(L, sw + 10, shh, X(L, 8), sp25 ? [sp25.box] : [], { top: true, ymin: L.PT + 12 }) || { x: X(L, 8), y: L.PT + 12 + shh / 2 }; if (stamped) sp99 = null; }
      if (sp99 && kf >= 17) s += pinTag(t99, X(L, 17), Yv(L, d.old[17]) - 8, sp99.x, sp99.y, TS, C.cream, -3);
      if (sp25 && kf >= NY - 1e-6) s += pinTag(t25, X(L, NY), sp25.y < Yv(L, d.old[NY]) ? Yv(L, d.old[NY]) - 8 : Yv(L, d.fixed[NY]) + 10, sp25.x, sp25.y, TS, C.cream, 2);
      LL.sp99 = sp99 && kf >= 17 ? sp99.box : null;
      LL.stamp = { x: ssp.x, y: ssp.y };
      if (stamped) s += K.stampMark({ x: ssp.x, y: ssp.y, label: 'CORRECTED', color: C.sea, size: L.stamp, rot: -6 });
      return s;
    }

    /* the Striper's acting */
    function striper(L, rx) {
      var pd = st8.pay, fin = pd >= 999, T = st8.T, port = L.port, x = st8.sx, y = L.GY, hold = st8.play === 'pull' || st8.play === 'rewind', moving = Math.abs(strTarget(L) - x) > 3 || hold;
      var o = { x: x, y: y, scale: L.SS, flip: true, suitcase: false, pose: 'neutral', expr: 'neutral', look: 'upFwd', blink: (T % 38) === 5 }, s = '', ticks = false;
      if (st8.play) {
        if (hold || Math.abs(strTarget(L) - x) < 40) {                               // holding the roll
          o.reach = port ? [rx + 6, L.PB + 12] : [rx + 16, S.clamp(y - L.SS * 250, L.PT + 60, L.PB - 30)];
          if (port) o.flip = rx < x - 10;
          o.expr = 'hopeful'; o.look = port ? 'up' : 'fwd';
        } else { o.pose = 'point'; o.expr = 'talk'; o.flip = strTarget(L) < x; }
        if (moving && (T >> 1) % 2) { o.y -= 8; o.rot = o.flip ? 3 : -3; }
      } else if (pd >= 16 || fin) {
        if (fin || pd >= 72) { o.pose = 'tipHat'; o.expr = 'wink'; }
        else if (pd >= 30) { o.pose = 'pointSelf'; o.expr = 'surprised'; o.look = 'cam'; }
        else {                                                                        // the take
          var a = pd - 16; o.pose = a === 0 ? 'neutral' : 'surprised'; o.expr = 'surprised'; o.look = 'up';
          o.squash = [0.08, -0.08, -0.06, 0.02, 0.05][Math.min(a, 4)] || 0; o.y -= [0, 40, 26, 6, 0][Math.min(a, 4)] || 0; ticks = a >= 1 && a < 10;
        }
      } else if (st8.turn && !st8.tried && st8.kf < 28) { o.pose = 'point'; o.expr = 'talk'; o.look = 'fwd'; o.mouth = (T >> 3) % 2 ? 'mid' : 'closed'; }
      else if (moving) { o.flip = strTarget(L) < x; if ((T >> 1) % 2) o.y -= 8; }
      else if (focusPt(L)) {
        var fp = focusPt(L), sh0 = K.striperPoints(o).shoulder, fdx = fp[0] - sh0[0], fdy = fp[1] - sh0[1], fl = Math.sqrt(fdx * fdx + fdy * fdy) || 1;
        o.pose = 'point'; o.expr = 'kind'; o.flip = fp[0] < x; o.look = 'fwd';
        sh0 = K.striperPoints(o).shoulder; o.reach = [sh0[0] + fdx / fl * 170 * L.SS, sh0[1] + fdy / fl * 170 * L.SS];
        o.squash = S.breath(stage);
      } else {
        o.squash = S.breath(stage);
        var lk = st8.turn && S.lookAt(stage, K.striperPoints(o).eye, o.flip); if (lk) o.look = lk;
      }
      s += S.shadow(x, L.GY, 210 * L.SS / 0.78, 'sand');
      if (moving && Math.abs(strTarget(L) - x) > 60) s += K.speedLines({ x: x + (strTarget(L) < x ? 150 : -150) * L.SS, y: y - 200 * L.SS, rot: strTarget(L) < x ? 180 : 0, len: 120, n: 3, gap: 34, w: 6 });
      s += K.striper(o);
      if (ticks) {
        var hp = K.striperPoints(o).hat, tk = '';
        [[-70, -40], [-10, -70], [55, -45]].forEach(function (q) { tk += 'M' + N(hp[0] + q[0] * 0.8) + ',' + N(hp[1] + q[1] * 0.8) + ' l' + N(q[0] * 0.5) + ',' + N(q[1] * 0.5) + ' '; });
        s += path(tk, 'none', 7);
      }
      return s;
    }

    /* the step's subject pops when its step arrives (the film's pop-on, small): 4 drawings of overshoot */
    function popK() { var a = st8.T - st8.fz; return a >= 0 && a < 4 ? [1.06, 0.97, 1.02, 1][a] : 1; }
    function popG(svg, cx, cy, k) { return k === 1 ? svg : '<g transform="translate(' + N(cx) + ' ' + N(cy) + ') scale(' + k + ') translate(' + N(-cx) + ' ' + N(-cy) + ')">' + svg + '</g>'; }
    /* where the Striper points for each step's subject: the ledger, or the fleet on the horizon */
    function focusPt(L) {
      if (st8.focus === 'fleet') return [L.slots.x0 + 2.25 * L.slots.dx, L.HZ - 20];
      if (st8.focus === 'scroll' || st8.focus === 'ledger') return [(L.X0 + rollX(L)) / 2, (L.PT + L.PB) / 2];
      return null;
    }

    /* ---------------- the clock: the page draws on twos while anything moves ---------------- */
    var raf = 0, t0 = 0, lastF = -1, idleUntil = 0;
    function busy() { return st8.play || st8.rewAt || st8.pay >= 0 && st8.pay < 80 || st8.ves.some(function (v) { return v && (v.gone >= 0 || (!v.moored && st8.T - v.t < 16)); }) || Math.abs(st8.drop - ghostsAt(st8.k)) > 0.01 || st8.flip >= 0; }
    function wake(ms) {
      idleUntil = Math.max(idleUntil, performance.now() + (ms || 4000));
      if (S.reduce) { finishPlay(); settle(); stage.render(); return; }
      if (raf) return;
      t0 = performance.now(); lastF = -1;
      raf = requestAnimationFrame(function tick(now) {
        var fr = Math.floor((now - t0) / (1000 / 12));
        if (fr !== lastF) { lastF = fr; st8.T++; stage.drawing++; step(); stage.render(); }
        if (busy() || now < idleUntil) raf = requestAnimationFrame(tick); else raf = 0;
      });
    }
    function step() {
      var L = LL; if (!L) return;
      if (st8.rewAt && st8.T >= st8.rewAt) { st8.rewAt = 0; st8.tgt = 0; st8.play = 'walk'; }
      if (st8.play === 'walk' && Math.abs(strTarget(L) - st8.sx) < 40) st8.play = st8.tgt < st8.kf ? 'rewind' : 'pull';
      if (st8.play === 'pull') { setK(Math.min(st8.tgt, st8.kf + (st8.fast ? 1.25 : 0.5))); if (st8.kf >= st8.tgt) stopPlay(); }
      else if (st8.play === 'rewind') { setK(Math.max(st8.tgt, st8.kf - 1.5)); if (st8.kf <= st8.tgt) stopPlay(); }
      var tg = strTarget(L), dx = tg - st8.sx;
      st8.sx = st8.play === 'pull' || st8.play === 'rewind' ? tg : Math.abs(dx) < 3 ? tg : st8.sx + S.clamp(dx * 0.35, -80, 80);
      var nd = ghostsAt(st8.k); st8.drop = Math.abs(nd - st8.drop) < 0.5 ? nd : st8.drop + (nd > st8.drop ? 0.5 : -0.5);
      var tv = D().cum[st8.k]; st8.tv = Math.abs(tv - st8.tv) < tv * 0.01 + 0.05 ? tv : st8.tv + (tv - st8.tv) * 0.5;
      st8.ves.forEach(function (v, b) { if (v && v.gone >= 0 && st8.T - v.gone > 4) st8.ves[b] = null; });
      if (st8.flip >= 0) st8.flip = st8.flip >= 3 ? -1 : st8.flip + 1;
      if (st8.pay >= 0 && st8.pay < 999) { st8.pay++; if (st8.pay > 90) st8.pay = 999; }
    }
    // reduced motion: the Striper's errand is done at once
    function finishPlay() {
      var go = st8.play || st8.rewAt; if (!go) return;
      if (st8.rewAt) { st8.rewAt = 0; st8.tgt = 0; }
      st8.play = 0; setK(st8.tgt);
    }
    function settle() {
      var L = LL;
      if (L) st8.sx = strTarget(L);
      st8.drop = ghostsAt(st8.k); st8.tv = D().cum[st8.k];
      st8.ves = st8.ves.map(function (v) { return v && v.gone < 0 ? { t: -99, k: v.k, gone: -1, moored: true } : null; });
      if (st8.k === NY && st8.pay >= 0 && st8.pay < 999) st8.pay = 999;
      st8.flip = -1;
    }

    /* ---------------- state changes ---------------- */
    function syncFleet(instant) {
      var n = ghostsAt(st8.k), d = D();
      for (var b = 0; b < 10; b++) {
        var v = st8.ves[b];
        if (b < n) { if (!v || v.gone >= 0) st8.ves[b] = { t: st8.T, k: d.launch[b], gone: -1, moored: !!instant || S.reduce }; }
        else if (v && v.gone < 0) v.gone = st8.T;
      }
    }
    function setK(kf) {
      var was = st8.k;
      st8.kf = S.clamp(kf, 0, NY); st8.k = Math.round(st8.kf);
      if (st8.k !== was) {
        var puffed = st8.pay >= 50;
        // leaving 2025 undoes the payoff: the fleet for this year is back on the horizon
        if (st8.k < NY && st8.pay >= 0) { st8.pay = -1; st8.ves = st8.ves.map(function (v) { return v && v.gone < 0 ? { t: st8.T - 20, k: v.k, gone: -1, moored: true } : null; }); }
        syncFleet(false);
        if (puffed) st8.ves = st8.ves.map(function (v) { return v && v.gone >= 0 ? null : v; });
        if (st8.k === NY && was < NY) st8.pay = S.reduce ? 999 : 0;
        key.value = Y[st8.k]; live.textContent = label();
      }
      wake();
    }
    function setMetric(m) {
      if (m === st8.m) return;
      st8.was = st8.m; st8.m = m; st8.flip = 0; st8.ves = []; syncFleet(true);
      st8.tv = D().cum[st8.k]; st8.drop = ghostsAt(st8.k);
      if (st8.k === NY) st8.pay = S.reduce ? 999 : 0;
      live.textContent = label(); wake();
    }
    function stopPlay() { st8.play = 0; st8.fast = false; }
    function pullTo(k) { st8.tgt = k; st8.play = LL && Math.abs(strTarget(LL) - st8.sx) < 40 ? 'pull' : 'walk'; if (!LL || st8.sx == null) st8.play = 'pull'; wake(); }
    function label() {
      var d = D(), k = st8.k, M = MET[st8.m];
      return 'The record unrolled from 1982 to ' + Y[k] + '. ' + M.sign.charAt(0) + M.sign.slice(1).toLowerCase() + ' that year: old count ' + S.m(d.old[k]) +
        ', corrected ' + S.m(d.fixed[k]) + '. ' + (k < COUNT0 ? 'The running count starts in 1990.' : M.noun.charAt(0).toUpperCase() + M.noun.slice(1) + ' since 1990: ' + fmtM(d.cum[k]) + '.');
    }

    /* ---------------- the walkthrough ---------------- */
    var T99 = DATA.trips, per = function (k) { return Math.round(T99.fixed[k] / T99.old[k] * 100); };
    var STEPS = [
      { focus: 'scroll', cls: 'first', h: '<p>NOAA’s correction reaches all the way back to the early 1980s. This scroll is the record of striper fishing trips: the old count is the <b>dashed gray</b> line, the corrected count the <b>blue</b> one.</p>' },
      { focus: 'ledger', h: '<p>The hatched gap between the two lines is <b>ghost trips</b>: trips the old count included that never happened.</p>' },
      { focus: 'fleet', h: '<p>Every time the ghosts add up to another <b>27 million trips</b>, a ghost boat peels off and sails to the horizon. The board on the post keeps the running count, starting in 1990.</p>' },
      { focus: 'ledger', h: '<p><b>1999 had the deepest cut.</b> The old count said <b class="num">' + T99.old[17].toFixed(1) + ' million</b> trips. The corrected count says <b class="num">' + T99.fixed[17].toFixed(1) + ' million</b>, less than half.</p>' },
      { focus: null, h: '<p>Keep going to 2025. Since the 1990s, the ghosts add up to <b>272 million trips</b> that never happened.</p>' },
      { focus: null, h: '<p><b>Fewer trips means fewer fish caught, too.</b> Since the 1990s, the same correction takes <b>421 million</b> released stripers and <b>51 million</b> kept stripers out of the record.</p>' },
      { focus: null, cls: 'turn', h: '<span class="go">Your turn</span><p>Pull the roll to the right to unroll the record and launch the ghost boats. Push it back to roll it up again.</p>' }
    ];
    var PULL = [0, Math.max(DATA.trips.launch[0], COUNT0 + 1), 17, 17, NY, NY], PLAY = STEPS.length - 1, OUTRO = STEPS.length;
    STEPS.forEach(function (d) { api.step(d.h, d.cls); });
    function focus(f) { if (f !== st8.focus) { st8.focus = f; st8.fz = st8.T + 1; } }
    /* the finished state of step n, drawn at once (a jump, a scroll back, or reduced motion) */
    function snap(n, quiet) {
      st8.play = 0; st8.rewAt = 0; st8.fast = false; st8.drag = null; st8.flip = -1; st8.was = null;
      st8.m = n === 5 ? 'released' : 'trips';
      var kf = n >= PLAY ? 0 : PULL[n];
      st8.kf = kf; st8.k = Math.round(kf); st8.ves = []; syncFleet(true);
      st8.tv = D().cum[st8.k]; st8.drop = ghostsAt(st8.k); st8.pay = st8.k === NY ? 999 : -1;
      st8.turn = n >= PLAY; st8.tried = false; st8.focus = STEPS[n] ? STEPS[n].focus : null; st8.fz = -99;
      if (LL) st8.sx = L0home();
      key.value = Y[st8.k]; key.disabled = !st8.turn; live.textContent = label();
      api.playing(st8.turn);
      if (!quiet) { stage.drawing++; stage.render(); }
    }
    function L0home() { return LL ? LL.home : null; }
    /* step n's entrance, played from the finished state of step n - 1 */
    function enter(n) {
      if (STEPS[n]) focus(STEPS[n].focus);
      if (n >= 1 && n <= 4 && PULL[n] > st8.kf) pullTo(PULL[n]);
      else if (n === 5) setMetric('released');
      else if (n === PLAY) { st8.turn = true; key.disabled = false; api.playing(true); setMetric('trips'); st8.rewAt = st8.T + 8; }
      wake(); stage.render();
    }
    api.onStep(function (n, prev) {
      if (n >= PLAY && prev >= PLAY) { if (n === OUTRO) closing(); return; }
      if (prev >= 0 && n === prev + 1 && !S.reduce) { snap(prev, true); enter(n); }
      else snap(n);
      if (n === OUTRO) closing();
    });
    function closing() {
      S.reward(api); handoff.classList.add('on');
      // a reader who scrolls on without pulling the roll still gets the page's picture (director 4): the Striper
      // walks back, unrolls the record to 2025, the whole fleet sails out and the board lands on the final total
      if (st8.turn && !st8.tried && st8.kf < NY) { st8.rewAt = 0; st8.fast = true; pullTo(NY); }
    }

    /* keyboard and screen readers: the roll as a range, hidden under the picture */
    var key = S.el('input', { type: 'range', class: 'sr', min: 1982, max: 2025, step: 1, value: 1982, 'aria-label': 'Unroll the record through' }, api.bar);
    key.addEventListener('input', function () { if (!st8.turn) return; st8.tried = true; stopPlay(); setK(+key.value - 1982); });
    var live = S.el('p', { class: 'sr', 'aria-live': 'polite' }, api.bar);

    /* ---------------- the close ---------------- */
    api.take('Across the whole record, the corrected counts of trips, kept fish and released fish each come to about 58 for every 100 in the old counts. The other 42 never happened, which is the song’s “down about 42 percent”. Since the 1990s, that adds up to 272 million trips, 51 million kept fish and 421 million released fish that never happened. Since 2015 the gap is smaller: about 71 trips and 70 released fish for every 100 in the old counts.');
    api.more('About the record',
      '<p>NOAA surveyed anglers by phone until 2018, when it switched to the mail survey and recalibrated the older years to match. This correction revises the whole record again. In 1999 the corrected count has ' + per(17) + ' trips for every 100 in the old one; in 2025 it has ' + per(NY) + '.</p>' +
      '<p>The running count on the post starts in 1990, and each ghost boat stands for a tenth of the total. Yearly values are read from ASGA’s charts of NOAA’s old and corrected estimates and rounded, so they are approximate. The running count is scaled to land on the reported totals. Private boat and shore fishing only.</p>' +
      '<p>Both the old and the corrected numbers are survey estimates with a margin of error. The ghost trips are the difference between NOAA’s two best estimates, not trips that were checked one by one.</p>' +
      '<p class="src">Source: ' + FRAME.link('mrip', 'NOAA’s Marine Recreational Information Program (MRIP)') + ' old and corrected estimates, posted Aug 31, 2026, as presented by ASGA on Sept 22, 2026.</p>');
    var handoff = S.el('p', { class: 'gh-next' }, api.panel, 'Fewer fish caught. So more fish left?');

    // page styles, scoped to this chapter
    if (!document.getElementById('gh-style')) {
      var css = S.el('style', { id: 'gh-style' }, document.head);
      css.textContent = '#ghosts .gh-next{margin:4px 0 0;padding-left:34px;position:relative;font:400 19px/1.3 var(--f-label);color:var(--brick)}' +
        '#ghosts .gh-next::before{content:"";position:absolute;left:0;top:2px;width:24px;height:22px;background:var(--bobber) no-repeat center/contain}' +
        '#ghosts .gh-next.on{color:var(--ink)}' +
        '';
    }

    // the reader's turn: drag the roll through the years
    stage.drag({
      start: function (name, pt) {
        if (name !== 'roll' || !LL || !st8.turn) return false;
        stopPlay(); st8.rewAt = 0;
        st8.tried = true; st8.drag = { x: pt.x, kf: st8.kf }; wake();
      },
      move: function (name, pt) { if (!st8.drag) return; setK(st8.drag.kf + (pt.x - st8.drag.x) / LL.dx); stage.render(); },
      end: function () { if (!st8.drag) return; st8.drag = null; setK(Math.round(st8.kf)); stage.render(); }
    });

    // the idle heartbeat (SITE.idle): the boil, the fleet's bob and the blinks keep going after the page's clock rests
    S.idle(api.stageHost, function () { st8.T++; stage.drawing++; step(); stage.render(); }, function () { return !!raf || !!st8.drag; });

    stage.render(); snap(0);
    document.addEventListener('site:fonts', function () { stage.render(); });
  }
});
