(() => {
  'use strict';

  const STORE_KEY = 'nova-os-state-v1';
  const APP_DEFS = [
    { id: 'files', name: 'Files', icon: '📁', width: 760, height: 520 },
    { id: 'notes', name: 'Notepad', icon: '📝', width: 700, height: 510 },
    { id: 'calculator', name: 'Calculator', icon: '🧮', width: 360, height: 510 },
    { id: 'browser', name: 'Browser', icon: '🌐', width: 820, height: 590 },
    { id: 'settings', name: 'Settings', icon: '⚙️', width: 760, height: 560 },
    { id: 'terminal', name: 'Terminal', icon: '🖥️', width: 690, height: 460 },
    { id: 'recycle', name: 'Recycle Bin', icon: '🗑️', width: 690, height: 460 },
    { id: 'performance', name: 'Performance', icon: '◒', width: 680, height: 450 },
    { id: 'profile', name: 'Your account', icon: '👤', width: 520, height: 440 }
  ];
  const DESKTOP_APPS = ['files', 'notes', 'calculator', 'browser', 'settings', 'terminal', 'recycle'];
  const PINNED_APPS = ['files', 'browser', 'notes', 'calculator', 'settings'];
  const DEFAULT_STATE = {
    settings: { theme: 'dark', wallpaper: 0, accent: '#8ed8c4', taskbarPosition: 'bottom', iconSize: 'medium', notifications: true, sounds: false, pin: '1234' },
    user: { username: 'Nova User', computerName: 'NOVA-DESKTOP', picture: '' },
    files: [
      { id: 'welcome', name: 'Welcome.txt', type: 'text', location: 'Desktop', content: 'Welcome to Nova OS.\n\nYour browser is now a little desktop of its own.\n\nTry the Start menu, open an app, or right-click in this folder.', modified: Date.now() },
      { id: 'project', name: 'Final project.txt', type: 'text', location: 'Documents', content: 'Operating System Simulator\n\nA small world running entirely in your browser.', modified: Date.now() },
      { id: 'todo', name: 'Weekend plans.txt', type: 'text', location: 'Documents', content: '1. Make something useful\n2. Take a proper break', modified: Date.now() },
      { id: 'downloads', name: 'Nova-setup.zip', type: 'archive', location: 'Downloads', content: 'A pretend archive. No installation required.', modified: Date.now() },
      { id: 'photo', name: 'Coastline.jpg', type: 'image', location: 'Pictures', content: 'A quiet afternoon by the water.', modified: Date.now() },
      { id: 'music', name: 'Soft Focus.mp3', type: 'audio', location: 'Music', content: '03:42 · Nova Radio', modified: Date.now() },
      { id: 'video', name: 'Studio tour.mp4', type: 'video', location: 'Videos', content: '01:18 · Local video sample', modified: Date.now() }
    ],
    recycle: [], drafts: {}, bookmarks: ['search.nova', 'school.nova', 'news.nova', 'weather.nova'], notifications: [], recent: [], desktopPositions: {}, windowPositions: {}
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const loadState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return clone(DEFAULT_STATE);
      return {
        ...clone(DEFAULT_STATE), ...saved,
        settings: { ...clone(DEFAULT_STATE.settings), ...(saved.settings || {}) },
        user: { ...clone(DEFAULT_STATE.user), ...(saved.user || {}) },
        files: Array.isArray(saved.files) ? saved.files : clone(DEFAULT_STATE.files),
        recycle: Array.isArray(saved.recycle) ? saved.recycle : [], drafts: saved.drafts || {},
        notifications: Array.isArray(saved.notifications) ? saved.notifications : [],
        bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks : clone(DEFAULT_STATE.bookmarks),
        recent: Array.isArray(saved.recent) ? saved.recent : [], desktopPositions: saved.desktopPositions || {}, windowPositions: saved.windowPositions || {}
      };
    } catch { return clone(DEFAULT_STATE); }
  };
  let state = loadState();
  let zIndex = 20;
  let selectedFileId = null;
  let activeNoteId = null;
  let newNoteDraft = false;
  let currentFolder = 'Desktop';
  let fileSort = 'name';
  let fileQuery = '';
  let calcExpression = '';
  let calendarOffset = 0;
  let terminalHistory = [];
  let terminalHistoryIndex = -1;
  let matrixFrame = 0;
  let matrixAnimation = null;
  let performanceTimer = null;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const appDef = id => APP_DEFS.find(app => app.id === id) || APP_DEFS[0];
  const iconForFile = file => ({ folder: '📁', text: '📝', image: '🖼️', audio: '🎵', video: '🎬', archive: '📦', pdf: '📄' }[file.type] || '📄');
  const persist = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { toast('Storage is full', 'Remove a few files and try again.'); } };
  const getAppWindow = id => $(`.window[data-app="${id}"]`);
  const windows = () => $$('.window', $('#windowLayer'));
  const notify = (title, message, icon = '◉') => {
    if (!state.settings.notifications) return;
    const item = { id: `${Date.now()}-${Math.random()}`, title, message, icon, time: Date.now() };
    state.notifications.unshift(item);
    state.notifications = state.notifications.slice(0, 40);
    persist(); renderNotificationDot();
    toast(title, message, icon);
    if (state.settings.sounds) playSound();
  };
  function toast(title, message, icon = '◉') {
    const stack = $('#toastStack');
    const node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = `<strong>${escapeHTML(icon)} &nbsp;${escapeHTML(title)}</strong><p>${escapeHTML(message)}</p>`;
    stack.append(node);
    setTimeout(() => node.remove(), 3900);
  }
  function playSound() {
    try {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator(); const gain = audio.createGain();
      oscillator.frequency.value = 680; gain.gain.value = .035; oscillator.connect(gain); gain.connect(audio.destination);
      oscillator.start(); oscillator.stop(audio.currentTime + .07); oscillator.onended = () => audio.close();
    } catch { /* Audio is optional. */ }
  }
  const setAvatar = (node, size = 'avatar') => {
    node.className = size;
    node.innerHTML = state.user.picture ? `<img alt="" src="${escapeHTML(state.user.picture)}">` : escapeHTML((state.user.username.trim()[0] || 'N').toUpperCase());
  };
  function applySettings() {
    const shell = $('#desktopShell');
    shell.classList.toggle('light-mode', state.settings.theme === 'light');
    shell.classList.remove('icon-small', 'icon-large');
    if (state.settings.iconSize === 'small') shell.classList.add('icon-small');
    if (state.settings.iconSize === 'large') shell.classList.add('icon-large');
    document.documentElement.style.setProperty('--accent', state.settings.accent || '#8ed8c4');
    const desktop = $('#desktop'); desktop.dataset.wallpaper = String(state.settings.wallpaper || 0);
    const taskbar = $('#taskbar'); taskbar.classList.remove('position-top', 'position-left');
    shell.classList.remove('taskbar-top', 'taskbar-left');
    if (state.settings.taskbarPosition !== 'bottom') taskbar.classList.add(`position-${state.settings.taskbarPosition}`);
    if (state.settings.taskbarPosition === 'top') shell.classList.add('taskbar-top');
    if (state.settings.taskbarPosition === 'left') shell.classList.add('taskbar-left');
    renderDesktopIcons(); renderTaskbar(); renderProfileBits(); updateLockScreen();
  }
  function renderProfileBits() {
    $('#lockUsername').textContent = state.user.username;
    setAvatar($('#lockAvatar'));
    setAvatar($('#trayAvatar'), 'avatar avatar-small');
    const username = $('#startMenu .start-top strong'); if (username) username.textContent = state.user.username;
  }
  function renderDesktopIcons() {
    const holder = $('#desktopIcons');
    holder.innerHTML = DESKTOP_APPS.map((id, index) => {
      const app = appDef(id); const pos = state.desktopPositions[id] || { x: 12, y: 12 + index * 98 };
      return `<button class="desktop-icon" data-app="${id}" style="left:${pos.x}px;top:${pos.y}px" aria-label="Open ${escapeHTML(app.name)}"><span class="app-glyph">${app.icon}</span><span>${escapeHTML(app.name)}</span></button>`;
    }).join('');
    $$('.desktop-icon', holder).forEach(icon => {
      icon.addEventListener('pointerdown', startIconDrag);
      icon.addEventListener('dblclick', event => { event.preventDefault(); openApp(icon.dataset.app); });
      icon.addEventListener('click', () => { if (icon.dataset.moved !== '1') openApp(icon.dataset.app); });
    });
  }
  function startIconDrag(event) {
    if (event.button !== 0) return;
    const icon = event.currentTarget; const rect = icon.getBoundingClientRect();
    const originX = event.clientX; const originY = event.clientY; let moved = false;
    icon.setPointerCapture(event.pointerId);
    const move = moveEvent => {
      const dx = moveEvent.clientX - originX; const dy = moveEvent.clientY - originY;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      const x = Math.max(0, Math.min($('#desktop').clientWidth - icon.offsetWidth, rect.left - $('#desktop').getBoundingClientRect().left + dx));
      const y = Math.max(0, Math.min($('#desktop').clientHeight - icon.offsetHeight, rect.top - $('#desktop').getBoundingClientRect().top + dy));
      if (moved) { icon.style.left = `${x}px`; icon.style.top = `${y}px`; }
    };
    const end = () => {
      icon.removeEventListener('pointermove', move); icon.removeEventListener('pointerup', end);
      if (moved) {
        icon.dataset.moved = '1';
        state.desktopPositions[icon.dataset.app] = { x: parseFloat(icon.style.left), y: parseFloat(icon.style.top) };
        persist(); setTimeout(() => { icon.dataset.moved = '0'; }, 80);
      }
    };
    icon.addEventListener('pointermove', move); icon.addEventListener('pointerup', end, { once: true });
  }
  function renderTaskbar() {
    $('#pinnedApps').innerHTML = PINNED_APPS.map(id => `<button class="taskbar-app" data-launch="${id}" title="${escapeHTML(appDef(id).name)}" aria-label="Open ${escapeHTML(appDef(id).name)}">${appDef(id).icon}</button>`).join('');
    $('#runningApps').innerHTML = windows().map(win => {
      const id = win.dataset.app; const app = appDef(id);
      return `<button class="taskbar-app running ${win.classList.contains('minimized') ? '' : (win.classList.contains('active-window') ? 'focused' : '')}" data-window="${id}" title="${escapeHTML(app.name)}">${app.icon}</button>`;
    }).join('');
  }
  function appContent(id) {
    if (id === 'files') return fileManagerMarkup();
    if (id === 'notes') return notesMarkup();
    if (id === 'calculator') return calculatorMarkup();
    if (id === 'browser') return browserMarkup();
    if (id === 'terminal') return terminalMarkup();
    if (id === 'settings') return settingsMarkup('Personalization');
    if (id === 'recycle') return recycleMarkup();
    if (id === 'performance') return performanceMarkup();
    if (id === 'profile') return profileMarkup();
    return '<p class="empty-state">Nothing to show.</p>';
  }
  function openApp(id) {
    const app = appDef(id); let win = getAppWindow(id);
    if (win) { win.classList.remove('minimized'); focusWindow(win); }
    else {
      const saved = state.windowPositions[id];
      win = document.createElement('section'); win.className = 'window'; win.dataset.app = id; win.style.zIndex = ++zIndex;
      const defaultLeft = Math.max(10, (window.innerWidth - app.width) / 2 + (windows().length % 4) * 22);
      const defaultTop = Math.max(10, (window.innerHeight - app.height) / 2 - 24 + (windows().length % 4) * 18);
      win.style.left = `${saved?.x ?? defaultLeft}px`; win.style.top = `${saved?.y ?? defaultTop}px`;
      win.style.width = `${saved?.width ?? app.width}px`; win.style.height = `${saved?.height ?? app.height}px`;
      win.innerHTML = `<header class="window-titlebar"><div class="window-title"><span class="app-glyph">${app.icon}</span><span>${escapeHTML(app.name)}</span></div><div class="window-controls"><button class="window-control" data-window-action="minimize" aria-label="Minimize">−</button><button class="window-control" data-window-action="maximize" aria-label="Maximize">□</button><button class="window-control close" data-window-action="close" aria-label="Close">×</button></div></header><div class="window-body">${appContent(id)}</div>`;
      $('#windowLayer').append(win); bindWindowDrag(win); focusWindow(win);
      if (id === 'browser') bindBrowser(win);
      if (id === 'performance') startPerformance(win);
      if (id === 'terminal') setTimeout(() => $('.terminal-form input', win)?.focus(), 30);
    }
    state.recent = [id, ...state.recent.filter(item => item !== id)].slice(0, 6); persist(); renderTaskbar(); closePanels();
    if (!win.dataset.opened) { notify(`${app.name} opened`, 'Ready when you are.', app.icon); win.dataset.opened = '1'; }
    if (id === 'terminal') setTimeout(() => $('.terminal-form input', win)?.focus(), 30);
    return win;
  }
  function focusWindow(win) {
    windows().forEach(item => item.classList.remove('active-window'));
    win.classList.remove('minimized'); win.classList.add('active-window'); win.style.zIndex = ++zIndex; renderTaskbar();
  }
  function bindWindowDrag(win) {
    const bar = $('.window-titlebar', win); let drag = null;
    bar.addEventListener('pointerdown', event => {
      if (event.target.closest('.window-controls') || win.classList.contains('maximized')) return;
      focusWindow(win); drag = { x: event.clientX, y: event.clientY, left: win.offsetLeft, top: win.offsetTop };
      bar.setPointerCapture(event.pointerId);
    });
    bar.addEventListener('pointermove', event => {
      if (!drag) return;
      const maxX = Math.max(0, $('#desktop').clientWidth - 120); const maxY = Math.max(0, $('#desktop').clientHeight - 44);
      win.style.left = `${Math.min(maxX, Math.max(-win.offsetWidth + 120, drag.left + event.clientX - drag.x))}px`;
      win.style.top = `${Math.min(maxY, Math.max(0, drag.top + event.clientY - drag.y))}px`;
    });
    bar.addEventListener('pointerup', () => { if (drag) persistWindowPosition(win); drag = null; });
    win.addEventListener('pointerdown', () => focusWindow(win));
    win.addEventListener('dblclick', event => { if (event.target.closest('.window-titlebar') && !event.target.closest('.window-controls')) toggleMaximize(win); });
    win.addEventListener('pointerup', () => { if (!win.classList.contains('maximized')) persistWindowPosition(win); });
  }
  function persistWindowPosition(win) {
    state.windowPositions[win.dataset.app] = { x: win.offsetLeft, y: win.offsetTop, width: win.offsetWidth, height: win.offsetHeight }; persist();
  }
  function toggleMaximize(win) {
    if (win.classList.contains('maximized')) {
      win.classList.remove('maximized'); const saved = win.dataset.restore;
      if (saved) { const rect = JSON.parse(saved); win.style.left = rect.left; win.style.top = rect.top; win.style.width = rect.width; win.style.height = rect.height; }
    } else {
      win.dataset.restore = JSON.stringify({ left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height }); win.classList.add('maximized');
    }
    focusWindow(win);
  }
  function closeWindow(win) {
    if (win.dataset.app === 'performance') clearInterval(performanceTimer);
    if (win.dataset.app === 'notes') saveDraft();
    win.remove(); renderTaskbar();
    const remaining = windows().filter(item => !item.classList.contains('minimized'));
    if (remaining.length) focusWindow(remaining.at(-1));
  }
  function fileManagerMarkup() {
    const places = ['Home', 'Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Videos'];
    const files = visibleFiles();
    return `<div class="app-layout"><aside class="app-sidebar"><div class="side-heading">Places</div>${places.map(place => `<button class="side-item ${currentFolder === place ? 'selected' : ''}" data-folder="${escapeHTML(place)}">${({ Home: '⌂', Desktop: '▦', Documents: '▤', Downloads: '↓', Pictures: '▧', Music: '♫', Videos: '▷' })[place]} &nbsp;${place}</button>`).join('')}</aside><section class="file-main"><div class="app-toolbar"><button data-action="new-folder">＋ Folder</button><button data-action="new-file">＋ Text file</button><input class="file-search" placeholder="Search this folder" value="${escapeHTML(fileQuery)}" aria-label="Search files"><select class="file-sort" aria-label="Sort files"><option value="name" ${fileSort === 'name' ? 'selected' : ''}>Name</option><option value="modified" ${fileSort === 'modified' ? 'selected' : ''}>Date modified</option><option value="type" ${fileSort === 'type' ? 'selected' : ''}>Type</option></select><button title="Refresh" data-action="refresh">↻</button></div><div class="file-list" data-file-list>${files.length ? files.map(file => `<button class="file-card ${selectedFileId === file.id ? 'selected' : ''}" data-file-id="${escapeHTML(file.id)}"><span class="file-glyph">${iconForFile(file)}</span><strong>${escapeHTML(file.name)}</strong><small>${file.type === 'folder' ? 'Folder' : new Date(file.modified).toLocaleDateString()}</small></button>`).join('') : '<div class="empty-state">This folder is empty.</div>'}</div><div class="file-status">${files.length} item${files.length === 1 ? '' : 's'} · ${escapeHTML(currentFolder)}</div></section></div>`;
  }
  function visibleFiles() {
    const list = currentFolder === 'Home' ? state.files : state.files.filter(file => file.location === currentFolder);
    const filtered = list.filter(file => file.name.toLowerCase().includes(fileQuery.toLowerCase()));
    return filtered.sort((a, b) => fileSort === 'modified' ? b.modified - a.modified : fileSort === 'type' ? a.type.localeCompare(b.type) : a.name.localeCompare(b.name));
  }
  function rerenderApp(id) {
    const win = getAppWindow(id); if (!win) return;
    const activeElement = document.activeElement; const keep = activeElement?.classList.contains('file-search') || activeElement?.classList.contains('global-search');
    $('.window-body', win).innerHTML = appContent(id);
    if (keep) { const input = $('.file-search', win); input?.focus(); input?.setSelectionRange(input.value.length, input.value.length); }
  }
  function notesMarkup() {
    const textFiles = state.files.filter(file => file.type === 'text');
    const current = newNoteDraft ? null : (textFiles.find(file => file.id === activeNoteId) || textFiles[0] || null);
    if (current) activeNoteId = current.id;
    const content = current ? (state.drafts[current.id] ?? current.content) : (state.drafts.new || '');
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    return `<div class="editor-shell"><div class="editor-toolbar"><select class="note-select" aria-label="Open document"><option value="" ${!current ? 'selected' : ''}>New draft</option>${textFiles.map(file => `<option value="${escapeHTML(file.id)}" ${current?.id === file.id ? 'selected' : ''}>${escapeHTML(file.name)}</option>`).join('')}</select><button data-action="note-new">New</button><button data-action="note-open">Open</button><button data-action="note-save">Save</button><button data-action="note-save-as">Save as</button><button data-action="note-rename">Rename</button><button data-action="note-delete">Delete</button></div><textarea class="note-editor" spellcheck="true" placeholder="Start with a blank page...">${escapeHTML(content)}</textarea><div class="editor-meta"><span>${current ? escapeHTML(current.name) : 'Unsaved draft'}</span><span class="note-count">${content.length} characters · ${words} words</span></div></div>`;
  }
  function saveDraft() {
    const editor = $('.note-editor', getAppWindow('notes')); if (!editor) return;
    if (activeNoteId) state.drafts[activeNoteId] = editor.value; else state.drafts.new = editor.value;
    persist();
  }
  function calculatorMarkup() {
    const keys = ['AC', '⌫', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '±', '0', '.', '='];
    return `<div class="calc-shell"><div class="calc-display"><div class="calc-expression">${escapeHTML(calcExpression)}</div><div class="calc-result" data-calc-result>0</div></div><div class="calc-grid">${keys.map(key => `<button class="calc-key ${['÷', '×', '−', '+', '%'].includes(key) ? 'operator' : ''} ${key === '=' ? 'equals' : ''}" data-calc="${key}">${key}</button>`).join('')}</div><div class="calc-history" data-calc-history>${(state.calcHistory || []).slice(0, 3).map(row => `<div><span>${escapeHTML(row.expression)}</span><strong>${escapeHTML(row.result)}</strong></div>`).join('')}</div></div>`;
  }
  function browserMarkup() {
    return `<div class="browser-shell"><div class="browser-tabs"><button class="browser-tab active" data-browser-tab="1">Nova tab</button><button class="browser-tab add-tab" data-action="browser-new-tab" title="New tab">＋</button></div><div class="browser-bar"><button data-action="browser-back" title="Back">←</button><button data-action="browser-forward" title="Forward">→</button><button data-action="browser-refresh" title="Refresh">↻</button><button data-action="browser-home" title="Home">⌂</button><form class="browser-address-form"><input class="browser-address" aria-label="Address" placeholder="Search or enter an address" value="search.nova"></form><button data-action="browser-bookmark" title="Bookmark">☆</button></div><div class="browser-bookmarks">${state.bookmarks.map(site => `<button data-site="${escapeHTML(site)}">☆ ${escapeHTML(site.replace('.nova', ''))}</button>`).join('')}</div><div class="browser-page" data-browser-page></div></div>`;
  }
  function terminalMarkup() {
    return `<div class="terminal-shell"><div class="terminal-output" data-terminal-output><div>Nova OS Terminal [Version 1.0]</div><div>Type <span style="color:var(--accent)">help</span> to explore. Type <span style="color:var(--accent)">matrix</span> for a little detour.</div><br></div><form class="terminal-form"><label>${escapeHTML(state.user.computerName.toLowerCase())}&nbsp;›</label><input aria-label="Terminal command" autocomplete="off" spellcheck="false"></form></div>`;
  }
  function settingsMarkup(section) {
    const sections = ['Personalization', 'System', 'Notifications', 'Privacy', 'About'];
    let content = '';
    if (section === 'Personalization') content = `<div class="settings-section"><h3>Appearance</h3><div class="setting-row"><span>Color mode<small>Choose a comfortable workspace</small></span><select data-setting="theme"><option value="dark" ${state.settings.theme === 'dark' ? 'selected' : ''}>Dark</option><option value="light" ${state.settings.theme === 'light' ? 'selected' : ''}>Light</option></select></div><div class="setting-row"><span>Accent color</span><input type="color" data-setting="accent" value="${escapeHTML(state.settings.accent)}"></div><div class="setting-row"><span>Wallpaper</span><div class="wallpaper-swatches">${['linear-gradient(135deg,#18253c,#9a8e79)', 'linear-gradient(145deg,#19283b,#467572 58%,#f1af6b)', 'linear-gradient(135deg,#20364b,#8ed8c4)', 'linear-gradient(135deg,#29263b,#d2ae91)'].map((bg, index) => `<button class="wallpaper-swatch ${Number(state.settings.wallpaper) === index ? 'selected' : ''}" style="background:${bg}" data-wallpaper="${index}" aria-label="Wallpaper ${index + 1}"></button>`).join('')}</div></div></div><div class="settings-section"><h3>Desktop</h3><div class="setting-row"><span>Taskbar position</span><select data-setting="taskbarPosition"><option value="bottom" ${state.settings.taskbarPosition === 'bottom' ? 'selected' : ''}>Bottom</option><option value="top" ${state.settings.taskbarPosition === 'top' ? 'selected' : ''}>Top</option><option value="left" ${state.settings.taskbarPosition === 'left' ? 'selected' : ''}>Left</option></select></div><div class="setting-row"><span>Desktop icon size</span><select data-setting="iconSize"><option value="small" ${state.settings.iconSize === 'small' ? 'selected' : ''}>Small</option><option value="medium" ${state.settings.iconSize === 'medium' ? 'selected' : ''}>Medium</option><option value="large" ${state.settings.iconSize === 'large' ? 'selected' : ''}>Large</option></select></div></div><div class="settings-section"><h3>Account security</h3><div class="setting-row"><span>Lock screen PIN</span><button data-action="change-pin">Change PIN</button></div></div>`;
    if (section === 'System') content = `<div class="settings-section"><h3>Device specifications</h3>${[['Edition', 'Nova OS Simulator'], ['Version', '1.0.0'], ['Browser engine', 'JavaScript'], ['Computer name', escapeHTML(state.user.computerName)], ['Memory', 'Simulated · 8 GB'], ['Storage', `${(JSON.stringify(state.files).length / 1024).toFixed(1)} KB used locally`]].map(row => `<div class="setting-row"><span>${row[0]}</span><span>${row[1]}</span></div>`).join('')}<button data-open-app="performance">Open performance dashboard</button></div>`;
    if (section === 'Notifications') content = `<div class="settings-section"><h3>Notification preferences</h3><div class="setting-row"><span>Show notifications<small>Application alerts and system messages</small></span><input type="checkbox" data-setting="notifications" ${state.settings.notifications ? 'checked' : ''}></div><div class="setting-row"><span>Notification sounds</span><input type="checkbox" data-setting="sounds" ${state.settings.sounds ? 'checked' : ''}></div><button data-action="fake-message">Send a test message</button></div>`;
    if (section === 'Privacy') content = `<div class="settings-section"><h3>Local data</h3><p class="settings-subtitle">Your files and settings are stored in this browser on this device.</p><div class="setting-row"><span>Clear notification history</span><button data-action="clear-notifications">Clear</button></div><div class="setting-row"><span>Reset settings<small>Restore appearance and notification defaults</small></span><button data-action="reset-settings">Reset settings</button></div><div class="setting-row"><span>Reset Nova OS<small>Delete all local files, notes, and simulator settings</small></span><button class="danger-button" data-action="reset-os">Reset OS</button></div></div>`;
    if (section === 'About') content = `<div class="settings-section"><div class="profile-preview"><div class="boot-mark" style="font-size:44px">N<span>.</span></div><div><h3>Nova OS Simulator</h3><small class="settings-subtitle">Version 1.0.0 · Stable</small></div></div><p class="settings-subtitle">A browser desktop made with HTML, CSS &amp; JavaScript. Everything stays on this device.</p><div class="setting-row"><span>Computer</span><span>${escapeHTML(state.user.computerName)}</span></div><div class="setting-row"><span>Signed in as</span><span>${escapeHTML(state.user.username)}</span></div><button data-open-app="profile">Manage your account</button></div>`;
    if (section === 'Personalization') content = content.replace(/<div class="settings-section"><h3>Account security<\/h3><div class="setting-row"><span>Lock screen PIN<\/span><button data-action="change-pin">Change PIN<\/button><\/div><\/div>/, '');
    if (section === 'Privacy') content += `<div class="settings-section"><h3>Passcode options</h3><div class="setting-row"><span>Change lock screen passcode<small>Choose a new 4 to 12 digit PIN.</small></span><button data-action="change-pin">Change PIN</button></div><div class="setting-row"><span>Remove passcode<small>${state.settings.pin ? 'Unlock without entering a PIN.' : 'The lock screen already has no passcode.'}</small></span><button class="danger-button" data-action="remove-pin" ${state.settings.pin ? '' : 'disabled'}>Remove passcode</button></div></div>`;
    return `<div class="settings-shell"><nav class="settings-nav">${sections.map(item => `<button class="side-item ${section === item ? 'selected' : ''}" data-settings-section="${item}">${({ Personalization: '◐', System: '▣', Notifications: '♧', Privacy: '◇', About: 'ⓘ' })[item]} &nbsp;${item}</button>`).join('')}</nav><section class="settings-main"><h2>${section}</h2><p class="settings-subtitle">${section === 'Personalization' ? 'Make this workspace feel like yours.' : section === 'System' ? 'A quick view of this simulated device.' : section === 'Privacy' ? 'Manage the data stored in this browser.' : section === 'About' ? 'A small desktop, made for the web.' : 'Choose which alerts you receive.'}</p>${content}</section></div>`;
  }
  function recycleMarkup() {
    return `<div class="app-toolbar"><button data-action="empty-recycle" ${state.recycle.length ? '' : 'disabled'}>Empty recycle bin</button><span class="toolbar-spacer"></span><span style="font-size:10px;color:#9eabbe">${state.recycle.length} item${state.recycle.length === 1 ? '' : 's'}</span></div><div class="file-list">${state.recycle.length ? state.recycle.map(file => `<div class="file-card"><span class="file-glyph">${iconForFile(file)}</span><strong>${escapeHTML(file.name)}</strong><small>Deleted ${new Date(file.deletedAt).toLocaleDateString()}</small><div style="display:flex;gap:4px"><button data-restore="${escapeHTML(file.id)}" title="Restore">↶</button><button data-permanent-delete="${escapeHTML(file.id)}" title="Delete permanently">×</button></div></div>`).join('') : '<div class="empty-state">Recycle Bin is empty.</div>'}</div>`;
  }
  function performanceMarkup() {
    return `<div class="performance-grid">${[['CPU', 'cpu'], ['Memory', 'ram'], ['Storage', 'storage'], ['Network', 'network']].map(([label, id]) => `<div class="metric-card" data-metric="${id}"><div class="metric-head"><span>${label}</span><span data-metric-value>--%</span></div><div class="metric-value" data-metric-large>--%</div><div class="metric-bar"><i></i></div><div class="chart"></div></div>`).join('')}</div>`;
  }
  function profileMarkup() {
    return `<section class="settings-main"><h2>Your account</h2><p class="settings-subtitle">Personalize the details shown around Nova OS.</p><form class="profile-form"><div class="profile-preview"><span class="avatar" data-profile-avatar></span><span><strong>${escapeHTML(state.user.username)}</strong><small class="settings-subtitle">Local account</small></span></div><label>Profile picture URL<input name="picture" type="text" placeholder="https://example.com/photo.jpg" value="${escapeHTML(state.user.picture)}"></label><label>Username<input name="username" type="text" maxlength="30" required value="${escapeHTML(state.user.username)}"></label><label>Computer name<input name="computerName" type="text" maxlength="24" required value="${escapeHTML(state.user.computerName)}"></label><button class="primary-button" type="submit">Save profile</button></form></section>`;
  }
  function bindBrowser(win) {
    const page = $('[data-browser-page]', win); if (!page) return;
    const browser = { tabs: [{ id: 1, title: 'Nova tab', history: ['search.nova'], index: 0 }], activeId: 1, nextId: 2 };
    const activeTab = () => browser.tabs.find(tab => tab.id === browser.activeId);
    const render = (address = activeTab().history[activeTab().index]) => {
      const tab = activeTab(); tab.address = address; tab.title = address === 'search.nova' ? 'Nova tab' : address.replace(/^https?:\/\//, '').split(/[/?]/)[0];
      $('.browser-address', win).value = address; page.innerHTML = fakeSite(address); renderBrowserTabs(win);
    };
    browser.render = render;
    browser.navigate = address => { const tab = activeTab(); tab.history = tab.history.slice(0, tab.index + 1); tab.history.push(address); tab.index++; render(address); };
    browser.go = offset => { const tab = activeTab(); tab.index = Math.max(0, Math.min(tab.history.length - 1, tab.index + offset)); render(tab.history[tab.index]); };
    browser.selectTab = id => { if (browser.tabs.some(tab => tab.id === id)) { browser.activeId = id; render(); } };
    browser.addTab = () => { const id = browser.nextId++; browser.tabs.push({ id, title: 'Nova tab', history: ['search.nova'], index: 0 }); browser.activeId = id; render(); };
    browser.closeTab = id => {
      if (browser.tabs.length === 1) { browser.tabs[0] = { id: browser.nextId++, title: 'Nova tab', history: ['search.nova'], index: 0 }; browser.activeId = browser.tabs[0].id; }
      else { const index = browser.tabs.findIndex(tab => tab.id === id); browser.tabs = browser.tabs.filter(tab => tab.id !== id); if (browser.activeId === id) browser.activeId = browser.tabs[Math.max(0, index - 1)].id; }
      render();
    };
    win._browser = browser; render();
  }
  function renderBrowserTabs(win) {
    const browser = win._browser; const holder = $('.browser-tabs', win); if (!browser || !holder) return;
    holder.innerHTML = `${browser.tabs.map(tab => `<button class="browser-tab ${tab.id === browser.activeId ? 'active' : ''}" data-browser-tab="${tab.id}"><span>${escapeHTML(tab.title)}</span><span class="tab-close" data-browser-close="${tab.id}" aria-label="Close tab">×</span></button>`).join('')}<button class="browser-tab add-tab" data-action="browser-new-tab" title="New tab">＋</button>`;
  }
  function fakeSite(address) {
    const clean = address.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!clean || clean === 'home' || clean === 'nova://home') return `<div class="web-home"><h1>Good morning.</h1><p>A small collection of places on the Nova network.</p><form class="web-search"><input name="query" placeholder="Search the Nova network" aria-label="Search the Nova network"><button>Search</button></form><div class="site-grid">${[['Search Engine', 'search.nova', 'Find something useful'], ['School Portal', 'school.nova', 'Classes, calendar, and updates'], ['News', 'news.nova', 'Today, in brief'], ['Weather', 'weather.nova', 'A look outside'], ['Social Network', 'social.nova', 'People you know'], ['Video Platform', 'video.nova', 'Watch something good']].map(([name, site, desc]) => `<button class="site-card" data-site="${site}"><b>${name}</b><small>${desc}</small></button>`).join('')}</div></div>`;
    if (clean.startsWith('search.nova') || !clean.includes('.nova')) {
      const query = clean.includes('?q=') ? decodeURIComponent(clean.split('?q=')[1]) : '';
      return `<div class="web-home"><h1 style="color:#3679d4">nova<span style="color:#ef7d68">.</span>search</h1><form class="web-search"><input name="query" value="${escapeHTML(query)}" placeholder="Search the Nova network"><button>Search</button></form>${query ? `<h3>Results for “${escapeHTML(query)}”</h3><p>Nothing on the public web, but your local files are always close by.</p><button class="site-card" data-open-app="files">Search local files</button>` : '<p>Curious minds welcome.</p>'}</div>`;
    }
    const sites = {
      'school.nova': ['Northstar School', 'Your week at a glance.', ['Monday · Design studio', 'Wednesday · Systems lab', 'Friday · Final project presentations']],
      'news.nova': ['The Daily Nova', 'Small stories, clearly told.', ['The library extends its quiet hours', 'Community garden celebrates a first harvest', 'Local students build a browser desktop']],
      'weather.nova': ['Nova Weather', 'A bright, breezy afternoon.', ['Now · 21° · Partly sunny', 'Feels like 20°', 'Sunset · 7:14 PM']],
      'social.nova': ['Gather', 'Good things happen when we keep in touch.', ['Mina shared a photo from the coast', 'Ari is working on a tiny game', 'You have 2 new messages']],
      'video.nova': ['Nova Video', 'A little something for your next break.', ['Making a keyboard from scratch · 12 min', 'A walk through the greenhouse · 8 min', 'The art of a really good sandwich · 6 min']]
    };
    const [title, subtitle, items] = sites[clean] || ['Page not found', 'That address is not on the Nova network.', ['Try search.nova, school.nova, news.nova, weather.nova, social.nova, or video.nova']];
    return `<header class="site-header">${title}</header><article class="site-content"><h1>${title}</h1><p>${subtitle}</p>${items.map(item => `<p class="site-link">${item}</p>`).join('')}<p><button class="site-card" data-site="search.nova">← Back to Nova Search</button></p></article>`;
  }
  function renderStartMenu() {
    const menu = $('#startMenu');
    menu.innerHTML = `<div class="start-top"><span class="avatar" data-start-avatar></span><div><strong>${escapeHTML(state.user.username)}</strong><small>${escapeHTML(state.user.computerName)}</small></div><button class="text-button" data-open-app="profile" style="margin-left:auto">Account</button></div><input class="start-search" placeholder="Search apps and files" aria-label="Search apps and files"><div class="start-section-head"><span>Pinned</span><button class="text-button" data-show-all>All apps&nbsp; →</button></div><div class="start-app-grid">${APP_DEFS.slice(0, 8).map(app => `<button class="start-app" data-launch="${app.id}"><span class="app-glyph">${app.icon}</span><span>${escapeHTML(app.name)}</span></button>`).join('')}</div><div class="start-section-head"><span>Recently opened</span></div><div class="start-recent">${state.recent.slice(0, 4).map(id => `<button class="recent-item" data-launch="${id}">${appDef(id).icon}<span>${escapeHTML(appDef(id).name)}</span></button>`).join('') || '<span style="padding:8px;color:#9eabbe;font-size:10px">Your recent apps will show up here.</span>'}</div><div class="start-footer"><button data-open-app="profile">◉ &nbsp;${escapeHTML(state.user.username)}</button><button data-action="power-menu">⏻ &nbsp;Power</button></div><div class="power-options is-hidden"><button data-action="lock">Lock</button><button data-action="restart">Restart Simulator</button><button data-action="shutdown">Shut Down Simulator</button></div>`;
    setAvatar($('[data-start-avatar]', menu));
  }
  function openSearch(initial = '') {
    const panel = $('#searchPanel'); panel.classList.remove('is-hidden');
    panel.innerHTML = `<input class="global-search" placeholder="Search apps, files, settings, and notes" aria-label="Search everything" value="${escapeHTML(initial)}"><div class="search-results"></div>`;
    renderSearchResults(initial); $('.global-search', panel).focus(); closePanels(panel);
  }
  function renderSearchResults(query) {
    const results = $('.search-results', $('#searchPanel')); if (!results) return;
    const q = query.trim().toLowerCase();
    const matches = [];
    APP_DEFS.forEach(app => { if (!q || app.name.toLowerCase().includes(q)) matches.push({ icon: app.icon, title: app.name, detail: 'Application', action: `app:${app.id}` }); });
    state.files.forEach(file => { if (q && `${file.name} ${file.content || ''}`.toLowerCase().includes(q)) matches.push({ icon: iconForFile(file), title: file.name, detail: `File · ${file.location}`, action: `file:${file.id}` }); });
    if ('personalization system notifications privacy about'.includes(q) && q) matches.push({ icon: '⚙️', title: 'Settings', detail: 'Settings', action: 'app:settings' });
    results.innerHTML = matches.slice(0, 12).map(item => `<button class="search-result" data-search-action="${escapeHTML(item.action)}"><span class="app-glyph">${item.icon}</span><span>${escapeHTML(item.title)}<small>${escapeHTML(item.detail)}</small></span></button>`).join('') || '<p class="empty-state">No matches yet.</p>';
  }
  function renderNotificationDot() { $('#notificationDot').classList.toggle('is-hidden', !state.notifications.length); }
  function openNotifications() {
    const panel = $('#notificationPanel'); panel.classList.remove('is-hidden');
    panel.innerHTML = `<div class="panel-head"><h2>Notifications</h2><button class="text-button" data-action="clear-notifications">Clear all</button></div>${state.notifications.length ? state.notifications.map(item => `<article class="notification-item"><span class="app-glyph">${escapeHTML(item.icon)}</span><div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.message)}</p><time>${timeAgo(item.time)}</time></div><button data-dismiss-notification="${escapeHTML(item.id)}" aria-label="Dismiss notification">×</button></article>`).join('') : '<div class="empty-state">You’re all caught up.</div>'}`;
    closePanels(panel);
  }
  const timeAgo = time => { const m = Math.max(0, Math.floor((Date.now() - time) / 60000)); return m < 1 ? 'Just now' : m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`; };
  function renderCalendar() {
    const panel = $('#calendarPanel'); const now = new Date(); const shown = new Date(now.getFullYear(), now.getMonth() + calendarOffset, 1);
    const startDay = new Date(shown.getFullYear(), shown.getMonth(), 1).getDay(); const days = new Date(shown.getFullYear(), shown.getMonth() + 1, 0).getDate();
    const cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => `<span class="weekday">${day}</span>`);
    for (let i = 0; i < startDay; i++) cells.push('<span></span>');
    for (let day = 1; day <= days; day++) cells.push(`<span class="${calendarOffset === 0 && day === now.getDate() ? 'today' : ''}">${day}</span>`);
    panel.innerHTML = `<div class="calendar-now">${new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(now)}</div><div class="calendar-full-date">${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now)}</div><div class="calendar-nav"><button data-calendar="prev">‹</button><strong>${new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(shown)}</strong><button data-calendar="next">›</button></div><div class="calendar-grid">${cells.join('')}</div>`;
  }
  function closePanels(except = null) {
    ['startMenu', 'searchPanel', 'notificationPanel', 'calendarPanel'].forEach(id => { const panel = $(`#${id}`); if (panel !== except) panel.classList.add('is-hidden'); });
    $('#contextMenu').classList.add('is-hidden');
  }
  function togglePanel(id, render) {
    const panel = $(`#${id}`); const opening = panel.classList.contains('is-hidden'); closePanels(opening ? panel : null);
    if (!opening) return;
    if (render) render(); panel.classList.remove('is-hidden');
  }
  function newFile(type, name, location = currentFolder === 'Home' ? 'Desktop' : currentFolder) {
    const baseName = name || (type === 'folder' ? 'New folder' : 'New document.txt');
    const file = { id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: baseName, type, location, content: type === 'text' ? '' : '', modified: Date.now() };
    state.files.push(file); selectedFileId = file.id; persist(); notify(type === 'folder' ? 'Folder created' : 'File created', baseName, iconForFile(file));
    return file;
  }
  function deleteFile(id) {
    const index = state.files.findIndex(file => file.id === id); if (index < 0) return;
    const [file] = state.files.splice(index, 1); file.deletedAt = Date.now(); state.recycle.unshift(file);
    delete state.drafts[id]; persist(); notify('Moved to Recycle Bin', `${file.name} can be restored later.`, '🗑️');
  }
  function showModal(title, message, defaultValue, callback, confirmText = 'Save') {
    const layer = $('#modalLayer'); layer.innerHTML = `<div class="modal-backdrop"><form class="modal-box"><h2>${escapeHTML(title)}</h2><p>${escapeHTML(message)}</p>${defaultValue !== null ? `<input name="value" autocomplete="off" value="${escapeHTML(defaultValue)}" aria-label="${escapeHTML(title)}">` : ''}<div class="modal-actions"><button type="button" data-action="modal-cancel">Cancel</button><button class="primary-button" type="submit">${escapeHTML(confirmText)}</button></div></form></div>`;
    const form = $('form', layer); if (defaultValue !== null) { $('input', form).focus(); $('input', form).select(); }
    form.addEventListener('submit', event => { event.preventDefault(); const value = $('input', form)?.value; layer.innerHTML = ''; callback(value); });
    $('.modal-backdrop', layer).addEventListener('click', event => { if (event.target.classList.contains('modal-backdrop')) layer.innerHTML = ''; });
  }
  function showFileContext(event, fileId = null) {
    event.preventDefault(); const menu = $('#contextMenu'); selectedFileId = fileId;
    const entries = fileId ? [['open', 'Open'], ['rename', 'Rename'], ['move', 'Move to…'], ['delete', 'Delete'], ['properties', 'Properties'], ['refresh', 'Refresh']] : [['new-folder', 'New Folder'], ['new-file', 'New Text File'], ['refresh', 'Refresh']];
    menu.innerHTML = entries.map(([action, label]) => `<button role="menuitem" data-action="${action}" data-context-file="${escapeHTML(fileId || '')}">${label}</button>`).join('');
    const desktopRect = $('#desktop').getBoundingClientRect(); menu.style.left = `${Math.max(5, Math.min(event.clientX - desktopRect.left, desktopRect.width - 180))}px`; menu.style.top = `${Math.max(5, Math.min(event.clientY - desktopRect.top, desktopRect.height - 170))}px`; menu.classList.remove('is-hidden');
  }
  function actOnFile(action, id) {
    const file = state.files.find(item => item.id === id);
    if (action === 'new-folder') { const name = prompt('Folder name', 'New folder'); if (name?.trim()) { newFile('folder', name.trim()); rerenderApp('files'); } }
    else if (action === 'new-file') { const name = prompt('Text file name', 'New document.txt'); if (name?.trim()) { const item = newFile('text', name.trim()); selectedFileId = item.id; rerenderApp('files'); } }
    else if (!file) return;
    else if (action === 'open') openFile(file);
    else if (action === 'delete') { deleteFile(id); rerenderApp('files'); rerenderApp('recycle'); }
    else if (action === 'rename') showModal('Rename item', 'Choose a new name for this item.', file.name, value => { if (value?.trim()) { file.name = value.trim(); file.modified = Date.now(); persist(); rerenderApp('files'); notify('File renamed', file.name, iconForFile(file)); } });
    else if (action === 'move') showModal('Move item', 'Enter Desktop, Documents, Downloads, Pictures, Music, or Videos.', file.location, value => { const place = ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Videos'].find(item => item.toLowerCase() === value?.trim().toLowerCase()); if (place) { file.location = place; file.modified = Date.now(); persist(); rerenderApp('files'); notify('File moved', `${file.name} · ${place}`, iconForFile(file)); } else toast('Choose a known folder', 'Try Documents, Downloads, Pictures, Music, Videos, or Desktop.'); });
    else if (action === 'properties') showModal(file.name, `Type: ${file.type}\nLocation: ${file.location}\nModified: ${new Date(file.modified).toLocaleString()}\n${file.type === 'text' ? `Characters: ${file.content.length}` : ''}`, null, () => {}, 'Done');
    else if (action === 'refresh') rerenderApp('files');
  }
  function openFile(file) {
    if (file.type === 'folder') { currentFolder = file.location === 'Home' ? file.name : `${file.location}/${file.name}`; rerenderApp('files'); return; }
    if (file.type === 'text') { activeNoteId = file.id; newNoteDraft = false; openApp('notes'); rerenderApp('notes'); }
    else showModal(file.name, `${file.content || 'No preview available.'}\n\nLocation: ${file.location}`, null, () => {}, 'Close');
  }
  function calcPress(key, win) {
    const result = $('[data-calc-result]', win); if (!result) return;
    if (key === 'AC') calcExpression = '';
    else if (key === '⌫') calcExpression = calcExpression.slice(0, -1);
    else if (key === '±') calcExpression = calcExpression.startsWith('-') ? calcExpression.slice(1) : `-${calcExpression}`;
    else if (key === '=') {
      const value = evaluateExpression(calcExpression);
      if (value !== null) {
        (state.calcHistory ||= []).unshift({ expression: calcExpression, result: String(value) }); state.calcHistory = state.calcHistory.slice(0, 20); result.textContent = String(value); $('.calc-expression', win).textContent = `${calcExpression} =`; calcExpression = String(value); persist(); $('[data-calc-history]', win).innerHTML = state.calcHistory.slice(0, 3).map(row => `<div><span>${escapeHTML(row.expression)}</span><strong>${escapeHTML(row.result)}</strong></div>`).join(''); return;
      }
      result.textContent = 'Error'; calcExpression = ''; return;
    } else calcExpression += ({ '÷': '/', '×': '*', '−': '-', '%': '%' }[key] || key);
    $('.calc-expression', win).textContent = calcExpression;
    const preview = evaluateExpression(calcExpression); result.textContent = preview === null ? (calcExpression ? '…' : '0') : String(preview);
  }
  function evaluateExpression(expression) {
    if (!expression || !/^[\d+\-*/().%\s]+$/.test(expression)) return null;
    const normalized = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)').replace(/[+\-*/.]\s*$/, '');
    if (!normalized) return null;
    try { const value = Function(`"use strict"; return (${normalized})`)(); return Number.isFinite(value) ? Number(value.toPrecision(11)) : null; } catch { return null; }
  }
  function terminalPrint(win, text, className = '') {
    const output = $('[data-terminal-output]', win); if (!output) return;
    const line = document.createElement('div'); line.className = className; line.textContent = text; output.append(line); output.scrollTop = output.scrollHeight;
  }
  function runCommand(win, command) {
    const raw = command.trim(); if (!raw) return;
    terminalPrint(win, `${state.user.computerName.toLowerCase()} › ${raw}`, 'terminal-line');
    terminalHistory.unshift(raw); terminalHistoryIndex = -1;
    const [base, ...args] = raw.split(' '); const lower = base.toLowerCase(); const rest = args.join(' ');
    const print = text => terminalPrint(win, text);
    if (lower === 'help') print('help  clear  date  time  whoami  about  apps  files  pwd  ls  echo\ncalculator  systeminfo  neofetch\nTry sudo, matrix, coffee, 42, or konami.');
    else if (lower === 'clear') $('[data-terminal-output]', win).innerHTML = '';
    else if (lower === 'date') print(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    else if (lower === 'time') print(new Date().toLocaleTimeString());
    else if (lower === 'whoami') print(`${state.user.username} · ${state.user.computerName}`);
    else if (lower === 'about') print('Nova OS Simulator 1.0 · built with HTML, CSS & JavaScript.');
    else if (lower === 'apps') print(APP_DEFS.map(app => app.name).join('  ·  '));
    else if (lower === 'files' || lower === 'ls' || lower === 'dir') print((currentFolder === 'Home' ? state.files : state.files.filter(file => file.location === currentFolder)).map(file => `${iconForFile(file)} ${file.name}`).join('\n') || 'This folder is empty.');
    else if (lower === 'pwd') print(`/Users/${state.user.username.replace(/\s/g, '_')}/${currentFolder}`);
    else if (lower === 'echo') print(rest);
    else if (lower === 'systeminfo') print(`OS: Nova OS Simulator\nVersion: 1.0\nBrowser Engine: JavaScript\nMemory: Simulated\nStorage: LocalStorage\nComputer: ${state.user.computerName}`);
    else if (lower === 'neofetch') print(`       .--.      ${state.user.username}\n      |o_o |     Nova OS 1.0\n      |:_/ |     JavaScript\n     //   \\ \\    LocalStorage\n    (|     | )\n   /'\\_   _/\u0060\\`);
    else if (lower === 'calculator') { print('Opening calculator…'); openApp('calculator'); }
    else if (lower === 'sudo') print('Nice try. You already have enough power to make a very good cup of tea.');
    else if (lower === 'matrix') { print('Wake up, Nova…'); activateMatrix(); }
    else if (lower === 'konami') { print('Secret mode unlocked: the desktop is yours. ↑ ↑ ↓ ↓ ← → ← → B A'); document.body.classList.toggle('secret-mode'); toast('Secret mode', 'You found the quiet switch.', '✦'); }
    else if (lower === 'coffee') { print('Brewing a fresh cup of ☕. Productivity is now an optional setting.'); notify('Coffee break', 'The simulated kettle is on.', '☕'); }
    else if (lower === '42') print('The answer is 42. The question is probably in your Documents folder.');
    else if (lower === 'sudo rm' || raw.toLowerCase().includes('rm -rf')) print('Absolutely not. Your files are safer than that.');
    else if (lower === 'open' && rest) openApp(rest.toLowerCase());
    else print(`Command not found: ${base}. Try "help".`);
  }
  function activateMatrix() {
    const layer = $('#matrixLayer'); const canvas = $('#matrixCanvas'); layer.classList.remove('is-hidden');
    const ctx = canvas.getContext('2d'); const chars = 'アイウエオカキクケコ012345789NOVＡ'; let drops = [];
    const resize = () => { canvas.width = Math.floor(layer.clientWidth * devicePixelRatio); canvas.height = Math.floor(layer.clientHeight * devicePixelRatio); ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); drops = Array(Math.ceil(layer.clientWidth / 17)).fill(1); };
    resize(); window.addEventListener('resize', resize, { once: true }); cancelAnimationFrame(matrixAnimation);
    const draw = () => {
      if (layer.classList.contains('is-hidden')) return;
      ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(0, 0, layer.clientWidth, layer.clientHeight); ctx.fillStyle = '#75f2a2'; ctx.font = '14px monospace';
      drops.forEach((y, index) => { ctx.fillText(chars[Math.floor(Math.random() * chars.length)], index * 17, y * 17); if (y * 17 > layer.clientHeight && Math.random() > .98) drops[index] = 0; drops[index]++; });
      matrixAnimation = requestAnimationFrame(draw);
    };
    draw();
  }
  function startPerformance(win) {
    clearInterval(performanceTimer);
    performanceTimer = setInterval(() => {
      if (!win.isConnected) { clearInterval(performanceTimer); return; }
      $$('.metric-card', win).forEach(card => {
        const id = card.dataset.metric; const value = id === 'storage' ? Math.floor(30 + state.files.length * 2 + Math.random() * 3) : id === 'network' ? Math.floor(8 + Math.random() * 72) : Math.floor(16 + Math.random() * 68);
        $('[data-metric-value]', card).textContent = `${value}%`; $('[data-metric-large]', card).textContent = id === 'network' ? `${(value * .34).toFixed(1)} Mbps` : `${value}%`; $('.metric-bar i', card).style.width = `${value}%`;
        const chart = $('.chart', card); const heights = [...$$('i', chart).map(node => parseInt(node.style.height, 10) || 10), value].slice(-16); chart.innerHTML = heights.map(height => `<i style="height:${Math.max(8, height)}%"></i>`).join('');
      });
    }, 850);
  }
  function updateClock() {
    const now = new Date(); $('#taskbarTime').textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); $('#taskbarDate').textContent = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' });
    $('#lockClock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); $('#lockDate').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    if (!$('#calendarPanel').classList.contains('is-hidden')) renderCalendar();
  }
  function updateLockScreen() {
    const hasPasscode = Boolean(state.settings.pin);
    const input = $('#pinInput'); input.classList.toggle('is-hidden', !hasPasscode); input.required = hasPasscode;
    input.placeholder = hasPasscode ? 'Enter passcode' : ''; input.setAttribute('aria-label', hasPasscode ? 'Enter passcode' : 'No passcode required');
    $('#unlockForm button[type="submit"]').innerHTML = hasPasscode ? 'Unlock <span aria-hidden="true">→</span>' : 'Continue <span aria-hidden="true">→</span>';
    $('#pinError').textContent = hasPasscode ? 'Enter your passcode to continue' : 'Passcode removed. Anyone can unlock this simulator.';
  }
  function lockOS() { $('#desktopShell').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden'); $('#pinInput').value = ''; updateLockScreen(); }
  function unlockOS(event) {
    event?.preventDefault(); const pin = $('#pinInput').value;
    if (state.settings.pin && pin !== String(state.settings.pin)) { $('#pinError').textContent = 'That passcode did not match. Try again.'; $('#pinInput').select(); return; }
    $('#lockScreen').classList.add('is-hidden'); $('#desktopShell').classList.remove('is-hidden'); $('#pinError').textContent = ''; $('#pinInput').value = ''; applySettings();
  }
  function shutdown() {
    closePanels(); $('#desktopShell').classList.add('is-hidden'); $('#shutdownScreen').classList.remove('is-hidden');
  }
  function resetOS() {
    localStorage.removeItem(STORE_KEY); state = clone(DEFAULT_STATE); currentFolder = 'Desktop'; selectedFileId = null; activeNoteId = null; newNoteDraft = false; windows().forEach(win => win.remove()); applySettings(); renderStartMenu(); renderNotificationDot();
    $('#shutdownScreen').classList.add('is-hidden'); $('#desktopShell').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden');
  }
  function init() {
    renderStartMenu(); renderDesktopIcons(); renderTaskbar(); renderNotificationDot(); updateClock(); setInterval(updateClock, 1000);
    setTimeout(() => { $('#bootScreen').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden'); $('#pinInput').focus(); }, 1600);
    $('#unlockForm').addEventListener('submit', unlockOS);
    $('#startButton').addEventListener('click', () => togglePanel('startMenu', renderStartMenu));
    $('#searchButton').addEventListener('click', () => openSearch());
    $('#notificationButton').addEventListener('click', () => togglePanel('notificationPanel', openNotifications));
    $('#clockButton').addEventListener('click', () => togglePanel('calendarPanel', renderCalendar));
    $('#profileButton').addEventListener('click', () => openApp('profile'));
    $('#trayNetwork').addEventListener('click', () => toast('Network', 'Connected to Nova network.', '◔'));
    $('#trayVolume').addEventListener('click', () => toast('Volume', 'Volume is set to 68%.', '◖'));
    $('#trayBattery').addEventListener('click', () => toast('Battery', '86% · Power source: simulated.', '▰'));
    $('#powerOnButton').addEventListener('click', () => { $('#shutdownScreen').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden'); });
    $('#matrixLayer .matrix-close').addEventListener('click', () => { $('#matrixLayer').classList.add('is-hidden'); cancelAnimationFrame(matrixAnimation); });
    $('#desktop').addEventListener('pointerdown', event => { if (event.target === $('#desktop')) closePanels(); });
    $('#desktop').addEventListener('contextmenu', event => { if (event.target === $('#desktop') || event.target.classList.contains('wallpaper-glow')) { event.preventDefault(); const menu = $('#contextMenu'); menu.innerHTML = '<button data-action="new-folder">New Folder</button><button data-action="new-file">New Text File</button><button data-action="refresh">Refresh</button><button data-open-app="settings">Personalize</button>'; const rect = $('#desktop').getBoundingClientRect(); menu.style.left = `${event.clientX - rect.left}px`; menu.style.top = `${event.clientY - rect.top}px`; menu.classList.remove('is-hidden'); } });
    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleChange);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('contextmenu', event => { const card = event.target.closest('.file-card[data-file-id]'); if (card) showFileContext(event, card.dataset.fileId); else if (event.target.closest('[data-file-list]')) showFileContext(event); });
    document.addEventListener('dblclick', event => { const card = event.target.closest('.file-card[data-file-id]'); if (card) { const file = state.files.find(item => item.id === card.dataset.fileId); if (file) openFile(file); } });
    document.addEventListener('keydown', handleKeydown);
    renderProfileBits(); applySettings();
  }
  function handleClick(event) {
    const target = event.target.closest('button'); if (!target) return;
    if (target.dataset.launch) { openApp(target.dataset.launch); return; }
    if (target.dataset.window) { const win = getAppWindow(target.dataset.window); if (!win) return; if (win.classList.contains('active-window') && !win.classList.contains('minimized')) { win.classList.add('minimized'); renderTaskbar(); } else focusWindow(win); return; }
    if (target.dataset.app && target.classList.contains('desktop-icon')) { openApp(target.dataset.app); return; }
    if (target.dataset.windowAction) {
      const win = target.closest('.window');
      if (target.dataset.windowAction === 'close') closeWindow(win);
      if (target.dataset.windowAction === 'minimize') { win.classList.add('minimized'); renderTaskbar(); }
      if (target.dataset.windowAction === 'maximize') toggleMaximize(win);
      return;
    }
    if (target.dataset.folder) { currentFolder = target.dataset.folder; fileQuery = ''; selectedFileId = null; rerenderApp('files'); return; }
    if (target.dataset.fileId) { selectedFileId = target.dataset.fileId; rerenderApp('files'); return; }
    if (target.dataset.action) { handleAction(target.dataset.action, target); return; }
    if (target.dataset.openApp) { openApp(target.dataset.openApp); return; }
    if (target.dataset.settingsSection) { const win = target.closest('.window'); $('.window-body', win).innerHTML = settingsMarkup(target.dataset.settingsSection); return; }
    if (target.dataset.wallpaper !== undefined) { state.settings.wallpaper = Number(target.dataset.wallpaper); persist(); applySettings(); rerenderApp('settings'); notify('Wallpaper updated', 'Your desktop has a new view.', '◐'); return; }
    if (target.dataset.calc) { calcPress(target.dataset.calc, target.closest('.window')); return; }
    const closeTab = event.target.closest('[data-browser-close]');
    if (closeTab) { target.closest('.window')?._browser?.closeTab(Number(closeTab.dataset.browserClose)); return; }
    if (target.dataset.browserTab) { target.closest('.window')?._browser?.selectTab(Number(target.dataset.browserTab)); return; }
    if (target.dataset.site) { navigateBrowser(target.closest('.window'), target.dataset.site); return; }
    if (target.dataset.searchAction) { const [type, value] = target.dataset.searchAction.split(':'); closePanels(); if (type === 'app') openApp(value); else { const file = state.files.find(item => item.id === value); if (file) openFile(file); } return; }
    if (target.dataset.restore) { const file = state.recycle.find(item => item.id === target.dataset.restore); if (file) { delete file.deletedAt; state.files.push(file); state.recycle = state.recycle.filter(item => item.id !== file.id); persist(); rerenderApp('recycle'); rerenderApp('files'); notify('File restored', file.name, iconForFile(file)); } return; }
    if (target.dataset.permanentDelete) { state.recycle = state.recycle.filter(item => item.id !== target.dataset.permanentDelete); persist(); rerenderApp('recycle'); return; }
    if (target.dataset.dismissNotification) { state.notifications = state.notifications.filter(item => item.id !== target.dataset.dismissNotification); persist(); renderNotificationDot(); openNotifications(); return; }
    if (target.dataset.calendar) { calendarOffset += target.dataset.calendar === 'next' ? 1 : -1; renderCalendar(); return; }
    if (target.hasAttribute('data-show-all')) { $('.start-app-grid', $('#startMenu')).innerHTML = APP_DEFS.map(app => `<button class="start-app" data-launch="${app.id}"><span class="app-glyph">${app.icon}</span><span>${escapeHTML(app.name)}</span></button>`).join(''); target.textContent = 'All apps'; return; }
  }
  function handleAction(action, target) {
    const win = target.closest('.window'); const fileId = target.dataset.contextFile || selectedFileId;
    if (action.startsWith('new-') || ['open', 'rename', 'move', 'delete', 'properties', 'refresh'].includes(action)) { actOnFile(action, fileId); $('#contextMenu').classList.add('is-hidden'); return; }
    if (action === 'modal-cancel') { $('#modalLayer').innerHTML = ''; return; }
    if (action === 'power-menu') { $('.power-options', $('#startMenu')).classList.toggle('is-hidden'); return; }
    if (action === 'lock') { closePanels(); lockOS(); return; }
    if (action === 'restart') { closePanels(); windows().forEach(item => item.remove()); $('#desktopShell').classList.add('is-hidden'); $('#lockScreen').classList.add('is-hidden'); $('#shutdownScreen').classList.add('is-hidden'); $('#bootScreen').classList.remove('is-hidden'); setTimeout(() => { $('#bootScreen').classList.add('is-hidden'); $('#lockScreen').classList.remove('is-hidden'); }, 1400); return; }
    if (action === 'shutdown') { shutdown(); return; }
    if (action === 'refresh') { rerenderApp('files'); return; }
    if (action === 'browser-home') { navigateBrowser(win, 'search.nova'); return; }
    if (action === 'browser-back') { win?._browser?.go(-1); return; }
    if (action === 'browser-forward') { win?._browser?.go(1); return; }
    if (action === 'browser-refresh') { win?._browser?.render(); return; }
    if (action === 'browser-bookmark') { const address = $('.browser-address', win).value; state.bookmarks = state.bookmarks.includes(address) ? state.bookmarks.filter(item => item !== address) : [address, ...state.bookmarks]; persist(); $('.browser-bookmarks', win).innerHTML = state.bookmarks.map(site => `<button data-site="${escapeHTML(site)}">☆ ${escapeHTML(site.replace('.nova', ''))}</button>`).join(''); return; }
    if (action === 'browser-new-tab') { win?._browser?.addTab(); return; }
    if (action === 'browser-close-tab') { win?._browser?.closeTab(Number(target.dataset.browserClose)); return; }
    if (action === 'note-new') { saveDraft(); activeNoteId = null; newNoteDraft = true; rerenderApp('notes'); $('.note-editor', getAppWindow('notes'))?.focus(); return; }
    if (action === 'note-open') { const text = state.files.find(file => file.type === 'text'); if (text) { activeNoteId = text.id; newNoteDraft = false; rerenderApp('notes'); } else toast('No documents found', 'Create a new text file first.'); return; }
    if (action === 'note-save') { saveNote(); return; }
    if (action === 'note-save-as') { showModal('Save document as', 'Choose a name for your text file.', 'Untitled.txt', value => { if (!value?.trim()) return; const file = newFile('text', value.trim(), 'Documents'); file.content = $('.note-editor', getAppWindow('notes'))?.value || ''; activeNoteId = file.id; newNoteDraft = false; persist(); rerenderApp('notes'); notify('Document saved', file.name, '📝'); }); return; }
    if (action === 'note-rename') { const file = state.files.find(item => item.id === activeNoteId); if (file) showModal('Rename document', 'Choose a new document name.', file.name, value => { if (value?.trim()) { file.name = value.trim(); file.modified = Date.now(); persist(); rerenderApp('notes'); notify('Document renamed', file.name, '📝'); } }); return; }
    if (action === 'note-delete') { if (activeNoteId) { deleteFile(activeNoteId); activeNoteId = null; newNoteDraft = true; rerenderApp('notes'); } else { state.drafts.new = ''; persist(); rerenderApp('notes'); } return; }
    if (action === 'change-pin') { showModal('Change passcode', 'Choose a new passcode using 4 to 12 digits.', '', value => { if (/^\d{4,12}$/.test(value || '')) { state.settings.pin = value; persist(); updateLockScreen(); rerenderApp('settings'); notify('Passcode updated', 'Your next unlock will use the new passcode.', '🔒'); } else toast('Passcode not changed', 'Use between 4 and 12 digits.'); }); return; }
    if (action === 'remove-pin') { if (!state.settings.pin) return; showModal('Remove passcode?', 'Anyone with access to this device will be able to unlock Nova OS without a passcode.', null, () => { state.settings.pin = ''; persist(); updateLockScreen(); rerenderApp('settings'); notify('Passcode removed', 'The lock screen no longer requires a passcode.', '🔓'); }, 'Remove passcode'); return; }
    if (action === 'fake-message') { notify('A note from Mina', 'The new desktop is looking good. See you after class!', '✉'); return; }
    if (action === 'clear-notifications') { state.notifications = []; persist(); renderNotificationDot(); if (!$('#notificationPanel').classList.contains('is-hidden')) openNotifications(); return; }
    if (action === 'reset-settings') { state.settings = { ...clone(DEFAULT_STATE.settings), pin: state.settings.pin }; persist(); applySettings(); rerenderApp('settings'); notify('Settings reset', 'Appearance and alerts are back to default.'); return; }
    if (action === 'reset-os') { showModal('Reset Nova OS?', 'This permanently clears local files, notes, bookmarks, notifications, and settings. This cannot be undone.', null, resetOS, 'Reset OS'); return; }
    if (action === 'empty-recycle') { if (state.recycle.length) showModal('Empty Recycle Bin?', 'These deleted items will be permanently removed.', null, () => { state.recycle = []; persist(); rerenderApp('recycle'); notify('Recycle Bin emptied', 'Deleted files have been removed.', '🗑️'); }, 'Empty'); return; }
  }
  function saveNote() {
    const editor = $('.note-editor', getAppWindow('notes')); if (!editor) return;
    if (!activeNoteId) { const file = newFile('text', `Note ${new Date().toLocaleDateString()}.txt`, 'Documents'); activeNoteId = file.id; }
    const file = state.files.find(item => item.id === activeNoteId); if (!file) return;
    file.content = editor.value; file.modified = Date.now(); delete state.drafts[file.id]; newNoteDraft = false; persist(); rerenderApp('notes'); notify('Note saved', file.name, '📝');
  }
  function navigateBrowser(win, address) {
    if (!win) return; const browser = win._browser;
    if (browser) browser.navigate(address);
    else { bindBrowser(win); win._browser?.navigate(address); }
  }
  function handleInput(event) {
    const target = event.target;
    if (target.classList.contains('global-search')) renderSearchResults(target.value);
    if (target.classList.contains('start-search')) {
      const q = target.value.toLowerCase(); $$('.start-app', $('#startMenu')).forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(q); });
      if (q) { openSearch(q); target.value = q; }
    }
    if (target.classList.contains('file-search')) { fileQuery = target.value; const win = target.closest('.window'); const list = $('[data-file-list]', win); const files = visibleFiles(); list.innerHTML = files.length ? files.map(file => `<button class="file-card" data-file-id="${escapeHTML(file.id)}"><span class="file-glyph">${iconForFile(file)}</span><strong>${escapeHTML(file.name)}</strong><small>${file.type === 'folder' ? 'Folder' : new Date(file.modified).toLocaleDateString()}</small></button>`).join('') : '<div class="empty-state">No matching files.</div>'; return; }
    if (target.classList.contains('note-editor')) { saveDraft(); const text = target.value; const words = text.trim() ? text.trim().split(/\s+/).length : 0; $('.note-count', target.closest('.editor-shell')).textContent = `${text.length} characters · ${words} words`; }
  }
  function handleChange(event) {
    const target = event.target;
    if (target.matches('[data-setting]')) {
      const key = target.dataset.setting; state.settings[key] = target.type === 'checkbox' ? target.checked : target.value; persist(); applySettings(); rerenderApp('settings'); notify('Setting updated', `${key === 'theme' ? 'Color mode' : key === 'accent' ? 'Accent color' : key === 'taskbarPosition' ? 'Taskbar position' : key === 'iconSize' ? 'Icon size' : 'Notification preference'} changed.`, '⚙️');
    }
    if (target.classList.contains('file-sort')) { fileSort = target.value; rerenderApp('files'); }
    if (target.classList.contains('note-select')) { saveDraft(); activeNoteId = target.value || null; newNoteDraft = !target.value; rerenderApp('notes'); }
  }
  function handleSubmit(event) {
    const form = event.target;
    if (form.classList.contains('terminal-form')) { event.preventDefault(); const input = $('input', form); const command = input.value; input.value = ''; runCommand(form.closest('.window'), command); }
    if (form.classList.contains('browser-address-form')) { event.preventDefault(); const address = $('.browser-address', form.closest('.window')).value.trim(); navigateBrowser(form.closest('.window'), address || 'search.nova'); }
    if (form.classList.contains('web-search')) { event.preventDefault(); const query = new FormData(form).get('query') || ''; navigateBrowser(form.closest('.window'), `search.nova?q=${encodeURIComponent(query)}`); }
    if (form.classList.contains('profile-form')) {
      event.preventDefault(); const data = new FormData(form); state.user.username = String(data.get('username')).trim() || 'Nova User'; state.user.computerName = String(data.get('computerName')).trim().replace(/\s+/g, '-').toUpperCase() || 'NOVA-DESKTOP'; state.user.picture = String(data.get('picture')).trim(); persist(); renderProfileBits(); renderStartMenu(); rerenderApp('profile'); notify('Profile updated', `Welcome, ${state.user.username}.`, '👤');
    }
    if (form.classList.contains('modal-box')) { /* Modal owns its own submit handler. */ }
  }
  function handleKeydown(event) {
    const key = event.key.toLowerCase();
    if (event.ctrlKey && key === 'k') { event.preventDefault(); openSearch(); return; }
    if (event.ctrlKey && event.altKey && key === 't') { event.preventDefault(); openApp('terminal'); return; }
    if (event.ctrlKey && event.shiftKey && key === 'e') { event.preventDefault(); openApp('files'); return; }
    if (event.ctrlKey && key === 'n') { event.preventDefault(); openApp('notes'); activeNoteId = null; newNoteDraft = true; rerenderApp('notes'); return; }
    if (event.key === 'Meta' || event.key === 'OS') { togglePanel('startMenu', renderStartMenu); return; }
    if (event.altKey && event.key === 'Tab') { event.preventDefault(); const list = windows(); if (!list.length) return; const active = list.findIndex(win => win.classList.contains('active-window')); focusWindow(list[(active + 1) % list.length]); return; }
    if (event.key === 'Escape') { closePanels(); $('#modalLayer').innerHTML = ''; $('#matrixLayer').classList.add('is-hidden'); cancelAnimationFrame(matrixAnimation); return; }
    if (event.key === 'Enter' && document.activeElement === $('#pinInput')) { unlockOS(event); }
    if (event.target.matches('.terminal-form input') && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      if (event.key === 'ArrowUp') terminalHistoryIndex = Math.min(terminalHistory.length - 1, terminalHistoryIndex + 1);
      else terminalHistoryIndex = Math.max(-1, terminalHistoryIndex - 1);
      event.target.value = terminalHistoryIndex < 0 ? '' : terminalHistory[terminalHistoryIndex];
      return;
    }
    if (getAppWindow('calculator')?.classList.contains('active-window') && !event.ctrlKey) {
      const map = { Enter: '=', Backspace: '⌫', Escape: 'AC', '*': '×', '/': '÷', '-': '−', '+': '+', '.': '.', '%': '%', '=': '=' };
      const mapped = map[event.key] || (/^\d$/.test(event.key) ? event.key : null);
      if (mapped) { event.preventDefault(); calcPress(mapped, getAppWindow('calculator')); }
    }
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    window._konami ||= []; window._konami.push(event.key); window._konami = window._konami.slice(-konami.length);
    if (konami.every((item, index) => window._konami[index]?.toLowerCase() === item.toLowerCase())) { toast('Secret mode unlocked', 'A tiny salute to the classics.', '✦'); document.body.classList.toggle('secret-mode'); }
  }

  init();
})();
