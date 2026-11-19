(() => {
  'use strict';

  const {
    TOTAL,
    PREFS_KEY,
    LANGUAGE_NAMES,
    randomIndex,
    readStored,
    writeStored,
    storageAvailable,
    loadPrefs,
    detectSystemLanguage,
    applyTheme: applyThemeToDocument,
    applyLanguage: applyLanguageToPage,
    syncControls,
    bindSettings,
    openDialog,
    closeDialog,
    syncModalLock,
    bindShortcut,
  } = globalThis.BingoCommon;

  const NEAPOLITAN_NAMES = globalThis.BINGO_NAMES || [];

  // Legacy keys: renaming them would discard saved games and preferences.
  const STATE_KEY = 'tombola.state.v1';

  const COPY = {
    it: {
      ...BINGO_COPY.it,
      docTitle: 'Bingo e tombola: tabellone digitale da 1 a 90',
      docDescription: 'Estrai i numeri da 1 a 90, vedi l\'ultimo in grande e tieni traccia di quelli usciti. Gratis, senza registrazione; la partita resta salvata sul dispositivo.',
      ogTitle: 'Bingo e tombola: tabellone digitale da 1 a 90',
      ogDescription: 'Estrai i numeri da 1 a 90, vedi l\'ultimo in grande e riprendi la partita dal dispositivo. Gratis, senza registrazione.',
      skip: 'Vai al tabellone',
      cards: 'Cartelle',
      cardsLink: 'Apri le cartelle',
      title: 'Tabellone del bingo da 1 a 90',
      intro: 'Estrai i numeri da 1 a 90, uno alla volta. I numeri già usciti restano segnati.',
      resetBody: "Tutti i numeri tornano disponibili e il tabellone si svuota. L'operazione non si può annullare.",
      resetAnnounce: 'Tabellone azzerato. I 90 numeri sono di nuovo disponibili.',
    },
    en: {
      ...BINGO_COPY.en,
      docTitle: 'Bingo: digital board from 1 to 90',
      docDescription: 'Draw bingo numbers one at a time, see the latest number large, and keep track of every number called. Your game is saved on this device.',
      ogTitle: 'Bingo: digital board from 1 to 90',
      ogDescription: 'Draw numbers one at a time, see the latest one large, and keep track of every number called.',
      skip: 'Skip to the board',
      cards: 'Cards',
      cardsLink: 'Open the cards',
      title: 'Bingo board from 1 to 90',
      intro: 'Draw the numbers from 1 to 90, one at a time. Every number that comes out stays marked.',
      resetBody: 'Every number becomes available again and the board is cleared. This cannot be undone.',
      resetAnnounce: 'Board cleared. All 90 numbers are available again.',
    },
    fr: {
      ...BINGO_COPY.fr,
      docTitle: 'Bingo : tableau numérique de 1 à 90',
      docDescription: 'Tirez les numéros de bingo un par un, voyez le dernier numéro en grand et gardez la trace de tous les numéros sortis. La partie est sauvegardée sur cet appareil.',
      ogTitle: 'Bingo : tableau numérique de 1 à 90',
      ogDescription: 'Tirez les numéros un par un, voyez le dernier en grand et gardez la trace de tous les numéros sortis.',
      skip: 'Aller au tableau',
      cards: 'Cartes',
      cardsLink: 'Ouvrir les cartes',
      title: 'Tableau de bingo de 1 à 90',
      intro: 'Tirez les numéros de 1 à 90, un par un. Chaque numéro sorti reste marqué.',
      resetBody: 'Tous les numéros redeviennent disponibles et le tableau se vide. Cette action est irréversible.',
      resetAnnounce: 'Tableau remis à zéro. Les 90 numéros sont de nouveau disponibles.',
    },
  };

  const darkMedia = matchMedia('(prefers-color-scheme: dark)');
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

  const ui = globalThis.BingoBoardUi.create({
    board: dom.board,
    recentList: dom.historyList,
    recentEmpty: dom.historyEmpty,
    lastNumber: dom.lastNumber,
    lastName: dom.lastName,
    lastNumberSr: dom.lastNumberSr,
    stageOrdinal: dom.stageOrdinal,
    stageStatus: dom.stageStatus,
    drawnCount: dom.drawnCount,
    progress: dom.progress,
    progressFill: dom.progressFill,
    drawButton: dom.drawButton,
    resetButton: dom.resetButton,
    shortcut: dom.shortcut,
    total: TOTAL,
    names: neapolitanName,
    t,
  });

  init();

  function init() {
    ui.build();
    syncControls(prefs, dom);
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

  function render({ animate = false } = {}) {
    ui.renderDrawn(drawn, animate);
    ui.renderTally(drawn);
    ui.renderStage(drawn, animate);
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
    render({ animate: true });
    announce(t('drawAnnounce', number, TOTAL - drawn.length, neapolitanName(number)));
  }

  function resetGame() {
    drawn = [];
    persistState();
    render();
    announce(t('resetAnnounce'));
  }

  function applyTheme() {
    applyThemeToDocument(prefs, darkMedia);
  }

  function applyLanguage() {
    resolvedLang = applyLanguageToPage({
      prefs,
      systemLang,
      copy: COPY,
      detectedLanguage: dom.detectedLanguage,
    });
    applyPersistenceCopy();
    render();
  }

  function applyPersistenceCopy() {
    if (!dom.savedLabel || !dom.settingsLede) return;
    dom.savedLabel.textContent = canPersist ? t('saved') : t('notSaved');
    dom.settingsLede.textContent = canPersist ? t('settingsLede') : t('settingsLedePlain');
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

    bindSettings(prefs, dom, {
      persistPrefs,
      onChange: key => {
        if (key === 'lang') applyLanguage();
        else if (key === 'theme') applyTheme();
        else render();
      },
    });

    bindShortcut({ drawButton: dom.drawButton, draw: drawNumber });

    darkMedia.addEventListener('change', () => {
      if (prefs.theme === 'system') applyTheme();
    });
    window.addEventListener('languagechange', () => {
      systemLang = detectSystemLanguage();
      dom.detectedLanguage.textContent = LANGUAGE_NAMES[systemLang];
      if (prefs.lang === 'system') applyLanguage();
    });
  }

  function openSettingsDialog() {
    syncControls(prefs, dom);
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

  function persistState() {
    if (!canPersist) return;
    try {
      writeStored(STATE_KEY, drawn);
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }

  function persistPrefs() {
    if (!canPersist) return;
    try {
      writeStored(PREFS_KEY, prefs);
    } catch (error) {
      canPersist = false;
      applyPersistenceCopy();
    }
  }
})();
