/* 1. The count: trips x fish per trip = total catch (the film's s03 multiplier, 0:28 to 0:47).
   A scrolly page (Luyen's review, Sep 26): one page scroll, the picture pinned, six short step cards that
   walk through the idea before any controls appear. The film's split screen hangs above the dock: the
   mail survey window (the householder, his house, skiff and mailbox) feeds the machine's left funnel with
   TRIPS, the ramp survey window (Dot polling the ramp angler) feeds its right one with FISH PER TRIP.
   Steps: exit polls; the mail survey counts trips (13.9M in 2025); the dock interviews give fish per trip
   (about one); the machine cranks out the total catch (13.2M); the corrected mail survey sends 11.6M
   trips; the machine cranks again (10.4M). Each step spotlights its part of the picture. Then it's the
   reader's turn: a year picker (paired bars, old beside corrected total catch, 2000 to 2025), Old count
   or Corrected, and the crank (drag the red knob round, or press Turn the crank).
   No fish-per-trip number is shown on the machine or in the readout: NOAA multiplies state by state,
   wave by wave and mode by mode, so the year's average fish per trip shifts a little between the counts
   even though the interviews are the same, and a number that changed confused readers. The step text
   gives "about one per trip" for 2025 and the details explain the rest. */
SITE.register({
  id: 'count', short: 'The count', title: 'Trips × fish per trip', scrolly: true,
  build: function (api) {
    var S = SITE, K = S.K, C = S.C, INK = C.ink, D = RC.series, Y = RC.years, N = S.N, path = S.path;
    var Y25 = Y.indexOf(2025), P0 = Y.indexOf(2000);
    var st8 = { fixed: false, i: Y25, ang: 0, turn: 0, out: { old: false, fixed: false }, tried: false,
      sPose: 'ready', stamped: false, auto: 0, blinkWho: 0, dragging: false, shownT: false, shownF: false,
      showT: false, showF: false, focus: null, play: false, banner: false, kitLine: null };
    // scripted moments, counted in held drawings (12 a second); -1 = not playing
    var T = { lob: -1, ding: -1, stamp: -1, env: -1, tap: -1, dropT: -1, dropF: -1, ghost: -1, kit: -1, cheer: -1, flip: -1, blink: -1, hh: -1, back: -1, inT: -1, inF: -1, fz: -1, ban: -1 };
    var LEN = { lob: 5, ding: 30, stamp: 5, env: 10, tap: 18, dropT: 5, dropF: 7, ghost: 4, kit: 22, cheer: 16, flip: 2, blink: 2, hh: 14, back: 4, inT: 7, inF: 7, fz: 3, ban: 4 };
    function vals(i, fixed) {
      var to = D.trips.old[i], tf = D.trips.fixed[i];
      var co = D.kept.old[i] + D.released.old[i], cf = D.kept.fixed[i] + D.released.fixed[i];
      return { tripsOld: to, trips: fixed ? tf : to, catchOld: co, catchNew: cf, catch: fixed ? cf : co };
    }
    function key() { return st8.fixed ? 'fixed' : 'old'; }

    /* ---------------- page CSS: the readout under the picture, the controls, the crank button ---------------- */
    var css = document.createElement('style');
    css.textContent =
      // the readout: [year] [trips] x [fish per trip] = [total catch]
      '#count .eq{display:flex;align-items:stretch;justify-content:center;gap:clamp(6px,.9vw,14px)}' +
      '#count .eqyr{display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:clamp(78px,7vw,112px);padding:6px 10px;border-radius:10px;border:3px solid var(--ink);background:var(--ink);color:var(--cream);transform:rotate(-2deg);box-shadow:4px 4px 0 var(--sh-tan)}' +
      '#count .eqyr b{font:400 clamp(24px,2.1vw,34px)/1 var(--f-label);color:var(--mustard)}' +
      '#count .eqyr small{font:700 clamp(11px,.8vw,13px)/1.1 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;margin-top:3px}' +
      '#count .eq.cor .eqyr{background:var(--seaDeep)}' +
      '#count .chip{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:clamp(92px,9vw,156px);padding:8px 14px 6px;background:var(--white);border:3px solid var(--ink);border-radius:10px;box-shadow:4px 4px 0 var(--sh-tan);transition:background .1s}' +
      '#count .chip b{font:700 clamp(26px,2.5vw,42px)/1 var(--f-mono);font-variant-numeric:tabular-nums}' +
      '#count .chip small{font:400 clamp(14px,1.05vw,17px)/1.15 var(--f-label);color:var(--muted);margin-top:5px;white-space:nowrap}' +
      '#count .chip.cor{background:var(--sea);color:var(--cream)}' +
      '#count .chip.cor small{color:var(--cream)}' +
      '#count .chip .fish{display:none;width:clamp(54px,4.6vw,78px);height:clamp(28px,2.4vw,40px);background:var(--fish) no-repeat center/contain}' +
      '#count .chip.known .fish{display:block}#count .chip.known b{display:none}' +
      '#count .op{align-self:center;font:400 clamp(30px,2.8vw,46px)/1 var(--f-title)}' +
      '#count .chip.pop{animation:countPop .3s steps(3,end)}' +
      '@keyframes countPop{0%{transform:scale(1.14)}60%{transform:scale(.97)}100%{transform:none}}' +
      '#count.playing .chip b{font-size:clamp(22px,1.8vw,30px)}#count.playing .chip{padding:5px 12px 4px}#count.playing .eqyr b{font-size:clamp(20px,1.6vw,26px)}' +
      '#count.playing .chip .fish{height:26px}#count.playing .op{font-size:clamp(24px,2vw,34px)}' +
      // the controls row: the year picker, then Old / Corrected and the crank
      '#count .sc-play{align-items:flex-end}' +
      '#count .ppick{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}' +
      '#count .phead{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;font:400 16px/1.2 var(--f-label)}' +
      '#count .phead b{font:700 16px/1 var(--f-mono)}#count .phead .yr{font:400 19px/1 var(--f-label);color:var(--brick)}' +
      '#count .sw{display:inline-block;width:12px;height:14px;margin-right:5px;border:2px solid var(--ink);border-radius:2px;vertical-align:-2px}#count .sw.o{background:var(--silver)}#count .sw.c{background:var(--sea)}' +
      '#count .pctl{display:flex;flex-direction:column;gap:8px;width:clamp(210px,17vw,262px)}' +
      '#count .crankbtn .sm{display:none}' +
      '#count .pctl .seg{padding:4px;gap:4px}' +
      '#count .crankbtn{min-height:48px;padding:6px 18px 6px 10px;font-size:18px;justify-content:center}' +
      '#count .crankbtn i{display:block;width:34px;height:34px;flex:none;border-radius:50%;background:var(--mustard);border:3px solid var(--ink);position:relative;box-shadow:inset -4px -4px 0 var(--sh-mustard)}' +
      '#count .crankbtn i::before{content:"";position:absolute;left:50%;top:50%;width:5px;height:15px;margin:-15px 0 0 -2.5px;background:var(--brown);border:2px solid var(--ink);border-radius:3px;transform-origin:50% 100%;transform:rotate(var(--crk,0deg))}' +
      '#count .crankbtn i::after{content:"";position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:var(--brick);border:2px solid var(--ink);transform:rotate(var(--crk,0deg)) translateY(-13px)}' +
      '#count .crankbtn[aria-busy="true"] i::before,#count .crankbtn[aria-busy="true"] i::after{animation:countCrk .5s steps(6,end) infinite}' +
      '@keyframes countCrk{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}' +
      '#count .crankbtn[aria-busy="true"] i::after{animation-name:countCrkK}' +
      '@keyframes countCrkK{from{transform:rotate(0deg) translateY(-13px)}to{transform:rotate(360deg) translateY(-13px)}}' +
      '#count .navrow .btn.nudge{animation:countNudge 1.2s steps(6,end) 3}' +
      '@keyframes countNudge{0%,100%{transform:translateY(0)}20%{transform:translateY(-6px)}40%{transform:translateY(0)}60%{transform:translateY(-3px)}}' +
      '@media (max-aspect-ratio: 1/1), (max-width: 820px){' +
        '#count .eqyr{min-width:58px;padding:4px 6px}#count .eqyr b{font-size:19px}#count .eqyr small{font-size:9.5px}' +
        '#count .chip{min-width:0;flex:1;padding:5px 4px 4px;box-shadow:3px 3px 0 var(--sh-tan)}#count .chip b,#count.playing .chip b{font-size:19px}#count .chip small{font-size:12px}' +
        '#count .chip .fish,#count.playing .chip .fish{width:40px;height:19px}#count .op,#count.playing .op{font-size:22px}#count .eq{gap:4px}' +
        '#count.playing .eq{display:none}' +
        '#count .pctl{width:auto;flex-direction:row;align-items:stretch}#count .pctl .ctl{flex:1;min-width:0}#count .pctl .seg{flex-wrap:nowrap}#count .pctl .seg button{flex:1 1 0;min-height:42px;padding:4px 6px;font-size:15px;white-space:nowrap}' +
        '#count .crankbtn{flex:none;min-height:0;font-size:16px;padding:4px 14px 4px 8px;gap:6px}#count .crankbtn i{width:28px;height:28px}#count .crankbtn .lg{display:none}#count .crankbtn .sm{display:inline}' +
        '#count .ycols{height:50px}#count .sc-play{flex-direction:column-reverse}' +
        '#count .phead{font-size:14px;gap:2px 10px}#count .phead b{font-size:14px}#count .phead .yr{font-size:16px}' +
      '}' +
      '@media (prefers-reduced-motion: reduce){#count .crankbtn[aria-busy="true"] i::before,#count .crankbtn[aria-busy="true"] i::after,#count .navrow .btn.nudge,#count .chip.pop{animation:none}}';
    document.head.appendChild(css);

    /* ---------------- layout: laptop (1920 x 1080..1320, anchored to the planks) and phone (1080 x 1250) ---------------- */
    function lay(st) {
      if (!st.port) {
        var dy = st.h - 1080, k = S.clamp(dy / 240, 0, 1), py = Math.round(dy * 0.1), FL = 985 + dy, MS = 0.95 + 0.15 * k;
        return { port: false, W: 1920, H: st.h, k: k, FL: FL, MS: MS, MX: 960, hz: 566 + py + Math.round(dy * 0.2), dock: 690 + py + Math.round(dy * 0.4),
          LP: { x: 30, y: 112 + py, w: 902, h: 420 }, RP: { x: 988, y: 112 + py, w: 902, h: 420 }, banY: 58 + py, poleTop: 96 + py,
          KX: 1752, KS: 0.8 + 0.1 * k, CW: 340, CH: 232, hs: 38, ns: 96, fs: 36,
          oldSpot: [214, FL - 122], newSpot: [562, FL - 122],
          inW: [240, 270], inH: 152, inHs: 38, inNs: 72, inY: FL - 420 * MS - 58, inX: [960 - 112 * MS - 24, 960 + 112 * MS + 30], inRot: [-5, 5],
          plate: [150, 76, 62], tag: 40, say: 44, sayW: 470 };
      }
      var FLp = 1170, MSp = 0.78;
      return { port: true, W: 1080, H: 1250, k: 0, FL: FLp, MS: MSp, MX: 432, hz: 424, dock: 532,
        LP: { x: 14, y: 16, w: 518, h: 396 }, RP: { x: 548, y: 16, w: 518, h: 396 }, poleTop: 10,
        KX: 980, KS: 0.62, CW: 252, CH: 206, hs: 44, ns: 80, fs: 44,
        oldSpot: [148, FLp - 108], newSpot: [154, FLp - 336],
        inW: [214, 306], inH: 150, inHs: 44, inNs: 66, inY: 650, inX: [330, 600], inRot: [-4, 4],
        plate: [176, 84, 66], tag: 44, say: 44, sayW: 330 };
    }
    function hub(L) { return [L.MX + 182 * L.MS, L.FL - 230 * L.MS]; }
    function orbit(L) { return [L.MX + 200 * L.MS, L.FL - 230 * L.MS]; }       // the knob's circle (it rides 18 px off the arm)
    function slot(L) { return [L.MX + 150 * L.MS, L.FL - 118 * L.MS]; }

    /* ---------------- small drawing helpers ---------------- */
    function rect(x, y, w, h, fill, sw, rx, extra) {
      return '<rect x="' + N(x) + '" y="' + N(y) + '" width="' + N(w) + '" height="' + N(h) + '" rx="' + (rx || 0) + '" fill="' + (fill || 'none') + '"' +
        (sw ? ' stroke="' + INK + '" stroke-width="' + sw + '" stroke-linejoin="round"' : '') + (extra || '') + '/>';
    }
    function circ(x, y, r, fill, sw) { return '<circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r) + '" fill="' + fill + '"' + (sw ? ' stroke="' + INK + '" stroke-width="' + sw + '"' : '') + '/>'; }
    function tube(d, w, fill, sw) {
      return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w + 2 * sw) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    function grp(inner, tr) { return '<g transform="' + tr + '">' + inner + '</g>'; }
    function flap(d) { return d % 3 === 2 ? 'closed' : (d % 3 === 0 ? 'open' : 'mid'); }
    function blinkOf(who) { return T.blink >= 0 && st8.blinkWho === who; }
    /* a tag hanging on a 5 px ink string from a pin at (ax, ay) */
    function hang(ax, ay, o) {
      var h = o.h || 110;
      return path('M' + N(ax) + ',' + N(ay) + ' L' + N(o.x) + ',' + N(o.y - h / 2 + 6), 'none', 5) + '<circle cx="' + N(ax) + '" cy="' + N(ay) + '" r="8" fill="' + C.cream + '" stroke="' + INK + '" stroke-width="4"/>' + S.tag(o);
    }
    /* the film's cloth banner (s03), fully unrolled */
    function banner(str, cx, cy, w, size) {
      var h = size * 1.7, x0 = cx - w / 2;
      return rect(x0, cy - h / 2, w, h, C.cream, 7, 6) + rect(x0 + 6, cy + h / 2 - 16, w - 12, 10, S.HALF.cream, 0) +
        K.text(str, cx, cy + size * 0.36, { size: size, font: 'label', fill: C.brick }) +
        rect(x0 - 16, cy - h / 2 - 12, 22, h + 24, C.brown, 6, 8) + rect(x0 + w - 8, cy - h / 2 - 12, 22, h + 24, C.brown, 6, 8);
    }

    /* ---------------- the film's split screen (scenes/s03-surveys.js), drawn in the film's coordinates ---------------- */
    var F_LP = { x: 30, y: 112 }, F_RP = { x: 988, y: 112 }, LG = 492, RG = 482, MBX = 382;
    function house() {
      var s = '';
      s += rect(44, -262, 30, 70, C.brick, 7, 3);
      s += rect(0, -162, 238, 162, C.cream, 8, 4);
      s += rect(8, -60, 222, 56, S.HALF.cream, 0);
      s += path('M-22,-158 L119,-270 L260,-158 Z', C.brick, 8);
      s += path('M-4,-164 L119,-262', 'none', 8, '', S.HI.brick);
      s += rect(34, -90, 48, 90, INK, 0, 3);
      s += path('M34,-90 L12,-98 L12,6 L34,0 Z', C.brown, 6) + circ(19, -44, 3.5, INK, 0) + rect(34, -90, 48, 90, 'none', 7, 3);
      s += rect(34, -8, 48, 8, C.tan, 5, 2);
      s += rect(110, -132, 52, 46, C.sky, 6, 3) + path('M136,-132 L136,-86 M110,-109 L162,-109', 'none', 5);
      s += rect(180, -132, 44, 46, C.sky, 6, 3) + path('M202,-132 L202,-86', 'none', 5);
      return grp(s, 'translate(66 468) scale(0.93)');
    }
    function boatTrailer(x, y, sc) {
      var s = '';
      s += tube('M-96,-34 L150,-30', 7, C.brown, 3.5);
      s += path('M150,-30 L150,-8', 'none', 6) + circ(150, -6, 6, C.gray, 3.5) + path('M140,-30 l18,0', 'none', 9);
      s += circ(62, -18, 18, INK, 0) + circ(62, -18, 7, C.silver, 3.5) + path('M32,-30 Q34,-54 62,-54 Q90,-54 92,-30 Z', C.silver, 5);
      s += tube('M-104,-86 L-104,-26', 7, C.gray, 3.5) + path('M-116,-26 l24,0 M-104,-26 l0,12', 'none', 5);
      s += rect(-128, -128, 44, 46, C.gray, 6, 12) + path('M-122,-110 L-92,-110', 'none', 4);
      s += path('M-96,-98 L84,-98 Q126,-100 132,-112 Q128,-70 96,-44 L-92,-44 Z', C.white, 7);
      s += path('M-92,-72 L112,-72', 'none', 9, '', C.orange) + path('M-94,-66 L108,-66 M-94,-78 L118,-78', 'none', 3.4);
      s += path('M-10,-98 L6,-122 L44,-122 L52,-98', C.sky, 5);
      return grp(s, 'translate(' + N(x) + ' ' + N(y) + ') scale(' + sc + ')');
    }
    function shrub(x, y, sc) {
      var s = path('M-58,0 Q-74,-34 -40,-48 Q-34,-84 2,-80 Q34,-92 48,-58 Q76,-44 60,0 Z', C.avocado, 7);
      s += path('M-30,-40 q10,-8 20,0 M16,-56 q10,-8 20,0 M-4,-22 q10,-8 20,0', 'none', 4);
      return grp(s, 'translate(' + N(x) + ' ' + N(y) + ') scale(' + sc + ')');
    }
    function panelCloud(x, y, sc) {
      return grp('<path d="M0,22 q18,-34 58,-22 q26,-30 66,-6 q38,-6 38,28 Z" fill="' + C.white + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M6,22 L156,22 L154,14 Q90,20 10,14 Z" fill="' + S.HALF.white + '"/>', 'translate(' + N(x) + ' ' + N(y) + ') scale(' + sc + ')');
    }
    /* the householder: reading his form; 'mail' with the letter when the flag snaps; 'think' now and then */
    function householderO() {
      var o = { x: 232, y: LG, scale: 0.42, blink: blinkOf(3) };
      if (T.env >= 0 && T.env < 3) { o.pose = 'mail'; o.frame = T.env < 2 ? 1 : 0; }
      else if (T.env >= 3) { o.pose = 'mail'; o.frame = 0; o.look = [0.9, -0.6]; }
      else if (T.hh >= 0) { o.pose = 'think'; o.frame = (T.hh >> 1) % 2; }
      else { o.pose = 'read'; o.frame = T.back >= 0 ? (T.back >> 1) % 2 : 0; }
      return o;
    }
    function mailScene() {
      var s = rect(30, 112, 902, 420, C.sky);
      s += rect(30, 112, 902, 150, '#6BB5CF') + panelCloud(640, 180, 1);
      s += rect(20, 464, 922, 120, C.olive, 6) + rect(24, 468, 914, 14, S.HI.olive, 0);
      s += '<path d="M100,467 L141,467 L258,494 L186,494 Z" fill="' + C.cream + '" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' +
        '<path d="M116,473 L150,473 M136,480 L181,480 M160,487 L218,487" stroke="' + C.tan + '" stroke-width="3" stroke-linecap="round"/>';
      s += S.cel(house()) + S.cel(boatTrailer(256, LG, 0.7));
      s += S.shadow(232, LG + 2, 110, 'olive') + K.householder(householderO());
      var fl = st8.fixed ? (T.env === 0 ? 0.5 : 1) : 0;
      s += S.cel(K.mailbox({ x: MBX, y: LG, scale: 0.62, flag: fl, door: T.env >= 0 && T.env < 6 ? 1 : 0 })) + shrub(MBX + 30, LG + 2, 0.5);
      return s;
    }
    function mailForm() {
      var x = 486, y = 128, w = 400, h = 300, cx = x + w / 2, s = '';
      s += rect(x + 8, y + 10, w, h, INK, 0, 8, ' opacity=".15"') + rect(x, y, w, h, C.paper, 7, 8) + rect(x + 7, y + h - 44, w - 14, 37, S.HALF.paper, 0, 4);
      s += K.text('MAIL SURVEY:', cx, y + 56, { size: 46, font: 'label' });
      s += K.text('HOW MANY', cx, y + 106, { size: 42, font: 'label' });
      s += K.text('FISHING TRIPS?', cx, y + 152, { size: 42, font: 'label' });
      var d = '', bx = '';
      for (var i = 0; i < 3; i++) { var yy = y + 196 + i * 32; bx += rect(x + 28, yy - 16, 22, 22, C.white, 3.5, 3); d += 'M' + N(x + 66) + ',' + N(yy) + ' q20,-6 40,0 t40,0 t40,0 t40,0 '; }
      s += bx + path(d, 'none', 3.2) + path('M' + N(x + 30) + ',' + N(y + 188) + ' l8,10 l14,-18', 'none', 4.5);
      return s;
    }
    function dotO() {
      var o = { x: 1750, y: RG + 6, scale: 0.46, flip: true, pose: 'clipboard', blink: blinkOf(2), look: [1, -0.05] };
      if (T.tap >= 0) { o.pose = 'tap'; o.frame = (T.tap >> 1) % 2; o.look = [0.4, 0.75]; }
      return o;
    }
    function rampScene() {
      var s = rect(988, 112, 1200, 420, C.sky) + rect(988, 112, 1200, 150, '#6BB5CF') + panelCloud(1060, 170, 0.8);
      s += path('M1560,462 Q1640,420 1760,428 Q1850,432 1910,418 Q1990,410 2100,420 L2100,470 L1560,470 Z', C.sand, 5);
      s += tube('M1740,450 L1756,410', 3.5, C.brown, 2) + path('M1756,410 q16,20 14,48', 'none', 2);
      s += tube('M1782,446 L1798,406', 3.5, C.brown, 2) + path('M1798,406 q14,20 10,46', 'none', 2);
      s += K.waves(456, 6, 110, C.sea, 0);
      s += path('M970,' + RG + ' L1748,' + RG + ' L1900,548 L1900,600 L970,600 Z', C.tan, 7) + rect(972, RG + 4, 770, 10, S.HI.tan, 0);
      s += path('M1110,' + (RG + 22) + ' L1180,' + (RG + 22) + ' M1560,' + (RG + 26) + ' L1630,' + (RG + 26) + ' M1790,516 L1840,526', 'none', 4);
      s += '<path d="M1772,508 q25,-10 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 L2100,600 L1772,600 Z" fill="' + C.sea + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>';
      s += S.cel(K.piling({ x: 1852, y: 600, h: 250, r: 24 }));
      s += S.shadow(1484, RG + 4, 150) + S.cel(K.cooler({ x: 1484, y: RG + 2, scale: 0.55, open: 0.34 }));
      s += S.shadow(1592, RG + 4, 110) + K.rampAngler({ x: 1592, y: RG, scale: 0.43, pose: 'stand', look: [1, -0.05], blink: blinkOf(4) });
      s += S.shadow(1750, RG + 8, 110) + K.dot(dotO());
      // three fish on her clipboard: the answer to "what did you catch?"
      var c = K.dotPoints({ x: 1750, y: RG + 6, scale: 0.46, flip: true, pose: 'clipboard' }).clip;
      [[0, -19], [-6, -2], [4, 15]].forEach(function (p, i) { s += K.fishIcon({ x: c[0] + p[0], y: c[1] + p[1], size: 0.5, rot: 6 - i * 4, flip: true }); });
      return s;
    }
    function rampSign() {
      var x = 1226, y = 200;
      return grp(rect(-222, -64, 444, 128, INK, 0, 14, ' opacity=".15" transform="translate(7 9)"') + rect(-222, -64, 444, 128, C.cream, 7, 14) + rect(-215, 28, 430, 30, S.HALF.cream, 0, 6) +
        K.text('RAMP SURVEY:', 0, -12, { size: 46, font: 'label' }) + K.text('WHAT DID YOU CATCH?', 0, 40, { size: 40, font: 'label' }), 'translate(' + x + ' ' + y + ') rotate(-1.5)') +
        path('M1156,264 L1150,296 M1296,262 L1302,296', 'none', 5) + K.tag('AT RAMPS AND BEACHES', 1226, 318, { size: 36, rot: 1.5 });
    }
    /* the panel frame: a chunky 70s screen with a cream bezel, content clipped inside */
    function frame(P, id, content, flash) {
      var ix = P.x + 14, iy = P.y + 14, iw = P.w - 28, ih = P.h - 28, s = '';
      s += rect(P.x + 8, P.y + 10, P.w, P.h, S.SH.sky, 0, 34, ' opacity=".55"');
      s += rect(P.x, P.y, P.w, P.h, flash ? C.mustard : C.cream, 7, 34) + path('M' + N(P.x + 30) + ',' + N(P.y + 7) + ' L' + N(P.x + P.w - 30) + ',' + N(P.y + 7), 'none', 4, '', S.HI.cream);
      s += '<clipPath id="' + id + '"><rect x="' + ix + '" y="' + iy + '" width="' + iw + '" height="' + ih + '" rx="22"/></clipPath>';
      s += '<g clip-path="url(#' + id + ')">' + content + (flash ? rect(ix, iy, iw, ih, C.white, 0, 0, ' opacity=".2"') : '') + '</g>';
      s += rect(ix, iy, iw, ih, 'none', 6, 22);
      return s;
    }
    /* where a film-space point of the mail panel lands on this stage */
    function mailMap(L) {
      if (!L.port) { var oy = L.LP.y - F_LP.y; return { k: 1, tx: 0, ty: oy, tr: 'translate(0 ' + oy + ')' }; }
      var k = 0.8, tx = L.LP.x + (L.LP.w - 430 * k) / 2 - 36 * k, ty = L.LP.y + L.LP.h - 22 - LG * k;
      return { k: k, tx: tx, ty: ty, tr: 'translate(' + N(tx) + ' ' + N(ty) + ') scale(' + k + ')' };
    }
    function rampMap(L) {
      if (!L.port) { var oy = L.RP.y - F_RP.y; return { k: 1, tx: 0, ty: oy, tr: 'translate(0 ' + oy + ')' }; }
      var k = 0.8, tx = L.RP.x + 18 - 1380 * k, ty = L.RP.y + L.RP.h - 18 - RG * k;
      return { k: k, tx: tx, ty: ty, tr: 'translate(' + N(tx) + ' ' + N(ty) + ') scale(' + k + ')' };
    }
    function mapPt(m, p) { return [m.tx + p[0] * m.k, m.ty + p[1] * m.k]; }
    /* on phones each window carries its question as one big paper header */
    function phoneHeader(P, a, b) {
      var cx = P.x + P.w / 2, y = P.y + 22, w = P.w - 44, h = 118;
      return rect(cx - w / 2 + 6, y + 8, w, h, INK, 0, 8, ' opacity=".15"') + rect(cx - w / 2, y, w, h, C.paper, 6, 8) + rect(cx - w / 2 + 6, y + h - 26, w - 12, 20, S.HALF.paper, 0, 4) +
        K.text(a, cx, y + 50, { size: 46, font: 'label' }) + K.text(b, cx, y + 100, { size: 44, font: 'label' });
    }
    function windows(L) {
      var s = '', mm = mailMap(L), rm = rampMap(L);
      var mail = grp(mailScene() + (L.port ? '' : mailForm()), mm.tr);
      var ramp = grp(rampScene(), rm.tr);
      if (L.port) { mail += phoneHeader(L.LP, 'MAIL SURVEY:', 'HOW MANY TRIPS?'); ramp += phoneHeader(L.RP, 'RAMP SURVEY:', 'WHAT DID YOU CATCH?'); }
      var flL = T.env >= 0 && T.env < 3, flR = T.dropF >= 0 && T.dropF < 3;
      s += frame(L.LP, 'cntL', mail, flL) + frame(L.RP, 'cntR', ramp, flR);
      if (!L.port) s += grp(rampSign(), rm.tr);
      return s;
    }

    /* ---------------- the machine and its cards ---------------- */
    function inCard(x, y, w, h, head, num, o) {
      o = o || {};
      var cor = o.style === 'corrected', fill = cor ? C.sea : C.cream, col = cor ? C.cream : INK, s = '';
      var hs = o.hs, ns = o.ns, heads = [].concat(head);
      s += rect(-w / 2 + 7, -h / 2 + 9, w, h, INK, 0, 14, ' opacity=".15"');
      s += rect(-w / 2, -h / 2, w, h, fill, 7, 14);
      s += rect(-w / 2 + 7, h / 2 - 30, w - 14, 23, cor ? S.SH.sea : S.HALF.cream, 0, 6);
      var y0 = -h / 2 + 12;
      heads.forEach(function (t, i) { s += K.text(t, 0, y0 + hs * 0.86 * (i + 1) + i * 4, { size: hs, font: 'label', fill: cor ? C.cream : C.brick }); });
      var top = y0 + heads.length * (hs * 0.86 + 4) + 4, mid = (top + h / 2 - 8) / 2;
      if (o.fish) [-1, 0, 1].forEach(function (k) { s += K.fishIcon({ x: k * w * 0.29 + 4, y: mid + (k === 0 ? -6 : 5), size: w * 0.0029, rot: k * 5 }); });
      else s += K.text(num, 0, mid + ns * 0.3, { size: ns, font: 'label', fill: col });
      if (cor) s += grp(tube('M-30,2 L-8,26 L34,-28', 14, C.cream, 5), 'translate(' + N(w / 2 - 6) + ' ' + N(-h / 2 + 4) + ') scale(0.8)');
      var sq = o.sq || 0;
      return grp(s, 'translate(' + N(x) + ' ' + N(y) + ') rotate(' + (o.rot || 0) + ')' + (sq ? ' scale(' + N((1 + sq) * 1000) / 1000 + ' ' + N((1 - sq) * 1000) / 1000 + ')' : ''));
    }
    function sqOf(t, len) { return t < 0 ? 0 : [0.16, -0.08, 0.05, -0.02, 0, 0, 0, 0][Math.min(7, t)] * (t <= len ? 1 : 0); }
    var FALL = [-300, -170, -60, 0];
    function funnelCards(L) {
      var s = '', dT = T.dropT, dF = T.dropF;
      var yT = L.inY + (dT >= 0 && dT < 1 ? -60 : 0), yF = L.inY + (dF >= 0 && dF < 2 ? -70 + dF * 30 : 0);
      var sqT = sqOf(dT, LEN.dropT), sqF = dF >= 2 ? sqOf(dF - 2, LEN.dropF) : 0;
      // first appearance (steps 1 and 2): the card falls in from above and squashes into the funnel
      if (T.inT >= 0) { yT += FALL[Math.min(3, T.inT)]; sqT = T.inT >= 3 ? sqOf(T.inT - 3, 4) : 0; }
      if (T.inF >= 0) { yF += FALL[Math.min(3, T.inF)]; sqF = T.inF >= 3 ? sqOf(T.inF - 3, 4) : 0; }
      // on phones the cards hover over their funnel mouths, with a dashed drop line into each
      if (L.port) {
        [[L.inX[0], L.MX - 112 * L.MS, st8.showT], [L.inX[1], L.MX + 112 * L.MS, st8.showF]].forEach(function (p) {
          if (p[2]) s += path('M' + N(p[0] + (p[1] - p[0]) * 0.3) + ',' + N(L.inY + L.inH / 2 + 4) + ' L' + N(p[1]) + ',' + N(L.FL - 420 * L.MS - 14), 'none', 6, ' stroke-dasharray="14 12"', C.brown);
        });
      }
      var vt = vals(st8.i, st8.shownT);
      if (st8.showT) s += S.cel(inCard(L.inX[0], yT, L.inW[0], L.inH, 'TRIPS', S.m(vt.trips), { hs: L.inHs, ns: L.inNs, rot: L.inRot[0], style: st8.shownT ? 'corrected' : 'plain', sq: sqT }));
      if (st8.showF) s += S.cel(inCard(L.inX[1], yF, L.inW[1], L.inH, 'FISH PER TRIP', '', { hs: L.inHs, ns: L.inNs, rot: L.inRot[1], sq: sqF, fish: true }));
      return s;
    }
    function cardTags(L, v) {
      if (!st8.shownT) return '';
      var s = '', p = S.pop(T.dropF < 0 ? 99 : Math.max(0, T.dropF - 2), 4);
      var tw = L.port ? 250 : 250, fw = L.port ? 330 : 360;
      var ax = L.inX[0] - L.inW[0] / 2 + 34, ay = L.inY - L.inH / 2 + 12;
      if (L.port) s += hang(220, L.LP.y + L.LP.h - 6, { x: 214, y: 522, w: tw, h: 72, rot: -3, lines: [{ t: 'WAS ' + S.m(v.tripsOld), fill: C.cream }], size: L.tag, fill: C.gray });
      else s += hang(ax, ay, { x: ax - 150, y: ay + 40, w: tw, h: 70, rot: -4, lines: [{ t: 'WAS ' + S.m(v.tripsOld), fill: C.cream }], size: L.tag, fill: C.gray });
      if (p > 0 && st8.shownF) {
        if (L.port) {
          var qy = L.RP.y + L.RP.h - 6;
          s += grp(hang(0, 0, { x: 0, y: 522 - qy, w: fw, h: 72, rot: 3, lines: [{ t: 'SAME INTERVIEWS', fill: C.cream }], size: L.tag, fill: C.avocado }), 'translate(700 ' + N(qy) + ') scale(' + N(p) + ')');
        } else {
          // hang it from the ramp window's rim when there is room under the window, else just above the card
          var px = L.inX[1] + 30, cardTop = L.inY - L.inH / 2 - 8, py = L.RP.y + L.RP.h - 6, ty = Math.max(py + 36, cardTop - 38);
          if (cardTop - py < 80) { ty = cardTop - 40; py = ty - 52; }
          s += grp(hang(0, 0, { x: 10, y: ty - py, w: fw, h: 64, rot: 2, lines: [{ t: 'SAME INTERVIEWS', fill: C.cream }], size: L.tag, fill: C.avocado }), 'translate(' + N(px) + ' ' + N(py) + ') scale(' + N(p) + ')');
        }
      }
      return s;
    }
    /* the film's nameplate read THE MULTIPLIER, which readers took for a second, mystery multiplier: paint
       it out (the big x on the box and the banner say what the machine does) */
    function nameplate(L) {
      var M = L.MS;
      return rect(L.MX - 154 * M, L.FL - 304 * M, 228 * M, 58 * M, C.mustard, 0, 10 * M);
    }
    /* the crank, redrawn over the relettered nameplate (the same geometry as K.multiplier's) */
    function crankTop(L) {
      var M = L.MS, a = crankAngle() * Math.PI / 180, hx = L.MX + 182 * M, hy = L.FL - 230 * M, ax = hx + Math.sin(a) * 64 * M, ay = hy - Math.cos(a) * 64 * M;
      return circ(hx, hy, 16 * M, C.brown, 7 * M) + tube('M' + N(hx) + ',' + N(hy) + ' L' + N(ax) + ',' + N(ay), 12 * M, C.brown, 5 * M) + circ(ax + 18 * M, ay, 15 * M, C.brick, 5.5 * M) + circ(hx, hy, 7 * M, INK, 0);
    }
    /* the year: a flip card bolted to the front of the machine, between the wheels */
    function flipYear(L) {
      var w = L.plate[0], h = L.plate[1], sz = L.plate[2], cx = L.MX, cy = L.FL - 42 * L.MS - (L.port ? 4 : 0), s = '';
      s += rect(cx - w / 2 - 10, cy - h / 2 - 10, w + 20, h + 20, C.brown, 6, 12) + rect(cx - w / 2 - 6, cy + h / 2 - 2, w + 12, 8, S.SH.brown, 0, 4);
      s += rect(cx - w / 2, cy - h / 2, w, h, C.white, 5, 8) + rect(cx - w / 2 + 4, cy + 4, w - 8, h / 2 - 8, S.HALF.white, 0, 4);
      s += K.text(String(Y[st8.i]), cx, cy + sz * 0.3, { size: sz, font: 'label' });
      if (T.flip >= 0) {
        // the top leaf falls over the split in two held drawings
        var f = T.flip, lh = f === 0 ? h / 2 * 0.45 : h / 2 * 0.3;
        s += f === 0 ? rect(cx - w / 2, cy - lh, w, lh, C.paper, 5, 6) : rect(cx - w / 2, cy, w, lh, S.HALF.paper, 5, 6);
      }
      s += path('M' + N(cx - w / 2) + ',' + N(cy) + ' L' + N(cx + w / 2) + ',' + N(cy), 'none', 4);
      s += circ(cx - w / 2 - 2, cy, 6, C.silver, 3.5) + circ(cx + w / 2 + 2, cy, 6, C.silver, 3.5);
      return s;
    }
    /* the catch card: header, number and footer; ghost = gray dashed; placeholder = "?" */
    function catchCard(x, y, L, o) {
      var w = L.CW, h = L.CH, s = '', hs = L.hs, ns = L.ns;
      if (o.kind === 'ghost' || o.kind === 'wait') {
        var ghost = o.kind === 'ghost', gcol = ghost ? '#6E6656' : C.gray;
        s += rect(-w / 2, -h / 2, w, h, C.cream, 0, 16, ' opacity="' + (ghost ? 0.78 : 0.28) + '"');
        s += rect(-w / 2, -h / 2, w, h, 'none', 0, 16, ' stroke="' + gcol + '" stroke-width="7" stroke-dasharray="20 12"');
        s += K.text(ghost ? 'OLD COUNT' : 'TOTAL CATCH', 0, -h / 2 + 18 + hs * 0.86, { size: fitHead(ghost ? 'OLD COUNT' : 'TOTAL CATCH', w, hs), font: 'label', fill: gcol });
        s += K.text(ghost ? o.num : '?', 0, (ghost ? 8 : 18) + ns * 0.3, { size: ghost ? ns : ns * 1.1, font: ghost ? 'label' : 'title', fill: gcol });
        if (ghost) s += K.text(o.foot, 0, h / 2 - 20, { size: L.fs, font: 'label', fill: gcol });
      } else {
        s += rect(-w / 2 + 8, -h / 2 + 10, w, h, INK, 0, 16, ' opacity=".15"');
        s += rect(-w / 2, -h / 2, w, h, C.cream, 7, 16) + rect(-w / 2 + 7, -h / 2 + 7, w - 14, hs + 18, S.HI.cream, 0, 10);
        s += rect(-w / 2 + 7, h / 2 - 34, w - 14, 27, S.HALF.cream, 0, 8);
        s += K.text('TOTAL CATCH', 0, -h / 2 + 18 + hs * 0.86, { size: fitHead('TOTAL CATCH', w, hs), font: 'label', fill: C.brick });
        s += K.text(o.num, 0, 8 + ns * 0.3, { size: ns, font: 'label' });
        if (!o.stamp) s += K.text(o.foot, 0, h / 2 - 20, { size: L.fs, font: 'label', fill: C.brown });
      }
      var sq = o.sq || [1, 1], rot = o.rot || 0;
      return grp(s, 'translate(' + N(x) + ' ' + N(y + h / 2) + ') rotate(' + rot + ') scale(' + N(sq[0] * 1000) / 1000 + ' ' + N(sq[1] * 1000) / 1000 + ') translate(0 ' + N(-h / 2) + ')');
    }
    function fitHead(t, w, hs) { return Math.min(hs, (w - 30) / (t.length * 0.56)); }
    function stampOn(L, x, y) {
      var p = T.stamp >= 0 ? [1.9, 0.86, 1.08, 1, 1, 1][Math.min(5, T.stamp)] : 1;
      return K.stampMark({ x: x, y: y + L.CH / 2 - (L.port ? 28 : 32), label: 'CORRECTED', color: C.sea, size: 44, rot: -5, scale: p });
    }
    function spots(L) { var o = L.oldSpot, n = L.newSpot; return { old: o, fixed: n }; }
    function restingCards(L, v) {
      var s = '', sp = spots(L), yr = 'IN ' + Y[st8.i];
      var inAir = T.lob >= 0;
      // the old spot: the old card, its gray ghost (corrected mode), or a "?" until the first crank
      var o = sp.old;
      if (st8.fixed) {
        if (T.ghost >= 0 && T.ghost < 2) {
          s += S.shadow(o[0], L.FL - 2, L.CW) + catchCard(o[0], o[1], L, { num: S.m(v.catchOld), foot: yr, rot: -2 });
          if (T.ghost === 1) s += rect(o[0] - L.CW / 2, o[1] - L.CH / 2, L.CW, L.CH, C.cream, 0, 16, ' opacity=".55"');
        } else s += catchCard(o[0], o[1], L, { kind: 'ghost', num: S.m(v.catchOld), foot: yr, rot: -2 });
        if (T.ghost >= 0 && T.ghost < 4) s += K.puff({ x: o[0] - L.CW * 0.4, y: o[1] - L.CH * 0.4, r: 34 + T.ghost * 6, seed: 3 + T.ghost }) + K.puff({ x: o[0] + L.CW * 0.42, y: o[1] + L.CH * 0.1, r: 26 + T.ghost * 5, seed: 7 });
      } else if (st8.out.old && !inAir) {
        s += S.shadow(o[0], L.FL - 2, L.CW) + catchCard(o[0], o[1], L, { num: S.m(v.catchOld), foot: yr, rot: -2 });
      } else if (!inAir) s += catchCard(o[0], o[1], L, { kind: 'wait', rot: -2 });
      if (st8.fixed) {
        var n = sp.fixed;
        if (st8.out.fixed && !inAir) {
          s += (L.port ? '' : S.shadow(n[0], L.FL - 2, L.CW)) + catchCard(n[0], n[1], L, { num: S.m(v.catchNew), foot: yr, rot: 2, stamp: st8.stamped });
          if (st8.stamped) s += stampOn(L, n[0], n[1]);
        } else if (!inAir) s += catchCard(n[0], n[1], L, { kind: 'wait', rot: 2 });
      }
      return s;
    }
    /* the card rising out of the slot as you crank (toast style), clipped at the slot line */
    function emerging(L, v) {
      if (T.lob >= 0 || st8.turn <= 0) return '';
      var sl = slot(L), p = st8.turn / 360, sc = 0.5, hh = L.CH * sc;
      var cy = sl[1] + hh * (1 - 0.8 * p);
      return '<clipPath id="cntSlot"><rect x="' + N(sl[0] - 300) + '" y="-50" width="600" height="' + N(sl[1] + 50 - 2) + '"/></clipPath>' +
        '<g clip-path="url(#cntSlot)">' + grp(catchCard(0, -L.CH / 2, L, { num: S.m(v.catch), foot: '' }), 'translate(' + N(sl[0]) + ' ' + N(cy) + ') scale(' + sc + ') rotate(-4)') + '</g>' +
        rect(sl[0] - 54 * L.MS, sl[1] - 10 * L.MS, 108 * L.MS, 20 * L.MS, INK, 0, 6);
    }
    /* the pop and lob: slot, apex over the machine, coming down, landing squash, rest */
    function lobbing(L, v) {
      if (T.lob < 0) return '';
      var d = T.lob, sl = slot(L), sp = spots(L)[key()], s = '', num = S.m(st8.fixed ? v.catchNew : v.catchOld), yr = 'IN ' + Y[st8.i];
      var rot = st8.fixed ? 2 : -2;
      if (d === 0) {
        s += K.impact({ x: sl[0], y: sl[1] - 30, r: 80 * (L.port ? 0.9 : 1), n: 9, fill: C.mustard });
        s += '<clipPath id="cntSlot2"><rect x="' + N(sl[0] - 300) + '" y="-50" width="600" height="' + N(sl[1] + 48) + '"/></clipPath>';
        s += '<g clip-path="url(#cntSlot2)">' + grp(catchCard(0, -L.CH / 2, L, { num: num, foot: '' }), 'translate(' + N(sl[0]) + ' ' + N(sl[1] + L.CH * 0.12) + ') scale(0.5) rotate(-8)') + '</g>';
        return s + rect(sl[0] - 54 * L.MS, sl[1] - 10 * L.MS, 108 * L.MS, 20 * L.MS, INK, 0, 6);
      }
      if (d <= 2) {
        var apex = [(sl[0] + sp[0]) / 2 + 40, Math.min(sl[1], sp[1]) - (L.port ? 260 : 360)], down = [sp[0] + (sl[0] - sp[0]) * 0.18, sp[1] - (L.port ? 110 : 150)];
        var k = d === 1 ? apex : down, prev = d === 1 ? sl : apex, sc = d === 1 ? 0.78 : 0.95, r = d === 1 ? -16 : -8;
        var dir = [prev[0] - k[0], prev[1] - k[1]], len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]) || 1;
        s += K.speedLines({ x: k[0] + dir[0] / len * L.CW * 0.55, y: k[1] + dir[1] / len * L.CH * 0.5, rot: Math.atan2(-dir[1], -dir[0]) * 180 / Math.PI, len: 130, n: 3, gap: 28, w: 7 });
        s += grp(catchCard(0, 0, L, { num: num, foot: yr }), 'translate(' + N(k[0]) + ' ' + N(k[1]) + ') scale(' + sc + ') rotate(' + r + ')');
        return s;
      }
      var bottom = sp[1] + L.CH / 2;
      if (d === 3) {
        s += K.puff({ x: sp[0] - L.CW * 0.56, y: bottom - 8, r: 26, seed: 2 }) + K.puff({ x: sp[0] + L.CW * 0.56, y: bottom - 8, r: 26, seed: 6 });
        return s + catchCard(sp[0], sp[1], L, { num: num, foot: yr, sq: [1.08, 0.9], rot: rot });
      }
      s += K.puff({ x: sp[0] - L.CW * 0.6, y: bottom - 16, r: 18, seed: 2 }) + K.puff({ x: sp[0] + L.CW * 0.6, y: bottom - 16, r: 18, seed: 6 });
      return s + (L.port && st8.fixed ? '' : S.shadow(sp[0], L.FL - 2, L.CW)) + catchCard(sp[0], sp[1], L, { num: num, foot: yr, rot: rot });
    }
    function ding(L) {
      if (T.ding < 0) return '';
      var sp = spots(L)[st8.out.fixed && st8.fixed ? 'fixed' : 'old'], p = S.pop(T.ding, 4), spin = (T.ding >> 1) % 2 ? 0.14 : 0;
      var x = sp[0] + L.CW * 0.5 + (L.port ? (st8.fixed ? 76 : 20) : 30), y = L.port ? sp[1] + (st8.fixed ? L.CH * 0.22 : -L.CH * 0.5) : sp[1] - L.CH * 0.5 - 20, sc = L.port ? 1.02 : 1.1, s = '';
      s += K.at(x, y, p * sc, 0, K.starburst(0, 0, 96, 60, 12, C.mustard, spin) + K.text('DING', 0, 15, { size: 46, font: 'title', fill: C.cream, stroke: INK, strokeW: 6, rot: -8 }));
      if (T.ding < 14) {
        var tw = (T.ding >> 1) % 2;
        s += K.sparkle({ x: sp[0] - L.CW * 0.52, y: sp[1] - L.CH * 0.6 - tw * 10, r: 30 - tw * 8 }) + K.sparkle({ x: sp[0] - L.CW * 0.1, y: sp[1] - L.CH * 0.75 + tw * 8, r: 20 + tw * 6 });
      }
      return s;
    }
    /* the envelope's flight from the mailbox into the trips funnel */
    function envelope(L) {
      if (T.env < 0 || T.env >= LEN.env) return '';
      var mm = mailMap(L), a = mapPt(mm, [MBX + 70, LG - 128]), b = [L.inX[0], L.inY - 20];
      var c = [(a[0] + b[0]) / 2 + (L.port ? 20 : 60), Math.min(a[1], b[1]) - (L.port ? 150 : 200)];
      var t = S.ease.inOut(Math.min(1, T.env / (LEN.env - 1))), u = 1 - t;
      var x = u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], y = u * u * a[1] + 2 * u * t * c[1] + t * t * b[1];
      var sc = (L.port ? 0.62 : 0.75) * (T.env === 0 ? 0.5 : T.env === 1 ? 1.1 : 1 - 0.3 * t), s = '';
      var vx = 2 * u * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), vy = 2 * u * (c[1] - a[1]) + 2 * t * (b[1] - c[1]), vl = Math.sqrt(vx * vx + vy * vy) || 1;
      if (T.env > 0) s += K.speedLines({ x: x - vx / vl * 130 * sc, y: y - vy / vl * 130 * sc, rot: Math.atan2(vy, vx) * 180 / Math.PI, len: 110, n: 3, gap: 24, w: 6 });
      s += K.envelope({ x: x, y: y, scale: sc, rot: -10 + 24 * t, open: 0 });
      return s;
    }
    /* the drag hint: a dashed arrow round the crank and a tag tied to its hub */
    function hint(L) {
      var s = '', c = orbit(L), R = (64 + 62) * L.MS, h = hub(L);
      var waiting = st8.play && !st8.tried && T.lob < 0 && st8.turn === 0 && st8.auto <= 0 && T.env < 0;
      if (!waiting) return '';
      var d = '', a0 = 196, a1 = 334, rad = Math.PI / 180, bob = (T.blink >= 0 || (stage.drawing >> 1) % 2) ? 6 : 0;
      R += bob;
      for (var a = a0; a <= a1; a += 6) d += (a === a0 ? 'M' : ' L') + N(c[0] + Math.sin(a * rad) * R) + ',' + N(c[1] - Math.cos(a * rad) * R);
      s += tube(d, 12, C.brick, 5);
      var e = [c[0] + Math.sin(a1 * rad) * R, c[1] - Math.cos(a1 * rad) * R], ta = (a1 + 90) * rad, tx = Math.sin(ta), ty = -Math.cos(ta);
      var nx = Math.sin(a1 * rad), ny = -Math.cos(a1 * rad), aw = 30 * L.MS;
      s += '<path d="M' + N(e[0] + tx * aw * 1.6) + ',' + N(e[1] + ty * aw * 1.6) + ' L' + N(e[0] + nx * aw) + ',' + N(e[1] + ny * aw) + ' L' + N(e[0] - nx * aw) + ',' + N(e[1] - ny * aw) + ' Z" fill="' + C.brick + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
      var lbl = 'TURN THE CRANK';
      var tw = lbl.length * L.tag * 0.55 * 0.86 + 60;
      s += hang(h[0], h[1], { x: h[0] + (L.port ? 30 : 60), y: L.FL + (L.port ? 42 : 46), w: tw, h: L.port ? 70 : 68, rot: 3, lines: [lbl], size: L.tag, fill: C.mustard });
      return s;
    }

    /* ---------------- the leads ---------------- */
    function crankAngle() { return Math.round(st8.ang / 15) * 15; }
    function striperO(L) {
      var base = K.crankStage({ x: L.MX, y: L.FL, scale: L.MS, frame: 0 }).striper, q = crankAngle();
      var o = { x: base.x, y: base.y, scale: L.MS, flip: true, blink: blinkOf(0) };
      if (st8.sPose === 'tip') { o.pose = 'tipBack'; o.expr = 'happy'; o.look = [0.2, 0.3]; return o; }
      var f = Math.floor((((q % 360) + 360) % 360 + 60) / 120) % 3;
      o.pose = 'crank'; o.frame = f; o.reach = K.multiplierKnob({ x: L.MX, y: L.FL, scale: L.MS, crank: q / 360 });
      if (st8.sPose === 'ready') { o.expr = 'kind'; o.look = 'cam'; }
      return o;
    }
    function kitO(L) {
      var o = { x: L.KX, y: L.FL, scale: L.KS, flip: true, blink: blinkOf(1), pose: 'neutral', expr: 'eager', look: [1, 0.12] };
      var talk = T.kit >= 0 && T.kit < LEN.kit - 4;
      if (T.env >= 0 && T.env < LEN.env) { o.pose = 'point'; o.aim = -36; o.expr = 'wide'; o.look = [1, -0.6]; o.blink = false; }
      else if (st8.kitLine === 'why') { o.pose = 'think'; o.expr = 'tilt'; o.q = true; if (talk) o.mouth = flap(T.kit); }
      else if (st8.kitLine === 'fewer') { o.pose = 'point'; o.aim = 6; o.expr = 'talk'; o.mouth = talk ? flap(T.kit) : 'closed'; o.look = [1, 0.2]; }
      else if (T.cheer >= 0) { o.pose = 'cheer'; o.expr = 'grin'; }
      else if (st8.turn > 0 || T.lob >= 0 || st8.auto > 0) { o.expr = 'wide'; o.look = [1, 0.3]; }
      return o;
    }
    function balloons(L) {
      if (!st8.kitLine) return '';
      var ko = kitO(L), m = K.kidPoints(ko).mouth, line = st8.kitLine === 'why' ? 'But why were there too many trips?' : 'Fewer trips in, smaller catch out.';
      var bx = L.port ? 900 : L.KX - 110, by = L.port ? 700 : L.FL - 560 * L.KS - 150;
      return S.say(line, bx, by, L.sayW, m[0] - (L.port ? 10 : 20), m[1] - 30, { size: L.say });
    }
    /* the spotlight: everything but the step's subject sits under a dark scrim */
    function focusRects(L) {
      var f = st8.focus, pad = 14;
      if (!f) return null;
      function card(x, w) { return [x - w / 2 - 26, L.inY - L.inH / 2 - 26, w + 52, L.inH + 52]; }
      function win(P) { return [P.x - pad, P.y - pad, P.w + 2 * pad, P.h + 2 * pad]; }
      var cT = card(L.inX[0], L.inW[0]), cF = card(L.inX[1], L.inW[1]);
      if (f === 'mail') return [win(L.LP), cT];
      if (f === 'ramp') return [win(L.RP), cF];
      // the fix: the new trips, and the fish-per-trip card with its SAME INTERVIEWS tag
      if (f === 'fix') return [win(L.LP), cT, [cF[0], cF[1] - (L.port ? 20 : 70), cF[2], cF[3] + (L.port ? 20 : 70)]];
      // the machine: its two cards, and the dock from under the windows down, as far as the Striper
      var so = striperO(L), x1 = so.x + 170 * L.MS, y0 = Math.max(L.LP.y + L.LP.h + pad + 4, L.inY - L.inH / 2);
      return [cT, cF, [L.port ? -20 : 16, y0, x1 - (L.port ? -20 : 16), L.H - y0 + 20]];
    }
    function spotlight(L) {
      var rs = focusRects(L); if (!rs) return '';
      var op = T.fz >= 0 ? [0.12, 0.26, 0.36, 0.4][Math.min(3, T.fz)] : 0.4, W = L.W + 40, H = L.H + 40;
      var m = '<mask id="cntSpot" maskUnits="userSpaceOnUse" x="-20" y="-20" width="' + W + '" height="' + H + '"><rect x="-20" y="-20" width="' + W + '" height="' + H + '" fill="#fff"/>' +
        rs.map(function (r) { return rect(r[0], r[1], r[2], r[3], '#000', 0, 30); }).join('') + '</mask>';
      return m + '<rect x="-20" y="-20" width="' + W + '" height="' + H + '" fill="' + INK + '" opacity="' + op + '" mask="url(#cntSpot)"/>';
    }

    /* two little boats on the water and a gull (the film's coast strip), bobbing on twos */
    function offshore(L) {
      var s = '', b = (stage.drawing >> 1) % 2, wy = L.hz + (L.dock - L.hz) * 0.45;
      function skiff(x, y, sc, ph) {
        var yy = y + (ph ? 3 : -3);
        return grp(path('M-40,0 L40,0 L28,18 L-30,18 Z', C.mustard, 5) + path('M-30,4 L30,4', 'none', 3, '', S.HI.mustard) + path('M-8,0 L-8,-34 L20,0 Z', C.cream, 4.5), 'translate(' + N(x) + ' ' + N(yy) + ') scale(' + sc + ')');
      }
      if (L.port) s += skiff(92, wy + 6, 1, b) + skiff(1000, wy - 8, 0.8, 1 - b);
      else s += skiff(300, wy, 1.2, b) + skiff(1580, wy - 14, 0.9, 1 - b) + skiff(1790, wy + 10, 1.1, b);
      var gy = L.port ? L.LP.y + L.LP.h + 30 : L.LP.y + L.LP.h + 40;
      if (L.hz - gy > 50) s += K.gull({ x: L.port ? 830 : 1500, y: gy + 10, scale: 0.6, flap: b }) + K.gull({ x: L.port ? 900 : 1580, y: gy - 6, scale: 0.45, flap: 1 - b });
      return s;
    }

    /* ---------------- the whole frame ---------------- */
    function draw(st) {
      var L = lay(st), v = vals(st8.i, st8.fixed), s = '';
      s += S.set.dock(st, { hz: L.hz, dock: L.dock }).svg;
      s += offshore(L);
      // the mustard divider behind the windows and the machine, and the film's banner: the exit-poll idea
      // first, then (from the first crank) what the machine does
      s += rect(L.MX - (L.port ? 16 : 22), L.poleTop, L.port ? 32 : 44, L.FL - L.poleTop - 40, C.mustard, 7, 20) + rect(L.MX + (L.port ? 4 : 6), L.poleTop + 20, L.port ? 8 : 10, L.FL - L.poleTop - 80, S.HI.mustard, 0, 4);
      if (!L.port) {
        var bt = st8.banner ? 'TRIPS × FISH PER TRIP = TOTAL CATCH' : 'ASK SOME, ESTIMATE ALL', bw = Math.max(700, bt.length * 48 * 0.56 + 90);
        var bsq = T.ban >= 0 ? [0.2, 0.7, 1.06, 1][Math.min(3, T.ban)] : 1;
        s += grp(banner(bt, 0, 0, bw, 48), 'translate(' + L.MX + ' ' + L.banY + ') scale(' + bsq + ' 1)');
      }
      s += windows(L);
      // the cards in the funnels go behind the machine, so the funnel cones hold them
      s += funnelCards(L);
      var msq = T.lob === 0 ? 0.06 : T.lob === 1 ? -0.03 : 0, mtr = msq ? 'translate(' + L.MX + ' ' + L.FL + ') scale(' + (1 + msq) + ' ' + (1 - msq) + ') translate(' + (-L.MX) + ' ' + (-L.FL) + ')' : '';
      s += S.shadow(L.MX, L.FL, 480 * L.MS) + S.cel(K.multiplier({ x: L.MX, y: L.FL, scale: L.MS, crank: crankAngle() / 360, squash: msq }));
      s += grp(nameplate(L) + crankTop(L) + S.cel(flipYear(L)), mtr);
      s += emerging(L, v);
      s += cardTags(L, v);
      s += restingCards(L, v);
      var so = striperO(L), ko = kitO(L);
      s += S.shadow(so.x + 30 * L.MS, L.FL, 240 * L.MS) + K.striper(so);
      s += S.shadow(L.KX, L.FL, 190 * L.KS) + K.kid(ko);
      s += spotlight(L);
      s += hint(L);
      // the grab area (the reader's turn only): the knob's whole circle, so a drag can start anywhere on the handle
      var c = orbit(L);
      if (st8.play) s += S.grab('knob', '<circle cx="' + N(c[0]) + '" cy="' + N(c[1]) + '" r="' + N(118 * L.MS) + '" fill="transparent"/>', c[0], c[1], 0);
      s += envelope(L);
      s += lobbing(L, v) + ding(L);
      s += balloons(L);
      return s;
    }
    var stage = api.stage(draw, function () {
      var v = vals(st8.i, st8.fixed), out = st8.out[key()];
      return 'The count, ' + Y[st8.i] + (st8.fixed ? ', corrected' : ', old count') + ': the mail survey’s ' + S.m(v.trips) + ' trips times the fish per trip from the dock interviews' +
        (out ? ' gives a total catch of ' + S.m(v.catch) + ' fish.' : '.') + (st8.fixed && out ? ' The old count was ' + S.m(v.catchOld) + '.' : '');
    });

    /* ---------------- the clock: every scripted moment advances one held drawing at a time ---------------- */
    var raf = 0, last = 0, ffwd = false;
    function run() {
      if (S.reduce) { if (ffwd) return; ffwd = true; var guard = 0; while (step() && guard++ < 400) {} ffwd = false; stage.drawing++; stage.render(); show(); return; }
      if (raf) return;
      stage.drawing++; stage.render();
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    function tick(now) {
      // raf stays set while a drawing is made, so a moment started inside step() joins this loop
      if (now - last >= 1000 / 12 - 2) {
        last = now;
        var busy = step();
        stage.drawing++; stage.render();
        if (!busy) { raf = 0; cbtn.setAttribute('aria-busy', 'false'); return; }
      }
      raf = requestAnimationFrame(tick);
    }
    function step() {
      var busy = false;
      Object.keys(T).forEach(function (k) {
        if (T[k] < 0) return;
        T[k]++;
        if (T[k] > LEN[k]) { T[k] = -1; ended(k); } else busy = true;
      });
      if (st8.auto > 0) {
        crankBy(Math.min(30, st8.auto)); st8.auto -= 30; busy = true;
        if (st8.auto <= 0 && T.lob < 0 && st8.sPose === 'crank') st8.sPose = 'ready';
      }
      // cues inside the moments
      if (T.lob === 4) { T.ding = 0; st8.sPose = 'tip'; if (!st8.fixed) T.cheer = 0; busy = true; show(); }
      if (T.lob === LEN.lob && st8.fixed && st8.out.fixed && !st8.stamped) { T.stamp = 0; st8.stamped = true; }
      if (T.stamp === 3 && st8.fixed) {
        // the corrected card is stamped: Kit sums it up, and the spotlight lifts so everyone's lit
        if (st8.kitLine !== 'why') { st8.kitLine = 'fewer'; T.kit = 0; }
        if (st8.focus) { st8.focus = null; }
      }
      if (T.env === LEN.env - 1) { T.dropT = 0; T.tap = 0; st8.shownT = true; show(); }
      if (T.dropT === 2 && st8.fixed && !st8.shownF) T.dropF = 0;
      if (T.dropF === 2 && st8.fixed) st8.shownF = true;
      return busy || T.ding >= 0;
    }
    function ended(k) { if (k === 'env') show(); }
    function nudge() {
      var b = api.nav && api.nav.querySelector('.btn');
      if (b && !S.reduce) { b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); }
    }

    /* ---------------- the crank ---------------- */
    function crankBy(d) {
      var q0 = crankAngle();
      st8.ang += d;
      if (st8.sPose !== 'crank') st8.sPose = 'crank';
      if (T.lob < 0 && T.env < 0) {
        st8.turn = S.clamp(st8.turn + d, 0, 360);
        if (st8.turn >= 360) popCard();
      }
      return crankAngle() !== q0;
    }
    function popCard() {
      var k = key();
      st8.out[k] = true; st8.turn = 0; T.lob = 0; st8.auto = 0; T.cheer = -1;
      if (st8.fixed) st8.stamped = false;
      if (raf) { stage.drawing++; stage.render(); } else run();
    }
    var cbtn;
    function turnAuto() {
      if (!st8.play) return;
      st8.tried = true;
      st8.auto = Math.max(st8.auto, Math.ceil((360 - st8.turn) / 30) * 30);
      cbtn.setAttribute('aria-busy', 'true');
      run();
    }
    function setMode(f) {
      if (f === st8.fixed) return;
      st8.fixed = f; st8.turn = 0; st8.auto = 0; T.lob = -1; T.ding = -1; T.kit = -1; T.cheer = -1; T.stamp = -1;
      if (st8.sPose === 'tip') st8.sPose = 'ready';
      if (f) {
        // the old catch is known either way: its card turns to a ghost where it lies
        st8.out.old = true; st8.stamped = st8.out.fixed;
        T.env = 0; T.ghost = 0; T.dropT = -1; T.dropF = -1; T.tap = -1; st8.shownT = false; st8.shownF = false;
      } else {
        T.env = -1; T.tap = -1; T.ghost = -1; T.dropT = 0; T.dropF = -1; T.back = 0; st8.shownT = false; st8.shownF = false;
        if (st8.kitLine === 'fewer') st8.kitLine = null;
      }
      show(); run();
    }
    function pickYear(i) {
      if (i === st8.i) return;
      st8.i = i; T.flip = 0; show(); run();
    }

    /* ---------------- the walkthrough ---------------- */
    var v25 = vals(Y25, false), f25 = vals(Y25, true);
    function mil(x) { return '<span class="num">' + x.toFixed(1) + ' million</span>'; }
    var STEPS = [
      { focus: null, cls: 'first', h: '<p>Nobody can count every angler on the coast. So NOAA asks some of them and scales the answers up to everyone, the way TV networks call an election from exit polls.</p>' +
        '<p>Counting the striped bass that anglers catch takes two surveys.</p>' },
      { focus: 'mail', h: '<p><b>The mail survey counts trips.</b> NOAA mails a form to households and asks how many times they went saltwater fishing, then scales the answers up to all anglers.</p>' +
        '<p>For 2025 it came to <b>' + mil(v25.trips) + ' striper fishing trips</b>.</p>' },
      { focus: 'ramp', h: '<p><b>The dock interviews count fish per trip.</b> Interviewers at ramps, docks and beaches ask anglers what they caught, including the fish they let go.</p>' +
        '<p>In 2025 that averaged <b>about one striper per trip</b>.</p>' },
      { focus: 'machine', h: '<p><b>Trips × fish per trip = total catch.</b> Multiply the two and you get NOAA’s estimate of all the stripers anglers caught, kept and released.</p>' +
        '<p>For 2025: <b>' + mil(v25.catch) + ' fish</b>.</p>' },
      { focus: 'fix', h: '<p><b>In August 2026, NOAA corrected the mail survey.</b> It had been counting too many trips. The corrected count for 2025 is <b>' + mil(f25.trips) + ' trips</b>, down from ' + mil(v25.trips) + '.</p>' +
        '<p>The dock interviews were not changed.</p>' },
      { focus: 'machine', h: '<p><b>Same multiplication, fewer trips.</b> The corrected total catch for 2025 is <b>' + mil(f25.catch) + ' fish</b>, compared with ' + mil(v25.catch) + ' in the old count.</p>' },
      { focus: null, cls: 'turn', h: '<span class="go">Your turn</span><p>Pick any year from 2000 to 2025 on the chart under the picture. Switch between the old and corrected counts, and turn the crank: drag the red knob round, or press the button.</p>' +
        '<p>Every year, the corrected total catch is lower.</p>' }
    ];
    var PLAY = STEPS.length - 1, OUTRO = STEPS.length;
    STEPS.forEach(function (d) { api.step(d.h, d.cls); });

    /* the finished state of step n, drawn at once (a jump, a scroll back, or reduced motion) */
    function snap(n) {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      Object.keys(T).forEach(function (k) { T[k] = -1; });
      var play = n >= PLAY;
      st8.i = Y25; st8.showT = n >= 1; st8.showF = n >= 2;
      st8.fixed = n >= 4; st8.shownT = n >= 4; st8.shownF = n >= 4;
      st8.out.old = n >= 3; st8.out.fixed = n >= 5; st8.stamped = n >= 5;
      st8.kitLine = n === 5 ? 'fewer' : n >= OUTRO ? 'why' : null;
      st8.turn = 0; st8.auto = 0; st8.ang = 0; st8.sPose = 'ready'; st8.banner = n >= 3;
      st8.focus = n === 5 ? null : (STEPS[n] ? STEPS[n].focus : null); st8.play = play;
      cbtn.setAttribute('aria-busy', 'false');
      api.playing(play);
      show(); stage.drawing++; stage.render();
    }
    /* step n's entrance, played from the finished state of step n - 1 */
    function enter(n) {
      if (STEPS[n] && STEPS[n].focus !== st8.focus) { st8.focus = STEPS[n] ? STEPS[n].focus : null; T.fz = 0; }
      if (n === 1) { st8.showT = true; T.inT = 0; T.hh = 0; }
      else if (n === 2) { st8.showF = true; T.inF = 0; T.tap = 0; }
      else if (n === 3) { st8.banner = true; T.ban = 0; st8.auto = 360; }
      else if (n === 4) { setMode(true); }
      else if (n === 5) { st8.auto = 360; }
      else if (n === PLAY) { st8.play = true; api.playing(true); st8.focus = null; }
      show(); run();
    }
    api.onStep(function (n, prev) {
      if (n >= PLAY && prev >= PLAY) {
        // between the last step and the closing card: keep whatever the reader set up
        if (n === OUTRO) { st8.kitLine = 'why'; T.kit = 0; api.gotIt(); nudge(); }
        else if (st8.kitLine === 'why') st8.kitLine = null;
        run(); return;
      }
      if (prev >= 0 && n === prev + 1 && !S.reduce) { snap(prev); enter(n); }
      else snap(n);
      if (n === OUTRO) { api.gotIt(); nudge(); }
    });

    /* ---------------- the readout under the picture, and the reader's controls ---------------- */
    var eq = S.el('div', { class: 'eq', 'aria-live': 'polite' }, api.bar,
      '<span class="eqyr"><b></b><small></small></span>' +
      '<span class="chip t"><b></b><small>trips</small></span><span class="op" aria-hidden="true">×</span>' +
      '<span class="chip f"><i class="fish" role="img" aria-label="from the dock interviews"></i><b></b><small>fish per trip</small></span><span class="op" aria-hidden="true">=</span>' +
      '<span class="chip c"><b></b><small>total catch</small></span>');
    var cT = eq.querySelector('.chip.t'), cF = eq.querySelector('.chip.f'), cC = eq.querySelector('.chip.c');
    var playRow = S.el('div', { class: 'sc-play' }, api.bar);
    var ppick = S.el('div', { class: 'ppick' }, playRow), phead = S.el('div', { class: 'phead', 'aria-hidden': 'true' }, ppick);
    var PY = Y.slice(P0);
    var pick = S.yearPicker(ppick, {
      years: PY, max: 60, value: Y25 - P0, aria: 'Pick a year',
      series: [{ cls: 'o', vals: PY.map(function (y, k) { return vals(P0 + k).catchOld; }) }, { cls: 'c', vals: PY.map(function (y, k) { return vals(P0 + k).catchNew; }) }],
      label: function (k) { var w = vals(P0 + k); return PY[k] + ': total catch, old count ' + S.m(w.catchOld) + ' fish, corrected ' + S.m(w.catchNew) + ' fish'; },
      onPick: function (k) { pickYear(P0 + k); }
    });
    var pctl = S.el('div', { class: 'pctl' }, playRow);
    var mode = S.seg(pctl, { options: [{ v: false, t: 'Old count' }, { v: true, t: 'Corrected' }], value: false, small: true, aria: 'Which count', onChange: setMode });
    cbtn = S.el('button', { class: 'btn ghost crankbtn', type: 'button', 'aria-busy': 'false' }, pctl, '<i aria-hidden="true"></i><span class="lg">Turn the crank</span><span class="sm">Crank</span>');
    var spaceUp = 0;
    cbtn.addEventListener('click', function () { if (Date.now() - spaceUp < 120) return; turnAuto(); });
    cbtn.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); turnAuto(); } });
    cbtn.addEventListener('keyup', function (e) { if (e.key === ' ') { e.preventDefault(); spaceUp = Date.now(); } });

    function chip(c, txt) {
      var b = c.querySelector('b'); if (b.textContent === txt) return;
      if (txt === '?' || b.textContent === '?' || !b.textContent) b.textContent = txt; else S.countTo(b, txt);
      if (!S.reduce && txt !== '?') { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
    }
    function show() {
      var v = vals(st8.i, st8.fixed), y = Y[st8.i], vt = vals(st8.i, st8.shownT);
      eq.querySelector('.eqyr b').textContent = y;
      eq.querySelector('.eqyr small').textContent = st8.fixed ? 'corrected' : 'old count';
      eq.classList.toggle('cor', st8.fixed);
      chip(cT, st8.showT ? S.m(vt.trips) : '?'); cT.classList.toggle('cor', st8.shownT);
      cF.classList.toggle('known', st8.showF); chip(cF, st8.showF ? '' : '?');
      var out = st8.out[key()] && !(T.lob >= 0 && T.lob < 4);
      chip(cC, out ? S.m(v.catch) : '?'); cC.classList.toggle('cor', st8.fixed && out);
      phead.innerHTML = '<span class="yr">' + y + ' total catch</span><span><span class="sw o"></span>old count <b>' + S.m(v.catchOld) + '</b></span><span><span class="sw c"></span>corrected <b>' + S.m(v.catchNew) + '</b></span>';
      mode.set(st8.fixed);
      if (st8.i >= P0) pick.set(st8.i - P0);
    }

    /* ---------------- the close ---------------- */
    api.take('Only one of the two numbers was wrong. The mail survey counted too many trips. The dock interviews were fine, so the extra trips flowed straight into the total catch.');
    api.more('Why the corrected catch isn’t simply trips × one number',
      '<p>NOAA doesn’t multiply one trip total by one fish-per-trip number. It does the multiplication separately for each state, each two-month stretch of the year and each kind of fishing (from shore or from a private boat), then adds up the pieces. The fish per trip in every piece comes from the same dock interviews in both counts.</p>' +
      '<p>The correction cut some pieces more than others, so the total catch doesn’t fall by exactly the same share as the trips. In 2025 trips fell 17% and the total catch fell 21%.</p>' +
      '<p>Charter boats and commercial fishing are counted other ways, and neither changed in this revision. Source: NOAA MRIP revision, Aug 28, 2026, as presented by ASGA.</p>');

    /* ---------------- dragging the crank ---------------- */
    var dragA = null;
    function angleAt(pt) { var c = orbit(lay(stage)); return Math.atan2(pt.x - c[0], -(pt.y - c[1])) * 180 / Math.PI; }
    stage.drag({
      start: function (name, pt) {
        if (name !== 'knob' || !st8.play) return false;
        dragA = angleAt(pt); st8.tried = true; st8.dragging = true; st8.auto = 0;
        if (st8.sPose !== 'crank') { st8.sPose = 'crank'; stage.render(); }
      },
      move: function (name, pt) {
        if (dragA == null) return;
        var a = angleAt(pt), d = a - dragA;
        if (d > 180) d -= 360; if (d < -180) d += 360;
        dragA = a;
        var changed = crankBy(d);
        if (changed && !raf) { if (crankAngle() % 30 === 0) stage.drawing++; stage.render(); }
      },
      end: function () { dragA = null; st8.dragging = false; if (st8.sPose === 'crank' && T.lob < 0) st8.sPose = 'ready'; if (!raf) stage.render(); }
    });

    /* ---------------- life between moves: blinks and the householder thinking, only while in view ---------------- */
    var inView = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: 0.2 }).observe(api.stageHost);
    var idleN = 0;
    if (!S.reduce) setInterval(function () {
      if (!inView || raf || st8.dragging || document.hidden) return;
      idleN++;
      st8.blinkWho = idleN % 5; T.blink = 0;
      if (idleN % 3 === 0) T.hh = 0;
      if (idleN % 4 === 2 && T.tap < 0 && st8.showF) T.tap = 6;
      run();
    }, 2300);

    snap(0);
    document.addEventListener('site:fonts', function () { stage.render(); });
  }
});
