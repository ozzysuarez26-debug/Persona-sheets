/* Tabs for the tools under the sheet (Character / Damage Calculator).
   To add a tab: add a <button role="tab" aria-controls="ID"> to the .tabs bar in index.html
   and a matching <div class="tabpanel" id="ID" role="tabpanel" hidden> panel. No change needed here. */
(function () {
  'use strict';
  var tabs = [].slice.call(document.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  var KEY = ((window.SHEET_CONFIG && window.SHEET_CONFIG.storageKey) || 'persona-sheet') + '-tab';

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    try { localStorage.setItem(KEY, tab.id); } catch (e) {}
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var start = tabs.filter(function (t) { return t.id === saved; })[0] || tabs[0];
  select(start);
})();
