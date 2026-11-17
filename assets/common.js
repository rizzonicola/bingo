(function (root) {
  'use strict';

  const TOTAL = 90;
  const PREFS_KEY = 'tombola.prefs.v1';
  const LANGUAGES = ['it', 'en', 'fr'];
  const THEMES = ['system', 'light', 'dark', 'christmas', 'christmas-light', 'christmas-red'];
  const THEME_COLORS = {
    light: '#e8ece7',
    dark: '#121617',
    christmas: '#0c1711',
    'christmas-light': '#f1e8d8',
    'christmas-red': '#1b0c0d',
  };
  const LANGUAGE_NAMES = { it: 'Italiano', en: 'English', fr: 'Français' };

  function randomIndex(max) {
    if (root.crypto && typeof root.crypto.getRandomValues === 'function') {
      const buffer = new Uint32Array(1);
      const limit = Math.floor(0x100000000 / max) * max;
      do {
        root.crypto.getRandomValues(buffer);
      } while (buffer[0] >= limit);
      return buffer[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function readStored(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStored(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function removeStored(key) {
    localStorage.removeItem(key);
  }

  function storageAvailable() {
    try {
      const key = 'bingo.test.v1';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadPrefs() {
    const stored = readStored(PREFS_KEY, {}) || {};
    return {
      lang: ['system', ...LANGUAGES].includes(stored.lang) ? stored.lang : 'system',
      theme: THEMES.includes(stored.theme) ? stored.theme : 'system',
      names: stored.names === true,
    };
  }

  function detectSystemLanguage() {
    const languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    for (const language of languages) {
      const base = String(language || '').toLowerCase().split('-')[0];
      if (LANGUAGES.includes(base)) return base;
    }
    return 'en';
  }

  function applyTheme(prefs, darkMedia) {
    const effective = prefs.theme === 'system'
      ? (darkMedia.matches ? 'dark' : 'light')
      : prefs.theme;
    document.documentElement.dataset.theme = effective;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLORS[effective] || THEME_COLORS.light;
  }

  function applyLanguage({ prefs, systemLang, copy, detectedLanguage }) {
    const lang = prefs.lang === 'system' ? systemLang : prefs.lang;
    const dict = copy[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = dict[element.dataset.i18n];
      if (typeof value === 'string') element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const value = dict[element.dataset.i18nAria];
      if (typeof value === 'string') element.setAttribute('aria-label', value);
    });

    if (detectedLanguage) detectedLanguage.textContent = LANGUAGE_NAMES[systemLang];
    document.title = dict.docTitle;
    setMeta('meta[name="description"]', dict.docDescription);
    setMeta('meta[property="og:title"]', dict.ogTitle);
    setMeta('meta[property="og:description"]', dict.ogDescription);
    return lang;
  }

  function setMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
  }

  function syncControls(prefs, { languageInputs, themeInputs, namesInput }) {
    languageInputs.forEach(input => { input.checked = input.value === prefs.lang; });
    themeInputs.forEach(input => { input.checked = input.value === prefs.theme; });
    namesInput.checked = prefs.names;
  }

  function bindSettings(prefs, { languageInputs, themeInputs, namesInput }, { persistPrefs, onChange }) {
    languageInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (!input.checked) return;
        prefs.lang = input.value;
        persistPrefs();
        onChange('lang');
      });
    });
    themeInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (!input.checked) return;
        prefs.theme = input.value;
        persistPrefs();
        onChange('theme');
      });
    });
    namesInput.addEventListener('change', () => {
      prefs.names = namesInput.checked;
      persistPrefs();
      onChange('names');
    });
  }

  function openDialog(dialog) {
    document.documentElement.classList.add('modal-open');
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog(dialog, value = '') {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close(value);
    } else {
      dialog.removeAttribute('open');
      dialog.dispatchEvent(new Event('close'));
    }
    syncModalLock();
  }

  function syncModalLock() {
    if (!document.querySelector('dialog[open]')) {
      document.documentElement.classList.remove('modal-open');
    }
  }

  function bindShortcut({ drawButton, canDraw = () => true, draw }) {
    document.addEventListener('keydown', event => {
      if (event.repeat || event.defaultPrevented) return;
      if (event.key !== ' ' && event.code !== 'Space') return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (document.querySelector('dialog[open]')) return;
      const target = event.target;
      if (target instanceof Element && target.closest('button, a, input, select, textarea, [contenteditable]')) return;
      if (drawButton.disabled || !canDraw()) return;
      event.preventDefault();
      draw();
    });
  }

  root.BingoCommon = {
    TOTAL,
    PREFS_KEY,
    LANGUAGE_NAMES,
    randomIndex,
    readStored,
    writeStored,
    removeStored,
    storageAvailable,
    loadPrefs,
    detectSystemLanguage,
    applyTheme,
    applyLanguage,
    syncControls,
    bindSettings,
    openDialog,
    closeDialog,
    syncModalLock,
    bindShortcut,
  };
})(globalThis);
