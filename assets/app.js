(() => {
  'use strict';

  const TOTAL = 90;
  const STATE_KEY = 'tombola.state.v1';
  const PREFS_KEY = 'tombola.prefs.v1';
  const LANGUAGES = ['it', 'en', 'fr'];
  const THEMES = ['system', 'light', 'dark', 'christmas'];
  const THEME_COLORS = { light: '#e8ece7', dark: '#121617', christmas: '#0c1711' };
  const LANGUAGE_NAMES = { it: 'Italiano', en: 'English', fr: 'Français' };

  const NEAPOLITAN_NAMES = [
    "L'Italia",
    "'A piccerella",
    "'A gatta",
    "'O puorco",
    "'A mano",
    "Chella ca guarda 'nterra",
    "'O vaso",
    "'A Maronna",
    "'A figliata",
    "'E fasule",
    "'E suricille",
    "'O surdato",
    "Sant'Antonio",
    "'O mbriaco",
    "'O guaglione",
    "'O culo",
    "'A disgrazia",
    "'O sanghe",
    "'A resata",
    "'A festa",
    "'A femmena annura",
    "'O pazzo",
    "'O scemo",
    "'E gguardie",
    "Natale",
    "Nanninella",
    "'O cantero",
    "'E zizze",
    "'O pate d'e criature",
    "'E ppalle d'o tenente",
    "'O padrone 'e casa",
    "'O capitone",
    "Ll'anne 'e Cristo",
    "'A capa",
    "L'aucelluzzo",
    "'E castagnelle",
    "'O monaco",
    "'E mmazzate",
    "'A funa 'nganna",
    "'A paposcia",
    "'O curtiello",
    "'O cafè",
    "'Onna pereta fore 'o barcone",
    "'E ccancelle",
    "'O vino buono",
    "'E denare",
    "'O muorto",
    "'O muorto che parla",
    "'O piezzo 'e carne",
    "'O ppane",
    "'O ciardino",
    "'A mamma",
    "'O viecchio",
    "'O cappiello",
    "'A museca",
    "'A caruta",
    "'O scartellato",
    "'O paccotto",
    "'E pile",
    "Se lamenta",
    "'O cacciatore",
    "'O muorto acciso",
    "'A sposa",
    "'A sciammeria",
    "'O chianto",
    "'E ddoie zetelle",
    "'O totaro int'a chitarra",
    "'A zuppa cotta",
    "Sott'e 'ncoppa",
    "'O palazzo",
    "L'ommo 'e merda",
    "'A maraviglia",
    "'O spitale",
    "'A rotta",
    "Pulcinella",
    "'A funtana",
    "'E riavulille",
    "'A bella figliola",
    "'O mariuolo",
    "'A vocca",
    "'E sciure",
    "'A tavula 'mbandita",
    "'O maletiempo",
    "'A cchiesa",
    "Ll'aneme 'o priatorio",
    "'A puteca",
    "'E perucchie",
    "'E casecavalle",
    "'A vecchia",
    "'A paura",
  ];

  const COPY = {
    it: {
      docTitle: 'Tombola: tabellone digitale da 1 a 90',
      docDescription: "Estrai i numeri della tombola uno alla volta, vedi l'ultimo estratto in grande e tieni traccia di tutti i numeri usciti. La partita resta salvata sul dispositivo.",
      ogTitle: 'Tombola: tabellone digitale da 1 a 90',
      ogDescription: 'Estrai i numeri uno alla volta, vedi l\'ultimo in grande e tieni traccia di tutti quelli usciti.',
      skip: 'Vai al tabellone',
      settings: 'Impostazioni',
      title: 'Tabellone della tombola',
      intro: 'Estrai i numeri da 1 a 90, uno alla volta. I numeri già usciti restano segnati.',
      drawnLabel: 'estratti',
      progressLabel: 'Numeri estratti',
      lastDraw: 'Ultima estrazione',
      noDraw: 'Nessun numero estratto.',
      draw: 'Estrai un numero',
      boardTitle: 'Numeri da 1 a 90',
      boardLabel: 'Tabellone dei numeri da 1 a 90',
      recent: 'Ultimi estratti',
      recentEmpty: 'I numeri compaiono qui appena escono.',
      restart: 'Ricomincia',
      saved: 'Salvato su questo dispositivo.',
      notSaved: 'La partita non viene salvata su questo dispositivo.',
      numbers: 'Numeri da 1 a 90',
      shortcut: 'per estrarre',
      spaceKey: 'Spazio',
      close: 'Chiudi',
      settingsLede: 'La lingua, i nomi e il colore si cambiano quando vuoi. Le modifiche restano su questo dispositivo.',
      settingsLedePlain: 'La lingua, i nomi e il colore si cambiano quando vuoi.',
      language: 'Lingua',
      system: 'Sistema',
      color: 'Colore',
      light: 'Chiaro',
      dark: 'Scuro',
      christmas: 'Natale',
      names: 'Nomi napoletani',
      namesToggle: 'Mostra il nome tradizionale',
      namesHint: 'Sotto il numero compare il nome tradizionale napoletano.',
      done: 'Fatto',
      resetTitle: 'Ricominciare da capo?',
      resetBody: "Tutti i numeri tornano disponibili e il tabellone si svuota. L'operazione non si può annullare.",
      cancel: 'Annulla',
      numberWord: 'Numero',
      drawnCell: 'estratto',
      pendingCell: 'non estratto',
      drawOrdinal: n => `${n}ª estrazione`,
      remaining: n => n === 1 ? 'Resta 1 numero.' : `Restano ${n} numeri.`,
      allDrawn: 'Tutti i 90 numeri sono usciti.',
      lastNumberSr: (n, name) => name
        ? `Ultimo numero estratto: ${n}, ${name}.`
        : `Ultimo numero estratto: ${n}.`,
      drawAnnounce: (n, rest, name) => {
        const called = `Estratto il numero ${n}${name ? `: ${name}` : ''}.`;
        return rest === 0
          ? `${called} Tutti i 90 numeri sono usciti.`
          : `${called} ${rest === 1 ? 'Resta 1 numero.' : `Restano ${rest} numeri.`}`;
      },
      resetAnnounce: 'Tabellone azzerato. I 90 numeri sono di nuovo disponibili.',
    },
    en: {
      docTitle: 'Tombola: digital board from 1 to 90',
      docDescription: 'Draw tombola numbers one at a time, see the latest number large, and keep track of every number called. Your game is saved on this device.',
      ogTitle: 'Tombola: digital board from 1 to 90',
      ogDescription: 'Draw numbers one at a time, see the latest one large, and keep track of every number called.',
      skip: 'Skip to the board',
      settings: 'Settings',
      title: 'Tombola board',
      intro: 'Draw the numbers from 1 to 90, one at a time. Every number that comes out stays marked.',
      drawnLabel: 'drawn',
      progressLabel: 'Numbers drawn',
      lastDraw: 'Latest draw',
      noDraw: 'No numbers drawn yet.',
      draw: 'Draw a number',
      boardTitle: 'Numbers 1 to 90',
      boardLabel: 'Board of numbers 1 to 90',
      recent: 'Latest numbers',
      recentEmpty: 'Numbers appear here as they are drawn.',
      restart: 'Start over',
      saved: 'Saved on this device.',
      notSaved: 'This game is not being saved on this device.',
      numbers: 'Numbers 1 to 90',
      shortcut: 'to draw',
      spaceKey: 'Space',
      close: 'Close',
      settingsLede: 'Change the language, the names, and the color whenever you like. Your choices stay on this device.',
      settingsLedePlain: 'Change the language, the names, and the color whenever you like.',
      language: 'Language',
      system: 'System',
      color: 'Color',
      light: 'Light',
      dark: 'Dark',
      christmas: 'Christmas',
      names: 'Neapolitan names',
      namesToggle: 'Show the traditional name',
      namesHint: 'The traditional Neapolitan name appears under each number.',
      done: 'Done',
      resetTitle: 'Start over?',
      resetBody: 'Every number becomes available again and the board is cleared. This cannot be undone.',
      cancel: 'Cancel',
      numberWord: 'Number',
      drawnCell: 'drawn',
      pendingCell: 'not drawn',
      drawOrdinal: n => `Draw ${n}`,
      remaining: n => n === 1 ? '1 number left.' : `${n} numbers left.`,
      allDrawn: 'All 90 numbers are out.',
      lastNumberSr: (n, name) => name
        ? `Last number drawn: ${n}, ${name}.`
        : `Last number drawn: ${n}.`,
      drawAnnounce: (n, rest, name) => {
        const called = `Number ${n} drawn${name ? `: ${name}` : ''}.`;
        return rest === 0
          ? `${called} All 90 numbers are out.`
          : `${called} ${rest === 1 ? '1 number left.' : `${rest} numbers left.`}`;
      },
      resetAnnounce: 'Board cleared. All 90 numbers are available again.',
    },
    fr: {
      docTitle: 'Tombola : tableau numérique de 1 à 90',
      docDescription: 'Tirez les numéros de tombola un par un, voyez le dernier numéro en grand et gardez la trace de tous les numéros sortis. La partie est sauvegardée sur cet appareil.',
      ogTitle: 'Tombola : tableau numérique de 1 à 90',
      ogDescription: 'Tirez les numéros un par un, voyez le dernier en grand et gardez la trace de tous les numéros sortis.',
      skip: 'Aller au tableau',
      settings: 'Réglages',
      title: 'Tableau de tombola',
      intro: 'Tirez les numéros de 1 à 90, un par un. Chaque numéro sorti reste marqué.',
      drawnLabel: 'tirés',
      progressLabel: 'Numéros tirés',
      lastDraw: 'Dernier tirage',
      noDraw: 'Aucun numéro tiré.',
      draw: 'Tirer un numéro',
      boardTitle: 'Numéros de 1 à 90',
      boardLabel: 'Tableau des numéros de 1 à 90',
      recent: 'Derniers numéros',
      recentEmpty: 'Les numéros apparaissent ici au fur et à mesure.',
      restart: 'Recommencer',
      saved: 'Enregistré sur cet appareil.',
      notSaved: "La partie n'est pas enregistrée sur cet appareil.",
      numbers: 'Numéros de 1 à 90',
      shortcut: 'pour tirer',
      spaceKey: 'Espace',
      close: 'Fermer',
      settingsLede: 'Changez la langue, les noms et la couleur quand vous voulez. Vos choix restent sur cet appareil.',
      settingsLedePlain: 'Changez la langue, les noms et la couleur quand vous voulez.',
      language: 'Langue',
      system: 'Système',
      color: 'Couleur',
      light: 'Clair',
      dark: 'Sombre',
      christmas: 'Noël',
      names: 'Noms napolitains',
      namesToggle: 'Afficher le nom traditionnel',
      namesHint: 'Le nom traditionnel napolitain apparaît sous chaque numéro.',
      done: 'Terminé',
      resetTitle: 'Recommencer à zéro ?',
      resetBody: 'Tous les numéros redeviennent disponibles et le tableau se vide. Cette action est irréversible.',
      cancel: 'Annuler',
      numberWord: 'Numéro',
      drawnCell: 'tiré',
      pendingCell: 'pas tiré',
      drawOrdinal: n => `Tirage ${n}`,
      remaining: n => n === 1 ? '1 numéro restant.' : `${n} numéros restants.`,
      allDrawn: 'Les 90 numéros sont sortis.',
      lastNumberSr: (n, name) => name
        ? `Dernier numéro tiré : ${n}, ${name}.`
        : `Dernier numéro tiré : ${n}.`,
      drawAnnounce: (n, rest, name) => {
        const called = `Numéro ${n} tiré${name ? ` : ${name}` : ''}.`;
        return rest === 0
          ? `${called} Les 90 numéros sont sortis.`
          : `${called} ${rest === 1 ? '1 numéro restant.' : `${rest} numéros restants.`}`;
      },
      resetAnnounce: 'Tableau remis à zéro. Les 90 numéros sont de nouveau disponibles.',
    },
  };

  const html = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const darkMedia = matchMedia('(prefers-color-scheme: dark)');
  const cells = new Map();
  let canPersist = storageAvailable();
  let systemLang = detectSystemLanguage();
  let prefs = loadPrefs();
  let resolvedLang = prefs.lang === 'system' ? systemLang : prefs.lang;
  let drawn = loadDrawn();

  const dom = {
    board: document.getElementById('board'),
    drawButton: document.getElementById('draw-button'),
    resetButton: document.getElementById('reset-button'),
    settingsButton: document.getElementById('open-settings'),
    settingsDialog: document.getElementById('settings-dialog'),
    resetDialog: document.getElementById('reset-dialog'),
    lastNumber: document.getElementById('last-number'),
    lastName: document.getElementById('last-name'),
    lastNumberSr: document.getElementById('last-number-sr'),
    stageStatus: document.getElementById('stage-status'),
    stageOrdinal: document.getElementById('stage-ordinal'),
    drawnCount: document.getElementById('drawn-count'),
    progress: document.getElementById('progress'),
    progressFill: document.getElementById('progress-fill'),
    historyEmpty: document.getElementById('history-empty'),
    historyList: document.getElementById('history-list'),
    savedLabel: document.querySelector('.history__saved span'),
    settingsLede: document.getElementById('settings-lede'),
    detectedLanguage: document.getElementById('detected-language'),
    namesInput: document.getElementById('neapolitan-names'),
    shortcut: document.querySelector('.shortcut'),
    liveRegion: document.getElementById('live-region'),
    languageInputs: [...document.querySelectorAll('input[name="language"]')],
    themeInputs: [...document.querySelectorAll('input[name="theme"]')],
  };

  init();

  function init() {
    buildBoard();
    syncControls();
    applyTheme();
    applyLanguage();
    bindEvents();
  }

  function t(key, ...args) {
    const value = COPY[resolvedLang][key];
    return typeof value === 'function' ? value(...args) : value;
  }

  function neapolitanName(number) {
    return prefs.names ? (NEAPOLITAN_NAMES[number - 1] || '') : '';
  }

  function buildBoard() {
    const fragment = document.createDocumentFragment();
    for (let n = 1; n <= TOTAL; n += 1) {
      const cell = document.createElement('li');
      cell.className = 'cell';
      cell.dataset.number = String(n);
      cell.textContent = String(n).padStart(2, '0');
      cells.set(n, cell);
      fragment.appendChild(cell);
    }
    dom.board.replaceChildren(fragment);
  }

  function render({ newNumber = null, animate = false } = {}) {
    updateBoard(newNumber, animate);
    updateTally();
    updateStage(animate);
    updateHistory(animate);
  }

  function updateBoard(newNumber, animate) {
    const drawnSet = new Set(drawn);
    const latest = drawn.length ? drawn[drawn.length - 1] : null;

    for (const [number, cell] of cells) {
      const isDrawn = drawnSet.has(number);
      const name = neapolitanName(number);
      cell.classList.toggle('is-drawn', isDrawn);
      cell.classList.toggle('is-last', number === latest);
      cell.classList.remove('is-new');
      cell.setAttribute(
        'aria-label',
        `${t('numberWord')} ${number}${name ? `, ${name}` : ''}, ${isDrawn ? t('drawnCell') : t('pendingCell')}`
      );
      if (name) {
        cell.title = name;
      } else {
        cell.removeAttribute('title');
      }
    }

    if (newNumber === null || !animate) return;
    const fresh = cells.get(newNumber);
    if (!fresh) return;
    void fresh.offsetWidth;
    fresh.classList.add('is-new');
    window.setTimeout(() => fresh.classList.remove('is-new'), 560);
  }

  function updateTally() {
    const count = drawn.length;
    dom.drawnCount.textContent = String(count);
    dom.progress.setAttribute('aria-valuenow', String(count));
    dom.progressFill.style.width = `${(count / TOTAL) * 100}%`;
    dom.drawButton.disabled = count >= TOTAL;
    dom.resetButton.hidden = count === 0;
    dom.shortcut.hidden = count >= TOTAL;
  }

  function updateStage(animate) {
    const latest = drawn.length ? drawn[drawn.length - 1] : null;
    const full = drawn.length >= TOTAL;
    const name = latest === null ? '' : neapolitanName(latest);

    dom.lastNumber.classList.toggle('is-empty', latest === null);
    dom.lastNumber.textContent = latest === null ? '0' : String(latest);
    dom.lastName.textContent = name;
    dom.lastName.hidden = !name;
    dom.lastNumberSr.textContent = latest === null ? '' : t('lastNumberSr', latest, name);
    dom.stageOrdinal.hidden = latest === null;
    dom.stageOrdinal.textContent = latest === null ? '' : t('drawOrdinal', drawn.length);

    if (latest === null) {
      dom.stageStatus.textContent = t('noDraw');
    } else if (full) {
      dom.stageStatus.textContent = t('allDrawn');
    } else {
      dom.stageStatus.textContent = t('remaining', TOTAL - drawn.length);
    }

    dom.lastNumber.classList.remove('is-dealing');
    if (latest !== null && animate) {
      void dom.lastNumber.offsetWidth;
      dom.lastNumber.classList.add('is-dealing');
    }
  }

  function updateHistory(animate) {
    const recent = drawn.slice(-12).reverse();
    dom.historyEmpty.hidden = recent.length > 0;
    dom.historyList.hidden = recent.length === 0;
    dom.historyList.replaceChildren();

    recent.forEach((number, index) => {
      const chip = document.createElement('li');
      const name = neapolitanName(number);
      chip.className = `history__chip${index === 0 ? ' is-latest' : ''}${animate && index === 0 ? ' is-new' : ''}`;
      chip.textContent = String(number).padStart(2, '0');
      if (name) {
        chip.title = name;
        chip.setAttribute('aria-label', `${number}, ${name}`);
      }
      dom.historyList.appendChild(chip);
    });
  }

  function drawNumber() {
    if (drawn.length >= TOTAL) return;

    const remaining = [];
    for (let n = 1; n <= TOTAL; n += 1) {
      if (!drawn.includes(n)) remaining.push(n);
    }

    const number = remaining[randomIndex(remaining.length)];
    drawn = [...drawn, number];
    persistState();
    render({ newNumber: number, animate: true });
    announce(t('drawAnnounce', number, TOTAL - drawn.length, neapolitanName(number)));
  }

  function randomIndex(max) {
    if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
      const buffer = new Uint32Array(1);
      const limit = Math.floor(0x100000000 / max) * max;
      do {
        globalThis.crypto.getRandomValues(buffer);
      } while (buffer[0] >= limit);
      return buffer[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function resetGame() {
    drawn = [];
    persistState();
    render();
    announce(t('resetAnnounce'));
  }

  function applyTheme() {
    const effective = prefs.theme === 'system'
      ? (darkMedia.matches ? 'dark' : 'light')
      : prefs.theme;
    html.dataset.theme = effective;
    if (themeMeta) themeMeta.content = THEME_COLORS[effective] || THEME_COLORS.light;
  }

  function applyLanguage() {
    resolvedLang = prefs.lang === 'system' ? systemLang : prefs.lang;
    const dict = COPY[resolvedLang];
    html.lang = resolvedLang;

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = dict[element.dataset.i18n];
      if (typeof value === 'string') element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const value = dict[element.dataset.i18nAria];
      if (typeof value === 'string') element.setAttribute('aria-label', value);
    });

    dom.detectedLanguage.textContent = LANGUAGE_NAMES[systemLang];
    applyDocumentMeta(dict);
    applyPersistenceCopy();
    render();
  }

  function applyDocumentMeta(dict) {
    document.title = dict.docTitle;
    setMeta('meta[name="description"]', dict.docDescription);
    setMeta('meta[property="og:title"]', dict.ogTitle);
    setMeta('meta[property="og:description"]', dict.ogDescription);
  }

  function setMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
  }

  function applyPersistenceCopy() {
    if (!dom.savedLabel || !dom.settingsLede) return;
    dom.savedLabel.textContent = canPersist ? t('saved') : t('notSaved');
    dom.settingsLede.textContent = canPersist ? t('settingsLede') : t('settingsLedePlain');
  }

  function syncControls() {
    dom.languageInputs.forEach(input => { input.checked = input.value === prefs.lang; });
    dom.themeInputs.forEach(input => { input.checked = input.value === prefs.theme; });
    dom.namesInput.checked = prefs.names;
  }

  function announce(message) {
    dom.liveRegion.textContent = message;
  }

  function bindEvents() {
    dom.drawButton.addEventListener('click', drawNumber);
    dom.resetButton.addEventListener('click', openResetDialog);
    dom.settingsButton.addEventListener('click', openSettingsDialog);

    dom.settingsDialog.querySelectorAll('[data-close]').forEach(button => {
      button.addEventListener('click', () => closeDialog(dom.settingsDialog));
    });
    dom.settingsDialog.addEventListener('click', event => {
      if (event.target === dom.settingsDialog) closeDialog(dom.settingsDialog);
    });
    dom.settingsDialog.addEventListener('close', syncModalLock);

    dom.resetDialog.addEventListener('click', event => {
      if (event.target === dom.resetDialog) closeDialog(dom.resetDialog, 'cancel');
    });
    dom.resetDialog.addEventListener('close', () => {
      syncModalLock();
      handleResetClose();
    });

    dom.languageInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (!input.checked) return;
        prefs.lang = input.value;
        persistPrefs();
        applyLanguage();
      });
    });
    dom.themeInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (!input.checked) return;
        prefs.theme = input.value;
        persistPrefs();
        applyTheme();
      });
    });
    dom.namesInput.addEventListener('change', () => {
      prefs.names = dom.namesInput.checked;
      persistPrefs();
      render();
    });

    document.addEventListener('keydown', handleShortcut);
    darkMedia.addEventListener('change', () => {
      if (prefs.theme === 'system') applyTheme();
    });
    window.addEventListener('languagechange', () => {
      systemLang = detectSystemLanguage();
      dom.detectedLanguage.textContent = LANGUAGE_NAMES[systemLang];
      if (prefs.lang === 'system') applyLanguage();
    });
  }

  function handleShortcut(event) {
    if (event.repeat || event.defaultPrevented) return;
    if (event.key !== ' ' && event.code !== 'Space') return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (document.querySelector('dialog[open]')) return;
    const target = event.target;
    if (target instanceof Element && target.closest('button, a, input, select, textarea, [contenteditable]')) return;
    if (dom.drawButton.disabled) return;
    event.preventDefault();
    drawNumber();
  }

  function openSettingsDialog() {
    syncControls();
    openDialog(dom.settingsDialog);
  }

  function openResetDialog() {
    dom.resetDialog.returnValue = '';
    openDialog(dom.resetDialog);
  }

  function handleResetClose() {
    if (dom.resetDialog.returnValue === 'confirm') {
      resetGame();
      dom.drawButton.focus();
    } else {
      dom.resetButton.focus();
    }
  }

  function openDialog(dialog) {
    html.classList.add('modal-open');
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
    if (!document.querySelector('dialog[open]')) html.classList.remove('modal-open');
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

  function loadPrefs() {
    const stored = readStored(PREFS_KEY, {}) || {};
    return {
      lang: ['system', ...LANGUAGES].includes(stored.lang) ? stored.lang : 'system',
      theme: THEMES.includes(stored.theme) ? stored.theme : 'system',
      names: stored.names === true,
    };
  }

  function loadDrawn() {
    const stored = readStored(STATE_KEY, []);
    const values = Array.isArray(stored) ? stored : (Array.isArray(stored?.drawn) ? stored.drawn : []);
    const seen = new Set();
    const valid = [];
    for (const value of values) {
      const number = Number(value);
      if (Number.isInteger(number) && number >= 1 && number <= TOTAL && !seen.has(number)) {
        seen.add(number);
        valid.push(number);
      }
    }
    return valid;
  }

  function readStored(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function persistState() {
    if (!canPersist) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(drawn));
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }

  function persistPrefs() {
    if (!canPersist) return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }

  function storageAvailable() {
    try {
      const key = 'tombola.test.v1';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
})();
