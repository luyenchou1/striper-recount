/* Tackle Box Rock! engine.
   Deterministic renderer: every frame is a pure function of time T (seconds).
   Scenes register with TBR.scene({id, render(ctx)}) and return an SVG string
   drawn in a 1920x1080 space. Timing comes from TBR.timeline (built from the
   script by tools/build_timeline.py), so retiming to the real song only means
   regenerating timeline.js. */
(function () {
  'use strict';
  var TBR = window.TBR = window.TBR || {};
  TBR.scenes = TBR.scenes || {};
  TBR.W = 1920; TBR.H = 1080;
  TBR.FPS_DRAW = 12;          // animation on twos: 12 drawings per second
  TBR.scene = function (def) { TBR.scenes[def.id] = def; };

  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  TBR.hash = hash;

  /* Script bar at song time T (inverse of timeline.time_map); null when not retimed. */
  TBR.scriptBarAt = function (T) {
    var m = TBR.timeline && TBR.timeline.time_map;
    if (!m || m.length < 2) return null;
    for (var i = 0; i < m.length - 1; i++) {
      if (T >= m[i][1] && T <= m[i + 1][1]) return m[i][0] + (m[i + 1][0] - m[i][0]) * (T - m[i][1]) / (m[i + 1][1] - m[i][1]);
    }
    var a = T < m[0][1] ? 0 : m.length - 2, b = a + 1;
    return m[a][0] + (m[b][0] - m[a][0]) * (T - m[a][1]) / (m[b][1] - m[a][1]);
  };
  TBR.sceneAt = function (T) {
    var sc = TBR.timeline.scenes;
    for (var i = 0; i < sc.length; i++) if (T >= sc[i].start && T < sc[i].start + sc[i].dur) return sc[i];
    return T < 0 ? sc[0] : sc[sc.length - 1];
  };
  TBR.linesAt = function (T) {
    return TBR.timeline.lines.filter(function (l) { return T >= l.start && T < l.end; });
  };
  TBR.talking = function (speaker, T) {
    var ls = TBR.linesAt(T);
    var who = speaker.toUpperCase();
    for (var i = 0; i < ls.length; i++) {
      var sp = ls[i].speaker.toUpperCase();
      if (sp.indexOf(who) >= 0 || (sp === 'CHORUS' && who === 'STRIPER') || sp === 'ALL' || sp === 'BOTH') {
        // a recorded line (Kit's VO) flaps only where the take is voiced
        if (ls[i].talk && !ls[i].talk.some(function (g) { return T >= g[0] && T < g[1]; })) continue;
        // leave the mouth closed briefly between words so it reads as speech
        var f = Math.floor(T * TBR.FPS_DRAW);
        return (f % 3) !== 2 ? (hash(f * 3.1 + i) > 0.25 ? 'open' : 'mid') : 'closed';
      }
    }
    return false;
  };

  function defs(frame) {
    var s = Math.floor(frame / 2) % 4; // line boil: 4 drawings, each held for two (6 changes a second)
    return '<defs>' +
      '<filter id="boil" x="-5%" y="-5%" width="110%" height="110%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="' + (s + 3) + '" result="n"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>' +
      '<filter id="grain" x="0" y="0" width="100%" height="100%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="' + (frame % 17) + '" stitchTiles="stitch"/>' +
        '<feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 0.9 0"/>' +
      '</filter>' +
      '<radialGradient id="vignette" cx="50%" cy="50%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#2a1a08" stop-opacity=".38"/></radialGradient>' +
      (TBR.kit && TBR.kit.defs ? TBR.kit.defs(frame) : '') +
    '</defs>';
  }

  /* Build the full frame SVG for time T. */
  TBR.frameSVG = function (T) {
    var q = Math.floor(T * TBR.FPS_DRAW + 1e-6) / TBR.FPS_DRAW;
    var frame = Math.round(q * TBR.FPS_DRAW);
    var sc = TBR.sceneAt(q), def = TBR.scenes[sc.id];
    var bar = TBR.timeline.bar_sec;
    // Scene time is measured in SCRIPT bars. When the film is retimed to a real song
    // (timeline.time_map), time inside a scene follows the song's actual bars, so every
    // beat of the animation stays locked to its lyric even where the song stretches or
    // compresses a section. ctx.t is that scene time expressed at the nominal tempo.
    var sBar = TBR.scriptBarAt ? TBR.scriptBarAt(q) : null;
    var local = sBar == null ? (q - sc.start) : (sBar - sc.start_bar) * bar;
    var ctx = {
      T: q, t: local, dur: sc.bars ? sc.bars * bar : sc.dur, p: Math.min(1, Math.max(0, local / (sc.bars ? sc.bars * bar : sc.dur))),
      bar: local / bar, barSec: bar, frame: frame, id: sc.id, kit: TBR.kit,
      lines: TBR.linesAt(q),
      talking: function (who) { return TBR.talking(who, q); },
      at: function (b) { return b * bar; },          // bar offset -> seconds within scene
      since: function (b) { return local - b * bar; } // seconds since bar offset (negative before)
    };
    var body;
    try {
      body = def ? def.render(ctx) : placeholder(sc, ctx);
    } catch (e) {
      body = '<rect width="1920" height="1080" fill="#3a1010"/><text x="60" y="120" fill="#fff" font-size="40" font-family="monospace">' +
        esc(sc.id + ': ' + e.message) + '</text>';
      if (window.console) console.error(sc.id, e);
    }
    var wf = Math.floor(frame / 2), wx = (hash(wf * 1.7) - 0.5) * 1.1, wy = (hash(wf * 2.3) - 0.5) * 1.1; // gate weave (subtle)
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">' + defs(frame) +
      '<rect width="1920" height="1080" fill="#1b140c"/>' +
      '<g transform="translate(' + wx.toFixed(2) + ' ' + wy.toFixed(2) + ') translate(960 540) scale(1.014) translate(-960 -540)"><g filter="url(#boil)">' + body + '</g></g>' +
      '<rect width="1920" height="1080" filter="url(#grain)" opacity=".10" style="mix-blend-mode:multiply"/>' +
      specks(frame) +
      '<rect width="1920" height="1080" fill="url(#vignette)"/>' +
      '</svg>';
  };

  /* Film specks, like a 70s broadcast print: on each drawing 0 to 3 tiny white dust flecks
     and 0 to 2 black ones, a rare hair, all low contrast. Deterministic per drawing. */
  function specks(frame) {
    var out = '', f = frame * 7.13;
    var nW = Math.floor(hash(f + 1) * 4), nB = Math.floor(hash(f + 2) * 3), i;
    for (i = 0; i < nW; i++) {
      var x = hash(f + 10 + i) * 1920, y = hash(f + 20 + i) * 1080, r = 0.8 + hash(f + 30 + i) * 1.8;
      out += '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="' + r.toFixed(1) + '" ry="' + (r * (0.6 + hash(f + 35 + i) * 0.8)).toFixed(1) + '" fill="#fffbef" opacity="' + (0.35 + hash(f + 40 + i) * 0.3).toFixed(2) + '"/>';
    }
    for (i = 0; i < nB; i++) {
      var bx = hash(f + 50 + i) * 1920, by = hash(f + 60 + i) * 1080, br = 0.7 + hash(f + 70 + i) * 1.4;
      out += '<circle cx="' + bx.toFixed(0) + '" cy="' + by.toFixed(0) + '" r="' + br.toFixed(1) + '" fill="#1b140c" opacity="' + (0.3 + hash(f + 80 + i) * 0.3).toFixed(2) + '"/>';
    }
    if (hash(f + 90) > 0.995) { // an occasional hair, a few a minute
      var hx = hash(f + 91) * 1920, hy = hash(f + 92) * 1080, dx = (hash(f + 93) - 0.5) * 40, dy = 8 + hash(f + 94) * 26;
      out += '<path d="M' + hx.toFixed(0) + ',' + hy.toFixed(0) + ' q' + (dx / 2).toFixed(0) + ',' + (dy * 0.2).toFixed(0) + ' ' + dx.toFixed(0) + ',' + dy.toFixed(0) + '" stroke="' + (hash(f + 95) > 0.5 ? '#fffbef' : '#1b140c') + '" stroke-width="1.1" fill="none" opacity=".45"/>';
    }
    return out;
  }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  TBR.esc = esc;

  function placeholder(sc, ctx) {
    return '<rect width="1920" height="1080" fill="#E8D9B0"/>' +
      '<text x="960" y="500" text-anchor="middle" font-family="Georgia" font-size="72" fill="#3b2a14">' + esc(sc.id) + '</text>' +
      '<text x="960" y="590" text-anchor="middle" font-family="monospace" font-size="36" fill="#3b2a14">bar ' + ctx.bar.toFixed(2) + ' / ' + (sc.dur / ctx.barSec).toFixed(0) + '</text>';
  }

  /* Caption for time T: returns {speaker, mode, text} or null. */
  TBR.captionAt = function (T) {
    var ls = TBR.linesAt(T);
    return ls.length ? ls[ls.length - 1] : null;
  };
  /* Caption line breaks. Rows never exceed max characters; the row count is the greedy
     minimum. A two-row caption is balanced: the break minimises the longer row, prefers a
     sentence break (. ? !) and then a comma break near the middle, and leans top-heavy, so
     no word is stranded ("Wait. Smaller count means / more fish left, right?"). */
  TBR.wrapCaption = function (text, max) {
    var words = text.split(' '), rows = [], row = '';
    words.forEach(function (w) { if ((row + ' ' + w).length > max && row) { rows.push(row); row = w; } else row = row ? row + ' ' + w : w; });
    if (row) rows.push(row);
    if (rows.length !== 2) return rows;
    var best = null, bestScore = Infinity;
    for (var i = 1; i < words.length; i++) {
      var a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
      if (a.length > max || b.length > max) continue;
      var end = words[i - 1].slice(-1);
      var score = Math.max(a.length, b.length) + Math.max(0, b.length - a.length) * 0.75 -
        (/[.?!]/.test(end) ? 6 : /[,;]/.test(end) ? 3 : 0);
      if (score < bestScore) { bestScore = score; best = [a, b]; }
    }
    return best || rows;
  };
  TBR.captionSVG = function (T) {
    var c = TBR.captionAt(T);
    if (!c) return '';
    // the note glyphs are glued to their neighbouring words (no-break space) so a ♪ never
    // wraps onto a line by itself
    var label = c.mode === 'sung' ? '♪ ' : (c.speaker ? c.speaker.toUpperCase() + ': ' : '');
    var text = label + c.text + (c.mode === 'sung' ? ' ♪' : '');
    var rows = TBR.wrapCaption(text, 46);
    var fs = 46, lh = 60, y0 = 1080 - 60 - (rows.length - 1) * lh;
    return rows.map(function (r, i) {
      var w = r.length * fs * 0.6 + 28;
      return '<rect x="' + (960 - w / 2) + '" y="' + (y0 + i * lh - fs + 2) + '" width="' + w + '" height="' + (lh - 4) + '" fill="#000" opacity=".82"/>' +
        '<text x="960" y="' + (y0 + i * lh) + '" text-anchor="middle" font-family="\'Courier Prime\',\'Courier New\',monospace" font-weight="700" font-size="' + fs + '" fill="#fff">' + esc(r) + '</text>';
    }).join('');
  };

  /* Full frame with optional burned-in captions (used for capture). */
  TBR.renderAt = function (T, opts) {
    opts = opts || {};
    var svg = TBR.frameSVG(T);
    // captions change on the same drawing grid as the picture, so a line never leads the cut
    var q = Math.floor(T * TBR.FPS_DRAW + 1e-6) / TBR.FPS_DRAW;
    if (opts.cc) svg = svg.replace(/<\/svg>$/, TBR.captionSVG(q) + '</svg>');
    var stage = document.getElementById('stage');
    if (stage) stage.innerHTML = svg;
    return true;
  };

  /* Load scene files listed in TBR.manifest sequentially. */
  TBR.load = function (base) {
    base = base || '';
    var files = (TBR.manifest || []).slice();
    return new Promise(function (resolve) {
      (function next() {
        if (!files.length) {
          // document.fonts.ready can resolve before any text has asked for the webfonts, so
          // request every face the film letters with and wait for all of them (a fresh
          // capture page would otherwise draw its first frame with blank labels). A timeout
          // keeps an offline preview from hanging.
          var fs = document.fonts, faces = ['40px Shrikhand', '40px Chewy', '40px "Lilita One"', '40px "Patrick Hand"', 'bold 40px "Courier Prime"'];
          var loads = fs && fs.load ? Promise.all(faces.map(function (f) { return fs.load(f).catch(function () { return []; }); }))
            .then(function () { return fs.ready; }) : Promise.resolve();
          var timeout = new Promise(function (r) { setTimeout(r, 10000); });
          Promise.race([loads, timeout]).then(function () { TBR.ready = true; resolve(); });
          return;
        }
        var s = document.createElement('script');
        s.src = base + files.shift() + '?v=' + (TBR.buildId || '');
        s.onload = next; s.onerror = function () { console.error('failed to load', s.src); next(); };
        document.head.appendChild(s);
      })();
    });
  };
})();
