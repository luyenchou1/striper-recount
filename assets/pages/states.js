/* 6. State by state: how deep the fix cut in each state, Maine to Virginia (the film's s12 map, 2:46).
   A scrolly page, like the others (Luyen's reviews, Sep 26): a walkthrough, plain numbers ("for every 100 on
   the old books", never a percentage), a readout under the picture, then one gesture: tap a state. No
   spotlight here: the Striper's swim crosses the whole map, and a scrim would hide it.
   Every state's sign on the chart carries ten dots, its striper trips on the old books; the gray ones are the
   share the corrected count says never happened. Tap a state and the Striper swims there on twos, pops up out
   of the water and points at its sign; his logbook, pinned to the chart, shows the same count as ten trip
   tokens that flip to gray ghosts one per drawing. At the Chesapeake he says the film's line, "Where I grew up."
   Steps: the dots on every sign; Maine; Connecticut (the smallest cut); Virginia (the biggest). Then the
   reader's turn.
   The chart: painted land that closes off-canvas (no rectangle), a marsh edge like the s12 map, rivers, thin
   dashed brown state lines, depth bands offshore, a lighthouse in Maine, and each state's sign on a leader line
   out over the ocean on a rail, 50 map units apart, so no two signs overlap.
   Numbers: ASGA's slide C4 (Sept 22, 2026), "Coastwide scale. State-level change", 1990 to 2025: directed trips,
   harvest and releases, pre-revision vs 2026 revised. All 30 values in RC.states match it. */
SITE.register({
  id: 'states', short: 'State by state', title: 'Every state has its own story', scrolly: true,
  build: function (api) {
    var S = SITE, K = S.K, C = S.C, INK = C.ink, N = S.N, path = S.path, ST = RC.states, MAP = RC.map;
    var MK = { trips: 0, kept: 1, released: 2 };
    var IDS = ST.map(function (t) { return t.id; }), byId = {};
    ST.forEach(function (t) { byId[t.id] = t; });
    function per(t, i) { return 100 + t.cut[i]; }        // corrected, for every 100 on the old books
    var METRIC = { trips: 'TRIPS', kept: 'FISH KEPT', released: 'FISH RELEASED' };
    var GONE = { trips: 'NEVER HAPPENED', kept: 'WERE NEVER KEPT', released: 'WERE NEVER CAUGHT' };
    var SAYM = { trips: 'trips', kept: 'fish kept', released: 'fish released' };
    function cur() { return byId[st8.s]; }
    function cutOf(t) { return t.cut[MK[st8.m]]; }
    function ghosts(t) { return Math.round(Math.abs(cutOf(t)) / 10); }

    /* ---------------- the chart: projection and shapes (lon, lat) ---------------- */
    var LON0 = -77.7, LAT0 = 45.25, SC = 70, CL = Math.cos(41 * Math.PI / 180);
    function pj(p) { return [(p[0] - LON0) * CL * SC + 20, (LAT0 - p[1]) * SC + 20]; }       // 600 x 640 map units
    function P(L, p) { var q = pj(p); return [L.ox + q[0] * L.f, L.oy + q[1] * L.f]; }
    function M(L, q) { return [L.ox + q[0] * L.f, L.oy + q[1] * L.f]; }
    // the coast, closed well off-canvas (New Brunswick at the top right, the Outer Banks and inland at the
    // bottom and left) so no edge of the land ever shows. The Chesapeake's western shore is drawn a little wide,
    // as the film does, so the bay reads at this size.
    var WIDEN = { '-76.3,39.4': [-76.42, 39.4], '-76.45,39.25': [-76.62, 39.25], '-76.48,38.97': [-76.7, 38.97], '-76.5,38.6': [-76.72, 38.6],
      '-76.45,38.33': [-76.66, 38.33], '-76.3,38.05': [-76.54, 38.05], '-76.35,37.6': [-76.56, 37.6], '-76.3,37.25': [-76.52, 37.25], '-76.35,37': [-76.46, 37.02] };
    var COAST = [[-63.5, 48], [-64.4, 46.3], [-65.7, 45.5], [-66.6, 45.22]]
      .concat(MAP.coast.slice(0, -2).map(function (p) { return WIDEN[p[0] + ',' + p[1]] || p; }))
      .concat([[-75.72, 35.9], [-75.52, 35.25], [-76.6, 33], [-92, 33], [-92, 50], [-63.5, 50]]);
    var ISLANDS = [[-70.6, 41.4, 0.28, 0.07], [-70.08, 41.28, 0.2, 0.05]];     // Martha's Vineyard, Nantucket
    var AT = { MD: [-75.95, 38.52], VA: [-76.3, 36.95] };                         // on land: Maryland's Eastern Shore, Norfolk
    // thin dashed brown state lines over land (river borders are drawn as the rivers themselves)
    var LINES = [
      [[-70.7, 43.07], [-70.82, 43.23], [-70.98, 43.53], [-70.96, 43.8], [-71.08, 44.5], [-71.08, 45.3], [-70.8, 45.42], [-70.3, 45.95], [-70.2, 47]],   // ME | NH, ME | Quebec
      [[-67.05, 45.15], [-67.45, 45.6], [-67.8, 45.7], [-67.8, 47.5]],                                                    // ME | New Brunswick
      [[-71.5, 45.01], [-71.08, 45.3]], [[-71.5, 45.01], [-73.4, 45.01], [-74.8, 45.0], [-79, 45.0]],                    // Canada
      [[-72.46, 42.73], [-72.4, 43.2], [-72.2, 43.8], [-71.9, 44.3], [-71.5, 45.01]],                                    // NH | VT
      [[-70.82, 42.87], [-71.05, 42.8], [-71.3, 42.7], [-72.46, 42.73], [-73.26, 42.75]],                                // NH, VT | MA
      [[-71.12, 41.49], [-71.2, 41.7], [-71.38, 41.88], [-71.38, 42.02], [-71.8, 42.01], [-73.49, 42.05]],             // RI, CT | MA
      [[-71.85, 41.32], [-71.79, 41.6], [-71.8, 42.01]],                                                                  // RI | CT
      [[-73.65, 41.0], [-73.52, 41.2], [-73.48, 41.6], [-73.5, 42.05], [-73.26, 42.75], [-73.3, 43.6], [-73.4, 45.01]], // CT, MA, VT | NY
      [[-73.93, 41.0], [-74.69, 41.36], [-75.07, 41.8], [-75.35, 42.0], [-80, 42.0]],                                   // NY | NJ, PA
      [[-75.42, 39.8], [-75.6, 39.84], [-75.79, 39.72], [-75.77, 39.3], [-75.7, 38.46], [-75.05, 38.46]],                // DE
      [[-75.79, 39.72], [-80, 39.72]],                                                                                    // MD | PA
      [[-75.24, 38.03], [-75.87, 37.95]],                                                                                 // MD | VA on the Eastern Shore
      [[-75.87, 36.55], [-80, 36.55]]                                                                                     // VA | NC
    ];
    var RIVERS = [
      [[-76.54, 38.05], [-76.9, 38.25], [-77.05, 38.6], [-77.3, 38.95], [-77.7, 39.35], [-78.3, 39.5]],       // Potomac (MD | VA)
      [[-76.08, 39.55], [-76.2, 39.8], [-76.45, 40.1], [-76.8, 40.4], [-76.9, 41.0], [-76.7, 41.6]],         // Susquehanna
      [[-76.46, 37.02], [-76.75, 37.2], [-77.05, 37.3], [-77.45, 37.5], [-78.2, 37.6]],                      // James
      [[-75.55, 39.55], [-75.45, 39.8], [-75.1, 40.0], [-74.85, 40.2], [-75.05, 40.6], [-75.1, 41.0], [-74.69, 41.36]],   // Delaware (NJ | PA)
      [[-74.02, 40.72], [-73.95, 41.0], [-73.95, 41.6], [-73.75, 42.3], [-73.7, 43.0]],                       // Hudson
      [[-72.35, 41.28], [-72.6, 41.7], [-72.55, 42.3], [-72.46, 42.73]]                                      // Connecticut
    ];
    var TREES = [[-77.1, 41.35], [-75.85, 41.95], [-74.6, 42.6], [-72.9, 44.35], [-71.55, 44.2], [-69.9, 45.1], [-72.2, 42.4], [-74.62, 40.25], [-77.2, 39.95], [-68.6, 45.35]];
    var CATTAILS = [[-76.7, 38.45, 1], [-76.2, 38.5, -1], [-76.5, 39.3, 1], [-75.99, 37.95, -1], [-76.55, 37.45, 1]];
    /* sign centres in map units: a rail down the coast, 50 map units apart (so no two signs overlap), each on a
       leader line from its state out over the ocean */
    var LAB = {
      land: { ME: [530, 150], NH: [498, 200], MA: [500, 250], RI: [445, 330], CT: [375, 377], NY: [323, 424], NJ: [280, 470], DE: [250, 516], MD: [234, 562], VA: [220, 608] },
      port: { ME: [540, 136], NH: [512, 188], MA: [516, 240], RI: [456, 326], CT: [388, 376], NY: [334, 426], NJ: [292, 476], DE: [262, 526], MD: [246, 576], VA: [232, 626] }
    };

    /* ---------------- layout, per orientation ---------------- */
    function lay(st) {
      var W = st.w, H = st.h;
      if (st.port) {
        var fp = 1.42;
        return { port: true, W: W, H: H, f: fp, ox: 66 - 83 * fp, oy: 986 - 650 * fp, SS: 0.55, KS: 0.55, KX: 92, KY: H - 14, lab: 52, crest: 978 };
      }
      var f = 1.62;                                  // the chart is anchored to the bottom; extra height is more sea and land up north
      return { port: false, W: W, H: H, f: f, ox: 350 - 83 * f, oy: H - 46 - 622 * f, SS: 0.75, KS: 0.8, KX: 168, KY: H - 30, lab: 52, crest: H - 44 };
    }
    function geo(L) {
      var G = {}, fs = K.fs('label', L.lab), tbl = LAB[L.port ? 'port' : 'land'];
      IDS.forEach(function (id, i) {
        var t = byId[id], m = P(L, AT[id] || t.at), c = M(L, tbl[id]), txt = id;
        G[id] = { i: i, m: m, x: c[0], y: c[1], w: Math.round(7 * fs * 0.56 + 34), h: Math.round(fs * 1.42), txt: txt };
      });
      return G;
    }
    /* where the Striper pops up for each state: in open water to the right of its sign and clear of every other
       sign at the height of his head, his fin reaching back to the sign's right end */
    function stations(L, G) {
      var SS = L.SS;
      return IDS.map(function (id) {
        var g = G[id], tx = g.x + g.w / 2 + 4, ty = g.y, y = Math.min(ty + 292 * SS, L.crest + 150 * SS), x = tx + 190 * SS;
        IDS.forEach(function (j) {
          var h = G[j], t0 = h.y - h.h / 2, t1 = h.y + h.h / 2, r = h.x + h.w / 2;
          if (t1 > y - 480 * SS && t0 < y - 370 * SS) x = Math.max(x, r + 106 * SS + 10);      // his hat
          if (t1 > y - 370 * SS && t0 < y - 130 * SS) x = Math.max(x, r + 170 * SS + 16);      // his head and body
        });
        if (L.port && (id === 'DE' || id === 'MD' || id === 'VA')) x += 120;
        return { x: x, y: y, tx: tx, ty: ty };
      });
    }
    function along(pts, u) {                                      // Catmull-Rom through the stations, u = 0..9
      var n = pts.length, i = Math.max(0, Math.min(n - 2, Math.floor(u))), t = u - i;
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      function cr(a, b, c, d) { return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t); }
      return [cr(p0.x, p1.x, p2.x, p3.x), cr(p0.y, p1.y, p2.y, p3.y)];
    }

    var st8 = { m: 'trips', s: 'ME', u: 0, swim: false, dir: 1, phase: 0, drag: false, pop: 99, still: false, flip: 0, tried: false, book: false, reveal: 0, revealed: false, turn: false, hat: false,
      press: null, seen: {}, cheered: false, cheer: false, squash: 0 };
    st8.flip = ghosts(cur());

    /* ---------------- drawing helpers ---------------- */
    function smooth(pts, closed) {
      var n = pts.length, d = 'M' + N(pts[0][0]) + ',' + N(pts[0][1]);
      for (var i = 0; i < (closed ? n : n - 1); i++) {
        var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
        if (!closed) { if (i === 0) p0 = p1; if (i + 2 >= n) p3 = p2; }
        d += ' C' + N(p1[0] + (p2[0] - p0[0]) / 6) + ',' + N(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + N(p2[0] - (p3[0] - p1[0]) / 6) + ',' + N(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + N(p2[0]) + ',' + N(p2[1]);
      }
      return d + (closed ? ' Z' : '');
    }
    function landD(L) {
      var d = smooth(COAST.map(function (p) { return P(L, p); }), true) + ' ' + smooth(MAP.li.map(function (p) { return P(L, p); }), true);
      ISLANDS.forEach(function (e) {
        var q = P(L, [e[0], e[1]]), rx = e[2] * CL * SC * L.f, ry = e[3] * SC * L.f * 1.6;
        d += ' M' + N(q[0] - rx) + ',' + N(q[1]) + ' a' + N(rx) + ',' + N(ry) + ' 0 1,0 ' + N(2 * rx) + ',0 a' + N(rx) + ',' + N(ry) + ' 0 1,0 ' + N(-2 * rx) + ',0 Z';
      });
      return d;
    }
    function cattail(sw) {
      var st = 'M0,0 Q' + (-6 + sw) + ',-30 ' + (-14 + sw) + ',-56 M0,0 Q' + (4 + sw) + ',-34 ' + (8 + sw) + ',-64 M0,0 Q' + (10 + sw) + ',-22 ' + (22 + sw) + ',-40';
      return path(st, 'none', 7) + path(st, 'none', 3.5, '', C.olive) +
        '<rect x="' + (2 + sw) + '" y="-84" width="12" height="26" rx="6" fill="' + C.brown + '" stroke="' + INK + '" stroke-width="4" transform="rotate(8 ' + (8 + sw) + ' -70)"/>';
    }
    function tree() {
      return '<path d="M-5,0 L-5,-26 M5,0 L5,-26" stroke="' + INK + '" stroke-width="5"/><rect x="-6" y="-30" width="12" height="30" fill="' + C.brown + '" stroke="' + INK + '" stroke-width="4"/>' +
        '<path d="M-34,-34 Q-46,-62 -22,-72 Q-18,-98 6,-96 Q30,-100 32,-74 Q52,-62 38,-38 Q30,-24 0,-28 Q-26,-22 -34,-34 Z" fill="' + C.avocado + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>';
    }
    var FISH = 'M40,0 Q28,-20 0,-18 Q-22,-16 -34,-4 L-50,-18 Q-46,0 -50,18 L-34,4 Q-22,16 0,18 Q28,20 40,0 Z';
    /* one token on the logbook: a trip (the film's boat token) or a fish; ghost = gray dashed, no fill */
    function token(r, ghost, turning) {
      var s;
      if (st8.m === 'trips') s = K.tripToken({ r: r, ghost: ghost });
      else {
        var fk = r / 64;
        s = '<circle r="' + r + '" fill="' + (ghost ? 'none' : C.mustard) + '" stroke="' + (ghost ? C.gray : INK) + '" stroke-width="5"' + (ghost ? ' stroke-dasharray="8 6"' : '') + '/>';
        s += ghost ? '<path d="' + FISH + '" transform="scale(' + N(fk) + ')" fill="none" stroke="' + C.gray + '" stroke-width="' + N(4.5 / fk) + '" stroke-dasharray="' + N(9 / fk) + ' ' + N(6 / fk) + '" stroke-linejoin="round"/>'
          : K.fishIcon({ size: fk });
      }
      return turning ? '<g transform="scale(0.28 1)">' + s + '</g>' : s;
    }
    function tokenRow(L, cols, r, gap) {        // the ten tokens; the cut's share flips to ghosts from the end
      var t = cur(), n = ghosts(t), s = '';
      for (var i = 0; i < 10; i++) {
        var c = i % cols, rw = Math.floor(i / cols), gh = i >= 10 - st8.flip, turn = st8.flip < n && i === 9 - st8.flip && st8.pop >= 4 && st8.pop < 99;
        s += '<g transform="translate(' + N(c * gap) + ' ' + N(rw * gap) + ')">' + token(r, gh, turn) + '</g>';
      }
      return s;
    }
    function tack(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="11" fill="' + C.mustard + '" stroke="' + INK + '" stroke-width="4"/><circle cx="' + (x + 3) + '" cy="' + (y - 3) + '" r="3" fill="' + S.HI.mustard + '"/>'; }
    function checkBox(x, y, on, sz) {
      var s = '<rect x="' + N(x - sz / 2) + '" y="' + N(y - sz / 2) + '" width="' + sz + '" height="' + sz + '" rx="6" fill="' + C.white + '" stroke="' + INK + '" stroke-width="4"/>';
      if (on) s += K.check({ x: x + 2, y: y, scale: sz / 70, color: C.sea });
      return s;
    }
    function stampScale(d) { return d >= 4 ? 1 : [1.9, 1.3, 0.9, 1.06][d]; }
    /* the chosen state's logbook page, pinned to the chart */
    function logbook(L) {
      var t = cur(), n = ghosts(t), s = '';
      if (!st8.book) return '';
      if (L.port) {                                  // a strip along the bottom, 832 x 246
        var w = 832, h = 246;
        s += '<rect x="8" y="10" width="' + w + '" height="' + h + '" rx="12" fill="' + INK + '" opacity=".15"/>';
        s += S.cel('<rect width="' + w + '" height="' + h + '" rx="12" fill="' + C.white + '" stroke="' + INK + '" stroke-width="6"/>');
        s += '<path d="M3,12 Q3,3 12,3 L' + (w - 12) + ',3 Q' + (w - 3) + ',3 ' + (w - 3) + ',12 L' + (w - 3) + ',62 L3,62 Z" fill="' + C.brick + '"/>' + path('M0,63 H' + w, 'none', 5);
        s += K.text(t.name.toUpperCase(), 26, 48, { size: 46, fill: C.cream, anchor: 'start' });
        s += '<g transform="translate(58 128)">' + tokenRow(L, 10, 31, 79.5) + '</g>';
        s += K.text('ABOUT ' + n + ' IN 10 ' + GONE[st8.m], w / 2, 222, { size: 52, fill: C.brick });
        s += tack(22, 8) + tack(w - 22, 8);
        return K.at(232, 994, 1, 0, s);
      }
      var W2 = 570, H2 = 540, LX = 30, LY = 24 + Math.round((L.H - 1080) * 0.45);   // laptop: hung over the inland top left, clear of the sea
      s += '<rect x="9" y="11" width="' + W2 + '" height="' + H2 + '" rx="12" fill="' + INK + '" opacity=".15"/>';
      var rules = ''; for (var y = 150; y < H2 - 20; y += 34) rules += 'M18,' + y + ' H' + (W2 - 18) + ' ';
      s += S.cel('<rect width="' + W2 + '" height="' + H2 + '" rx="12" fill="' + C.white + '" stroke="' + INK + '" stroke-width="6"/>');
      s += path(rules, 'none', 2, ' opacity=".14"', C.sea);
      s += '<path d="M3,12 Q3,3 12,3 L' + (W2 - 12) + ',3 Q' + (W2 - 3) + ',3 ' + (W2 - 3) + ',12 L' + (W2 - 3) + ',76 L3,76 Z" fill="' + C.brick + '"/>' + path('M0,78 H' + W2, 'none', 5);
      s += K.text(t.name.toUpperCase(), W2 / 2, 58, { size: 58, fill: C.cream });
      s += K.text(METRIC[st8.m] + ', 1990 TO 2025', W2 / 2, 128, { size: 42 });
      s += '<g transform="translate(93 196)">' + tokenRow(L, 5, 40, 96) + '</g>';
      s += K.text('ABOUT ' + n + ' IN 10', W2 / 2, 396, { size: 62, fill: C.brick });
      s += K.text(GONE[st8.m], W2 / 2, 446, { size: 46 });
      s += K.text(per(t, 0) + ' TRIPS FOR EVERY 100', W2 / 2, 506, { size: 36, fill: C.seaDeep });
      // two strings up to the frame, like the film's hanging calendar pages
      var str = '';
      [70, W2 - 70].forEach(function (x) { str += path('M' + (x + (x < W2 / 2 ? -24 : 24)) + ',' + (-LY - 20) + ' L' + x + ',14', 'none', 5) + '<circle cx="' + x + '" cy="18" r="9" fill="' + C.cream + '" stroke="' + INK + '" stroke-width="4"/>'; });
      return K.at(LX, LY, 1, 0, str + s);
    }

    /* ---------------- the stage ---------------- */
    function draw(st) {
      var L = lay(st), W = L.W, H = L.H, f = L.f, G = geo(L), STN = stations(L, G), t = cur(), k = f / 1.62, s = '', art = '';
      var land = landD(L);
      /* the sea in three depth bands that follow the shore (hard edges, no gradients) */
      // painted past the frame, so a window wider than the stage's shape never shows a bare edge
      art += '<rect x="-1200" y="-600" width="' + (W + 2400) + '" height="' + (H + 1200) + '" fill="' + C.seaDeep + '"/>';
      art += '<path d="' + land + '" fill="none" stroke="' + C.sea + '" stroke-width="' + N(1180 * k) + '" stroke-linejoin="round"/>';
      art += '<path d="' + land + '" fill="none" stroke="' + C.skyDeep + '" stroke-width="' + N(78 * k) + '" stroke-linejoin="round"/>';
      // wave ticks, the highlight ticks shifting every other drawing
      var ph = (st.drawing >> 1) % 2, wt = '', wl = '';
      for (var i = 0; i < 26; i++) {
        var wx = (0.2 + 0.8 * TBR.hash(i * 3.1 + 1)) * W, wy = (0.05 + 0.9 * TBR.hash(i * 7.7 + 2)) * H;
        wt += 'M' + N(wx) + ',' + N(wy) + ' q22,-8 44,0 ';
        wl += 'M' + N(wx + 70 + ph * 16) + ',' + N(wy + 26) + ' q18,-6 36,0 ';
      }
      art += path(wt, 'none', 4, ' opacity=".55"') + path(wl, 'none', 4, '', S.HI.sea);
      /* the land: sand, a marsh edge like the s12 map, speckles, rivers, state lines, trees */
      art += '<clipPath id="stLand"><path d="' + land + '"/></clipPath>';
      art += '<path d="' + land + '" fill="' + C.sand + '"/>';
      var cl = '', sp = '', hs = '';
      for (var j = 0; j < 90; j++) { sp += 'M' + N(TBR.hash(j * 1.7) * W) + ',' + N(TBR.hash(j * 2.3 + 5) * H) + ' l0,0 '; }
      for (var j2 = 0; j2 < 14; j2++) { hs += 'M' + N(TBR.hash(j2 * 9.1) * W) + ',' + N(TBR.hash(j2 * 4.4 + 1) * H) + ' q40,-10 80,0 '; }
      cl += path(sp, 'none', 7, '', S.SH.sand) + path(hs, 'none', 5, '', S.HI.sand);
      RIVERS.forEach(function (r) { var d = smooth(r.map(function (p) { return P(L, p); }), false); cl += path(d, 'none', 8 * k + 9) + path(d, 'none', 8 * k, '', C.skyDeep); });
      var mb = 13 * k;
      cl += '<path d="' + land + '" fill="none" stroke="' + INK + '" stroke-width="' + N(2 * mb + 9) + '" stroke-linejoin="round"/>';
      cl += '<path d="' + land + '" fill="none" stroke="' + C.avocado + '" stroke-width="' + N(2 * mb) + '" stroke-linejoin="round"/>';
      var dl = ''; LINES.forEach(function (ln) { dl += smooth(ln.map(function (p) { return P(L, p); }), false) + ' '; });
      cl += path(dl, 'none', 5, ' stroke-dasharray="16 11"', C.brown);
      art += '<g clip-path="url(#stLand)">' + cl + '</g>';
      art += path(land, 'none', 7);
      TREES.forEach(function (p, ti) { var q = P(L, p); art += S.shadow(q[0], q[1], 70 * k, 'sand') + K.at(q[0], q[1], 0.62 * k * (0.85 + 0.3 * TBR.hash(ti)), 0, S.cel(tree())); });
      CATTAILS.forEach(function (c, ci) { var q = P(L, [c[0], c[1]]), sw = ((st.drawing >> 2) + ci) % 2 ? 3 : -3; art += K.at(q[0], q[1], 0.55 * k, 0, c[2] < 0 ? '<g transform="scale(-1 1)">' + cattail(sw) + '</g>' : cattail(sw)); });
      // the lighthouse in Maine (Portland Head)
      var lh = P(L, [-70.21, 43.62]), lhH = 118 * k;
      art += S.longShadow(lh[0], lh[1], 40 * k, lhH, 'sand') + S.shadow(lh[0], lh[1], 64 * k, 'sand') + S.cel(K.lighthouse({ x: lh[0], y: lh[1], h: lhH, scale: 0.9 * k }));
      // CHESAPEAKE BAY, lettered up the bay; ATLANTIC OCEAN in open water
      var cb = P(L, [-76.43, L.port ? 38.62 : 38.32]), cfs = L.port ? 44 : 40;
      art += K.text('CHESAPEAKE BAY', cb[0] + K.fs('label', cfs) * 0.35, cb[1], { size: cfs, fill: C.cream, stroke: INK, strokeW: 9, rot: -90 });
      // ATLANTIC OCEAN in open water (up the right edge on phones, where the Striper never goes)
      var ao = L.port ? [1036, 604] : [W - 330, H - 210], gf = (st.drawing >> 1) % 2;
      if (L.port) art += K.text('ATLANTIC OCEAN', ao[0], ao[1], { size: 44, fill: C.cream, stroke: C.seaDeep, strokeW: 8, spacing: 4, rot: -90 });
      else art += K.text('ATLANTIC', ao[0], ao[1], { size: 60, fill: C.cream, stroke: C.seaDeep, strokeW: 8, spacing: 6 }) + K.text('OCEAN', ao[0], ao[1] + 64, { size: 60, fill: C.cream, stroke: C.seaDeep, strokeW: 8, spacing: 6 });
      var gp = L.port ? [[930, 90], [1010, 60]] : [[W - 420, 120 + (H - 1080) * 0.4], [W - 220, 80 + (H - 1080) * 0.4]];
      art += K.gull({ x: gp[0][0], y: gp[0][1], scale: 0.6 * k, flap: gf }) + K.gull({ x: gp[1][0], y: gp[1][1], scale: 0.45 * k, flap: 1 - gf });
      art += '<g transform="translate(-600 0)">' + S.grain(W + 1200, H) + '</g>';

      /* the signs on leader lines; the chosen one is the Striper's sign and pops with overshoot */
      var signs = '', leads = '';
      IDS.forEach(function (id) {
        var g = G[id], sel = id === st8.s, bx = S.clamp(g.m[0], g.x - g.w / 2, g.x + g.w / 2), by = S.clamp(g.m[1], g.y - g.h / 2, g.y + g.h / 2);
        leads += path('M' + N(g.m[0]) + ',' + N(g.m[1]) + ' L' + N(bx) + ',' + N(by), 'none', sel ? 6 : 4, '', sel ? C.brick : INK);
        leads += '<circle cx="' + N(g.m[0]) + '" cy="' + N(g.m[1]) + '" r="' + N((sel ? 15 : 11) * k) + '" fill="' + (sel ? C.brick : C.mustard) + '" stroke="' + INK + '" stroke-width="5"/>';
        var sc = sel && st8.pop >= 0 && st8.pop < 4 ? [1, 1.28, 1.12, 0.95][st8.pop] : 1;
        if (st8.press === id) sc = 0.92;
        var sg = '<rect x="' + N(-g.w / 2 + 6) + '" y="' + N(-g.h / 2 + 8) + '" width="' + g.w + '" height="' + g.h + '" rx="12" fill="' + INK + '" opacity=".15"/>' +
          '<rect x="' + N(-g.w / 2) + '" y="' + N(-g.h / 2) + '" width="' + g.w + '" height="' + g.h + '" rx="12" fill="' + (sel ? C.mustard : C.cream) + '" stroke="' + INK + '" stroke-width="' + (sel ? 7 : 5) + '"/>' +
          K.text(g.txt, -g.w / 2 + 18, K.fs('label', L.lab) * 0.36, { size: L.lab, anchor: 'start' });
        // ten dots: the state's trips on the old books; the gray ones never happened. They pop on, sign by sign.
        var rv = st8.reveal - g.i * 2, gh = ghosts(byId[id]);
        if (rv >= 0) {
          var pk = rv < 4 ? S.pop(rv, 4) : 1, pr = 8.5, pp = 21, px0 = g.w / 2 - 18 - 4 * pp - pr;
          for (var q = 0; q < 10; q++) {
            var qx = px0 + (q % 5) * pp, qy = (q < 5 ? -11 : 11), ghost = q >= 10 - gh;
            sg += '<circle cx="' + N(qx) + '" cy="' + N(qy) + '" r="' + N(pr * pk) + '" fill="' + (ghost ? C.white : C.sea) + '" stroke="' + (ghost ? C.gray : INK) + '" stroke-width="3.5"' + (ghost ? ' stroke-dasharray="5 4"' : '') + '/>';
          }
        }
        if (st8.seen[id]) sg += K.check({ x: g.w / 2 - 10, y: -g.h / 2 + 2, scale: 0.42, color: C.brick });
        var sgn = K.at(g.x, g.y, sc, sel ? -2 : 0, sg);
        if (st8.press === id) sgn = '<g transform="translate(' + N(g.x) + ' ' + N(g.y + g.h / 2) + ') scale(1.06 0.9) translate(' + N(-g.x) + ' ' + N(-g.y - g.h / 2) + ')">' + sgn + '</g>';
        signs += '<g data-sg="' + id + '">' + sgn + '</g>';
      });
      s += '<g aria-hidden="true">' + art + leads + signs;

      /* Kit, on the land at the left edge like the film's s12 map */
      var stn = STN[IDS.indexOf(st8.s)], fishAt = st8.swim ? along(STN, st8.u) : [stn.x, stn.y];
      var kid = { x: L.KX, y: L.KY, scale: L.KS, pose: 'neutral', expr: 'kind', look: [1, -0.3], blink: (st.drawing % 44) === 3 };
      var here = !st8.swim && st8.pop >= 4;
      if (st8.hat || st8.cheer) { kid.pose = 'cheer'; kid.expr = 'grin'; if (L.port) kid.x = L.KX + 34; }
      else if (st8.swim) { kid.pose = 'point'; kid.expr = 'eager'; kid.aim = S.clamp(Math.atan2(fishAt[1] - 200 * L.SS - (L.KY - 380 * L.KS), fishAt[0] - L.KX) * 180 / Math.PI, -60, 25); kid.look = [1, -0.4]; }
      else if (here && (st8.s === 'MD' || st8.s === 'VA')) { kid.pose = 'cheeks'; kid.expr = 'happy'; }
      else if (here && Math.abs(cutOf(t)) >= 50) { kid.pose = 'cheeks'; kid.expr = 'wide'; }
      else if (st8.turn) { var klk = S.lookAt(stage, K.kidPoints(kid).eye, kid.flip); if (klk) kid.look = klk; }
      s += S.shadow(L.KX, L.KY, 190 * L.KS / 0.8, 'sand') + K.kid(kid);

      /* the Striper: swimming the coast on twos, or popped up at his station pointing at the sign */
      var SS = L.SS, fish = '', fx, fy;
      if (st8.swim) {
        var u0 = Math.max(0, st8.u - 0.03), u1 = Math.min(IDS.length - 1, st8.u + 0.03), a = along(STN, u0), b = along(STN, u1);
        var dx = (b[0] - a[0]) * st8.dir, dy = (b[1] - a[1]) * st8.dir, left = dx < 0, ang = Math.atan2(dy, dx) * 180 / Math.PI;
        var rot = S.clamp(left ? ang - 180 * (ang > 0 ? 1 : -1) : ang, -32, 32);
        fx = fishAt[0]; fy = fishAt[1] - 130 * SS;
        fish += '<ellipse cx="' + N(fx) + '" cy="' + N(fy + 26 * SS) + '" rx="' + N(230 * SS) + '" ry="' + N(30 * SS) + '" fill="none" stroke="' + S.HI.sea + '" stroke-width="5"/>';
        fish += K.speedLines({ x: fx + (left ? 250 : -250) * SS, y: fy - 90 * SS, len: 90 * SS / 0.75, n: 3, gap: 26, w: 6, flip: left });
        fish += K.striper({ x: fx, y: fy, scale: SS, flip: left, rot: rot, pose: 'swim', phase: (st8.phase % 4) / 4, expr: st8.drag ? 'grin' : 'hopeful', suitcase: false, squash: st8.squash || 0 });
        if (st8.turn) fish = S.grab('fish', fish, fx, fy - 90 * SS, 170 * SS);
      } else {
        fx = stn.x; fy = stn.y;
        var rise = !st8.still && st8.pop >= 0 && st8.pop < 4 ? [150, 60, -14, 0][st8.pop] * SS : 0, crest = fy - 150 * SS, oy = fy + rise;
        var bay = st8.s === 'MD' || st8.s === 'VA', hat = st8.hat;
        var o = { x: fx, y: oy, scale: SS, flip: true, suitcase: false, blink: (st.drawing % 38) === 7 };
        if (hat) { o.pose = 'tipHat'; o.expr = 'wink'; }
        else if (bay) { o.pose = 'hopeful'; o.expr = 'hopeful'; o.flip = false; o.look = [0.2, -0.6]; if (!st8.still && st8.pop >= 3 && st8.pop < 99) o.mouth = st8.pop % 3 === 2 ? 'closed' : 'open'; }
        else { o.pose = 'point'; o.expr = 'kind'; o.reach = [stn.tx + 10, stn.ty]; o.look = [1, 0.1]; }
        if (!hat && (st8.still || st8.pop >= 99)) {
          o.squash = S.breath(st);
          var slk = st8.turn && !bay && S.lookAt(stage, K.striperPoints(o).eye, o.flip); if (slk) o.look = slk;
        }
        var ring = '<ellipse cx="' + N(fx - 20 * SS) + '" cy="' + N(crest + 8 * SS) + '" rx="' + N(170 * SS) + '" ry="' + N(30 * SS) + '" fill="none" stroke="' + S.HI.sea + '" stroke-width="6"/>';
        // the water in front of him: a wave crest over his lower body, just wide enough to hide it
        var hw = 75 * SS, x0 = fx - 160 * SS, wd = 'M' + N(x0) + ',' + N(crest + 6) + ' q' + N(hw / 2) + ',-18 ' + N(hw) + ',0 t' + N(hw) + ',0 t' + N(hw) + ',0 t' + N(hw) + ',0';
        var front = path(wd + ' V' + N(fy + 40 * SS) + ' H' + N(x0) + ' Z', C.sea, 0) + path(wd, 'none', 6) + path('M' + N(fx - 120 * SS) + ',' + N(crest + 40 * SS) + ' q16,-6 32,0 M' + N(fx + 30 * SS) + ',' + N(crest + 56 * SS) + ' q16,-6 32,0', 'none', 4, '', S.HI.sea);
        fish += ring + K.striper(o) + front;
        if (!st8.still && st8.pop >= 1 && st8.pop < 5) fish += K.splash({ x: fx - 20 * SS, y: crest, r: 110 * SS, p: (st8.pop - 1) / 3, n: 5 });
        if (st8.turn) fish = S.grab('fish', fish, fx - 30 * SS, fy - 300 * SS, 170 * SS);
        if (bay && !hat && (st8.still || st8.pop >= 3)) {
          var hk = K.striperPoints(o).hook, bw = L.port ? 240 : 230;
          fish += S.say('Where I grew up.', Math.min(fx + 170 * SS + bw / 2 + 8, W - bw / 2 - 14), fy - 390 * SS, bw, hk[0] + 6, hk[1], { size: L.port ? 46 : 44 });
        }
      }
      s += fish;
      s += logbook(L);
      // until the user has tried: a hint tag with a dashed arrow down the coast
      if (st8.turn && !st8.tried) {
        // in open water, clear of every sign
        var hx = L.port ? 800 : W - 330, hy = (L.port ? 640 : H - 340) - ((st.drawing >> 1) % 2 ? 6 : 0);
        if (L.port) s += path('M' + N(hx - 150) + ',' + N(hy + 28) + ' Q' + N(hx - 220) + ',' + N(hy + 110) + ' ' + N(hx - 318) + ',' + N(hy + 104), 'none', 7, ' stroke-dasharray="16 12"', C.brick);
        s += K.tag('TAP A STATE', hx, hy, { size: L.port ? 44 : 44, rot: -3, fill: C.mustard });
      }
      s += '</g>';

      /* the signs and markers as real radio buttons, on top (the art above is hidden from screen readers) */
      var hit = '<g role="radiogroup" aria-label="States on the map, Maine to Virginia">';
      IDS.forEach(function (id) {
        var g = G[id], tt = byId[id], sel = id === st8.s, pad = 9;
        hit += '<g data-st="' + id + '" role="radio" aria-checked="' + sel + '" tabindex="' + (sel && st8.turn ? 0 : -1) + '" aria-label="' + tt.name + ': ' + per(tt, 0) + ' trips for every 100 in the old count">' +
          '<circle cx="' + N(g.m[0]) + '" cy="' + N(g.m[1]) + '" r="30" fill="transparent"/>' +
          '<rect class="ring" x="' + N(g.x - g.w / 2 - pad) + '" y="' + N(g.y - g.h / 2 - pad) + '" width="' + (g.w + 2 * pad) + '" height="' + (g.h + 2 * pad) + '" rx="16" fill="transparent"/></g>';
      });
      s += hit + '</g>';
      return s;
    }

    var stage = api.stage(draw, function () {
      var t = cur(), n = ghosts(t);
      return 'Map of the coast from Maine to Virginia. Each state’s sign shows its striper trips in the old count as 10 dots, the gray ones the share that never happened. The Striper is at ' + t.name +
        ': ' + per(t, 0) + ' trips for every 100 in the old count.';
    });
    stage.svg.setAttribute('role', 'group');
    // keep keyboard focus on the chosen state's sign across redraws
    var render0 = stage.render;
    stage.render = function () {
      var a = document.activeElement, had = a && a.getAttribute && stage.svg.contains(a) && a.getAttribute('data-st');
      render0();
      if (had) { var e = stage.svg.querySelector('[data-st="' + st8.s + '"]'); if (e && e.focus) e.focus({ preventScroll: true }); }
    };

    /* ---------------- moments ---------------- */
    function stop() { if (stage.anim) { cancelAnimationFrame(stage.anim.raf); stage.anim = null; } }
    function pick(id, user) {
      var to = IDS.indexOf(id); if (to < 0) return;
      st8.s = id; show();
      var from = st8.u, du = to - from;
      st8.flip = 0; st8.pop = -1; st8.still = false; st8.squash = 0; st8.cheer = false;
      if (Math.abs(du) < 0.01) { st8.u = to; st8.swim = false; arrive(); return; }
      var n = Math.round(S.clamp(5 + Math.abs(du) * 2.6, 6, user ? 16 : 28)), k = user ? 1 : 0;
      st8.swim = true; st8.dir = du > 0 ? 1 : -1;
      stage.play(n + k, function (d) { st8.squash = d < k ? 0.12 : 0; st8.u = from + du * S.ease.inOut(Math.max(0, d - k) / n); st8.phase = d; },
        function () { st8.u = to; st8.swim = false; st8.squash = 0; arrive(); });
    }
    /* he pops up, the sign pops, then the logbook's tokens flip one per drawing; Kit cheers once when the reader
       reaches a third state of their own */
    function arrive() {
      var n = ghosts(cur()), cheer = st8.turn && !st8.cheered && Object.keys(st8.seen).length >= 3;
      if (cheer) st8.cheered = true;
      stage.play(Math.max(n + 5, cheer ? 16 : 0), function (d) { st8.pop = Math.min(d, 99); st8.flip = S.clamp(d - 4, 0, n); st8.cheer = cheer && d < 16; },
        function () { st8.pop = 99; st8.flip = n; st8.cheer = cheer && S.reduce; stage.render(); });
    }
    function userPick(id) { if (!st8.turn) return; st8.tried = true; st8.seen[id] = true; S.buzz(8); pick(id, true); }
    /* the dots pop onto the signs, one sign every two drawings */
    function reveal() {
      if (st8.revealed) return; st8.revealed = true;
      stage.play(26, function (d) { st8.reveal = d; }, function () { st8.reveal = 99; stage.render(); });
    }

    /* ---------------- the walkthrough ---------------- */
    function st(id) { return byId[id]; }
    var STEPS = [
      { cls: 'first', h: '<p>The correction didn’t land evenly along the coast. Each state’s sign shows its striper fishing trips in the old count, 1990 to 2025, as <b>10 dots</b>. The <b>gray</b> dots are the share the corrected count says never happened.</p>' },
      { h: '<p><b>Maine.</b> For every 100 trips in the old count, the corrected count has <b class="num">' + per(st('ME'), 0) + '</b>. The other ' + (100 - per(st('ME'), 0)) + ' never happened.</p>' },
      { h: '<p><b>Connecticut</b> had the smallest cut: <b class="num">' + per(st('CT'), 0) + '</b> trips for every 100 in the old count.</p>' },
      { h: '<p><b>Virginia</b> had the biggest: <b class="num">' + per(st('VA'), 0) + '</b> trips for every 100, and only <b class="num">' + per(st('VA'), 1) + '</b> fish kept for every 100 in the old count.</p>' },
      { cls: 'turn', h: '<span class="go">Your turn</span><p>Tap any state’s sign and the Striper swims there. Under the picture: its trips, fish kept and fish released, for every 100 in the old count.</p>' }
    ];
    var AT_STEP = ['ME', 'ME', 'CT', 'VA'], PLAY = STEPS.length - 1, OUTRO = STEPS.length;
    STEPS.forEach(function (d) { api.step(d.h, d.cls); });
    function snap(n, quiet) {
      stop();
      var id = AT_STEP[Math.min(n, AT_STEP.length - 1)];
      st8.s = id; st8.u = IDS.indexOf(id); st8.swim = false; st8.drag = false; st8.pop = 99; st8.still = true; st8.flip = ghosts(cur());
      st8.book = n >= 1; st8.turn = n >= PLAY; st8.hat = n >= OUTRO; if (n < PLAY) st8.tried = false;
      if (st8.revealed) st8.reveal = 99;
      api.playing(st8.turn); show(); if (!quiet) stage.render();
    }
    function enter(n) {
      if (n === 1) { st8.book = true; st8.reveal = 99; pick('ME'); }
      else if (n === 2) pick('CT');
      else if (n === 3) pick('VA');
      else if (n === PLAY) { st8.turn = true; api.playing(true); stage.render(); }
    }
    api.onStep(function (n, prev) {
      if (n >= PLAY && prev >= PLAY) { st8.hat = n === OUTRO; if (st8.hat) closing(); stage.render(); return; }
      if (prev >= 0 && n === prev + 1 && !S.reduce) { snap(prev, true); enter(n); }
      else snap(n);
      if (n === OUTRO) closing();
    });
    function closing() { S.reward(api); }

    /* ---------------- under the picture: the chosen state, for every 100 on the old books ---------------- */
    var eq = S.el('div', { class: 'eq', 'aria-live': 'polite' }, api.bar);
    var yrB = S.el('span', { class: 'eqyr' }, eq, '<b></b><small></small>');
    S.el('span', { class: 'eqlab' }, eq, 'Corrected, for every 100 in the old count');
    var cs = ['trips', 'fish kept', 'fish released'].map(function (k) { return S.el('span', { class: 'chip' }, eq, '<b></b><small>' + k + '</small>'); });
    function show() {
      var t = cur();
      yrB.querySelector('b').textContent = t.id; yrB.querySelector('small').textContent = t.name;
      cs.forEach(function (c, i) {
        var b = c.querySelector('b'), v = String(per(t, i));
        if (S.shown(b) !== v) { if (b.textContent) S.countTo(b, v); else b.textContent = v; if (!S.reduce) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } }
      });
    }
    api.take('Every state’s numbers came down, but not evenly. For every 100 trips in the old count, the corrected count has ' + per(st('CT'), 0) + ' in Connecticut and ' + per(st('VA'), 0) + ' in Virginia. Six of the ten states lost more than a third of their estimated trips.');
    api.more('About these numbers', '<p>Each state’s change from the old to the corrected estimates, 1990 to 2025 combined: striped bass fishing trips, fish kept (harvest) and fish released. The dots and the logbook round each state to the nearest 10 in 100, so Connecticut’s 77 shows as 2 gray dots. ASGA’s slide covers the ten states from Maine to Virginia.</p>' +
      '<p class="src">Source: ' + FRAME.link('mrip', 'NOAA’s Marine Recreational Information Program (MRIP)') + ' corrected estimates, posted Aug 31, 2026, as presented by ASGA on Sept 22, 2026.</p>');

    /* ---------------- pointer and keys on the map ---------------- */
    /* a tap picks the state whose sign or marker is nearest the finger (within 40 px), so thin signs and close
       neighbours don't steal taps (UX #5). The sign squashes for one drawing under the finger, and a touch ring
       answers at once (polish B7, B5). */
    function nearest(e) {
      var L = lay(stage), G = geo(L), pt = stage.toLocal(e), best = null, bd = 40 * (stage.upp || 3);
      IDS.forEach(function (id) {
        var g = G[id], dx = Math.max(0, Math.abs(pt.x - g.x) - g.w / 2), dy = Math.max(0, Math.abs(pt.y - g.y) - g.h / 2);
        var d = Math.min(Math.hypot(dx, dy), Math.max(0, Math.hypot(pt.x - g.m[0], pt.y - g.m[1]) - 30));
        if (d < bd) { bd = d; best = id; }
      });
      return best;
    }
    var pressT = 0;
    stage.svg.addEventListener('pointerdown', function (e) {
      if (!st8.turn || (e.target.closest && e.target.closest('[data-hit]'))) return;
      var id = nearest(e); if (!id) return;
      stage.ring(e); if (S.reduce) return;
      st8.press = id;
      // drawn next frame, so the element under the finger stays put for the touchstart that follows
      requestAnimationFrame(function () { if (!stage.anim) stage.render(); });
      clearTimeout(pressT); pressT = setTimeout(function () { st8.press = null; if (!stage.anim) stage.render(); }, 1000 / 12);
    });
    stage.svg.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-hit]')) return;
      var g = e.target.closest && e.target.closest('[data-st]'), id = e.detail === 0 && g ? g.getAttribute('data-st') : nearest(e);
      if (id) userPick(id);
    });
    stage.svg.addEventListener('keydown', function (e) {
      var g = e.target.closest && e.target.closest('[data-st]'); if (!g || !st8.turn) return;
      var i = IDS.indexOf(g.getAttribute('data-st')), j = i;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = Math.min(IDS.length - 1, i + 1);
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = Math.max(0, i - 1);
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = IDS.length - 1;
      else if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault(); userPick(IDS[j]);
    });
    // drag the Striper along the coast; he settles on the nearest state when let go
    var lastMove = 0;
    stage.drag({
      start: function (name) { if (name !== 'fish' || !st8.turn) return false; stop(); st8.tried = true; st8.drag = true; st8.swim = true; st8.pop = 99; stage.render(); },
      move: function (name, pt) {
        var L = lay(stage), STN = stations(L, geo(L)), best = st8.u, bd = 1e9;
        for (var u = 0; u <= IDS.length - 1 + 1e-6; u += 0.05) { var q = along(STN, u), dd = Math.hypot(q[0] - pt.x, q[1] - 130 * L.SS - 90 * L.SS - pt.y); if (dd < bd) { bd = dd; best = u; } }
        if (Math.abs(best - st8.u) > 0.001) st8.dir = best > st8.u ? 1 : -1;
        st8.u = best;
        var now = performance.now(); if (now - lastMove > 83) { lastMove = now; st8.phase++; stage.drawing++; }
        stage.render();
      },
      end: function () { if (!st8.drag) return; st8.drag = false; pick(IDS[Math.round(S.clamp(st8.u, 0, IDS.length - 1))]); }
    });

    /* page styles: every selector under #states */
    var css = document.createElement('style');
    css.textContent =
      '#states svg.stage [role=radio]{cursor:pointer;outline:none}' +
      '#states svg.stage [role=radio] .ring{stroke:none}' +
      '#states svg.stage [role=radio]:focus-visible .ring{stroke:#1E1510;stroke-width:9px}' +
      // laptop: the sign under the pointer lifts 6 units (polish B7)
      '@media (hover:hover){' + IDS.map(function (id) { return '#states svg.stage:has([data-st="' + id + '"]:hover) [data-sg="' + id + '"]'; }).join(',') + '{translate:0 -6px}}' +
      '#states .eq{display:flex;align-items:stretch;justify-content:center;gap:clamp(6px,.9vw,14px)}' +
      '#states .eqyr{display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:clamp(110px,10vw,170px);padding:6px 10px;border-radius:10px;border:3px solid var(--ink);background:var(--ink);color:var(--cream);transform:rotate(-2deg);box-shadow:4px 4px 0 var(--sh-tan)}' +
      '#states .eqyr b{font:400 clamp(24px,2.1vw,34px)/1 var(--f-label);color:var(--mustard)}#states .eqyr small{font:700 clamp(11px,.85vw,13px)/1.1 var(--f-mono);letter-spacing:.04em;text-transform:uppercase;margin-top:3px;white-space:nowrap}' +
      '#states .eqlab{align-self:center;max-width:9em;font:400 clamp(14px,1.05vw,17px)/1.15 var(--f-label);color:var(--brick);text-align:right}' +
      '#states .chip{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:clamp(92px,8.5vw,146px);padding:8px 14px 6px;background:var(--white);border:3px solid var(--ink);border-radius:10px;box-shadow:inset 0 -6px 0 var(--sea),4px 4px 0 var(--sh-tan)}' +
      '#states .chip b{font:700 clamp(26px,2.5vw,42px)/1 var(--f-mono)}#states .chip small{font:400 clamp(13px,1vw,16px)/1.15 var(--f-label);color:var(--muted);margin-top:5px;white-space:nowrap}' +
      '#states .chip.pop{animation:stPop .3s steps(3,end)}@keyframes stPop{0%{transform:scale(1.12)}60%{transform:scale(.97)}100%{transform:none}}' +
      '@media (max-aspect-ratio: 1/1), (max-width: 820px){#states .eq{gap:4px}#states .eqlab{display:none}#states .eqyr{min-width:0;padding:4px 6px}#states .eqyr b{font-size:19px}#states .eqyr small{font-size:9px;white-space:normal;text-align:center}#states .chip{min-width:0;flex:1;padding:5px 4px 4px}#states .chip b{font-size:20px}#states .chip small{font-size:11.5px}}' +
      '#states .fact{position:relative;margin:0;padding:14px 16px 12px 24px;background:var(--white);border:3px solid var(--ink);border-radius:6px;box-shadow:inset 9px 0 0 var(--mustard),4px 5px 0 var(--sh-cream);font-size:16px;text-wrap:pretty}' +
      '#states .fact b{display:block;margin-bottom:4px;font:400 17px/1.1 var(--f-label);color:var(--brick)}' +
      '#states .fact.on{animation:statesFact .42s steps(5,end)}' +
      '@keyframes statesFact{0%{transform:scale(.6);opacity:0}40%{transform:scale(1.06);opacity:1}70%{transform:scale(.97)}100%{transform:scale(1)}}' +
      '@media (prefers-reduced-motion: reduce){#states .fact.on,#states .chip.pop{animation:none}}';
    document.head.appendChild(css);

    // the idle heartbeat (SITE.idle): the boil, the waves, the cattails, the blinks and the hint's bob between moments
    S.idle(api.stageHost, function () { stage.drawing++; stage.render(); }, function () { return !!stage.anim || st8.drag; });
    snap(0);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting) reveal(); }, { threshold: 0.35 }).observe(api.stageHost);
    else { st8.reveal = 99; st8.revealed = true; }
    document.addEventListener('site:fonts', function () { stage.render(); });
  }
});
