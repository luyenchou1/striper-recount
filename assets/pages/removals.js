/* 5. Who's killing the fish? (the film's s11 and s12, 2:20 to 2:43).
   A scrolly page, like the others (Luyen's reviews, Sep 26): a walkthrough with a spotlight (the picture is
   busy and still, and each step's motion stays inside its subject), plain numbers (killed in millions; rates
   as "in 100", never a percentage), an equation under the picture, then one slider for the reader.
   The film's two framed stacks on the pier, drawn to one scale: every block, in either stack, is 250,000
   stripers, and both stacks stand on the same baseline beside a tide staff.
     ANGLERS    = fish kept + released fish that die (9 in 100 in the assessment; about 4.5 in the new study)
     COMMERCIAL = landings + fish thrown back dead (a dashed "?" cap on top, sized by the discard figure)
   Steps: what counts; the anglers' old numbers; the commercial count; the recount (the shade pulls down a
   notch, Kit stamps RECOUNT and the top blocks go to gray ghosts); the release study (a second notch, RELEASE
   STUDY); same commercial count, smaller anglers' count (BIGGER SHARE lands on the commercial frame, the
   Striper's line); the question mark (the 1990s estimate drawn as a dashed ghost cap). Then the reader's
   turn: a slider for the commercial discard figure. No commercial share is lettered anywhere, and nothing
   predicts the stock estimate. The chalkboard holds only the inputs. */
SITE.register({
  id: 'removals', short: 'Who’s killing the fish', title: 'Who’s killing the fish?', scrolly: true,
  build: function (api) {
    var S = SITE, K = S.K, C = S.C, INK = C.ink, R = RC.removals2025, RT = RC.rates, N = S.N, path = S.path;
    var BLK = 0.25, NA = 12, NC = 7, PLATE = ' ', LUNGE = 22;          // millions of fish per block; frame capacities
    function r1(v) { return Math.round(v * 10) / 10; }
    var RM_OLD = r1(RT.releaseOld * 100), RM_NEW = r1(RT.releaseNew * 100), DISC = r1(RT.discardNow * 100), DISC90 = r1(RT.discard1990s * 100);
    var PRE = [{ fixed: false, rm: RM_OLD }, { fixed: true, rm: RM_OLD }, { fixed: true, rm: RM_NEW }];
    var st8 = { fixed: false, rm: RM_OLD, disc: DISC, prev: null, busy: false, drag: null, qdrag: null, pull: null, spin: -1, snapL: 0,
      dispL: null, puff: null, kit: null, hideRC: false, hideST: false, paid: false, pay: 0, talk: -1, say: false, tried: true, focus: null, fz: -99, ghost90: false, turn: false };
    function angM(o) { o = o || st8; return (o.fixed ? R.kept : R.keptOld) + (o.fixed ? R.released : R.releasedOld) * o.rm / 100; }
    function discM(o) { o = o || st8; return R.commLandings * o.disc / 100; }
    function lv(m) { return m / BLK; }
    var L_OLD = lv(angM(PRE[0])), L_FIX = lv(angM(PRE[1])), L_ST = lv(angM(PRE[2])), L_LAND = lv(R.commLandings);
    function notchOf(o) { for (var i = 0; i < 3; i++) if (PRE[i].fixed === o.fixed && Math.abs(PRE[i].rm - o.rm) < 1e-6) return i; return -1; }
    function fullNotch() { return Math.abs(st8.disc - DISC) < 1e-6 ? notchOf(st8) : null; }
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
    /* the chalkboard: inputs only, in chalk. Old figures are struck through once they are corrected;
       numbers you set yourself are in pink chalk. */
    function board(L) {
      var x0 = L.bx - L.bw / 2 + 34, top = L.bgy - L.bleg - L.bh, s = '';
      s += S.shadow(L.bx, L.bgy, L.bw * 0.7) + S.longShadow(L.bx, L.bgy, L.bw * 0.5, L.bleg + L.bh);
      s += S.cel(K.chalkboard({ x: L.bx, y: L.bgy, w: L.bw, h: L.bh, legH: L.bleg }));
      var showFixed = st8.fixed && !st8.hideRC, rmShown = st8.hideST && st8.prev ? st8.prev.rm : st8.rm;
      var lab = L.lab, big = L.big, y = top + 22, gap = 16, cr = C.cream;
      function t(str, x, yy, size, fill, op) { return (op ? '<g opacity="' + op + '">' : '') + K.text(str, N(x), N(yy), { size: size, font: 'hand', fill: fill || cr, anchor: 'start' }) + (op ? '</g>' : ''); }
      function head(str) { y += lab * 1.16; s += t(str, x0, y, lab, C.mustard); s += path('M' + N(x0) + ',' + N(y + 8) + ' h' + N(tw(str, lab) + 6), 'none', 3.5, ' opacity=".7"', C.mustard); y += 6; }
      var xMax = L.bx + L.bw / 2 - 22;
      function vals(x, o) {                                          // [struck old] [small word] big value
        var need = (o.old ? tw(o.old, big) + gap : 0) + (o.pre ? tw(o.pre, lab) + 10 : 0) + tw(o.v, big) + (o.post ? tw(o.post, lab) + 10 : 0);
        if (o.old && x + need > xMax) o.old = null;                   // no room: the struck figure gives way
        if (o.old) {
          var w0 = tw(o.old, big);
          s += t(o.old, x, y, big, cr, 0.5) + path('M' + N(x - 4) + ',' + N(y - big * 0.3) + ' q' + N(w0 / 2) + ',-7 ' + N(w0 + 8) + ',3', 'none', 5, '', cr);
          x += w0 + gap;
        }
        if (o.pre) { s += t(o.pre, x, y, lab, o.fill); x += tw(o.pre, lab) + 10; }
        s += t(o.v, x, y, big, o.fill);
        if (o.post) s += t(o.post, x + tw(o.v, big) + 10, y, lab, o.fill);
      }
      function row(label, o) { y += big * L.rowK; s += t(label, x0, y, lab); vals(x0 + tw(label, lab) + gap, o); }
      head('ANGLERS');
      row('KEPT', showFixed ? { old: S.m(R.keptOld, 2), v: S.m(R.kept, 2) } : { v: S.m(R.keptOld, 2) });
      row('RELEASED', showFixed ? { old: S.m(R.releasedOld, 1), v: S.m(R.released, 2) } : { v: S.m(R.releasedOld, 1) });
      y += lab * 1.12; s += t('RELEASED FISH THAT DIE:', x0, y, lab);
      y += big * (L.rowK - 0.04);
      if (Math.abs(rmShown - RM_OLD) < 1e-6) vals(x0 + 20, { v: fmtP(RM_OLD), post: 'IN 100' });
      else vals(x0 + 20, { old: fmtP(RM_OLD), pre: 'ABOUT', v: fmtP(rmShown), post: 'IN 100' });
      y += 6; head('COMMERCIAL, NOT REVISED');
      row('LANDED', { v: Math.round(R.commLandings * 1000) + 'K' });
      row('THROWN BACK DEAD', Math.abs(st8.disc - DISC) < 1e-6 ? { v: fmtP(DISC), post: 'IN 100' } : { old: fmtP(DISC), v: fmtP(st8.disc), post: 'IN 100', fill: C.pink });
      return s;
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

    /* ---------------- the stage ---------------- */
    var stage = api.stage(function (st) {
      var L = lay(st), port = L.port, dr = st.drawing, s = S.set.dock(st, { hz: L.hz, dock: L.dock, sun: !port }).svg;
      var aSolid = st8.dispL != null ? st8.dispL : lv(angM()), aGhost = Math.max(L_OLD, aSolid);
      var capL = lv(discM()), qdragging = !!st8.qdrag;
      s += gillnet(L, dr);
      var fl = (dr >> 1) % 2;                                          // two gulls over the pier, flapping on twos
      s += K.gull({ x: port ? 250 : 190, y: port ? 200 : 210 + L.dy * 0.35, scale: port ? 0.6 : 0.7, flap: fl }) + K.gull({ x: port ? 360 : 320, y: port ? 245 : 262 + L.dy * 0.35, scale: port ? 0.45 : 0.5, flap: 1 - fl });
      s += banner(L);
      s += board(L);
      s += staff(L);

      /* COMMERCIAL: landed blocks (brick), the dashed "?" cap for dead discards, NOT REVISED on its post */
      s += frameWood(L, L.XC, NC) + blocks(L, L.XC, L_LAND, 0, C.brick);
      var ya = yAt(L, L_LAND), yb2 = yAt(L, L_LAND + capL), bw = L.BW;
      s += rect(L.XC - bw / 2, yb2, bw, Math.max(4, ya - yb2), 5, C.pink, 5, ' fill-opacity=".45" stroke-dasharray="12 8"', C.brick);
      var capH = ya - yb2, qs = S.clamp(78 + capH * 0.3, 78, 124), qIn = capH > qs * 0.8, qy = qIn ? (ya + yb2) / 2 : yb2 - qs * 0.42;
      s += frameTop(L, L.XC, NC);
      var qArt = K.qmark({ x: L.XC, y: qy + qs * 0.36, size: qs, color: C.brick, rot: 6 });
      s += qArt;
      if (st8.ghost90) {
        var yg = yAt(L, L_LAND + lv(R.commLandings * DISC90 / 100)), ga = age90();
        if (ga > 0) {
          var gy = S.lerp(ya, yg, Math.min(1, ga / 6));
          s += rect(L.XC - bw / 2 - 8, gy, bw + 16, ya - gy, 6, 'none', 6, ' stroke-dasharray="14 10"', C.brick);
          if (ga >= 6) s += hang(L.XC - bw / 2 - 8, gy + 8, { x: L.XC - (port ? 150 : 200), y: gy - (port ? 70 : 70), w: tagW(['1990s ESTIMATE:', '80 IN 100'], L.tg * 0.8), h: L.tg * 0.8 * 2.4 + 26, band: C.brick, rot: -3, lines: ['1990s ESTIMATE:', '80 IN 100'], size: L.tg * 0.8 });
        }
      }
      if (!(port && st8.say && st8.sayUntil > Date.now())) {
        var rl = port ? ['TOP', 'RESEARCH', 'PRIORITY'] : ['TOP RESEARCH', 'PRIORITY'], rtx = port ? 968 : L.XC + 330, rty = port ? 800 + L.dy : yAt(L, L_LAND) - 16;
        s += hang(L.XC + qs * 0.32, qy - qs * 0.1, { x: rtx, y: rty, w: tagW(rl, L.tg), h: L.tg * (rl.length * 1.15 + 0.05) + 30, band: C.brick, rot: 2, lines: rl, size: L.tg });
      }
      s += nameBoard(L, L.XC, L.topC, 'COMMERCIAL');
      var nrw = tagW(['NOT REVISED'], L.tg);
      s += hang(L.XC, port ? L.base - 2 : L.GY - L.PH + 6, { x: L.XC + (port ? 26 : 30), y: L.GY - L.PH + (port ? 20 : 42), w: nrw, h: L.tg * 1.5 + 20, band: C.brick, rot: -2, lines: ['NOT REVISED'], size: L.tg });

      /* ANGLERS: kept + released that die (avocado); the corrected-away blocks turn to gray ghosts */
      s += frameWood(L, L.XA, NA) + blocks(L, L.XA, aSolid, aGhost, C.avocado);
      if (st8.puff != null) s += K.puff({ x: L.XA + 10, y: yAt(L, st8.puff + 0.5), r: port ? 44 : 50, seed: Math.floor(st8.puff) + 2 });
      s += frameTop(L, L.XA, NA);
      var showRC = st8.fixed && !st8.hideRC, showST = Math.abs(st8.rm - RM_NEW) < 1e-6 && !st8.hideST && aSolid < L_FIX - 0.1;
      if (showRC && aSolid < L_OLD - 0.5) s += imprint(['RECOUNT'], C.orange, port ? 48 : 44, L.XA + 4, yAt(L, impAt(Math.min(L_OLD, Math.max(aSolid, L_FIX)), L_OLD, 1)), -3);
      if (showST) s += imprint(['RELEASE', 'STUDY'], C.sea, port ? 44 : 40, L.XA + 6, yAt(L, impAt(aSolid, L_FIX, 2)), 2);
      // the notches the shade stops at (brick teeth on the frame's right edge)
      [L_FIX, L_ST].forEach(function (l) {
        var yy = yAt(L, l), xr = L.XA + L.pw / 2 + 16;
        s += path('M' + N(xr + 2) + ',' + N(yy - 14) + ' L' + N(xr - 16) + ',' + N(yy) + ' L' + N(xr + 2) + ',' + N(yy + 14) + ' Z', C.brick, 4);
      });
      // the shade: pulled down while you drag (or while a button pulls it), snapping up and spinning on release
      var sh = '', ringAt;
      if (st8.drag) { var sd = shadeDown(L, st8.drag.hem); sh += sd.svg; ringAt = sd.ring; }
      else if (st8.pull != null) { var sp = shadeDown(L, S.lerp(L.RY + 30, yAt(L, st8.pullL), st8.pull)); sh += sp.svg; ringAt = sp.ring; }
      else if (st8.spin === 0) { var s0 = shadeDown(L, S.lerp(L.RY + 30, yAt(L, st8.snapL), 0.45)); sh += s0.svg; ringAt = s0.ring; sh += K.speedLines({ x: L.XA - 50, y: L.RY + 40, rot: 90, len: 120, n: 3, gap: 50, w: 5 }); }
      else { var ro = roller(L, st8.spin > 0 ? st8.spin - 1 : null); sh += ro.roller + ro.ring; ringAt = ro.at; }
      s += sh;
      s += nameBoard(L, L.XA + (port ? 84 : 70), L.topA, 'ANGLERS');

      /* the stepladder and Kit with the stamp */
      s += ladder(L) + kit(L, st, ringAt);

      /* the Striper: points at commercial; shrugs as the "?" grows */
      var raised = st8.disc > DISC + 0.05;
      var so = { x: L.SX, y: L.GY + 6, scale: L.SS, flip: true, pose: raised ? 'shrug' : 'point', expr: raised ? 'sheepish' : 'kind', look: raised ? 'cam' : [1, 0.15], blink: (dr % 44) === 7 };
      if (st8.talk >= 0) { so.pose = 'point'; so.expr = 'talk'; so.look = [1, 0.1]; so.mouth = st8.talk % 3 === 2 ? 'closed' : 'open'; }
      s += S.shadow(L.SX, L.GY + 6, 250 * L.SS) + K.striper(so);

      s += spotlight(L);
      /* the payoff: BIGGER SHARE lands on the commercial frame */
      var aDown = lv(angM()) < L_OLD - 0.5;
      if (st8.paid && aDown && st8.pay > 0) {
        var seqS = [1.9, 0.9, 1.07, 1], sc = st8.pay >= 99 ? 1 : seqS[Math.min(3, st8.pay - 1)];
        var bx = L.XC, by = L.topC + (port ? 64 : 70);
        if (st8.pay < 4) s += K.impact({ x: bx - 150, y: by - 30, r: 34, fill: C.white }) + K.impact({ x: bx + 150, y: by + 20, r: 30, fill: C.brick, spin: 0.5 });
        s += bigStamp(bx, by, port ? 48 : 44, sc);
        if (st8.say && (!port || st8.sayUntil > Date.now())) {
          var sp2 = K.striperPoints({ x: L.SX, y: L.GY + 6, scale: L.SS, flip: true, pose: 'point' });
          s += port ? S.say('Same commercial count. Smaller anglers’ count.', 800, 560 + L.dy, 470, sp2.nose[0] - 10, sp2.nose[1] + 6, { size: 44 })
            : S.say('Same commercial count. Smaller anglers’ count.', 1758, 470 + L.dy, 316, sp2.nose[0] - 10, sp2.nose[1] + 8, { size: 40 });
        }
      }
      /* the hint, until the shade has been tried: a tag on the ring and a dashed arrow down to the first notch */
      if (!st8.tried && !st8.drag) {
        var hx = L.XA + L.pw / 2 + (port ? 34 : 44), y1 = yAt(L, L_FIX);
        s += path('M' + N(hx) + ',' + N(L.RY + 30) + ' L' + N(hx) + ',' + N(y1 - 10), 'none', 7, ' stroke-dasharray="16 12"', C.brick) + path('M' + N(hx - 18) + ',' + N(y1 - 30) + ' L' + N(hx) + ',' + N(y1 - 6) + ' L' + N(hx + 18) + ',' + N(y1 - 30), 'none', 7, '', C.brick);
        var pl = ['PULL', 'DOWN'];
        s += hang(ringAt[0], ringAt[1] + 14, { x: ringAt[0] + (port ? -70 : 4), y: ringAt[1] + (port ? 100 : 92), w: tagW(pl, port ? 44 : 40), h: (port ? 44 : 40) * 2.3 + 26, band: C.mustard, rot: 4, lines: pl, size: port ? 44 : 40 });
      }
      return s;
    }, function () {
      var a = angM(), a0 = angM(PRE[0]);
      return 'Stripers killed by fishing in 2025, drawn as blocks of 250,000 fish. Anglers: ' + r2(a) + ' million' + (a < a0 - 0.01 ? ', down from ' + r2(a0) + ' million in the old numbers (the gray ghost blocks)' : '') +
        '. Commercial: ' + Math.round(R.commLandings * 1000) + ',000 landed, not revised, plus about ' + Math.round(discM() * 1000) + ',000 thrown back dead (the dashed question mark).';
    });
    function r2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
    var g90 = -1;
    function age90() { return g90 < 0 ? 99 : Math.floor((performance.now() - g90) / (1000 / 12)); }
    /* the spotlight: the anglers' stack (with Kit's ladder) and its rows on the board, or the commercial side */
    function spotlight(L) {
      var f = st8.focus; if (!f) return '';
      var btop = L.bgy - L.bleg - L.bh, rs;
      if (f === 'anglers') rs = [[L.kd - 120, L.topA - 110, L.XA + L.pw / 2 + 50 - (L.kd - 120), L.GY - L.topA + 140], [L.bx - L.bw / 2 - 16, btop - 16, L.bw + 32, L.bh * 0.58]];
      else rs = [[L.XC - L.pw / 2 - 60, L.topC - 110, L.pw + 120 + (L.port ? 120 : 330), L.GY - L.topC + 140], [L.bx - L.bw / 2 - 16, btop + L.bh * 0.55, L.bw + 32, L.bh * 0.5]];
      var op = st8.fz >= 0 ? S.clamp(0.14 * age90f(), 0.14, 0.42) : 0.42, W = L.W + 40, H = L.H + 40;
      return '<mask id="rmSpot" maskUnits="userSpaceOnUse" x="-20" y="-20" width="' + W + '" height="' + H + '"><rect x="-20" y="-20" width="' + W + '" height="' + H + '" fill="#fff"/>' +
        rs.map(function (r) { return '<rect x="' + N(r[0]) + '" y="' + N(r[1]) + '" width="' + N(r[2]) + '" height="' + N(r[3]) + '" rx="30" fill="#000"/>'; }).join('') + '</mask>' +
        '<rect x="-20" y="-20" width="' + W + '" height="' + H + '" fill="' + INK + '" opacity="' + op + '" mask="url(#rmSpot)"/>';
    }
    function age90f() { return Math.floor((performance.now() - st8.fz) / (1000 / 12)) + 1; }

    function ladder(L) {                                             // front view, rungs where Kit stands for each stamp
      var x = L.lx, cap = L.rung[0] - 34 * L.KS / 0.8, k = L.KS / 0.8, s = '';
      var legs = 'M' + N(x - 50 * k) + ',' + L.GY + ' L' + N(x - 32 * k) + ',' + N(cap + 10) + ' M' + N(x + 50 * k) + ',' + L.GY + ' L' + N(x + 32 * k) + ',' + N(cap + 10);
      s += S.shadow(x, L.GY, 130 * k) + path(legs, 'none', 22 * k) + path(legs, 'none', 12 * k, '', C.brown);
      s += S.cel(rect(x - 46 * k, cap, 92 * k, 16, 5, C.brown, 5) + rect(x - 44 * k, L.rung[0], 88 * k, 12, 4, C.tan, 5) + rect(x - 48 * k, L.rung[1], 96 * k, 12, 4, C.tan, 5));
      for (var y = L.rung[1] + 80 * k; y < L.GY - 30; y += 80 * k) s += rect(x - 50 * k, y, 100 * k, 12, 4, C.tan, 5);
      return s;
    }
    /* Kit: waits on the dock, hops onto the ladder to stamp each correction, and hops back down */
    function spot(L, at) { return at === 'dock' ? [L.kd, L.GY] : at === 'r1' ? [L.lx, L.rung[1]] : [L.lx, L.rung[0]]; }
    function restColor() { return st8.fixed ? C.sea : C.orange; }
    function kit(L, st, ringAt) {
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
        if (k.hop >= 0) { var q = Math.min(1, (k.hop + 1) / 3); o.y = S.lerp(L.rung[0], L.rung[1], q) - Math.sin(q * Math.PI) * 26; o.expr = k.hop < 2 ? 'wide' : 'eager'; }
        if (k.mode === 'up' && k.d === 0) o.y -= 8;
      } else if (!st8.tried && ringAt) {                              // before anyone has tried: she points up at the pull ring
        var sx = o.x + 48 * L.KS, sy = o.y - 304 * L.KS;
        o.pose = 'point'; o.aim = S.clamp(Math.atan2(ringAt[1] - sy, ringAt[0] - sx) * 180 / Math.PI, -80, 10); o.expr = 'eager'; o.look = [0.7, -0.8];
      } else {                                                        // on the dock, stamp in hand
        o.pose = 'stamp'; o.stampLabel = PLATE; o.stampColor = col; o.look = [0.6, -0.6];
        o.expr = st8.paid && lv(angM()) < L_OLD - 0.5 ? 'grin' : 'eager';
        if (st8.drag) o.expr = 'wide';
        if (st8.disc > DISC + 0.05) { o.expr = 'wide'; o.look = [1, 0]; }
        if (st8.pay > 0 && st8.pay < 6) o.expr = 'wide';
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
      }, function () { settle(); if (done) done(); });
    }
    function settle() {                                              // clear every in-between state
      st8.busy = false; st8.kit = null; st8.dispL = null; st8.puff = null; st8.spin = -1; st8.pull = null; st8.drag = null;
      st8.hideRC = false; st8.hideST = false; st8.talk = -1; st8.prev = null; st8.cardState = null; if (st8.paid) st8.pay = 99;
      stage.render(); show();
    }
    /* go to a preset: the shade pulls down and snaps up, Kit stamps each correction that is new, and the blocks
       it covers ghost one per drawing from the top down */
    function go(b) {
      if (st8.busy) { stage.animate(0); settle(); }
      var P = { fixed: st8.fixed, rm: st8.rm }, T = PRE[b], Lp = lv(angM(P)), Lt = lv(angM(T));
      var needRC = T.fixed && !P.fixed, needST = Math.abs(T.rm - RM_NEW) < 1e-6 && Math.abs(P.rm - RM_NEW) > 1e-6;
      st8.prev = P; st8.fixed = T.fixed; st8.rm = T.rm; st8.disc = DISC; st8.say = false; st8.cardState = P; show();
      var stamps = [];
      if (Lt < Lp - 0.01) {
        if (needRC) stamps.push({ k: 1, col: C.orange, from: Lp, to: needST ? lv(angM({ fixed: true, rm: P.rm })) : Lt, rung: 0 });
        if (needST) stamps.push({ k: 2, col: C.sea, from: stamps.length ? stamps[0].to : Lp, to: Lt, rung: 1 });
      }
      st8.hideRC = stamps.some(function (x) { return x.k === 1; }); st8.hideST = stamps.some(function (x) { return x.k === 2; });
      st8.dispL = Lp;
      var seq = [];
      if (stamps.length) {
        seq.push({ n: 3, f: function (d) { st8.pull = (d + 1) / 3; st8.pullL = Lt; } });
        seq.push({ n: 7, f: function (d) { st8.pull = null; st8.spin = d; st8.snapL = Lt; } });
      }
      stamps.forEach(function (sp, i) {
        var nb = Math.ceil(sp.from - sp.to - 1e-6), at = sp.rung ? 'r1' : 'r0';
        if (i === 0) seq.push({ n: 2, f: function (d) { st8.spin = -1; st8.kit = { mode: 'hop', from: 'dock', to: at, p: (d + 1) / 2, col: sp.col, at: at }; } });
        seq.push({ n: i ? 3 : 2, f: function (d) { st8.spin = -1; st8.kit = { mode: 'windup', at: at, col: sp.col, hop: i > 0 ? d : -1, puff: i > 0 ? d : -1 }; } });
        seq.push({ n: 1, f: function () { st8.kit = { mode: 'slam', at: at, col: sp.col }; if (sp.k === 1) st8.hideRC = false; else st8.hideST = false; st8.cardState = null; show(); } });
        seq.push({ n: nb + 2, f: function (d) { st8.kit = { mode: 'up', at: at, col: sp.col, d: d }; st8.dispL = Math.max(sp.to, sp.from - d); st8.puff = d > 0 && d <= nb ? st8.dispL : null; } });
        if (i === stamps.length - 1) seq.push({ n: 2, f: function (d) { st8.puff = null; st8.kit = { mode: 'hop', from: at, to: 'dock', p: (d + 1) / 2, col: sp.col, at: 'dock' }; } });
      });
      if (!seq.length) seq.push({ n: 1, f: function () {} });
      run(seq);
    }
    /* same commercial count, smaller anglers' count: BIGGER SHARE lands, and the Striper says so */
    function payoff() {
      if (st8.busy) { stage.animate(0); settle(); }
      run([{ n: 6, f: function (d) { st8.paid = true; st8.pay = d + 1; } },
        { n: 18, f: function (d) { st8.pay = 99; st8.say = true; st8.sayUntil = Date.now() + 7000; st8.talk = d < 16 ? d : -1; } }], sayNow);
    }
    function sayNow() {                                             // the Striper's line (on phones it clears after a few seconds)
      st8.say = true; st8.sayUntil = Date.now() + 6500; stage.render();
      clearTimeout(st8.sayT); st8.sayT = setTimeout(function () { stage.render(); }, 6600);
    }

    /* ---------------- the walkthrough ---------------- */
    var STEPS = [
      { focus: null, cls: 'first', h: '<p>Every striper that dies from fishing counts. On the left, the fish anglers kill: the ones they keep, and released fish that die. On the right, commercial fishing: fish landed, and fish thrown back dead. Each block is <b>250,000 stripers</b>, the same in both stacks.</p><p>All the numbers are for <b>2025</b>, coastwide. Under the picture, the two sides add up to every striper killed by fishing that year.</p>' },
      { focus: 'anglers', h: '<p><b>Anglers, in the old numbers for 2025:</b> 1.42 million stripers kept and 11.8 million released. The assessment assumes 9 in 100 released fish die. Altogether, <b class="num">2.48 million</b> killed.</p>' },
      { focus: 'comm', h: '<p><b>Commercial:</b> 543,000 stripers landed, plus fish thrown back dead, estimated at 2.8 for every 100 landed. Altogether, about <b class="num">0.56 million</b> killed. The recount didn’t change these numbers.</p>' },
      { focus: 'anglers', h: '<p><b>The recount</b> lowers the anglers’ numbers to 1.14 million kept and 9.24 million released. Anglers’ kills drop to <b class="num">1.97 million</b>.</p>' },
      { focus: 'anglers', h: '<p><b>A new study</b> by Micah Dean of the Massachusetts Division of Marine Fisheries found that about half as many released stripers die: roughly 4.5 in 100, not 9. If the assessment uses it, anglers’ kills drop to <b class="num">1.56 million</b>.</p>' },
      { focus: null, h: '<p><b>Same commercial count, smaller anglers’ count.</b> Commercial fishing is a bigger part of the stripers killed than the old numbers showed.</p>' },
      { focus: 'comm', h: '<p><b>And the question mark.</b> The commercial discard figure comes from tagged fish that commercial fishermen report. In the 1990s the same kind of estimate put it as high as <b class="num">80 for every 100</b> landed. The assessment scientists made it their top research priority.</p>' },
      { focus: null, cls: 'turn', h: '<span class="go">Your turn</span><p>The commercial discard figure is uncertain. Slide it from today’s estimate toward the 1990s one and watch the commercial stack.</p>' }
    ];
    var PLAY = STEPS.length - 1, OUTRO = STEPS.length;
    STEPS.forEach(function (d) { api.step(d.h, d.cls); });
    function focus(f) { if (f !== st8.focus) { st8.focus = f; st8.fz = performance.now(); } }
    /* the finished state of step n, drawn at once (a jump, a scroll back, or reduced motion) */
    function snap(n) {
      if (st8.busy) { stage.animate(0); }
      st8.busy = false;
      st8.fixed = n >= 3; st8.rm = n >= 4 ? RM_NEW : RM_OLD; st8.disc = DISC;
      st8.paid = n >= 5; st8.pay = n >= 5 ? 99 : 0; st8.say = n === 5; st8.sayUntil = Date.now() + 6500;
      st8.ghost90 = n === 6; g90 = n === 6 ? performance.now() - 2000 : -1;
      st8.turn = n >= PLAY; st8.focus = STEPS[n] ? STEPS[n].focus : null; st8.fz = -99;
      settle(); disc.set(DISC); disc.el.disabled = !st8.turn;
      api.playing(st8.turn);
    }
    /* step n's entrance, played from the finished state of step n - 1 */
    function enter(n) {
      if (STEPS[n]) focus(STEPS[n].focus);
      if (n === 3) go(1);
      else if (n === 4) go(2);
      else if (n === 5) payoff();
      else if (n === 6) { st8.say = false; st8.ghost90 = true; g90 = performance.now(); stage.animate(900); }
      else if (n === PLAY) { st8.turn = true; st8.ghost90 = false; st8.say = false; disc.el.disabled = false; api.playing(true); }
      if (st8.focus && !st8.busy) stage.animate(300);
      stage.render();
    }
    api.onStep(function (n, prev) {
      if (n >= PLAY && prev >= PLAY) { if (n === OUTRO) closing(); return; }
      if (prev >= 0 && n === prev + 1 && !S.reduce) { snap(prev); enter(n); }
      else snap(n);
      if (n === OUTRO) closing();
    });
    function closing() {
      api.gotIt();
      var nx = api.nav && api.nav.querySelector('.btn'); if (nx && !S.reduce) { nx.classList.remove('rm-nudge'); void nx.offsetWidth; nx.classList.add('rm-nudge'); }
    }

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
      '#removals .sc-play{justify-content:center}#removals .sc-play .ctl{flex:1;max-width:760px}#removals .sc-play .rod{margin-top:20px}#removals .ticks span:last-child{transform:translateX(-50%)}#removals .ticks span:first-child{transform:translateX(-12%)}' +
      '#removals .navrow .btn.rm-nudge{animation:rmNudge 1.2s steps(6,end) 3}' +
      '@keyframes rmNudge{0%,100%{transform:translateY(0)}20%{transform:translateY(-6px)}40%{transform:translateY(0)}60%{transform:translateY(-3px)}}' +
      '@media (max-aspect-ratio: 1/1), (max-width: 820px){#removals .eq{gap:4px}#removals .chip{min-width:0;flex:1;padding:5px 4px 4px}#removals .chip b{font-size:18px}#removals .chip small{font-size:11px;white-space:normal;text-align:center}#removals .op{font-size:22px}#removals .eqyr{min-width:52px;padding:4px 5px}#removals .eqyr b{font-size:17px}#removals .eqyr small{font-size:8.5px}#removals.playing .eq{display:none}#removals .pov::after{position:static;display:block;margin-top:4px}}' +
      '@media (prefers-reduced-motion: reduce){#removals .chip.pop,#removals .navrow .btn.rm-nudge{animation:none}}';
    var eq = S.el('div', { class: 'eq', 'aria-live': 'polite' }, api.bar);
    S.el('span', { class: 'eqyr' }, eq, '<b>2025</b><small>coastwide</small>');
    var cA = S.el('span', { class: 'chip ang' }, eq, '<b></b><small></small>'); S.el('span', { class: 'op', 'aria-hidden': 'true' }, eq, '+');
    var cC = S.el('span', { class: 'chip com' }, eq, '<b></b><small></small>'); S.el('span', { class: 'op', 'aria-hidden': 'true' }, eq, '=');
    var cT = S.el('span', { class: 'chip' }, eq, '<b></b><small></small>');
    function chip(c, v, sm, extra) {
      var b = c.querySelector('b');
      if (b.textContent !== v) { if (/\d/.test(b.textContent)) S.countTo(b, v); else b.textContent = v; if (!S.reduce) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } }
      c.querySelector('small').textContent = sm; c.classList.toggle('pink', !!extra);
    }
    function show() {
      var a = angM(st8.cardState || st8), a0 = angM(PRE[0]), c = R.commLandings + discM(), c0 = R.commLandings * (1 + DISC / 100), mine = Math.abs(st8.disc - DISC) > 1e-6;
      chip(cA, S.m(a, 2), Math.abs(a - a0) > 0.005 ? 'anglers, old count ' + S.m(a0, 2) : 'killed by anglers');
      chip(cC, S.m(c, 2), mine ? 'commercial, your figure' : 'killed commercially', mine);
      chip(cT, S.m(a + c, 2), Math.abs(a + c - a0 - c0) > 0.005 ? 'all fishing, old count ' + S.m(a0 + c0, 2) : 'killed by all fishing');
    }
    var playBox = S.el('div', { class: 'sc-play' }, api.bar);
    var disc = S.slider(playBox, { label: 'Commercial fish thrown back dead, for every 100 landed', min: 0, max: 100, step: 1, value: DISC, fmt: function (v) { return fmtP(v); },
      ticks: [{ v: DISC, t: 'today: 2.8', hot: true }, { v: DISC90, t: '1990s: 80' }],
      onInput: function (v) { if (!st8.turn) return; if (st8.busy) { stage.animate(0); settle(); } st8.disc = v < 3.4 && v > 2 ? DISC : v; st8.say = false; stage.animate(250); show(); } });

    api.take('Both corrections shrink the anglers’ side. Commercial numbers weren’t revised, so commercial fishing is now a bigger share of the stripers killed, and bigger still if the commercial discard estimate is too low.');
    api.pov('ASGA wants commercial dead discards studied as rigorously as recreational release deaths, and wants the big spawning females protected.');
    api.more('Where these numbers come from',
      '<p>2025, coastwide. Anglers kept 1.14 million stripers and released 9.24 million (corrected; the old estimates were 1.42 million and 11.8 million). Commercial fishermen landed 543,000. Commercial numbers were not revised.</p>' +
      '<p>Release deaths: the assessment has assumed 9 in 100 released stripers die. A new study by Micah Dean of the Massachusetts Division of Marine Fisheries found about half that, roughly 4.5 in 100, and the real rate depends on fish size. The benchmark assessment is weighing it now.</p>' +
      '<p>Commercial dead discards: the 2.8-in-100 figure is estimated from tagged fish that commercial fishermen report. In the 1990s the same kind of estimate put commercial dead discards as high as 80 for every 100 landed. The assessment scientists made it their top research priority at the last assessment.</p>' +
      '<p>The totals under the picture are our own sums of these 2025 inputs: fish kept, plus released fish that die, plus commercial landings, plus commercial fish thrown back dead. They are not an official removals figure. The stock assessment counts the same pieces but works state by state and by fish size, so its own totals can differ somewhat.</p>' +
      '<p>The two stacks use the same blocks: each one stands for 250,000 stripers.</p>');
    // the hand-off to the states page
    setTimeout(function () {
      var nx = api.nav && api.nav.querySelector('a.btn:not(.ghost)');
      if (nx && /State by state/.test(nx.textContent)) nx.innerHTML = 'Next: Where do commercial stripers come from? <span class="fishy" aria-hidden="true"></span>';
    }, 0);
    snap(0);
    document.addEventListener('site:fonts', function () { stage.render(); });
  }
});
