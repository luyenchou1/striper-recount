/* GotOne Labs: the anonymous counts for The Striper Recount, per the shared contract (Oct 2026,
   Offshore Trip Planner/docs/labs-analytics-contract.md). No cookies, nothing stored in the browser.
   tools/build_site.py loads it on every page but the 404, ahead of the other scripts, with the page's id:
     <script src="assets/labs-count.js" data-page="recount/count"></script>
   - the page hit, once on load: {p: page, r: referrer host} to <api>/api/hit. The referrer is a host only:
     "internal" when it is this site, "... (embedded)" when the page is framed.
   - GotOneLabs.event(name): {t: "recount", e: name} to <api>/api/event, at most once per page view per name.
     The site calls it at each moment (the film in build_site.py's HERO script; reach_, turn_ and end_ in
     site.js; the share buttons in frame.js and pages/next.js). Clicks on links to ASGA, GotOne, GotOne Labs and
     the ASMFC are counted here: out_asga, out_gotone, out_labs, out_asmfc.
   - the footer's "Was this helpful?" control ([data-helpful], built by build_site.py): the vote at once, then
     an optional note as a second post, {t, v, n, w (the honeypot), d (seconds on the page)} to <api>/api/feedback.
   Counting runs only on the live hosts (*.gotoneapp.com, *.onrender.com) unless window.GotOneLabsCountHere is
   set, and never with Do Not Track or Global Privacy Control on; feedback the reader chose to send goes even
   then. The API base is RC_META.labsApi (build_site.py LABS_API); window.GotOneLabsAPI overrides it for local
   tests. Fire and forget: sendBeacon with a JSON string (sent as text/plain, so a cross-origin post needs no
   CORS preflight), else fetch with keepalive and mode no-cors. Nothing here ever throws. */
(function () {
  'use strict';
  var TOOL = 'recount', LIVE = /(^|\.)gotoneapp\.com$|\.onrender\.com$/, NAME = /^[a-z0-9_]{1,32}$/;
  var me = document.currentScript, page = null, sent = {};
  try { page = (me && me.getAttribute('data-page')) || null; } catch (e) {}

  function base() {
    var b = window.GotOneLabsAPI || (window.RC_META && window.RC_META.labsApi) || '';
    return String(b).replace(/\/+$/, '');
  }
  function live() {
    try { return LIVE.test(location.hostname) || !!window.GotOneLabsCountHere; } catch (e) { return false; }
  }
  function dnt() {
    try {
      var n = navigator;
      return n.doNotTrack === '1' || n.doNotTrack === 'yes' || window.doNotTrack === '1' || n.msDoNotTrack === '1' ||
        n.globalPrivacyControl === true;
    } catch (e) { return true; }
  }
  function counting() { return !!page && live() && !dnt(); }
  function post(path, obj) {
    try {
      var b = base(); if (!b) return false;
      var url = b + path, body = JSON.stringify(obj);
      if (navigator.sendBeacon && navigator.sendBeacon(url, body)) return true;
      if (window.fetch) {
        fetch(url, { method: 'POST', body: body, keepalive: true, mode: 'no-cors', credentials: 'omit' }).catch(function () {});
        return true;
      }
    } catch (e) { /* counting is best-effort */ }
    return false;
  }
  function referrer() {
    var r = '', framed;
    try { r = new URL(document.referrer).hostname; } catch (e) { r = ''; }
    if (r && r === location.hostname) r = 'internal';
    try { framed = window.self !== window.top; } catch (e) { framed = true; }
    return framed ? (r || 'unknown') + ' (embedded)' : r;
  }
  function seconds() {
    try { return Math.floor(performance.now() / 1000); } catch (e) { return 0; }
  }

  function event(name) {
    try {
      name = String(name || '');
      if (!NAME.test(name) || sent[name]) return false;
      sent[name] = true;
      return counting() ? post('/api/event', { t: TOOL, e: name }) : false;
    } catch (e) { return false; }
  }
  function feedback(vote, note, honey) {
    try {
      if (!page || !live()) return false;
      var v = vote === 'up' || vote === 'down' ? vote : '';
      var n = String(note || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, 500);
      if (!v && !n) return false;
      return post('/api/feedback', { t: TOOL, v: v, n: n, w: String(honey || ''), d: seconds() });
    } catch (e) { return false; }
  }
  window.GotOneLabs = { page: page, event: event, feedback: feedback };

  // the hit, once per page load (a page the browser prerenders counts when it is shown)
  function hit() { try { if (counting()) post('/api/hit', { p: page, r: referrer() }); } catch (e) {} }
  try {
    if (document.prerendering) document.addEventListener('prerenderingchange', hit, { once: true });
    else hit();
  } catch (e) {}

  // links out
  function outOf(a) {
    var u;
    try { u = new URL(a.href, location.href); } catch (e) { return null; }
    var h = u.hostname.toLowerCase().replace(/^www\./, '');
    if (/(^|\.)saltwaterguidesassociation\.com$/.test(h)) return 'out_asga';
    if (/(^|\.)asmfc\.org$/.test(h)) return 'out_asmfc';
    if (h === 'labs.gotoneapp.com' || (h === 'gotoneapp.com' && /^\/labs(\/|$)/.test(u.pathname))) return 'out_labs';
    if (h === 'gotoneapp.com') return 'out_gotone';
    return null;
  }
  function onLink(e) {
    try {
      if (e.type === 'auxclick' && e.button !== 1) return;
      var a = e.target && e.target.closest && e.target.closest('a[href]'), n = a && outOf(a);
      if (n) event(n);
    } catch (err) {}
  }
  document.addEventListener('click', onLink, true);
  document.addEventListener('auxclick', onLink, true);

  // "Was this helpful?": a vote, then "Thanks!" and an optional private note
  function helpful() {
    var box = document.querySelector('[data-helpful]'); if (!box || !page) return;
    var btns = [].slice.call(box.querySelectorAll('.hf-btn')), msg = box.querySelector('.hf-msg');
    var form = box.querySelector('.hf-note'), note = box.querySelector('input[name="note"]'), honey = box.querySelector('input[name="website"]');
    if (!btns.length || !msg || !form || !note) return;
    var voted = '';
    function hp() { return honey ? honey.value : ''; }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        if (voted) return;
        voted = b.getAttribute('data-v') || '';
        // the chosen thumb keeps the focus; the other leaves the tab order, so Tab goes on to the note
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); x.setAttribute('aria-disabled', 'true'); if (x !== b) x.setAttribute('tabindex', '-1'); });
        box.classList.add('voted');
        msg.textContent = 'Thanks!';
        form.hidden = false;
        feedback(voted, '', hp());
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = note.value.trim();
      if (!n) { note.focus(); return; }
      feedback('', n, hp());
      form.hidden = true; box.classList.add('noted');
      msg.setAttribute('tabindex', '-1');
      msg.textContent = 'Thanks for the note.';
      try { msg.focus({ preventScroll: true }); } catch (err) { msg.focus(); }
    });
    box.hidden = false;
  }
  try {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { try { helpful(); } catch (e) {} });
    else helpful();
  } catch (e) {}
})();
