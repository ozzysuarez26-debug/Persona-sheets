/* Multi-persona local save manager with portable JSON backup/import. */
(function () {
  'use strict';

  var CONFIG = window.SHEET_CONFIG;
  var REGISTRY_KEY = 'persona-sheet-personas-v1';
  var ACTIVE_KEY = REGISTRY_KEY + ':active';
  var registry;

  function makeId() {
    return 'p-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  }
  function readRegistry() {
    try {
      var parsed = JSON.parse(localStorage.getItem(REGISTRY_KEY) || 'null');
      if (parsed && Array.isArray(parsed.personas)) {
        return { personas: parsed.personas.filter(function (p) {
          return p && typeof p.id === 'string' && typeof p.name === 'string' && typeof p.storageKey === 'string';
        }) };
      }
    } catch (e) { /* Start from the existing single-sheet save below. */ }
    return null;
  }
  function persistRegistry() {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  }

  registry = readRegistry();
  if (!registry || !registry.personas.length) {
    registry = { personas: [{ id: makeId(), name: 'Persona 1', storageKey: CONFIG.storageKey }] };
    persistRegistry();
  }

  var activeId = localStorage.getItem(ACTIVE_KEY);
  var active = registry.personas.find(function (p) { return p.id === activeId; }) || registry.personas[0];
  localStorage.setItem(ACTIVE_KEY, active.id);
  CONFIG.storageKey = active.storageKey;

  var panel = document.createElement('section');
  panel.className = 'panel ctl';
  panel.setAttribute('aria-label', 'Persona save manager');
  var heading = document.createElement('h2');
  heading.textContent = 'Personas and transfer';
  panel.appendChild(heading);

  var row = document.createElement('div');
  row.className = 'row';
  var selectWrap = document.createElement('div');
  var label = document.createElement('label');
  label.htmlFor = 'personaSelect';
  label.textContent = 'Current persona';
  var select = document.createElement('select');
  select.id = 'personaSelect';
  select.setAttribute('aria-label', 'Choose persona');
  selectWrap.appendChild(label);
  selectWrap.appendChild(select);
  row.appendChild(selectWrap);

  function addButton(text, action) {
    var button = document.createElement('button');
    button.className = 'b';
    button.type = 'button';
    button.textContent = text;
    button.addEventListener('click', action);
    row.appendChild(button);
    return button;
  }
  var message = document.createElement('p');
  message.className = 'msg';
  message.setAttribute('role', 'status');
  message.setAttribute('aria-live', 'polite');

  function refreshSelect() {
    select.textContent = '';
    registry.personas.forEach(function (p) {
      var option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.name;
      option.selected = p.id === active.id;
      select.appendChild(option);
    });
  }
  function showError(text) { message.textContent = text; }
  function reloadTo(persona) {
    try {
      persistRegistry();
      localStorage.setItem(ACTIVE_KEY, persona.id);
      window.location.reload();
    } catch (e) {
      showError('Could not save the persona list in this browser. Check available storage space.');
    }
  }

  select.addEventListener('change', function () {
    var next = registry.personas.find(function (p) { return p.id === select.value; });
    if (next) reloadTo(next);
  });
  addButton('New persona', function () {
    var name = window.prompt('Name this persona:', 'New persona');
    if (name === null) return;
    name = name.trim().slice(0, 80);
    if (!name) { showError('Please enter a persona name.'); return; }
    var next = { id: makeId(), name: name, storageKey: 'persona-sheet-' + makeId() };
    registry.personas.push(next);
    try { localStorage.removeItem(next.storageKey); reloadTo(next); }
    catch (e) { registry.personas.pop(); showError('Could not create a persona. Browser storage may be full.'); }
  });
  addButton('Rename', function () {
    var name = window.prompt('Rename this persona:', active.name);
    if (name === null) return;
    name = name.trim().slice(0, 80);
    if (!name) { showError('Please enter a persona name.'); return; }
    active.name = name;
    try { persistRegistry(); refreshSelect(); showError('Persona renamed.'); }
    catch (e) { showError('Could not save the persona name.'); }
  });
  addButton('Delete', function () {
    if (!window.confirm('Delete "' + active.name + '" and its saved data? This cannot be undone.')) return;
    var old = active;
    registry.personas = registry.personas.filter(function (p) { return p.id !== old.id; });
    try { localStorage.removeItem(old.storageKey); }
    catch (e) { showError('Could not delete the saved persona.'); return; }
    if (!registry.personas.length) {
      active = { id: makeId(), name: 'Persona 1', storageKey: CONFIG.storageKey };
      registry.personas.push(active);
    } else active = registry.personas[0];
    reloadTo(active);
  });

  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json,.json';
  fileInput.hidden = true;
  fileInput.setAttribute('aria-label', 'Choose persona backup file');
  addButton('Export personas', function () {
    try {
      var payload = {
        format: 'persona-sheets-backup',
        version: 1,
        exportedAt: new Date().toISOString(),
        personas: registry.personas.map(function (p) {
          var raw = localStorage.getItem(p.storageKey);
          return { name: p.name, state: raw ? JSON.parse(raw) : {} };
        })
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'persona-sheets-backup.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showError('Backup downloaded. Move that JSON file to your other device, then import it there.');
    } catch (e) { showError('Could not export. Browser storage may be unavailable or full.'); }
  });
  addButton('Import backup', function () { fileInput.click(); });
  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onerror = function () { showError('Could not read that file.'); };
    reader.onload = function () {
      try {
        var backup = JSON.parse(reader.result);
        if (!backup || backup.format !== 'persona-sheets-backup' || backup.version !== 1 ||
            !Array.isArray(backup.personas) || !backup.personas.length || backup.personas.length > 100) {
          throw new Error('This is not a supported Persona Sheets backup.');
        }
        var imported = backup.personas.map(function (p) {
          if (!p || typeof p.name !== 'string' || !p.state || typeof p.state !== 'object' || Array.isArray(p.state)) {
            throw new Error('The backup contains an invalid persona.');
          }
          return {
            id: makeId(),
            name: (p.name.trim().slice(0, 80) || 'Imported persona'),
            storageKey: 'persona-sheet-' + makeId(),
            state: p.state
          };
        });
        imported.forEach(function (p) { localStorage.setItem(p.storageKey, JSON.stringify(p.state)); });
        imported.forEach(function (p) { delete p.state; registry.personas.push(p); });
        persistRegistry();
        refreshSelect();
        showError('Imported ' + imported.length + ' persona(s). Choose one from the list to open it.');
      } catch (e) {
        showError(e.message || 'Import failed. Check the backup file and available browser storage.');
      }
      fileInput.value = '';
    };
    reader.readAsText(file);
  });

  refreshSelect();
  panel.appendChild(row);
  panel.appendChild(fileInput);
  panel.appendChild(message);
  var wrap = document.querySelector('.wrap');
  var footer = document.querySelector('.foot');
  if (wrap) wrap.insertBefore(panel, footer || null);
})();
