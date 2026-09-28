/* The frame around the interactives, at runtime: source links, sharing and the "What you can do" block.
   Loaded after data.js and answers.js, before the page modules. window.RC_META comes from the build
   (tools/build_site.py): the canonical address, the credit line, the as-of date and the source links.
   FRAME.link(key, text)     a source link (opens in a new tab), or the bare text if the key is unknown
   FRAME.canShare()          a phone with a share sheet
   FRAME.fourText()          the four answers (answers.js) with the credit, the address and the source
   FRAME.copy(text, ui)      the clipboard, else the text selected in ui.fall (a textarea) with a hint
   FRAME.share(o, ui)        the share sheet on phones ({title, text, url}), else FRAME.copy(o.copy)
   FRAME.wycd(host)          appends a copy of the "What you can do" block to host
   Any element with data-share="page" (the footer's Share link) or data-share="four" (the home page's short
   version) shares on click, with its message in the nearest .sharemsg. */
(function () {
  'use strict';
  var M = window.RC_META || {}, F = window.FRAME = {}, SRC = M.src || {};
  F.url = M.url || location.href.split('#')[0].replace(/[^/]*$/, '');
  F.link = function (key, text) {
    var u = SRC[key];
    return u ? '<a href="' + u + '" target="_blank" rel="noopener">' + text + '</a>' : text;
  };
  F.canShare = function () {
    try { return typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches; } catch (e) { return false; }
  };
  function plain(t) { return String(t).replace(/[’‘]/g, '\'').replace(/[“”]/g, '"'); }
  F.fourText = function () {
    var A = window.RC_ANSWERS || [], cr = M.credit || '';
    return plain('What to tell your fishing buddies (The Striper Recount):\n' +
      A.map(function (c, i) { return (i + 1) + '. ' + c.q + '\n   ' + c.a; }).join('\n') +
      '\n\nFrom The Striper Recount, ' + cr.charAt(0).toLowerCase() + cr.slice(1) + '.\n' +
      'Watch the song and try the numbers: ' + F.url + '\n' +
      'Source: NOAA MRIP revision, ' + (M.asOf || '') + '.');
  };
  F.copy = function (text, ui) {
    ui = ui || {};
    function say(t) { if (ui.msg) ui.msg.textContent = t; }
    function done() { say(ui.ok || 'Copied. Paste it anywhere.'); if (ui.fall) ui.fall.hidden = true; }
    function fallback() {
      var ta = ui.fall, tmp = !ta, ok = false;
      if (tmp) { ta = document.createElement('textarea'); ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(ta); }
      ta.value = text; ta.hidden = false; ta.focus(); ta.select();
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      if (tmp) document.body.removeChild(ta);
      if (ok) done();
      else say(tmp ? 'Your browser blocked copying. The address is ' + text : 'Your browser blocked copying. The text is selected below: press Ctrl+C (or Cmd+C on a Mac).');
    }
    say('');
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext !== false) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  };
  F.share = function (o, ui) {
    if (F.canShare()) {
      var d = { title: o.title || 'The Striper Recount' };
      if (o.text) d.text = o.text;
      if (o.url) d.url = o.url;
      navigator.share(d).catch(function (e) { if (!e || e.name !== 'AbortError') F.copy(o.copy, ui); });
    } else F.copy(o.copy, ui);
  };
  F.wycd = function (host) {
    var t = document.getElementById('wycd-tpl');
    if (!t || !host || !t.content || !t.content.firstElementChild) return null;
    var n = t.content.firstElementChild.cloneNode(true);
    host.appendChild(n);
    return n;
  };
  F.pageUrl = function () { return F.url + (document.body.getAttribute('data-file') || ''); };

  // share buttons and links: label them for this device, then share on click
  function label() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-share="four"] .lbl'), function (e) { e.textContent = F.canShare() ? 'Share the four' : 'Copy all four'; });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-share]'); if (!a) return;
    e.preventDefault();
    var box = a.closest('[data-sharebox]') || a.parentNode, msg = box.querySelector('.sharemsg');
    if (a.getAttribute('data-share') === 'four') { var t = F.fourText(); F.share({ title: 'The Striper Recount', text: t, copy: t }, { msg: msg }); }
    else { var u = F.pageUrl(); F.share({ title: document.title, text: M.shareText, url: u, copy: u }, { msg: msg, ok: 'Link copied. Paste it anywhere.' }); }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', label); else label();
})();
